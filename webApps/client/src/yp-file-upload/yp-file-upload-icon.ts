import { html, css, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";

import "@material/web/iconbutton/outlined-icon-button.js";

import { YpFileUpload } from "./yp-file-upload.js";

@customElement("yp-file-upload-icon")
export class YpFileUploadIcon extends YpFileUpload {
  @property({ type: String })
  override buttonIcon = "file_upload";

  @property({ type: Boolean })
  simple = false;

  static override get styles() {
    return [super.styles, css``];
  }

  override render() {
    return html`
      ${this.simple
        ? html`
            <md-icon-button
              id="button"
              class="blue"
              ?raised="${this.raised}"
              .label="${this.buttonText}"
              aria-label="${this.buttonText}"
              @click="${this._fileClick}"
            ><md-icon>${this.buttonIcon}</md-icon>
            </md-icon-button>
          `
        : html`
            <md-outlined-icon-button
              id="button"
              class="blue"
              ?raised="${this.raised}"
              .label="${this.buttonText}"
              aria-label="${this.buttonText}"
              @click="${this._fileClick}"
            ><md-icon>${this.buttonIcon}</md-icon>
            </md-outlined-icon-button>
          `}
      <input
        type="file"
        id="fileInput"
        ?capture="${this.capture}"
        @change="${this._fileChange}"
        .accept="${this.accept}"
        hidden
        ?multiple="${this.multi}"
      />
    `;
  }
}
