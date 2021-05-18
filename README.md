# Next.JS Firebase Hosting Rewrite Rules Module

Ensure that firebase.json contains the appropriate hosting rewrites for NextJS dynamic routes.

## WARNINGS!

This module has been tested only in the described scenario using NextJS 10.2, Yarn 2 (with PnP), Node 16.

Missing rewrite rules will fail your build and print out instructions on how to fix it.

## Use this if

1. You use `next export` to export your app to static HTML
1. You deploy the static site to Firebase Hosting
1. You deploy the site to one or more hosting sites

## Usage

```
yarn add next-firebase-hosting-rewrites
```

On your `next.config.js`

```js
// next.config.js
const withFHR = require('next-firebase-hosting-rewrites')([
  'site-name-1',
  'site-name-2',
])

module.exports = withFHR()
```

## Sample

If you have any of the following files in your NextJS project, it will result in the output below.

- `pages/auth/action/reset-password/[oobCode].tsx`
- `pages/auth/action/reset-password/[oobCode]/index.tsx`

```
[...]
info  - using build directory: /Users/user/repo/hosting/.next
info  - Copying "static build" directory
info  - Launching 7 workers
> [FHR] Validating Firebase Hosting Rules (FHR)...
> [FHR] Found Firebase config at /Users/user/repo/firebase.json.
> [FHR] REWRITE RULE ERROR @ firebase.json/hosting/[site="site-name-1"]
> [FHR] Missing rewrite rule for site path '/auth/action/reset-password/[oobCode]'.
> [FHR] Include the following rewrite rule in firebase.json:
> [FHR]
> [FHR] {"source":"/auth/action/reset-password/*","destination":"/auth/action/reset-password/[oobCode].html"}
> [FHR]
Error: One or more rewrites rules missing or erroneous in '/Users/user/repo/firebase.json'.

[...stack trace here]

user@Machine-Name hosting %
```
