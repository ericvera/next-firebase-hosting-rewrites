interface FirebaseHostingRewriteConfig {
  source: string
  destination: string
}

interface FirebaseHostingConfig {
  site?: string
  rewrites?: FirebaseHostingRewriteConfig[]
  [key: string]: any
}

interface FirebaseConfig {
  hosting?: FirebaseHostingConfig[]
  [key: string]: any
}
