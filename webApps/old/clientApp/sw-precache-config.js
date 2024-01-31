module.exports = {
  staticFileGlobs: [
    '/index.html'
  ],
  navigateFallback: '/',
  runtimeCaching: [{
    urlPattern: /(?!(.*)(mp4))\/(.*)/,
    handler: 'networkFirst'
  }]
};
