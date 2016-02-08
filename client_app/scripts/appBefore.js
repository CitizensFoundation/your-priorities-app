function onSplashClick() {
  var loadContainer = document.getElementById('splash');
  loadContainer.parentNode.removeChild(loadContainer);
  document.body.classList.remove('loading');
}

(function(document) {
  'use strict';

  window.appStartTime = new Date();
  i18n.init({ lng: "en" });
  window.i18n = i18n;

})(document);
