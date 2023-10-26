import findUp  from 'find-up'
import fs from 'node:fs/promises'
import log from './helpers/log.js'
import logError from './helpers/logError.js'

const FirebaseConfigFileName = 'firebase.json'

export const withFHR =
  (sites?: string[]) =>
  (nextConfig: NextJsConfig = {}) => {
    if (!sites || sites.length < 1) {
      throw new Error(
        `In order for this to work provide a list of sites to check for rewrites in the firebase.json hosting section.`,
      )
    }

    return Object.assign({}, nextConfig, {
      exportPathMap: async (
        defaultPathMap: string[],
        { dir }: { dir: string },
      ) => {
        log('Validating Firebase Hosting Rules (FHR)...')

        const firebaseConfigPath = await findUp(FirebaseConfigFileName, {
          cwd: dir,
        })

        if (!firebaseConfigPath) {
          throw new Error(
            `${FirebaseConfigFileName} not found looking through directories from ${dir} to the root.`,
          )
        }

        log(`Found Firebase config at ${firebaseConfigPath}.`)

        const firebaseConfig = JSON.parse(
          await fs.readFile(firebaseConfigPath, 'utf8'),
        ) as FirebaseConfig

        const firebaseConfigHosting = firebaseConfig.hosting

        if (!firebaseConfigHosting) {
          throw new Error(
            `The config ${firebaseConfigPath} does not contain a "hosting" section. Add it and run this again.`,
          )
        }

        const firebaseConfigHostingItems = firebaseConfigHosting.filter(
          (hostingConfig) =>
            hostingConfig.site && sites.includes(hostingConfig.site),
        )

        if (firebaseConfigHostingItems.length === 0) {
          throw new Error(
            `The following sites were provided as parameter (${sites.join(
              ', ',
            )}), but no hosting entries with matching site were found.`,
          )
        }

        if (firebaseConfigHostingItems.length !== sites.length) {
          const foundSites = firebaseConfigHostingItems.map((item) => item.site)

          throw new Error(
            `The following sites were provided as parameter (${sites.join(
              ', ',
            )}), but only (${foundSites.join(', ')}).`,
          )
        }

        let errorFound = false

        for (const sitePath in defaultPathMap) {
          if (sitePath.includes('[')) {
            // Replace slugs (i.e. [...varname])
            let source = sitePath.replace(/\[\.{3}.+?\]$/gm, '**')

            // Check for mistake in remaining params (param starting with .)
            if (/\[\.+.+?\]/gm.test(source)) {
              throw new Error(
                `Dynamic path '${sitePath}' section should not start with . (e.g. [.name]) except for slugs at the end (i.e. [...name]). Check https://nextjs.org/docs/routing/dynamic-routes for more details.`,
              )
            }

            // Replace other params with glob
            source = source.replace(/\[[^.].+?\]/gm, '*')

            // Destination just add html (generated by Next.js)
            let destination = sitePath + '.html'

            let rewriteRule

            for (const hostingEntry of firebaseConfigHostingItems) {
              rewriteRule = hostingEntry.rewrites?.find(
                (val) => val.source === source,
              )

              if (!rewriteRule) {
                errorFound = true
                logError()
                logError(
                  `REWRITE RULE ERROR @ firebase.json/hosting/[site="${hostingEntry.site}"]`,
                )
                logError(`Missing rewrite rule for site path '${sitePath}'.`)
                logError('Include the following rewrite rule in firebase.json:')
                logError()
                logError(JSON.stringify({ source, destination }))
                logError()
              } else if (rewriteRule.destination !== destination) {
                errorFound = true
                logError()
                logError(
                  `REWRITE RULE ERROR @ firebase.json/hosting/[site=${hostingEntry.site}]`,
                )
                logError(`Incorrect rewrite rule for site path '${sitePath}'.`)
                logError('In firebase.json replace:')
                logError()
                logError(JSON.stringify(rewriteRule))
                logError()
                logError('with')
                logError()
                logError(JSON.stringify({ source, destination }))
                logError()
              }
            }
          }
        }

        if (errorFound) {
          throw new Error(
            `One or more rewrites rules missing or erroneous in '${firebaseConfigPath}'.`,
          )
        } else {
          log('[PASS] Firebase Hosting Rules are OK!')
        }

        return defaultPathMap
      },
    })
  }
