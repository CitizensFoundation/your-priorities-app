import { html, css, nothing, PropertyValueMap } from "lit";
import { property, customElement } from "lit/decorators.js";

import "@material/web/select/outlined-select.js";
import "@material/web/select/select-option.js";
import "@material/web/textfield/filled-text-field.js";
import "@material/web/menu/menu.js";
import "@material/web/menu/menu-item.js";

import { YpBaseElement } from "../../common/yp-base-element.js";
import { YpLanguages } from "../../common/languages/ypLanguages.js";
import { MdFilledTextField } from "@material/web/textfield/filled-text-field.js";
import { MdMenu } from "@material/web/menu/menu.js";
import { MdMenuItem } from "@material/web/menu/menu-item.js";

@customElement("yp-language-selector")
export class YpLanguageSelector extends YpBaseElement {
  @property({ type: Boolean })
  refreshLanguages = false;

  @property({ type: Boolean })
  noUserEvents = false;

  @property({ type: String })
  selectedLocale: string | undefined;

  @property({ type: String })
  value = "";

  @property({ type: String })
  autocompleteText = "";

  @property({ type: String })
  name = "";

  @property({ type: Boolean })
  autoTranslateOptionDisabled = false;

  @property({ type: Boolean })
  autoTranslate = false;

  @property({ type: Boolean })
  dropdownVisible = true;

  @property({ type: Boolean })
  hasServerAutoTranslation = false;

  @property({ type: Boolean })
  isOutsideChangeEvent = false;

  override updated(changedProperties: Map<string | number | symbol, unknown>) {
    super.updated(changedProperties);
    if (changedProperties.has("selectedLocale")) {
      this._selectedLocaleChanged(
        this.selectedLocale ? this.selectedLocale : this.language
      );
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

  static override get styles() {
    return [
      super.styles,
      css`
        md-outlined-select {
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
      return (
        item.name.toLowerCase().indexOf(this.autocompleteText.toLowerCase()) >
        -1
      );
    });
  }

  async openMenu() {
    (this.$$("md-menu") as MdMenu).open = true;
    (this.$$("md-filled-text-field") as MdFilledTextField).value ="";
  }

  _autoCompleteChange(event: CustomEvent) {
    this.autocompleteText = (event.target as MdFilledTextField).value;
  }

  _selectLanguage(event: CustomEvent) {
    this.selectedLocale = (event.currentTarget as MdMenuItem).getAttribute(
      "data-language"
    )!;

    localStorage.setItem("yp-user-locale", this.selectedLocale);
    console.info("Saving locale");
  }

  renderMenuItem(index: number, item: YpLanguageMenuItem) {
    return html`
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
    return html`
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

  override render() {
    return html`
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

  override async connectedCallback() {
    super.connectedCallback();
    this.setupBootListener();
    if (!this.noUserEvents) {
      const response =
        (await window.serverApi.hasAutoTranslation()) as YpHasAutoTranslationResponse;
      if (response && response.hasAutoTranslation === true) {
        this.hasServerAutoTranslation = true;
      } else {
        this.hasServerAutoTranslation = false;
      }
    }

    this.addGlobalListener(
      "yp-refresh-language-selection",
      this._refreshLanguage.bind(this)
    );

    this.addGlobalListener(
      "yp-auto-translate",
      this._autoTranslateEvent.bind(this)
    );
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.removeGlobalListener(
      "yp-auto-translate",
      this._autoTranslateEvent.bind(this)
    );
    this.removeGlobalListener(
      "yp-refresh-language-selection",
      this._refreshLanguage.bind(this)
    );
  }

  protected override firstUpdated(
    _changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
  ): void {
    super.firstUpdated(_changedProperties);
    if (_changedProperties.has("language") && this.language) {
      const textfield = this.$$("md-filled-text-field") as MdFilledTextField;
      textfield.value = YpLanguages.getEnglishName(this.language) || "";
    }
  }

  _autoTranslateEvent(event: CustomEvent) {
    this.autoTranslate = event.detail;
  }

  _stopTranslation() {
    window.appGlobals.stopTranslation();
    this.autoTranslate = false;
    this.fire("yp-language-name", YpLanguages.getEnglishName(this.language));
    window.appDialogs.getDialogAsync("masterToast", (toast: any) => {
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
      window.appDialogs.getDialogAsync("masterToast", (toast: any) => {
        toast.text = this.t("autoTranslationStarted");
        toast.open = true;
      });
    }
    window.appGlobals.activity("click", "startTranslation", this.language);
  }

  get canUseAutoTranslate() {
    if (
      !this.autoTranslateOptionDisabled &&
      this.language &&
      this.hasServerAutoTranslation &&
      !this.noUserEvents
    ) {
      return this.hasLlm===true || !(YpLanguages.isoCodesNotInGoogleTranslate.indexOf(this.language) > -1);
    } else {
      return false;
    }
  }

  get languages(): YpLanguageMenuItem[] {
    if (YpLanguages.allLanguages) {
      let arr = [];
      const highlighted = [];
      let highlightedLocales = ["en", "is", "fr", "de", "es", "ar"];
      if (window.appGlobals.highlightedLanguages) {
        highlightedLocales = window.appGlobals.highlightedLanguages.split(",");
      }

      highlightedLocales = highlightedLocales.map((item) =>
        item.replace("-", "_").toLowerCase()
      );

      for (let l = 0; l < YpLanguages.allLanguages.length; l++) {
        const language = YpLanguages.allLanguages[l];

        if (highlightedLocales.indexOf(language.code) > -1) {
          highlighted.push({
            language: language.code,
            name: `${language.nativeName} (${language.englishName})`,
          });
        } else {
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
    } else {
      return [];
    }
  }

  _selectedLocaleChanged(oldLocale: string) {
    if (this.selectedLocale) {
      this.value = this.selectedLocale;
      if (oldLocale) {
        this.fire("changed", this.value);
      }
      if (!this.noUserEvents && oldLocale) {
        if (!this.canUseAutoTranslate && this.autoTranslate) {
          this._stopTranslation();
        }
        this.fire(
          "yp-language-name",
          YpLanguages.getEnglishName(this.language)
        );
        window.appGlobals.changeLocaleIfNeeded(this.selectedLocale, true);

        if (window.appUser && window.appUser.user) {
          window.appUser.setLocale(this.selectedLocale);
        }
        window.appGlobals.activity(
          "click",
          "changeLanguage",
          this.selectedLocale
        );
      }
    }
    this.isOutsideChangeEvent = false;
  }
}
