var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { YpBaseElement } from "../common/yp-base-element.js";
import "@material/web/select/outlined-select.js";
import "@material/web/select/select-option.js";
import "@material/web/textfield/outlined-text-field.js";
import { YpThemeManager } from "../yp-app/YpThemeManager.js";
let YpThemeSelector = class YpThemeSelector extends YpBaseElement {
    constructor() {
        super(...arguments);
        this.selectedThemeScheme = "tonal";
        this.selectedThemeVariant = "monochrome";
        this.disableSelection = false;
    }
    static get styles() {
        return [
            super.styles,
            css `
        md-outlined-select,
        md-outlined-text-field {
          max-width: 250px;
          width: 250px;
        }
      `,
        ];
    }
    connectedCallback() {
        super.connectedCallback();
        if (this.themeConfiguration) {
            this.oneDynamicThemeColor = this.themeConfiguration.oneDynmicColor;
            this.selectedThemeScheme =
                this.themeConfiguration.oneColorScheme || this.selectedThemeScheme;
            this.selectedThemeVariant =
                this.themeConfiguration.variant || this.selectedThemeVariant;
            this.themePrimaryColor = this.themeConfiguration.primaryColor;
            this.themeSecondaryColor = this.themeConfiguration.secondaryColor;
            this.themeTertiaryColor = this.themeConfiguration.tertiaryColor;
            this.themeNeutralColor = this.themeConfiguration.neutralColor;
            this.themeNeutralVariantColor =
                this.themeConfiguration.neutralVariantColor;
        }
    }
    updated(changedProperties) {
        let shouldUpdateConfiguration = false;
        // Check if any of the relevant properties have changed
        [
            "oneDynamicThemeColor",
            "selectedThemeScheme",
            "selectedThemeVariant",
            "themePrimaryColor",
            "themeSecondaryColor",
            "themeTertiaryColor",
            "themeNeutralColor",
            "themeNeutralVariantColor",
        ].forEach((prop) => {
            if (changedProperties.has(prop)) {
                shouldUpdateConfiguration = true;
            }
        });
        if (shouldUpdateConfiguration) {
            // Update the themeConfiguration object
            this.themeConfiguration = {
                oneDynmicColor: this.oneDynamicThemeColor,
                oneColorScheme: this.selectedThemeScheme,
                variant: this.selectedThemeVariant,
                primaryColor: this.themePrimaryColor,
                secondaryColor: this.themeSecondaryColor,
                tertiaryColor: this.themeTertiaryColor,
                neutralColor: this.themeNeutralColor,
                neutralVariantColor: this.themeNeutralVariantColor,
            };
            if (this.themeConfiguration.oneDynmicColor) {
                this.fireGlobal("yp-theme-configuration-updated", this.themeConfiguration);
            }
            else if (!this.themeConfiguration.oneDynmicColor &&
                this.themeConfiguration.primaryColor &&
                this.themeConfiguration.secondaryColor &&
                this.themeConfiguration.tertiaryColor &&
                this.themeConfiguration.neutralColor &&
                this.themeConfiguration.neutralVariantColor) {
                this.fireGlobal("yp-theme-configuration-updated", this.themeConfiguration);
            }
            this.fire("yp-theme-configuration-changed", {
                themeConfiguration: this.themeConfiguration,
            });
        }
    }
    // Helper method to check if color is a valid hex
    isValidHex(color) {
        if (color) {
            return /^#([0-9A-F]{3}){1,2}$/i.test(color);
        }
        else {
            return false;
        }
    }
    render() {
        const disableMultiInputs = this.isValidHex(this.oneDynamicThemeColor);
        const disableOneThemeColorInputs = [
            this.themePrimaryColor,
            this.themeSecondaryColor,
            this.themeTertiaryColor,
            this.themeNeutralColor,
            this.themeNeutralVariantColor,
        ].some((color) => this.isValidHex(color));
        return html `
      <md-outlined-text-field
        label="Dynamic Theme Color"
        .value="${this.oneDynamicThemeColor || ""}"
        ?disabled="${this.disableSelection || disableOneThemeColorInputs}"
        @input="${(e) => {
            this.oneDynamicThemeColor = e.target.value;
        }}"
        class="mainInput"
      ></md-outlined-text-field>

      <md-outlined-select
        label="Theme Scheme"
        .disabled="${this.disableSelection || disableOneThemeColorInputs}"
        @selected="${(e) => {
            this.selectedThemeScheme = e.detail.value;
        }}"
      >
        <md-select-option aria-label="blank"></md-select-option>
        ${YpThemeManager.themeScemesOptionsWithName.map((option) => html `
            <md-select-option value="${option.value}">
              <div slot="headline">${option.name}</div>
            </md-select-option>
          `)}
      </md-outlined-select>

      <md-outlined-select
        label="Theme Variant"
        .disabled="${disableMultiInputs}"
        @selected="${(e) => {
            this.selectedThemeVariant = e.detail.value;
        }}"
      >
        <md-select-option aria-label="blank"></md-select-option>
        ${YpThemeManager.themeVariantsOptionsWithName.map((option) => html `
            <md-select-option value="${option.value}">
              <div slot="headline">${option.name}</div>
            </md-select-option>
          `)}
      </md-outlined-select>

      <md-outlined-text-field
        label="Theme Primary Color"
        .value="${this.themePrimaryColor || ""}"
        .disabled="${disableMultiInputs}"
        @input="${(e) => {
            this.themePrimaryColor = e.target.value;
        }}"
        class="mainInput"
      ></md-outlined-text-field>

      <md-outlined-text-field
        label="Theme Secondary Color"
        .value="${this.themeSecondaryColor || ""}"
        .disabled="${disableMultiInputs}"
        @input="${(e) => {
            this.themeSecondaryColor = e.target.value;
        }}"
        class="mainInput"
      ></md-outlined-text-field>

      <md-outlined-text-field
        label="Theme Tertiary Color"
        .value="${this.themeTertiaryColor || ""}"
        .disabled="${disableMultiInputs}"
        @input="${(e) => {
            this.themeTertiaryColor = e.target.value;
        }}"
        class="mainInput"
      ></md-outlined-text-field>

      <md-outlined-text-field
        label="Theme Neutral Color"
        .value="${this.themeNeutralColor || ""}"
        .disabled="${disableMultiInputs}"
        @input="${(e) => {
            this.themeNeutralColor = e.target.value;
        }}"
        class="mainInput"
      ></md-outlined-text-field>

      <md-outlined-text-field
        label="Theme Neutral Color"
        .value="${this.themeNeutralVariantColor || ""}"
        .disabled="${disableMultiInputs}"
        @input="${(e) => {
            this.themeNeutralVariantColor = e.target.value;
        }}"
        class="mainInput"
      ></md-outlined-text-field>
    `;
    }
};
__decorate([
    property({ type: String })
], YpThemeSelector.prototype, "oneDynamicThemeColor", void 0);
__decorate([
    property({ type: String })
], YpThemeSelector.prototype, "themePrimaryColor", void 0);
__decorate([
    property({ type: String })
], YpThemeSelector.prototype, "themeSecondaryColor", void 0);
__decorate([
    property({ type: String })
], YpThemeSelector.prototype, "themeTertiaryColor", void 0);
__decorate([
    property({ type: String })
], YpThemeSelector.prototype, "themeNeutralColor", void 0);
__decorate([
    property({ type: String })
], YpThemeSelector.prototype, "themeNeutralVariantColor", void 0);
__decorate([
    property({ type: String })
], YpThemeSelector.prototype, "selectedThemeScheme", void 0);
__decorate([
    property({ type: String })
], YpThemeSelector.prototype, "selectedThemeVariant", void 0);
__decorate([
    property({ type: Object })
], YpThemeSelector.prototype, "themeConfiguration", void 0);
__decorate([
    property({ type: Boolean })
], YpThemeSelector.prototype, "disableSelection", void 0);
YpThemeSelector = __decorate([
    customElement("yp-theme-selector")
], YpThemeSelector);
export { YpThemeSelector };
//# sourceMappingURL=yp-theme-selector.js.map