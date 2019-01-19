module.exports = {
  staticFileGlobs: [
    '/index.html',
    '/locales/**'
  ],
  navigateFallback: '/',
  runtimeCaching: [{
    urlPattern: /(?!(.*)(mp4|png))\/(.*)/,
    handler: 'networkFirst'
  }]
};
