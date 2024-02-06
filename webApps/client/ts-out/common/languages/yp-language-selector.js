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
import "@material/web/textfield/filled-text-field.js";
import "@material/web/menu/menu.js";
import "@material/web/menu/menu-item.js";
import { YpBaseElement } from "../../common/yp-base-element.js";
import { YpLanguages } from "../../common/languages/ypLanguages.js";
let YpLanguageSelector = class YpLanguageSelector extends YpBaseElement {
    constructor() {
        super(...arguments);
        this.refreshLanguages = false;
        this.noUserEvents = false;
        this.value = "";
        this.autocompleteText = "";
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
            this._selectedLocaleChanged(this.selectedLocale ? this.selectedLocale : this.language);
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

        .translateButton,
        .stopTranslateButton {
          padding: 8px;
          margin-top: 24px;
          margin-bottom: 16px;
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
    get foundAutoCompleteLanguages() {
        return this.languages.filter((item) => {
            return (item.name.toLowerCase().indexOf(this.autocompleteText.toLowerCase()) >
                -1);
        });
    }
    openMenu() {
        this.$$("md-menu").open = true;
    }
    _autoCompleteChange(event) {
        this.autocompleteText = event.target.value;
    }
    _selectLanguage(event) {
        this.selectedLocale = event.currentTarget.getAttribute("data-language");
    }
    renderMenuItem(index, item) {
        return html `
      <md-menu-item
        type="option"
        id="${index}"
        data-language="${item.language}"
        @click="${this._selectLanguage}"
      >
        <div slot="headline">${item.name}</div>
      </md-menu-item>
    `;
    }
    renderAutoComplete() {
        let idIndex = 0;
        return html `
      <span style="position: relative">
        <md-filled-text-field
          id="textfield"
          type="combobox"
          aria-controls="menu"
          aria-autocomplete="list"
          aria-expanded="true"
          aria-activedescendant="1"
          .label="${this.t("selectLanguage")}"
          @click="${this.openMenu}"
          @keyup=${this._autoCompleteChange}
          .value="${YpLanguages.getEnglishName(this.language) || ""}"
        >
        </md-filled-text-field>
        <md-menu
          id="menu"
          anchor="textfield"
          role="listbox"
          aria-label="states"
        >
          ${this.foundAutoCompleteLanguages.map((item) => {
            return this.renderMenuItem(idIndex++, item);
        })}
          <md-divider
            ?hidden="${this.foundAutoCompleteLanguages.length == 0}"
            role="separator"
            tabindex="-1"
          ></md-divider>
          ${this.languages.map((item) => {
            return this.renderMenuItem(idIndex++, item);
        })}
        </md-menu>
      </span>
    `;
    }
    render() {
        return html `
      <div class="layout vertical">
        ${this.dropdownVisible ? this.renderAutoComplete() : nothing}
        <div ?hidden="${!this.canUseAutoTranslate}">
          <md-filled-button
            ?hidden="${this.autoTranslate}"
            class="layout horizontal translateButton"
            @click="${this.startTranslation}"
            >${this.t("autoTranslate")}<md-icon slot="icon">translate</md-icon>
          </md-filled-button>
          <md-filled-button
            ?hidden="${!this.autoTranslate}"
            class="layout horizontal stopTranslateButton"
            @click="${this._stopTranslation}"
          >
            ${this.t("stopAutoTranslate")}<md-icon slot="icon" class="stopIcon"
              >do_not_disturb</md-icon
            >
          </md-filled-button>
        </div>
      </div>
    `;
    }
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
            this.selectedLocale = this.language;
        }
        this.addGlobalListener("yp-refresh-language-selection", this._refreshLanguage.bind(this));
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this.removeGlobalListener("yp-refresh-language-selection", this._refreshLanguage.bind(this));
    }
    firstUpdated(_changedProperties) {
        super.firstUpdated(_changedProperties);
        if (_changedProperties.has("language") && this.language) {
            const textfield = this.$$("md-filled-text-field");
            textfield.value = YpLanguages.getEnglishName(this.language) || "";
        }
    }
    _autoTranslateEvent(event) {
        this.autoTranslate = event.detail;
    }
    _stopTranslation() {
        window.appGlobals.stopTranslation();
        this.autoTranslate = false;
        this.fire("yp-language-name", YpLanguages.getEnglishName(this.language));
        window.appDialogs.getDialogAsync("masterToast", (toast) => {
            toast.text = this.t("autoTranslationStopped");
            toast.open = true;
        });
        window.appGlobals.activity("click", "stopTranslation", this.language);
        sessionStorage.setItem("dontPromptForAutoTranslation", "true");
    }
    startTranslation() {
        if (this.canUseAutoTranslate) {
            window.appGlobals.startTranslation();
            this.autoTranslate = true;
            this.fire("yp-language-name", YpLanguages.getEnglishName(this.language));
            window.appDialogs.getDialogAsync("masterToast", (toast) => {
                toast.text = this.t("autoTranslationStarted");
                toast.show();
            });
        }
        window.appGlobals.activity("click", "startTranslation", this.language);
    }
    get canUseAutoTranslate() {
        if (!this.autoTranslateOptionDisabled &&
            this.language &&
            this.hasServerAutoTranslation &&
            !this.noUserEvents) {
            const found = window.appGlobals.hasLlm ||
                YpLanguages.isoCodesNotInGoogleTranslate.indexOf(this.language) > -1;
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
            let highlightedLocales = ["en", "is", "fr", "de", "es", "ar"];
            if (window.appGlobals.highlightedLanguages) {
                highlightedLocales = window.appGlobals.highlightedLanguages.split(",");
            }
            highlightedLocales = highlightedLocales.map((item) => item.replace("-", "_").toLowerCase());
            for (let l = 0; l < YpLanguages.allLanguages.length; l++) {
                const language = YpLanguages.allLanguages[l];
                if (highlightedLocales.indexOf(language.code) > -1) {
                    highlighted.push({
                        language: language.code,
                        name: `${language.nativeName} (${language.englishName})`,
                    });
                }
                else {
                    arr.push({
                        language: language.code,
                        name: `${language.nativeName} (${language.englishName})`,
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
], YpLanguageSelector.prototype, "autocompleteText", void 0);
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