import loadPolyfills from '@open-wc/polyfills-loader';

loadPolyfills().then(() => {
  import('./src/yp-app/yp-app.js');
});
