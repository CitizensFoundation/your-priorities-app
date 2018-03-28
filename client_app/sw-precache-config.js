module.exports = {
  staticFileGlobs: [
    '/index.html'
  ],
  navigateFallback: '',
  runtimeCaching: [{
    urlPattern: /.html/,
    handler: 'networkFirst'
  }]
};
