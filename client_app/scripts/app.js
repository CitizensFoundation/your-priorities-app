var splashDiv;

var setupLocale = function (locale) {
  window.locale = locale;
  i18n.init({ lng: window.locale });
  window.i18n = i18n;
};

var setupBetterReykjavikSplash = function () {
  splashDiv = document.createElement("div");
  splashDiv.id = "splashBR";
  splashDiv.onclick = onSplashClick;
  document.body.appendChild(splashDiv);
};

var setupBetterIcelandSplash = function () {
  splashDiv = document.createElement("div");
  splashDiv.id = "splashBI";
  splashDiv.onclick = onSplashClick;
  document.body.appendChild(splashDiv);
};

var setupYourPrioritiesSplash = function () {
  splashDiv = document.createElement("div");
  splashDiv.id = "splashYrPri";
  splashDiv.onclick = onSplashClick;
  document.body.appendChild(splashDiv);
};

if (window.location.hostname.indexOf('betrireykjavik') > -1) {
  setupLocale('is');
  setupBetterReykjavikSplash();
} else if (window.location.hostname.indexOf('betraisland') > -1) {
  setupLocale('is');
  setupBetterIcelandSplash();
} else {
  setupLocale('en');
  setupYourPrioritiesSplash();
}

function onSplashClick() {
  var loadContainer = document.getElementById('splashYrPri');
  if (loadContainer) {
    loadContainer.parentNode.removeChild(loadContainer);
  }
  loadContainer = document.getElementById('splashBR');
  if (loadContainer) {
    loadContainer.parentNode.removeChild(loadContainer);
  }
  loadContainer = document.getElementById('splashBI');
  if (loadContainer) {
    loadContainer.parentNode.removeChild(loadContainer);
  }
  document.body.classList.remove('loading');
}
