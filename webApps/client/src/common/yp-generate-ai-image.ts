import { css, html } from "lit";
import { property, customElement, query, queryAll } from "lit/decorators.js";
import { YpBaseElement } from "./yp-base-element.js";
import { Layouts } from "../flexbox-literals/classes.js";

import "@material/web/dialog/dialog.js";
import { MdDialog } from "@material/web/dialog/dialog.js";

import "@material/web/button/elevated-button.js";
import "@material/web/button/outlined-button.js";
import "@material/web/button/text-button.js";
import "@material/web/progress/circular-progress.js";
import "@material/web/textfield/filled-text-field.js";

@customElement("yp-generate-ai-image")
export class YpGenerateAiImage extends YpBaseElement {
  @property({ type: Boolean })
  submitting = false;

  @property({ type: String })
  currentError: string | undefined;

  @property({ type: String })
  name!: string;

  @property({ type: String })
  description!: string;

  @property({ type: Number })
  collectionId!: number;

  @property({ type: String })
  collectionType!: string;

  @property({ type: String })
  imageType: YpAiGenerateImageTypes = "logo";

  @property({ type: Number })
  jobId: number | undefined;

  @query("#styleText")
  styleText!: HTMLInputElement;

  timeout: number | undefined;

  resetGenerator() {
    this.submitting = false;
    this.currentError = undefined;
    this.styleText.value = "";
    this.jobId = undefined;
  }

  override async connectedCallback() {
    super.connectedCallback();
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
  }

  //TODO: Fix that styleText
  get finalPrompt() {
    return `
      Name: ${this.name}
      Description: ${this.description}
      Image style: ${this.styleText?.value || "Something cool"}

      Do not include text or labels in the image except if the user asks for it in the image style.
    `;
  }

  async pollForImage() {
    const pollInterval = 5000; // Poll every 5 seconds, adjust as needed

    const poll = async () => {
      try {
        let pollingResponse: YpGenerateAiImageResponse =
          await window.serverApi.pollForGeneratingAiImage(
            this.collectionType,
            this.collectionId as number,
            this.jobId!
          );

        if (pollingResponse.data?.imageId) {
          this.fire("got-image", {
            imageId: pollingResponse.data.imageId,
            imageUrl: pollingResponse.data.imageUrl,
          });
          this.dialog?.close();
          this.submitting = false;

          window.appGlobals.activity(`Generate AI Image - completed`);
        } else if (pollingResponse.error) {
          this.submitting = false;

          this.fire("image-generation-error", {
            error: pollingResponse.error,
          });

          // Handle any errors
          this.currentError = this.t(
            "An error occurred while generating the image."
          );
          if (pollingResponse.flagged) {
            this.currentError = this.t(
              "Your idea has been flagged as inappropriate. Please try again."
            );
            window.appGlobals.activity(`Generate AI Image - moderation flag`);
          }
          window.appGlobals.activity(`Generate AI Image - error`);
        } else {
          // Continue polling
          //@ts-ignore
          this.timeout = setTimeout(poll, pollInterval);
        }
      } catch (error) {
        console.error(error);
        this.submitting = false;
        this.currentError = this.t("An error occurred. Please try again.");
      }
    };

    poll();
  }

  async submit() {
    window.appGlobals.activity(`Generate AI Image - submit`);
    this.currentError = undefined;
    this.submitting = true;
    let generateAiImageStartResponse:
      | YpGenerateAiImageStartResponse
      | undefined;
    try {
      generateAiImageStartResponse =
        await window.serverApi.startGeneratingAiImage(
          this.collectionType,
          this.collectionId,
          this.imageType,
          this.finalPrompt
        );
    } catch (error: any) {
      console.error(error);
    }

    if (
      !generateAiImageStartResponse ||
      generateAiImageStartResponse.error ||
      !generateAiImageStartResponse.jobId
    ) {
      this.currentError = this.t("An error occurred. Please try again.");
      window.appGlobals.activity(`Generate AI Image - general error`);
    } else {
      this.jobId = generateAiImageStartResponse.jobId;

      // Start polling
      this.pollForImage();
    }
  }

  @query("#dialog")
  dialog!: MdDialog;

  scrollUp() {
    //await this.updateComplete;
    setTimeout(() => {
      //@ts-ignore
      (this.$$("#dialog") as MdDialog).contentElement.scrollTop = 0;
    }, 100);
  }

  open(
    name: string | undefined = undefined,
    description: string | undefined = undefined
  ) {
    if (name) {
      this.name = name;
    }
    if (description) {
      this.description = description;
    }
    this.dialog.show();
    this.currentError = undefined;
    window.appGlobals.activity(`Generate AI Image - open`);
  }

  cancel() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.resetGenerator();
    this.dialog?.close();
    window.appGlobals.activity(`Generate AI Image - cancel`);
  }

  moveToBackground() {
    this.dialog?.close();
    this.fire("yp-generate-ai-image-background", {
      name: this.name,
      description: this.description,
      collectionId: this.collectionId,
      collectionType: this.collectionType,
      imageType: this.imageType,
      jobId: this.jobId,
    });
    window.appGlobals.activity(`Generate AI Image - move to background`);
  }

  textAreaKeyDown(e: KeyboardEvent) {
    if (e.keyCode === 13 && !e.shiftKey) {
      e.preventDefault();
      return false;
    } else {
      return undefined;
    }
  }

  static override get styles() {
    return [
      super.styles,
      css`
        :host {
          --md-dialog-container-color: var(--md-sys-color-surface);
        }
        md-dialog[showing-fullscreen] {
          /* hack: private! */
          --_container-max-block-size: 100dvh;
          --md-dialog-container-inset-block-start: 0px;
        }

        md-circular-progress {
          margin-right: 16px;
          --md-circular-progress-size: 40px;
        }

        .indexNumber {
          margin-top: 12px;
          font-size: 20px;
          margin-left: 8px;
          margin-right: 8px;
          color: var(--md-sys-color-on-surface);
        }

        .cancelButton {
        }

        .header {
          text-align: center;
        }

        #dialog {
          width: 100%;
        }

        #styleText {
          margin-top: 8px;
          width: 500px;
        }

        .questionTitle {
          margin-top: 0;
          margin-bottom: 16px;
          margin-left: 12px;
          margin-right: 12px;
          line-height: 1.5;
          font-size: 20px;
          color: var(--md-sys-color-primary);
        }

        .description {
          margin-left: 12px;
          margin-right: 12px;
          margin-bottom: 12px;
        }

        .submitButton {
          margin-left: 8px;
        }

        .error {
          color: var(--md-sys-color-error);
          font-size: 16px;
          margin: 8px;
        }

        @media (max-width: 960px) {
          #dialog {
            --_fullscreen-header-block-size: 74px;
          }

          .footer {
            margin-bottom: 8px;
          }

          .questionTitle {
            margin-top: 16px;
            margin-bottom: 12px;
          }

          .cancelButton {
            margin-right: 32px;
          }

          .header {
            padding: 8px;
            font-size: 22px;
          }

          #styleText {
            width: 95%;
          }
        }
      `,
    ];
  }

  renderContent() {
    return html`
      <div class="questionTitle">${this.name}</div>
      <div class="description">${this.description}</div>

      <div class="layout vertical center-center">
        <md-filled-text-field
          type="textarea"
          id="styleText"
          type="text"
          charCounter
          @keydown="${this.textAreaKeyDown}"
          maxLength="140"
          .rows="${this.wide ? 3 : 5}"
          label="${this.t("styleOfAiImage")}"
        >
        </md-filled-text-field>
        <div class="error" ?hidden="${!this.currentError}">
          ${this.currentError}
        </div>
      </div>
    `;
  }

  renderFooter() {
    return html` <div class="layout horizontal footer">
      <md-circular-progress
        ?hidden="${!this.submitting}"
        indeterminate
      ></md-circular-progress>
      <md-text-button class="cancelButton" @click="${this.cancel}">
        ${this.t("Cancel")}
      </md-text-button>
      <md-text-button
        ?hidden="${!this.submitting}"
        class="cancelButton"
        @click="${this.moveToBackground}"
      >
        ${this.t("backgroundFinish")}
      </md-text-button>
      <md-outlined-button
        class="submitButton"
        @click="${this.submit}"
        ?disabled="${this.submitting}"
      >
        ${this.t("generateAiImage")}
      </md-outlined-button>
    </div>`;
  }

  override render() {
    return html`<md-dialog
      ?fullscreen="${!this.wide}"
      id="dialog"
      scrimClickAction=""
    >
      <div slot="headline">${this.t("generateImageWithAi")}</div>
      <div slot="content">${this.renderContent()}</div>
      <div slot="actions">${this.renderFooter()}</div>
    </md-dialog> `;
  }
}
