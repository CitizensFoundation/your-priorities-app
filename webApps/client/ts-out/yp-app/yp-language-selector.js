var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, css, nothing } from "lit";
import { property, customElement } from "lit/decorators.js";
import "@material/web/select/outlined-select.js";
import "@material/web/select/select-option.js";
import { YpBaseElement } from "../common/yp-base-element.js";
import { YpLanguages } from "../common/ypLanguages.js";
let YpLanguageSelector = class YpLanguageSelector extends YpBaseElement {
    constructor() {
        super(...arguments);
        this.refreshLanguages = false;
        this.noUserEvents = false;
        this.value = "";
        this.name = "";
        this.autoTranslateOptionDisabled = false;
        this.autoTranslate = false;
        this.dropdownVisible = true;
        this.hasServerAutoTranslation = false;
        this.isOutsideChangeEvent = false;
    }
    updated(changedProperties) {
        super.updated(changedProperties);
        if (changedProperties.has("selectedLocale")) {
            this._selectedLocaleChanged(changedProperties.get("selectedLocale"));
            this.fire("yp-selected-locale-changed", this.selectedLocale);
        }
    }
    _refreshLanguage() {
        this.dropdownVisible = false;
        this.refreshLanguages = !this.refreshLanguages;
        setTimeout(() => {
            this.dropdownVisible = true;
        });
    }
    static get styles() {
        return [
            super.styles,
            css `
        mwc-select {
          max-width: 250px;
        }

        .translateButton {
          padding: 8px;
          margin-top: 8px;
        }

        .stopTranslateButton {
          padding: 8px;
          margin-top: 8px;
        }

        .translateText {
          margin-left: 8px;
        }

        .stopIcon {
          margin-left: 8px;
        }
      `,
        ];
    }
    renderAutoComplete() {
        return html `
      <md-filled-text-field
        id="textfield"
        type="combobox"
        aria-controls="menu"
        aria-autocomplete="list"
        aria-expanded="true"
        aria-activedescendant="1"
        value="Ala"
      >
      </md-filled-text-field>
      <md-menu
        id="menu"
        anchor="textfield"
        role="listbox"
        aria-label="states"
        open
      >
        <md-menu-item type="option" id="0">
          <div slot="headline">Alabama</div>
        </md-menu-item>
        <md-divider role="separator" tabindex="-1"></md-divider>
        <md-menu-item type="option" id="1" selected aria-selected="true">
          <div slot="headline">Alabama</div>
        </md-menu-item>
      </md-menu>
    `;
    }
    render() {
        return html `
      <div class="layout vertical">
        ${this.dropdownVisible
            ? html `
              <md-outlined-select
                .value="${this.value}"
                label="Select language"
              >
                ${this.languages.map((item) => html `
                    <md-select-option
                      @click="${this._selectLanguage}"
                      .value="${item.language}"
                      >${item.name}</md-select-option
                    >
                  `)}
              </md-outlined-select>
            `
            : nothing}
        <div ?hidden="${!this.canUseAutoTranslate}">
          <md-outlined-button
            ?hidden="${this.autoTranslate}"
            raised
            class="layout horizontal translateButton"
            @click="${this.startTranslation}"
            .label="${this.t("autoTranslate")}"
            ><md-icon>translate</md-icon>
          </md-outlined-button>
          <md-outlined-button
            ?hidden="${!this.autoTranslate}"
            icon="translate"
            raised
            class="layout horizontal stopTranslateButton"
            @click="${this._stopTranslation}"
            .title="${this.t("stopAutoTranslate")}"
          >
            <md-icon class="stopIcon">do_not_disturb</md-icon>
          </md-outlined-button>
        </div>
      </div>
    `;
    }
    _selectLanguage(event) {
        this.selectedLocale = event.target.value;
    }
    /*
    behaviors: [
      IronFormElementBehavior
    ],
  */
    async connectedCallback() {
        super.connectedCallback();
        if (!this.noUserEvents) {
            const response = (await window.serverApi.hasAutoTranslation());
            if (response && response.hasAutoTranslation === true) {
                this.hasServerAutoTranslation = true;
            }
            else {
                this.hasServerAutoTranslation = false;
            }
            //TODO: Check this below!
            //(Update dropdown language after it has been loaded from defaults)
            setTimeout(() => {
                this.selectedLocale = this.language;
            }, 1500);
        }
        this.addGlobalListener("yp-refresh-language-selection", this._refreshLanguage.bind(this));
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this.removeGlobalListener("yp-refresh-language-selection", this._refreshLanguage.bind(this));
    }
    _autoTranslateEvent(event) {
        this.autoTranslate = event.detail;
    }
    _stopTranslation() {
        this.fireGlobal("yp-auto-translate", false);
        window.appGlobals.autoTranslate = false;
        this.fire("yp-language-name", YpLanguages.getEnglishName(this.language));
        /*window.appDialogs
          .getDialogAsync(
            'masterToast',
             (toast) => {
              toast.text = this.t('autoTranslationStopped');
              toast.open = true
            }
          );*/
        window.appGlobals.activity("click", "stopTranslation", this.language);
        sessionStorage.setItem("dontPromptForAutoTranslation", "true");
    }
    startTranslation() {
        if (this.canUseAutoTranslate) {
            this.fireGlobal("yp-auto-translate", true);
            window.appGlobals.autoTranslate = true;
            this.fire("yp-language-name", YpLanguages.getEnglishName(this.language));
            /*window.appDialogs.getDialogAsync("masterToast",  (toast) => {
              toast.text = this.t('autoTranslationStarted');
              toast.show();
            });*/
        }
        window.appGlobals.activity("click", "startTranslation", this.language);
    }
    get canUseAutoTranslate() {
        if (!this.autoTranslateOptionDisabled &&
            this.language &&
            this.hasServerAutoTranslation &&
            !this.noUserEvents) {
            const found = YpLanguages.isoCodesNotInGoogleTranslate.indexOf(this.language) > -1;
            return !found;
        }
        else {
            return false;
        }
    }
    get languages() {
        if (YpLanguages.allLanguages) {
            let arr = [];
            const highlighted = [];
            let highlightedLocales = ["en", "en_GB", "is", "fr", "de", "es", "ar"];
            if (window.appGlobals.highlightedLanguages) {
                highlightedLocales = window.appGlobals.highlightedLanguages.split(",");
            }
            highlightedLocales = highlightedLocales.map((item) => item.replace("-", "_").toLowerCase());
            for (let l = 0; l > YpLanguages.allLanguages.length; l++) {
                const language = YpLanguages.allLanguages[l];
                if (highlightedLocales.indexOf(language.code) > -1) {
                    highlighted.push({
                        language: language.code,
                        name: `${language.nativeName} (${language.englishName})}`,
                    });
                }
                else {
                    arr.push({
                        language: language.code,
                        name: `${language.nativeName} (${language.englishName})}`,
                    });
                }
            }
            arr = arr.sort(function (a, b) {
                if (a.name < b.name) {
                    return -1;
                }
                if (a.name > b.name) {
                    return 1;
                }
                return 0;
            });
            return highlighted.concat(arr);
        }
        else {
            return [];
        }
    }
    _selectedLocaleChanged(oldLocale) {
        if (this.selectedLocale) {
            this.value = this.selectedLocale;
            if (oldLocale) {
                this.fire("changed", this.value);
            }
            if (!this.noUserEvents && oldLocale) {
                if (!this.canUseAutoTranslate && this.autoTranslate) {
                    this._stopTranslation();
                }
                this.fire("yp-language-name", YpLanguages.getEnglishName(this.language));
                window.appGlobals.changeLocaleIfNeeded(this.selectedLocale, true);
                localStorage.setItem("yp-user-locale", this.selectedLocale);
                console.info("Saving locale");
                if (window.appUser && window.appUser.user) {
                    window.appUser.setLocale(this.selectedLocale);
                }
                window.appGlobals.activity("click", "changeLanguage", this.selectedLocale);
            }
        }
        this.isOutsideChangeEvent = false;
    }
};
__decorate([
    property({ type: Boolean })
], YpLanguageSelector.prototype, "refreshLanguages", void 0);
__decorate([
    property({ type: Boolean })
], YpLanguageSelector.prototype, "noUserEvents", void 0);
__decorate([
    property({ type: String })
], YpLanguageSelector.prototype, "selectedLocale", void 0);
__decorate([
    property({ type: String })
], YpLanguageSelector.prototype, "value", void 0);
__decorate([
    property({ type: String })
], YpLanguageSelector.prototype, "name", void 0);
__decorate([
    property({ type: Boolean })
], YpLanguageSelector.prototype, "autoTranslateOptionDisabled", void 0);
__decorate([
    property({ type: Boolean })
], YpLanguageSelector.prototype, "autoTranslate", void 0);
__decorate([
    property({ type: Boolean })
], YpLanguageSelector.prototype, "dropdownVisible", void 0);
__decorate([
    property({ type: Boolean })
], YpLanguageSelector.prototype, "hasServerAutoTranslation", void 0);
__decorate([
    property({ type: Boolean })
], YpLanguageSelector.prototype, "isOutsideChangeEvent", void 0);
YpLanguageSelector = __decorate([
    customElement("yp-language-selector")
], YpLanguageSelector);
export { YpLanguageSelector };
//# sourceMappingURL=yp-language-selector.js.map