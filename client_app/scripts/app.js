var splashDiv;

var setupLocale = function (locale) {

  var storedLocale = localStorage.getItem('yp-user-locale');
  if (storedLocale) {
    window.locale = storedLocale;
  } else {
    window.locale = locale;
  }

  i18n.init({ lng: window.locale }, function(loaded) {
    var app = document.querySelector("#app");
    if (app) {
      app._i18nReady();
    } else {
      console.error("App not ready when i18n is ready");
    }
    window.i18nTranslation = i18n;
    var event = new CustomEvent("iron-signal", { detail: { name: 'yp-18n-ready', data: null } } );
    document.dispatchEvent(event);
  });
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
