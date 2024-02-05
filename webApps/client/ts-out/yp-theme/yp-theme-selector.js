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
import { repeat } from "lit/directives/repeat.js";
import "./yp-theme-color-input.js";
//TODO: Figure out how to implement "Use exactly the provided colors as an option" https://material-foundation.github.io/material-theme-builder/
let YpThemeSelector = class YpThemeSelector extends YpBaseElement {
    constructor() {
        super(...arguments);
        this.selectedThemeScheme = "tonal";
        this.selectedThemeVariant = "monochrome";
        this.disableSelection = false;
        this.disableMultiInputs = false;
        this.disableOneThemeColorInputs = false;
    }
    static get styles() {
        return [
            super.styles,
            css `
        md-outlined-select,
        md-outlined-text-field {
          max-width: 300px;
          width: 300px;
          margin-bottom: 8px;
          margin-top: 8px;
        }

        .colorTypeTitle {
          font-size: 16px;
          font-weight: bold;
          text-transform: uppercase;
          margin-bottom: 16px;
          color: var(--md-sys-color-primary);
        }

        .darkContrastInfo {
          font-size: 11px;
          font-style: italic;
          margin-top: -8px;
          margin-bottom: 16px;
          text-align: center;
        }

        .or {
          margin-top: 16px;
          margin-bottom: 32px;
          align-items: center;
          font-size: 16px;
          font-weight: bold;
          text-transform: uppercase;
          max-width: 250px;
          width: 250px;
          text-align: center;
        }

        .color {
          padding: 12px;
          margin-top: 8px;
          margin-bottom: 16px;
          margin-left: 32px;
          border-radius: 8px;
          width: 369px;
        }

        .leftContainer {
          align-self: start;
          margin-top: 32px;
        }

        .dynamicColors, .customColors {
          padding: 40px;
          margin: 32px;
          margin-bottom: 8px;
          margin-top: 8px;
          border-radius: 32px;
          background-color: var(--md-sys-color-surface);
          color: var(--md-sys-color-on-surface);
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
        this.addGlobalListener("yp-theme-color-detected", this.themeColorDetected.bind(this));
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this.removeGlobalListener("yp-theme-color-detected", this.themeColorDetected.bind(this));
    }
    themeColorDetected(event) {
        this.oneDynamicThemeColor = event.detail;
        console.error("Theme Color Detected:", this.oneDynamicThemeColor);
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
                this.updateDisabledInputs();
                this.fire('config-updated');
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
            this.fire("yp-theme-configuration-changed", this.themeConfiguration);
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
    setThemeSchema(event) {
        const index = event.target.selectedIndex;
        this.selectedThemeScheme =
            YpThemeManager.themeScemesOptionsWithName[index].value;
    }
    setThemeVariant(event) {
        const index = event.target.selectedIndex;
        this.selectedThemeVariant =
            YpThemeManager.themeVariantsOptionsWithName[index].value;
    }
    handleColorInput(event) {
        const inputValue = event.target.value;
        const isValidHex = /^[0-9A-Fa-f]{0,6}$/.test(inputValue);
        if (isValidHex) {
            this.oneDynamicThemeColor = inputValue;
        }
        else {
            event.target.value =
                this.oneDynamicThemeColor || "";
        }
    }
    updateDisabledInputs() {
        this.disableOneThemeColorInputs = [
            this.themePrimaryColor,
            this.themeSecondaryColor,
            this.themeTertiaryColor,
            this.themeNeutralColor,
            this.themeNeutralVariantColor,
        ].some((color) => this.isValidHex(color));
        this.disableMultiInputs = this.isValidHex(this.oneDynamicThemeColor);
    }
    render() {
        return html `
      <div class="layout horizontal">
        <div class="layout vertical center-center leftContainer">
          <div class="dynamicColors">
            <div class="colorTypeTitle">${this.t("Dynamic Colors")}</div>
            <yp-theme-color-input
              class="mainInput"
              .label="${this.t("One Dynamic Color")}"
              .color="${this.oneDynamicThemeColor}"
              .disableSelection="${this.disableSelection ||
            this.disableOneThemeColorInputs}"
              @input="${(e) => {
            this.oneDynamicThemeColor = e.detail.color;
        }}"
            >
            </yp-theme-color-input>

            <md-outlined-select
              label="Theme Scheme"
              .disabled="${this.disableSelection ||
            this.disableOneThemeColorInputs}"
              @change="${this.setThemeSchema}"
              .selected="${this.selectedThemeScheme}"
            >
              ${YpThemeManager.themeScemesOptionsWithName.map((option) => html `
                  <md-select-option value="${option.value}">
                    <div slot="headline">${option.name}</div>
                  </md-select-option>
                `)}
            </md-outlined-select>
          </div>

          <div class="or">${this.t("or")}</div>

          <div class="customColors">
            <div class="colorTypeTitle">${this.t("Custom Colors")}</div>
            <yp-theme-color-input
              class="mainInput"
              .label="${this.t("Theme Primary Color")}"
              .color="${this.themePrimaryColor}"
              .disableSelection="${this.disableMultiInputs}"
              @input="${(e) => {
            this.themePrimaryColor = e.detail.color;
        }}"
            >
            </yp-theme-color-input>

            <yp-theme-color-input
              class="mainInput"
              .label="${this.t("Theme Secondary Color")}"
              .color="${this.themeSecondaryColor}"
              .disableSelection="${this.disableMultiInputs}"
              @input="${(e) => {
            this.themeSecondaryColor = e.detail.color;
        }}"
            >
            </yp-theme-color-input>

            <yp-theme-color-input
              class="mainInput"
              .label="${this.t("Theme Tertiary Color")}"
              .color="${this.themeTertiaryColor}"
              .disableSelection="${this.disableMultiInputs}"
              @input="${(e) => {
            this.themeTertiaryColor = e.detail.color;
        }}"
            >
            </yp-theme-color-input>

            <yp-theme-color-input
              class="mainInput"
              .label="${this.t("Theme Neutral Color")}"
              .color="${this.themeNeutralColor}"
              .disableSelection="${this.disableMultiInputs}"
              @input="${(e) => {
            this.themeNeutralColor = e.detail.color;
        }}"
            >
            </yp-theme-color-input>

            <yp-theme-color-input
              class="mainInput"
              .label="${this.t("Theme Neutral Variant Color")}"
              .color="${this.themeNeutralVariantColor}"
              .disableSelection="${this.disableMultiInputs}"
              @input="${(e) => {
            this.themeNeutralVariantColor = e.detail.color;
        }}"
            >
            </yp-theme-color-input>

            <md-outlined-select
              hidden
              label="Theme Variant"
              .disabled="${this.disableMultiInputs}"
              @change="${this.setThemeVariant}"
            >
              ${YpThemeManager.themeVariantsOptionsWithName.map((option) => html `
                  <md-select-option value="${option.value}">
                    <div slot="headline">${option.name}</div>
                  </md-select-option>
                `)}
            </md-outlined-select>
          </div>
        </div>
        <div class="layout vertical">
          <div class="layout horizontal center-center">
            ${this.renderThemeToggle(true)}
          </div>
          <div class="darkContrastInfo">
            ${this.t("userControlledSettings")}
          </div>
          ${this.renderPallette()}
        </div>
      </div>
    `;
    }
    renderPallette() {
        const palletteConfig = [
            {
                text: "Primary",
                color: "--md-sys-color-primary",
                contrast: "--md-sys-color-on-primary",
            },
            {
                text: "Primary Container",
                color: "--md-sys-color-primary-container",
                contrast: "--md-sys-color-on-primary-container",
            },
            {
                text: "Secondary",
                color: "--md-sys-color-secondary",
                contrast: "--md-sys-color-on-secondary",
            },
            {
                text: "Secondary Container",
                color: "--md-sys-color-secondary-container",
                contrast: "--md-sys-color-on-secondary-container",
            },
            {
                text: "Tertiary",
                color: "--md-sys-color-tertiary",
                contrast: "--md-sys-color-on-tertiary",
            },
            {
                text: "Tertiary Container",
                color: "--md-sys-color-tertiary-container",
                contrast: "--md-sys-color-on-tertiary-container",
            },
            {
                text: "Error",
                color: "--md-sys-color-error",
                contrast: "--md-sys-color-on-error",
            },
            {
                text: "Error Container",
                color: "--md-sys-color-error-container",
                contrast: "--md-sys-color-on-error-container",
            },
            {
                text: "Background",
                color: "--md-sys-color-background",
                contrast: "--md-sys-color-on-background",
            },
            {
                text: "Surface Dim",
                color: "--md-sys-color-surface-dim",
                contrast: "--md-sys-color-on-surface",
            },
            {
                text: "Surface",
                color: "--md-sys-color-surface",
                contrast: "--md-sys-color-on-surface",
            },
            {
                text: "Surface Bright",
                color: "--md-sys-color-surface-bright",
                contrast: "--md-sys-color-on-surface",
            },
            {
                text: "Surface Variant",
                color: "--md-sys-color-surface-variant",
                contrast: "--md-sys-color-on-surface-variant",
            },
            {
                text: "Surface Container Lowest",
                color: "--md-sys-color-surface-container-lowest",
                contrast: "--md-sys-color-on-surface-container",
            },
            {
                text: "Surface Container Low",
                color: "--md-sys-color-surface-container-low",
                contrast: "--md-sys-color-on-surface-container",
            },
            {
                text: "Surface Container",
                color: "--md-sys-color-surface-container",
                contrast: "--md-sys-color-on-surface-container",
            },
            {
                text: "Surface Container High",
                color: "--md-sys-color-surface-container-high",
                contrast: "--md-sys-color-on-surface-container",
            },
            {
                text: "Surface Container Highest",
                color: "--md-sys-color-surface-container-highest",
                contrast: "--md-sys-color-on-surface-container",
            },
            {
                text: "Inverse Primary",
                color: "--md-sys-color-inverse-primary",
                contrast: "--md-sys-color-inverse-on-primary",
            },
            {
                text: "Inverse Surface",
                color: "--md-sys-color-inverse-surface",
                contrast: "--md-sys-color-inverse-on-surface",
            },
        ];
        return html `<div class="wrapper">
      ${repeat(palletteConfig, ({ text }) => text, ({ text, color, contrast }) => html ` <div
          class="color"
          style="color:var(${contrast});background-color:var(${color})"
        >
          ${text}
        </div>`)}
    </div>`;
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
__decorate([
    property({ type: Boolean })
], YpThemeSelector.prototype, "disableMultiInputs", void 0);
__decorate([
    property({ type: Boolean })
], YpThemeSelector.prototype, "disableOneThemeColorInputs", void 0);
YpThemeSelector = __decorate([
    customElement("yp-theme-selector")
], YpThemeSelector);
export { YpThemeSelector };
//# sourceMappingURL=yp-theme-selector.js.map