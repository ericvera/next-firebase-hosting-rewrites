# Next.JS Firebase Rewrites Module

Ensure that firebase.json contains the appropriate hosting rewrites for NextJS dynamic routes.

## WARNINGS!

This module has been tested only in the described scenario using NextJS 10.2, Yarn 2 (Berry), Node 15+.

## Use this if...

1. You use `next export` to export your app to static HTML
1. You deploy the static site to Firebase Hosting
1. You deploy the site to one or more hosting sites

## Usage

`yarn add next-firebase-hosting-rewrites`

On your `next.config.js`

```js
// next.config.js
const withFHR = require('next-firebase-hosting-rewrites')

module.exports = withFHR({
  firebaseHostingSites: ['site-name-1', 'site-name-2']
})
```
