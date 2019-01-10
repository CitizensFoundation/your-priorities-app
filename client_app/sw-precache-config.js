module.exports = {
  staticFileGlobs: [
    '/index.html'
  ],
  navigateFallback: '/',
  runtimeCaching: [{
    urlPattern: /\/(.*)/,
    handler: 'networkFirst'
  }]
};
