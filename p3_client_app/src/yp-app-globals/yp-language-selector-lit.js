import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import 'lite-signal/lite-signal.js';
import { IronFormElementBehavior } from '@polymer/iron-form-element-behavior/iron-form-element-behavior.js';
import '@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/paper-item/paper-item.js';
import '@material/mwc-button';
import '../yp-ajax/yp-ajax.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { dom } from '@polymer/polymer/lib/legacy/polymer.dom.js';

class YpLanguageSelectorLit extends YpBaseElement {
  static get properties() {
    return {
      supportedLanguages: {
        type: Object,
        value: {
          en: 'English (US)',
          en_GB: 'English (GB)',
          fr: 'Français',
          is: 'Íslenska',
          es: 'Español',
          it: 'Italiano',
          ar: 'اَلْعَرَبِيَّةُ',
          ar_EG: 'اَلْعَرَبِيَّةُ (EG)',
          ca: 'Català',
          ro_MD: 'Moldovenească',
          de: 'Deutsch',
          da: 'Dansk',
          sv: 'Svenska',
          en_CA: 'English (CA)',
          nl: 'Nederlands',
          no: 'Norsk',
          uk: 'українська',
          sq: 'Shqip',
          ky: 'Кыргызча',
          uz: 'Ўзбек',
          tr: 'Türkçe',
          fa: 'فارسی',
          pl: 'Polski',
          pt: 'Português',
          pt_BR: 'Português (Brazil)',
          ru: 'Русский',
          hu: 'Magyar',
          zh_TW: '国语 (TW)',
          sr: 'Srpski',
          sr_latin: 'Srpski (latin)',
          hr: 'Hravtski',
          kl: 'Kalaallisut',
          sl: 'Slovenščina'
        }
      },

      noGoogleTranslateLanguages: {
        type: Array,
        value: ['kl']
      },

      refreshLanguages: {
        type: Boolean,
        value: false
      },

      languages: {
        type: Array,
        computed: '_languages(supportedLanguages, language, refreshLanguages)'
      },

      selectedLocale: {
        type: String,
        observer: '_selectedLocaleChanged'
      },

      noUserEvents: {
        type: Boolean,
        value: false
      },

      value: {
        type: String,
        value: ""
      },

      canUseAutoTranslate: {
        type: Boolean,
        computed: '_canUseAutoTranslate(language, hasServerAutoTranslation, autoTranslateOptionDisabled)'
      },

      autoTranslateOptionDisabled: {
        type: Boolean,
        value: false
      },

      autoTranslate: {
        type: Boolean,
        value: false
      },

      dropdownVisible: {
        type: Boolean,
        value: true
      },

      hasServerAutoTranslation: {
        type: Boolean,
        value: false
      },

      isOutsideChangeEvent: {
        type: Boolean,
        value: false
      }
    };
  }

  _refreshLanguage () {
    this.set('dropdownVisible', false);
    this.set('refreshLanguages', !this.refreshLanguages);
    this.async(function () {
      this.set('dropdownVisible', true);
    });
  }

  static get styles() {
    return [
      css`

      paper-dropdown-menu {
        max-width: 250px;
      }

      .translateButton {
        padding: 8px;
        color: var(--accent-color);
        margin-top: 8px;
      }

      .stopTranslateButton {
        padding: 8px;
        color: white;
        background: var(--accent-color);
        margin-top: 8px;
      }

      .translateText {
        margin-left: 8px;
      }

      .stopIcon {
        margin-left: 8px;
      }
    `, YpFlexLayout]
  }

  render() {
    return html`
    <lite-signal on-lite-signal-yp-refresh-language-selection="_refreshLanguage"></lite-signal>

    <div class="layout vertical">
      ${ this.dropdownVisible ? html`
        <paper-dropdown-menu .label="Select language" .selected="${this.selectedLocale}}" .attrForSelected="name">
          <paper-listbox slot="dropdown-content" .selected="${this.selectedLocale}" .attrForSelected="name">

            ${ this.languages.map(item => html`
              <paper-item .name="${this.item.language}">${this.item.name}</paper-item>
            `)}

          </paper-listbox>
        </paper-dropdown-menu>
      ` : nothing }
      <div ?hidden="${!this.canUseAutoTranslate}">
        <mwc-button ?hidden="${this.autoTranslate}" raised class="layout horizontal translateButton"
                    @click="${this._startTranslation}" .icon="translate" .label="${this.t('autoTranslate')}">
        </mwc-button>
        <mwc-button ?hidden="${!this.autoTranslate}" .icon="translate" raised class="layout horizontal stopTranslateButton" @click="${this._stopTranslation}" .title="${this.t('stopAutoTranslate')}">
          <iron-icon class="stopIcon" .icon="do-not-disturb"></iron-icon>
        </mwc-button>
      </div>
    </div>

    <yp-ajax id="hasAutoTranslationAjax" url="/api/users/has/AutoTranslation" @response="${this._hasAutoTranslationResponse}"></yp-ajax>
    `
  }

/*
  behaviors: [
    IronFormElementBehavior
  ],
*/

connectedCallback() {
  super.connectedCallback()
    if (!this.noUserEvents) {
      this.$$("#hasAutoTranslationAjax").generateRequest();
      // Update dropdown language after it has been loaded from defaults
      this.async(function () {
        this.set('selectedLocale', this.language);
      }, 1500);
    }
  }

  _autoTranslateEvent(event, detail) {
    this.set('autoTranslate', detail);
  }

  _stopTranslation() {
    document.dispatchEvent(
      new CustomEvent("lite-signal", {
        bubbles: true,
        compose: true,
        detail: { name: 'yp-auto-translate', data: false }
      })
    );
    window.autoTranslate = false;
    this.fire('yp-language-name', this.supportedLanguages[this.language]);
    dom(document).querySelector('yp-app').getDialogAsync("masterToast", function (toast) {
      toast.text = this.t('autoTranslationStopped');
      toast.show();
    }.bind(this));
    window.appGlobals.activity('click', 'stopTranslation', this.language);
    sessionStorage.setItem("dontPromptForAutoTranslation", true);
  }

  _startTranslation() {
    if (this._canUseAutoTranslate(this.language, this.hasServerAutoTranslation)) {
      document.dispatchEvent(
        new CustomEvent("lite-signal", {
          bubbles: true,
          compose: true,
          detail: { name: 'yp-auto-translate', data: true }
        })
      );
      window.autoTranslate = true;
      this.fire('yp-language-name', this.supportedLanguages[this.language]);
      dom(document).querySelector('yp-app').getDialogAsync("masterToast", function (toast) {
        toast.text = this.t('autoTranslationStarted');
        toast.show();
      }.bind(this));
    }
    window.appGlobals.activity('click', 'startTranslation', this.language);
  }

  _canUseAutoTranslate(language, hasServerAutoTranslation, autoTranslateOptionDisabled) {
    if (!autoTranslateOptionDisabled && language && hasServerAutoTranslation && !this.noUserEvents) {
      const found = this.noGoogleTranslateLanguages.indexOf(language) > -1;
      return !found;
    } else {
      return false;
    }
  }

  _hasAutoTranslationResponse(event, detail) {
    if (detail.response && detail.response.hasAutoTranslation===true) {
      this.set('hasServerAutoTranslation', true);
    } else {
      this.set('hasServerAutoTranslation', false);
    }
  }

  _languages(supportedLanguages) {
    if (supportedLanguages) {
      let arr = [];
      const highlighted = [];
      let highlightedLocales = ['en','en_GB','is','fr','de','es','ar'];
      if (window.appGlobals.highlightedLanguages) {
        highlightedLocales = window.appGlobals.highlightedLanguages.split(",");
      }
      for (var key in supportedLanguages) {
        if (supportedLanguages.hasOwnProperty(key)) {
          if (highlightedLocales.indexOf(key) > -1) {
            highlighted.push({ language: key, name: supportedLanguages[key] });
          } else {
            arr.push({ language: key, name: supportedLanguages[key] });
          }
        }
      }

      arr = arr.sort(function (a, b) {
        if(a.name < b.name) { return -1; }
        if(a.name > b.name) { return 1; }
        return 0;
      });
      return highlighted.concat(arr);
    } else {
      return [];
    }
  }

  _selectedLocaleChanged(locale, oldLocale) {
    if (locale) {
      this.set('value', locale);
      if (!this.noUserEvents && oldLocale) {
        if (!this._canUseAutoTranslate(locale, this.hasServerAutoTranslation) && this.autoTranslate) {
          this._stopTranslation();
        }
        this.fire('yp-language-name', this.supportedLanguages[locale]);
        window.appGlobals.changeLocaleIfNeeded(locale, true);
        localStorage.setItem('yp-user-locale', locale);
        console.info("Saving locale");
        if (window.appUser && window.appUser.user) {
          window.appUser.setLocale(locale);
        }
        window.appGlobals.activity('click', 'changeLanguage', locale);
      }
    }
    this.isOutsideChangeEvent = false;
  }
}

window.customElements.define('yp-language-selector-lit', YpLanguageSelectorLit)