import { LitElement, html, css, CSSResult, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { YpBaseElement } from "../common/yp-base-element";

@customElement("yp-snackbar")
export class YpSnackbar extends YpBaseElement {
  @property({ type: Boolean, reflect: true })
  open = false;

  @property({ type: String })
  labelText = "";

  @property({ type: Number })
  timeoutMs = 5000; // Default duration for the snackbar

  static override get styles() {
    return [
      super.styles,
      css`
        :host {
          --snackbar-background-color: var(
            --md-sys-color-inverse-surface,
            #323232
          );
          --snackbar-text-color: var(--md-sys-color-on-inverse-surface, white);
          --snackbar-action-color: var(--md-sys-color-primary, #bb86fc);
          --snackbar-elevation: var(--md-sys-elevation-level3, 6px);
          --snackbar-border-radius: var(--md-sys-shape-corner-extra-small, 4px);
          --snackbar-padding: 16px;
          --snackbar-margin: 8px;
        }

        .snackbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          min-width: 288px;
          max-width: 568px;
          padding: var(--snackbar-padding);
          background-color: var(--snackbar-background-color);
          color: var(--snackbar-text-color);
          box-shadow: var(--snackbar-elevation);
          border-radius: var(--snackbar-border-radius);
          margin: var(--snackbar-margin);
          transform: translateY(100%);
          transition: transform 0.3s ease-in-out;
          position: fixed;
          bottom: 0;
          left: 50%;
          transform: translate(-50%, 100%);
          visibility: hidden;
        }

        :host([open]) .snackbar {
          transform: translate(-50%, -10px);
          visibility: visible;
        }

        .message {
          margin-right: var(--snackbar-padding);
        }

        .action {
          color: var(--snackbar-action-color);
          cursor: pointer;
          text-transform: uppercase;
          font-weight: bold;
        }

        .close-icon {
          cursor: pointer;
          visibility: hidden;
        }

        :host([dismissible]) .close-icon {
          visibility: visible;
        }
      `,
    ];
  }

  // Close the snackbar after a specified time
  showSnackbar() {
    if (this.timeoutMs > 0) {
      setTimeout(() => {
        this.open = false;
        this.dispatchEvent(new CustomEvent("closed"));
      }, this.timeoutMs);
    }
  }

  override updated(changedProperties: Map<string | number | symbol, unknown>) {
    if (changedProperties.has("open") && this.open) {
      this.showSnackbar();
    }
  }

  closeSnackbar() {
    this.open = false;
    this.dispatchEvent(new CustomEvent("closed"));
  }

  override render() {
    return html`
      <div class="snackbar" style="${this.open ? "" : "display: none;"}">
        <span class="message">${this.labelText}</span>
        <slot name="dismiss" @click="${this.closeSnackbar}"></slot>
        <slot name="action"></slot>
      </div>
    `;
  }
}
