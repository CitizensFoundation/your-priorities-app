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
      if (typeof app._i18nReady == 'function') {
         app._i18nReady();
       } else {
        console.warn("App has not been upgraded to Polymer object when translation is ready");
      }
    } else {
      console.warn("App not ready when i18n is ready");
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
  document.title = "Betri Reykjavík";
};

var setupBetterIcelandSplash = function () {
  splashDiv = document.createElement("div");
  splashDiv.id = "splashBI";
  splashDiv.onclick = onSplashClick;
  document.body.appendChild(splashDiv);
  document.title = "Betra Ísland";
};

var setupYourPrioritiesSplash = function () {
  splashDiv = document.createElement("div");
  splashDiv.id = "splashYrPri";
  splashDiv.onclick = onSplashClick;
  document.body.appendChild(splashDiv);
  document.title = "Your Priorities";
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

window.addEventListener('WebComponentsReady', function(e) {
  console.log("WebComponentsReady");
});
