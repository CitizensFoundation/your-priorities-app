(function(document) {
  'use strict';

  // Create IE + others compatible event handler
  var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
  var eventer = window[eventMethod];
  var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";

  console.log("Have created event listener");

  // Listen to message from child window
  eventer(messageEvent,function(e) {
    if (e.data=='samlLogin' && window.appUser) {
      window.appUser.loginFromSaml();
      console.log("Have contacted app user 2");
    }
  },false);

  var splashDiv, splashCore;
  window.app = document.querySelector("#app");

  var setupLocale = function (locale) {

    var storedLocale = localStorage.getItem('yp-user-locale');
    if (storedLocale) {
      window.locale = storedLocale;
    } else {
      window.locale = locale;
    }

    var splitLocale = window.location.href.split('locale=');

    var localeFromUrl;
    if (splitLocale && splitLocale[1]) {
      localeFromUrl = splitLocale[1];
    }

    if (localeFromUrl && localeFromUrl.length==2) {
      window.locale = localeFromUrl;
      localStorage.setItem('yp-user-locale', localeFromUrl);
    }

    var language = window.locale;
    i18n.init({ lng: language, resGetPath: '/locales/__lng__/__ns__.json' }, function(loaded) {
      window.i18nTranslation = i18n;
      if (typeof moment !== 'undefined' && moment ) {
        moment.locale(language);
      }
      console.log("Changed language to "+language);
      var event = new CustomEvent("iron-signal", { detail: { name: 'yp-language', data: { type: 'language-loaded', language: language } } } );
      document.dispatchEvent(event);
      setTimeout(function(){
        onSplashClick();
      }, 50);
    });
  };

  var setupBetterReykjavikSplash = function () {
    splashCore = document.createElement("div");
    splashCore.id = "splashCore";
    splashDiv = document.createElement("div");
    splashDiv.id = "splashSub";
    splashDiv.innerHTML = '<span class="loadingText">Hleð inn...</span><br><span class="loadingHostname">'+window.location.hostname+'</span>';
    splashDiv.innerHTML += '<img width="280px" src="https://s3.amazonaws.com/yrpri-direct-asset/betrireykjavik_merki2_fb400_splash.png">';
    splashDiv.innerHTML += '<img src="https://s3.amazonaws.com/yrpri-direct-asset/heartSpinner.gif">';

    splashDiv.className = "js-fade fade-in";

    splashCore.onclick = onSplashClick;
    splashCore.appendChild(splashDiv);
    document.body.appendChild(splashCore);
    document.title = "Betri Reykjavík";
  };

  var setupBetterIcelandSplash = function () {
    splashCore = document.createElement("div");
    splashCore.id = "splashCore";
    splashDiv = document.createElement("div");
    splashDiv.id = "splashSub";
    splashDiv.innerHTML = '<span class="loadingText">Hleð inn...</span><br><span class="loadingHostname">'+window.location.hostname+'</span>';
    splashDiv.innerHTML += '<img src="https://s3.amazonaws.com/yrpri-direct-asset/BI_Splash_1.png">';
    splashDiv.innerHTML += '<img src="https://s3.amazonaws.com/yrpri-direct-asset/heartSpinner.gif">';

    splashDiv.className = "js-fade fade-in";

    splashCore.onclick = onSplashClick;
    splashCore.appendChild(splashDiv);
    document.body.appendChild(splashCore);

    document.title = "Betra Ísland";
  };

  var setupYourPrioritiesSplash = function () {
    splashCore = document.createElement("div");
    splashCore.id = "splashCore";
    splashDiv = document.createElement("div");
    splashDiv.id = "splashSub";
    // splashDiv.innerHTML = '<img src="">';
    splashDiv.innerHTML = '<span class="loadingText">Loading...</span><br><span class="loadingHostname">'+window.location.hostname+'</span>';
    splashDiv.innerHTML += '<img src="https://i.imgur.com/6MWkhrR.png">';
    splashDiv.innerHTML += '<img src="https://s3.amazonaws.com/yrpri-direct-asset/heartSpinner.gif">';

    splashDiv.className = "js-fade fade-in";

    splashCore.onclick = onSplashClick;
    splashCore.appendChild(splashDiv);
    document.body.appendChild(splashCore);
    document.title = "Your Priorities";
  };

  if (window.location.hostname.indexOf('betrireykjavik') > -1) {
    setupLocale('is');
    setupBetterReykjavikSplash();
  } else if (window.location.hostname.indexOf('betraisland') > -1) {
    setupLocale('is');
    setupBetterIcelandSplash();
  } else {
    setupYourPrioritiesSplash();
    if (window.location.hostname.indexOf('forbrukerradet') > -1) {
      setupLocale('no');
    } else if (window.location.hostname.indexOf('bolja-pula') > -1) {
      setupLocale('hr');
    } else if (window.location.hostname.indexOf('e-dem.nl') > -1) {
      setupLocale('nl');
    } else if (window.location.hostname.indexOf('waag.org') > -1) {
      setupLocale('nl');
    } else if (window.location.hostname.indexOf('boljikarlovac') > -1) {
      setupLocale('hr');
    } else if (window.location.hostname.indexOf('boljilosinj') > -1) {
      setupLocale('hr');
    } else if (window.location.hostname.indexOf('pulaodlucuje') > -1) {
      setupLocale('hr');
    } else if (window.location.href.indexOf("group/801") > -1) {
      setupLocale('sl');
    } else {
      setupLocale('en');
    }
  }

  function onSplashClick() {
    console.log("removing splash screen");
    var loadContainer = document.getElementById('splashCore');
    if (loadContainer) {
      loadContainer.parentNode.removeChild(loadContainer);
    } else {
      Polymer.Base.async(function () {
        console.log("Remove splash with delay");
        loadContainer = document.getElementById('splashCore');
        if (loadContainer) {
          loadContainer.parentNode.removeChild(loadContainer);
        }
      }, 250);
    }
    document.body.classList.remove('loading');
  }

  window.addEventListener('WebComponentsReady', function(e) {
    console.log("WebComponentsReady");
    onSplashClick();
  });
})(document);
