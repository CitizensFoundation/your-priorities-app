module.exports = {
  staticFileGlobs: [
    '/index.html'
  ],
  navigateFallback: '',
  runtimeCaching: [{
    urlPattern: /\/(.html|.js)/,
    handler: 'networkFirst'
  }]
};
