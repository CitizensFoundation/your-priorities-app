import { html, css, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import "@material/web/textfield/outlined-text-field.js";
import { MdOutlinedTextField } from "@material/web/textfield/outlined-text-field.js";

import "vanilla-colorful";

import { YpBaseElement } from "../common/yp-base-element.js";

@customElement("yp-theme-color-input")
export class YpThemeColorInput extends YpBaseElement {
  @property({ type: String })
  color: string | undefined;

  @property({ type: String })
  label!: string;

  @property({ type: Boolean })
  disableSelection: boolean | undefined = false;

  private isColorPickerActive: boolean = false;

  static override get styles() {
    return [
      super.styles,
      css`
        md-outlined-select,
        md-outlined-text-field {
          max-width: 250px;
          width: 250px;
          margin-bottom: 8px;
          margin-top: 8px;
        }

        .container {
          position: relative;
        }

        .clearButton {
          position: absolute;
          left: -36px;
          top: 14px;
          opacity: 0.5;
        }

        hex-color-picker {
          position: absolute;
          top: -136px;
          right: 0;
          opacity: 1 !important;
        }
      `,
    ];
  }

  isValidHex(color: string | undefined) {
    if (color) {
      return /^#([0-9A-F]{3}){1,2}$/i.test(color);
    } else {
      return false;
    }
  }

  handleColorInput(event: CustomEvent) {
    const inputValue = (event.target as MdOutlinedTextField).value;
    const isValidHex = /^[0-9A-Fa-f]{0,6}$/.test(inputValue);
    if (isValidHex && inputValue.length === 6) {
      this.color = inputValue.replace("#", "");
      this.fire("input", { color: `${this.color }` });
    } else {
      (event.target as MdOutlinedTextField)!.value = this.color || "";
    }
    console.error(`Invalid color: ${inputValue}`);
  }

  openPalette() {
    const picker = this.shadowRoot!.querySelector("hex-color-picker");
    picker!.hidden = false;
    this.isColorPickerActive = false;

    picker!.addEventListener(
      "mousedown",
      () => (this.isColorPickerActive = true)
    );
    picker!.addEventListener(
      "mouseup",
      () => (this.isColorPickerActive = false)
    );

    setTimeout(
      () => document.addEventListener("click", this.handleOutsideClick, true),
      0
    );
  }

  handleOutsideClick = (event: MouseEvent) => {
    if (!this.isColorPickerActive) {
      const path = event.composedPath();
      const picker = this.shadowRoot!.querySelector("hex-color-picker");

      // Check if the click was inside the picker
      const clickInsidePicker = path.includes(picker!);

      // If the click was not inside the picker and the picker was active, close it
      if (!clickInsidePicker) {
        this.closePalette();
      }
    }
  };

  closePalette() {
    const picker = this.shadowRoot!.querySelector("hex-color-picker");
    if (picker) {
      picker.hidden = true;
      document.removeEventListener("click", this.handleOutsideClick, true);
    }
  }
  override disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener("click", this.handleOutsideClick, true);

    // Clean up event listeners added to the color picker
    const picker = this.shadowRoot!.querySelector("hex-color-picker");
    if (picker) {
      picker.removeEventListener(
        "mousedown",
        () => (this.isColorPickerActive = true)
      );
      picker.removeEventListener(
        "mouseup",
        () => (this.isColorPickerActive = false)
      );
    }
  }

  handleKeyDown(event: KeyboardEvent) {
    // Allow backspace, tab, end, home, left arrow, right arrow, delete
    const allowedKeys = [
      "Backspace",
      "Tab",
      "End",
      "Home",
      "ArrowLeft",
      "ArrowRight",
      "Delete",
    ];

    if (allowedKeys.includes(event.key)) {
      return; // Do not interfere with navigation/control keys
    }

    // Check if the key is a valid hexadecimal character
    const isHexDigit = /^[0-9A-Fa-f]$/.test(event.key);
    if (!isHexDigit) {
      event.preventDefault(); // Prevent the key press if it's not a valid hex digit
    }
  }

  handleColorChanged(event: CustomEvent) {
    this.color = event.detail.value.replace("#", "");
    this.fire("input", { color: `${this.color}` });
  }

  clearColor() {
    this.color = undefined;
    this.fire("input", { color: undefined });
  }

  override render() {
    return html`
      <div class="container">
        <md-outlined-text-field
          .label="${this.label}"
          maxlength="6"
          trailing-icon
          prefix-text="#"
          pattern="^[0-9A-Fa-f]{0,6}$"
          .value="${this.color || ""}"
          ?disabled="${this.disableSelection}"
          @change="${this.handleColorInput}"
          @keydown="${this.handleKeyDown}"
          class="mainInput"
        >
          <md-icon-button @click="${this.openPalette}" slot="trailing-icon">
            <md-icon>palette</md-icon>
          </md-icon-button>
        </md-outlined-text-field>

        <md-icon-button
          ?hidden="${!this.color}"
          @click="${this.clearColor}"
          class="clearButton"
        >
          <md-icon>delete</md-icon>
        </md-icon-button>

        <hex-color-picker
          hidden
          @color-changed="${this.handleColorChanged}"
          .color="${this.color || "#000000"}"
        ></hex-color-picker>
      </div>
    `;
  }
}
