module.exports = {
  staticFileGlobs: [
    '/index.html'
  ],
  navigateFallback: '/',
  runtimeCaching: [{
    urlPattern: /(?!(.*)(mp4|png))\/(.*)/,
    handler: 'networkFirst'
  }]
};
