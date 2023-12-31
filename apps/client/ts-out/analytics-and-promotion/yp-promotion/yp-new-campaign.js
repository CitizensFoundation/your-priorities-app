var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { css, html, nothing } from "lit";
import { property, customElement, } from "lit/decorators.js";
import { YpBaseElementWithLogin } from "../../common/yp-base-element-with-login";
import "@material/web/fab/fab.js";
import "@material/web/radio/radio.js";
import "@material/web/button/filled-button.js";
import "@material/web/button/text-button.js";
import "@material/web/checkbox/checkbox.js";
import "@material/web/textfield/outlined-text-field.js";
import "@material/web/textfield/filled-text-field.js";
import { YpCollectionHelpers } from "../../common/YpCollectionHelpers";
import "../../common/yp-image.js";
import { YpFormattingHelpers } from "../../common/YpFormattingHelpers";
import "../../yp-file-upload/yp-file-upload-icon.js";
let YpNewCampaign = class YpNewCampaign extends YpBaseElementWithLogin {
    constructor() {
        super(...arguments);
        this.previewEnabled = false;
    }
    static get styles() {
        return [
            super.styles,
            css `
        div {
          flex-direction: column;
        }

        @media (max-width: 1100px) {
        }

        div,
        md-radio {
          display: flex;
        }

        .button {
        }

        .okButton {
          margin-right: 8px;
        }

        .collectionLogoImage {
          width: 350px;
          height: 197px;
        }

        @media (max-width: 1100px) {
          .collectionLogoImage {
            width: 100%;
          }
        }

        .headerText {
          color: var(--md-sys-color-on-surface);
          font-size: 18px;
          margin-top: 16px;
          margin-bottom: 8px;
        }



        md-outlined-text-field {
          width: 350px;
        }

        mwc-textarea {
          width: 350px;
          --mdc-theme-primary: var(--md-sys-color-primary);
          --mdc-text-field-ink-color: var(--md-sys-color-on-surface);
          --mdc-text-area-outlined-hover-border-color: var(
            --md-sys-color-on-surface
          );
          --mdc-text-area-outlined-idle-border-color: var(
            --md-sys-color-on-surface
          );
          --mdc-notched-outline-border-color: var(
            --md-sys-color-on-surface-variant
          );
        }

        @media (max-width: 1100px) {
          md-outlined-text-field {
            width: 290px;
          }
          mwc-textarea {
            width: 290px;
          }
        }

        @media (max-width: 400px) {
          md-outlined-text-field {
            width: 270px;
          }
          mwc-textarea {
            width: 270px;
          }
        }

        mwc-textarea.rounded {
          --mdc-shape-small: 4px;
        }

        .formField {
          margin-top: 16px;
        }

        label {
          width: 130px;
        }

        .otherTextField {
          width: 79px;
        }

        .adMediumsList {
          margin-top: 3px;
        }

        .preview {
          background-color: var(--md-sys-color-container);
          color: var(--md-sys-color-on-container);
          padding-top: 8px;
          padding-bottom: 8px;
          width: 350px;
        }

        .linkContentPanel {
          background-color: var(--md-sys-color-secondary-container);
          color: var(--md-sys-color-on-secondary-container);
          padding: 0;
        }

        .linkDescription {
          padding: 8px;
        }

        .previewPromotionText {
          margin-bottom: 8px;
        }

        @media (max-width: 1100px) {
          .preview {
            width: 100%;
            margin-left: -16px;
            margin-right: -16px;
          }

          .previewPromotionText {
            padding: 16px;
          }
        }

        .linkTitle {
          font-weight: bold;
          margin-bottom: 8px;
          margin-top: 6px;
          padding-left: 8px;
          padding-right: 8px;
          padding-top: 8px;
        }

        .linkImage {
        }

        yp-file-upload-icon {
          top: 16px;
          right: 16px;
          margin-bottom: -56px;
          margin-left: 8px;
          z-index: 8;
        }
      `,
        ];
    }
    open() {
        const dialog = this.$$("#newCampaignDialog");
        dialog.show();
    }
    getMediums() {
        let mediums = [];
        const checkboxes = this.shadowRoot.querySelectorAll("md-checkbox");
        checkboxes.forEach((checkbox) => {
            if (checkbox.checked) {
                mediums.push(checkbox.name);
            }
        });
        return mediums;
    }
    async inputsChanged() {
        const okButton = this.$$("md-tonal-button");
        const promotionTextArea = this.$$("#campaignDescription");
        const nameTextField = this.$$("#campaignName");
        //TODO: don't use timeout here, find away to wait for all the checkboxes to be updated
        setTimeout(() => {
            this.campaignName = nameTextField.value;
            this.promotionText = promotionTextArea.value;
            const mediums = this.getMediums();
            if (mediums.length > 0 &&
                nameTextField.value.length > 0 &&
                promotionTextArea.value.length > 0) {
                this.previewEnabled = true;
                okButton.disabled = false;
            }
            else {
                this.previewEnabled = false;
                okButton.disabled = true;
            }
        }, 50);
    }
    save() {
        this.fire("save", {
            targetAudience: this.targetAudience,
            promotionText: this.promotionText,
            name: this.campaignName,
            shareImageUrl: this.uploadedImageUrl,
            mediums: this.getMediums(),
        });
        this.close();
    }
    discard() {
        this.close();
    }
    close() {
        const dialog = this.$$("#newCampaignDialog");
        dialog.close();
    }
    cancel() {
        if (this.previewEnabled) {
            const dialog = this.$$("#confirmationDialog");
            dialog.show();
        }
        else {
            this.discard();
        }
    }
    renderAdMediums() {
        return html `
      <div class="layout vertical adMediumsList" @click="${this.inputsChanged}">
        <label>
          ${this.t("facebook")}
          <md-checkbox name="facebook"></md-checkbox>
        </label>
        <label
          >${this.t("twitter")}
          <md-checkbox name="twitter"></md-checkbox>
        </label>
        <label
          >${this.t("adwords")}
          <md-checkbox name="adwords"></md-checkbox>
        </label>
        <label
          >${this.t("linkedin")}
          <md-checkbox name="linkedin"></md-checkbox>
        </label>
        <label
          >${this.t("snapchat")}
          <md-checkbox name="snapchat"></md-checkbox>
        </label>
        <label
          >${this.t("instagram")}
          <md-checkbox name="instagram"></md-checkbox>
        </label>
        <label
          >${this.t("youtube")}
          <md-checkbox name="youtube"></md-checkbox>
        </label>
        <label
          >${this.t("tiktok")}
          <md-checkbox name="tiktok"></md-checkbox>
        </label>
        <label
          >${this.t("whatsapp")}
          <md-checkbox name="whatsapp"></md-checkbox>
        </label>
        <label
          >${this.t("email")}
          <md-checkbox name="email"></md-checkbox>
        </label>
        <label class="otherFormField"
          >${this.t("other")}
          <md-checkbox name="other"></md-checkbox>
        </label>
        <md-outlined-text-field
          class="formField otherTextField"
          hidden
          .label="${this.t("other")}"
        ></md-outlined-text-field>
      </div>
    `;
    }
    renderTextInputs() {
        return html `
      <div class="layout horizontal">
        <div class="layout vertical">
          <md-outlined-text-field
            class="formField"
            id="campaignName"
            @keydown="${this.inputsChanged}"
            .label="${this.t("promotionName")}"
          ></md-outlined-text-field>

          <md-outlined-text-field
            id="campaignDescription"
            rows="5"
            type="textarea"
            class="rounded formField"
            label="${this.t("promotionText")}"
            outlined
            charCounter
            maxLength="280"
            @keydown="${this.inputsChanged}"
          >
          </md-outlined-text-field>
        </div>
      </div>
    `;
    }
    imageUploadCompleted(event) {
        const file = JSON.parse(event.detail.xhr.response);
        const formats = JSON.parse(file.formats);
        this.uploadedImageUrl = formats[0];
    }
    get collectionImageUrl() {
        return (this.uploadedImageUrl ||
            YpCollectionHelpers.logoImagePath(this.collectionType, this.collection));
    }
    renderPreview() {
        return html `
      <div class="layout vertical center-center">
        <div class="headerText">${this.t("promotionPreview")}</div>
        <div class="preview">
          <div class="previewPromotionText">${this.promotionText}</div>
          <div class="linkImage">
            <yp-file-upload-icon
              target="/api/images?itemType=group-logo"
              method="POST"
              @success="${this.imageUploadCompleted}"
            ></yp-file-upload-icon>
            <yp-image
              class="collectionLogoImage"
              sizing="cover"
              .src="${this.collectionImageUrl}"
            ></yp-image>
          </div>
          <div class="linkContentPanel">
            <div class="linkTitle">${this.collection.name}</div>
            <div class="linkDescription">
              ${YpFormattingHelpers.truncate(this.collection.description || this.collection?.objectives, 150)}
            </div>
          </div>
        </div>
      </div>
    `;
    }
    renderConfirmationDialog() {
        return html `
      <md-dialog id="confirmationDialog" crimClickAction="" escapeKeyAction="">
        <div class="layout horizontal center-center">
          <div class="headerText" slot="headline">${this.t("discardDraft")}</div>
        </div>
        <md-text-button
          .label="${this.t("cancel")}"
          class="button"
          dialogAction="cancel"
          slot="actions"
        >
        </md-text-button>
        <md-tonal-button
          dialogAction="ok"
          class="button okButton"
          .label="${this.t("discard")}"
          @click="${this.discard}"
          slot="actions"
        >
        </md-tonal-button>
      </md-dialog>
    `;
    }
    render() {
        return html `
      <md-dialog
        id="newCampaignDialog"
        scrimClickAction=""
        escapeKeyAction=""
        modal
      >
        <div slot="heading">${this.t("newTrackingPromotion")}</div>
        <div class="layout ${this.wide ? "horizontal" : "vertical"}" slot="content">
          <div class="layout vertical">
            ${this.renderTextInputs()}
            ${!this.wide ? this.renderAdMediums() : nothing}
            ${this.renderPreview()}
          </div>
          ${this.wide ? this.renderAdMediums() : nothing}
        </div>
        <md-text-button
          .label="${this.t("cancel")}"
          class="button"
          @click="${this.cancel}"
          slot="actions"
        >
        </md-text-button>
        <md-tonal-button
          disabled
          class="button okButton"
          .label="${this.t("save")}"
          @click="${this.save}"
          slot="actions"
        >
        </md-tonal-button>
      </md-dialog>
      ${this.renderConfirmationDialog()}
    `;
    }
};
__decorate([
    property({ type: String })
], YpNewCampaign.prototype, "collectionType", void 0);
__decorate([
    property({ type: Number })
], YpNewCampaign.prototype, "collectionId", void 0);
__decorate([
    property({ type: Object })
], YpNewCampaign.prototype, "collection", void 0);
__decorate([
    property({ type: Object })
], YpNewCampaign.prototype, "campaign", void 0);
__decorate([
    property({ type: Boolean })
], YpNewCampaign.prototype, "previewEnabled", void 0);
__decorate([
    property({ type: String })
], YpNewCampaign.prototype, "uploadedImageUrl", void 0);
__decorate([
    property({ type: String })
], YpNewCampaign.prototype, "targetAudience", void 0);
__decorate([
    property({ type: String })
], YpNewCampaign.prototype, "campaignName", void 0);
__decorate([
    property({ type: String })
], YpNewCampaign.prototype, "promotionText", void 0);
YpNewCampaign = __decorate([
    customElement("yp-new-campaign")
], YpNewCampaign);
export { YpNewCampaign };
//# sourceMappingURL=yp-new-campaign.js.map