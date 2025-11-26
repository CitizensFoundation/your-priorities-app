import { html, css, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";

import "@material/web/iconbutton/outlined-icon-button.js";
import "@material/web/progress/linear-progress.js";

import { YpFileUpload } from "./yp-file-upload.js";

@customElement("yp-file-upload-icon")
export class YpFileUploadIcon extends YpFileUpload {
  @property({ type: String })
  override buttonIcon = "file_upload";

  @property({ type: Boolean })
  simple = false;

  static override get styles() {
    return [
      super.styles,
      css`
        :host {
          overflow: visible;
          position: relative;
        }
        .statusRow {
          position: absolute;
          right: 0;
          top: 100%;
          margin-top: 4px;
          font-size: 12px;
          color: var(--md-sys-color-primary, #1a73e8);
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 4px;
          white-space: nowrap;
          z-index: 1;
        }
        .statusRow[error] {
          color: var(--md-sys-color-error, #b00020);
        }
        .statusContent {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .statusContent md-icon {
          --md-icon-size: 18px;
        }
        md-linear-progress {
          width: 80px;
        }
      `,
    ];
  }

  override render() {
    const firstFile = this.files[0];
    const showProgress =
      (firstFile && !firstFile.complete && !firstFile.error) ||
      this.indeterminateProgress;
    const showStatus = this.uploadStatus || showProgress || firstFile?.complete;
    const isError = firstFile?.error;
    const isDone = firstFile?.complete && !isError && this.transcodingComplete;
    const isUploading = showProgress && !isDone && !isError;

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
              ?hidden="${isUploading}"
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
              ?hidden="${isUploading}"
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
      <div class="statusRow" ?hidden="${!showStatus}" ?error="${isError}">
        ${isDone
        ? html`<div class="statusContent"><md-icon>check_circle</md-icon> ${this.t("uploadCompleted")}</div>`
        : isError
          ? html`<div class="statusContent"><md-icon>error</md-icon> ${this.t("errorUploading")}</div>`
          : html`
                <div class="statusContent">
                  <md-icon>cloud_upload</md-icon>
                  ${this.uploadStatus || this.t("uploading")}
                </div>
                ${showProgress
              ? html`<md-linear-progress
                      .value="${firstFile?.progress || 0}"
                      ?indeterminate="${this.indeterminateProgress}"
                    ></md-linear-progress>`
              : nothing}
              `}
      </div>
    `;
  }
}
