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

    var language;
    var storedLocale = localStorage.getItem('yp-user-locale');
    if (storedLocale) {
      language = storedLocale;
    } else {
      language = locale;
    }

    var splitLocale = window.location.href.split('locale=');

    var localeFromUrl;
    if (splitLocale && splitLocale[1]) {
      localeFromUrl = splitLocale[1];
    }

    if (localeFromUrl && localeFromUrl.length==2) {
      language = localeFromUrl;
      localStorage.setItem('yp-user-locale', localeFromUrl);
    }

    i18next.use(i18nextXHRBackend).
            init({ lng: language, fallbackLng: 'en', backend: { loadPath: '/locales/{{lng}}/{{ns}}.json' } }, function(loaded) {
      console.info("Have loaded languages");
      setTimeout(function () {
        window.locale = language;
        window.i18nTranslation = i18next;
        window.haveLoadedLanguages = true;
        if (typeof moment !== 'undefined' && moment ) {
          moment.locale([language, 'en']);
        } else {
          setTimeout(function(){
            if (typeof moment !== 'undefined' && moment ) {
              moment.locale([language, 'en']);
            }
          }, 500);
        }

        console.log("Changed language to "+language);

        document.dispatchEvent(
          new CustomEvent("lite-signal", {
            bubbles: true,
            compose: true,
            detail: { name: 'yp-language', data: { type: 'language-loaded', language: language }  }
          })
        );

        setTimeout(function(){
          console.log("setTimeout 1");
          document.dispatchEvent(
            new CustomEvent("lite-signal", {
              bubbles: true,
              compose: true,
              detail: { name: 'yp-language', data: { type: 'language-loaded', language: language }  }
            })
          );
        }, 500);

        setTimeout(function(){
          onSplashClick();
        }, 720);
      }, 250);
    });
  };

  var isMobileScreen = function () {
    return window.innerWidth<420;
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
    splashDiv.innerHTML = '<div><div class="loadingText">Loading...</div><br><div class="loadingHostname">'+window.location.hostname+'</div>';

    if (window.location.hostname.indexOf("forzanazzjonali") >-1) {
      splashDiv.innerHTML += '<img style="width:200px; padding-top: 8px; padding-bottom: 8px" src="https://s3-eu-west-1.amazonaws.com/yrpri-eu-direct-assets/malta/malta_splash-2.jpg"><br>';
    } else if (window.location.hostname.indexOf("forbrukerradet") >-1) {
      splashDiv.innerHTML += '<img style="width:200px; padding-top: 8px; padding-bottom: 8px" src="https://s3-eu-west-1.amazonaws.com/yrpri-eu-direct-assets/ForbLogoSmall.jpg"><br>';
    } else if (window.location.hostname.indexOf("idea-synergy.com") >-1) {
      splashDiv.innerHTML += '<img style="width:200px; padding-top: 8px; padding-bottom: 8px" width="230" height="230" src="https://www.idea-synergy.com/wp-content/uploads/2017/12/Idea_Synergy_Logo_Orange_on_WhiteGreenBulb.png"><br>';
    } else {
      splashDiv.innerHTML += '<img src="https://s3-eu-west-1.amazonaws.com/yrpri-eu-direct-assets/yrprLogo.png">';
    }

    splashDiv.innerHTML += '<img src="https://s3.amazonaws.com/yrpri-direct-asset/heartSpinner.gif"></div>';

    splashDiv.className = "js-fade fade-in";

    splashCore.onclick = onSplashClick;
    splashCore.appendChild(splashDiv);
    document.body.appendChild(splashCore);
    document.title = "Your Priorities";
  };

  var hostname = window.location.hostname;
  if (hostname.indexOf('betrireykjavik') > -1) {
    setupLocale('is');
    if (isMobileScreen())
      setupBetterReykjavikSplash();
  } else if (hostname.indexOf('betraisland') > -1) {
    setupLocale('is');
    if (isMobileScreen())
      setupBetterIcelandSplash();
  } else {
    if (isMobileScreen())
      setupYourPrioritiesSplash();
    if (hostname.indexOf('forbrukerradet') > -1) {
      setupLocale('no');
    } else if (hostname.indexOf('bolja-pula') > -1) {
      setupLocale('hr');
    } else if (hostname.indexOf('waag.org') > -1) {
      setupLocale('nl');
    } else if (hostname.indexOf('boljikarlovac') > -1) {
      setupLocale('hr');
    } else if (hostname.indexOf('boljilosinj') > -1) {
      setupLocale('hr');
    } else if (hostname.indexOf('pulaodlucuje') > -1) {
      setupLocale('hr');
    } else if (window.location.href.indexOf("group/801") > -1) {
      setupLocale('sl');
    } else {
      var tld = hostname.substring(hostname.lastIndexOf('.'));
      var localeByTld = {
        '.fr': 'fr',
        '.hr': 'hr',
        '.hu': 'hu',
        '.is': 'is',
        '.nl': 'nl',
        '.no': 'no',
        '.pl': 'pl',
        '.tw': 'zh_TW',
      };
      setupLocale(localeByTld[tld] || 'en');
    }
  }

  function onSplashClick() {
    console.log("removing splash screen");
    var loadContainer = document.getElementById('splashCore');
    if (loadContainer) {
      loadContainer.parentNode.removeChild(loadContainer);
    } else {
      setTimeout(function() {
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
    onSplashClick();
  });
})(document);
