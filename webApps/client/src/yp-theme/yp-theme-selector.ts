import { html, css, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";

import { YpBaseElement } from "../common/yp-base-element.js";
import "@material/web/select/outlined-select.js";
import "@material/web/select/select-option.js";
import "@material/web/textfield/outlined-text-field.js";
import { YpThemeManager } from "../yp-app/YpThemeManager.js";

@customElement("yp-theme-selector")
export class YpThemeSelector extends YpBaseElement {
  @property({ type: String })
  oneDynamicThemeColor: string | undefined;

  @property({ type: String })
  themePrimaryColor: string | undefined;

  @property({ type: String })
  themeSecondaryColor: string | undefined;

  @property({ type: String })
  themeTertiaryColor: string | undefined;

  @property({ type: String })
  themeNeutralColor: string | undefined;

  @property({ type: String })
  themeNeutralVariantColor: string | undefined;

  @property({ type: String })
  selectedThemeScheme: string = "tonal";

  @property({ type: String })
  selectedThemeVariant: string = "monochrome";

  @property({ type: Object })
  themeConfiguration!: YpThemeConfiguration;

  @property({ type: Boolean })
  disableSelection: boolean | undefined = false;

  static override get styles() {
    return [
      super.styles,
      css`
        md-outlined-select,
        md-outlined-text-field {
          max-width: 250px;
          width: 250px;
        }
      `,
    ];
  }
  override connectedCallback() {
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

  override updated(changedProperties: Map<string | number | symbol, unknown>) {
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
        oneColorScheme: this.selectedThemeScheme as MaterialColorScheme,
        variant: this.selectedThemeVariant as MaterialDynamicVariants,
        primaryColor: this.themePrimaryColor,
        secondaryColor: this.themeSecondaryColor,
        tertiaryColor: this.themeTertiaryColor,
        neutralColor: this.themeNeutralColor,
        neutralVariantColor: this.themeNeutralVariantColor,
      };

      if (this.themeConfiguration.oneDynmicColor) {
        this.fireGlobal(
          "yp-theme-configuration-updated",
          this.themeConfiguration
        );
      } else if (
        !this.themeConfiguration.oneDynmicColor &&
        this.themeConfiguration.primaryColor &&
        this.themeConfiguration.secondaryColor &&
        this.themeConfiguration.tertiaryColor &&
        this.themeConfiguration.neutralColor &&
        this.themeConfiguration.neutralVariantColor
      ) {
        this.fireGlobal(
          "yp-theme-configuration-updated",
          this.themeConfiguration
        );
      }

      this.fire("yp-theme-configuration-changed", {
        themeConfiguration: this.themeConfiguration,
      });
    }
  }
  // Helper method to check if color is a valid hex
  isValidHex(color: string | undefined) {
    if (color) {
      return /^#([0-9A-F]{3}){1,2}$/i.test(color);
    } else {
      return false;
    }
  }

  override render() {
    const disableMultiInputs = this.isValidHex(this.oneDynamicThemeColor);

    const disableOneThemeColorInputs = [
      this.themePrimaryColor,
      this.themeSecondaryColor,
      this.themeTertiaryColor,
      this.themeNeutralColor,
      this.themeNeutralVariantColor,
    ].some((color) => this.isValidHex(color));

    return html`
      <md-outlined-text-field
        label="Dynamic Theme Color"
        .value="${this.oneDynamicThemeColor || ""}"
        ?disabled="${this.disableSelection || disableOneThemeColorInputs}"
        @input="${(e: any) => {
          this.oneDynamicThemeColor = e.target.value;
        }}"
        class="mainInput"
      ></md-outlined-text-field>

      <md-outlined-select
        label="Theme Scheme"
        .disabled="${this.disableSelection || disableOneThemeColorInputs}"
        @selected="${(e: any) => {
          this.selectedThemeScheme = e.detail.value;
        }}"
      >
        <md-select-option aria-label="blank"></md-select-option>
        ${YpThemeManager.themeScemesOptionsWithName.map(
          (option) => html`
            <md-select-option value="${option.value}">
              <div slot="headline">${option.name}</div>
            </md-select-option>
          `
        )}
      </md-outlined-select>

      <md-outlined-select
        label="Theme Variant"
        .disabled="${disableMultiInputs}"
        @selected="${(e: any) => {
          this.selectedThemeVariant = e.detail.value;
        }}"
      >
        <md-select-option aria-label="blank"></md-select-option>
        ${YpThemeManager.themeVariantsOptionsWithName.map(
          (option) => html`
            <md-select-option value="${option.value}">
              <div slot="headline">${option.name}</div>
            </md-select-option>
          `
        )}
      </md-outlined-select>

      <md-outlined-text-field
        label="Theme Primary Color"
        .value="${this.themePrimaryColor || ""}"
        .disabled="${disableMultiInputs}"
        @input="${(e: any) => {
          this.themePrimaryColor = e.target.value;
        }}"
        class="mainInput"
      ></md-outlined-text-field>

      <md-outlined-text-field
        label="Theme Secondary Color"
        .value="${this.themeSecondaryColor || ""}"
        .disabled="${disableMultiInputs}"
        @input="${(e: any) => {
          this.themeSecondaryColor = e.target.value;
        }}"
        class="mainInput"
      ></md-outlined-text-field>

      <md-outlined-text-field
        label="Theme Tertiary Color"
        .value="${this.themeTertiaryColor || ""}"
        .disabled="${disableMultiInputs}"
        @input="${(e: any) => {
          this.themeTertiaryColor = e.target.value;
        }}"
        class="mainInput"
      ></md-outlined-text-field>

      <md-outlined-text-field
        label="Theme Neutral Color"
        .value="${this.themeNeutralColor || ""}"
        .disabled="${disableMultiInputs}"
        @input="${(e: any) => {
          this.themeNeutralColor = e.target.value;
        }}"
        class="mainInput"
      ></md-outlined-text-field>

      <md-outlined-text-field
        label="Theme Neutral Color"
        .value="${this.themeNeutralVariantColor || ""}"
        .disabled="${disableMultiInputs}"
        @input="${(e: any) => {
          this.themeNeutralVariantColor = e.target.value;
        }}"
        class="mainInput"
      ></md-outlined-text-field>
    `;
  }
}
