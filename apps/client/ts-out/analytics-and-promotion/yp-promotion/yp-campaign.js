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
import "@material/web/button/elevated-button.js";
import "@material/web/button/text-button.js";
import "@material/web/button/outlined-button.js";
import "@material/web/button/filled-button.js";
import "@material/web/checkbox/checkbox.js";
import "@material/web/iconbutton/icon-button.js";
import "../../common/yp-image.js";
let YpCampaign = class YpCampaign extends YpBaseElementWithLogin {
    constructor() {
        super(...arguments);
        this.confirmedActive = false;
        this.haveCopied = false;
    }
    async deleteCampaign() {
        this.fire("deleteCampaign", this.campaign.id);
    }
    static get styles() {
        return [
            super.styles,
            css `
        md-dialog {
          --mdc-shape-medium: 24px !important;
          --mdc-theme-surface: var(--md-sys-color-surface);
          --mdc-dialog-heading-ink-color: var(--md-sys-color-on-surface);
          --mdc-dialog-box-shadow: none;
        }

        .campaignName {
          font-weight: bold;
          margin-bottom: 16px;
          font-size: 20px;
        }

        .mainContainer {
          width: 960px;
          background-color: var(--md-sys-color-surface-variant);
          color: var(--md-sys-color-on-surface-variant);
          padding: 24px;
          border-radius: 16px;
          margin-top: 16px;
          overflow-y: scroll;
          position: relative;
        }

        @media (max-width: 1100px) {
          .mainContainer {
            width: 100%;
          }
        }

        .mediumCard {
          width: 100px;
          background-color: var(--md-sys-color-secondary-container);
          color: var(--md-sys-color-on-secondary-container);
          margin-right: 8px;
          margin-left: 8px;
          padding: 16px;
          border-radius: 16px;
        }

        .mediumInnerCard {
          width: 100px;
        }

        .disabledCard {
          background-color: var(--md-sys-color-surface-variant) !important;
          color: var(--md-sys-color-on-surface-variant) !important;
        }

        .mediumsContainer {
          height: 200px;
          width: 100%;
        }

        .mediumImage {
          width: 80px;
          height: 80px;
          margin-top: 24px;
          margin-bottom: 24px;
        }

        md-icon-button {
          position: absolute;
          top: 2px;
          right: 2px;
        }

        .mediumActivationImage {
          width: 40px;
          height: 40px;
        }

        .activationInfo {
          font-weight: bold;
          margin-bottom: 24px;
          margin-top: 24px;
        }

        .url {
          font-style: italic;
        }

        .textWithLink {
          background-color: var(--md-sys-color-surface-variant);
          color: var(--md-sys-color-on-surface-variant);
          padding: 16px;
          border-radius: 16px;
          margin-bottom: 24px;
          overflow-wrap: break-word;
        }

        .copyButton {
          margin-bottom: 32px;
        }

        .mediumShowImage {
          margin-bottom: 24px;
        }
      `,
        ];
    }
    get configuration() {
        return this.campaign.configuration;
    }
    getMediumImageUrl(medium) {
        switch (medium) {
            case "facebook":
                return "https://yrpri-eu-direct-assets.s3.eu-west-1.amazonaws.com/SocialMediaImages/facebook.png";
            case "adwords":
                return "https://yrpri-eu-direct-assets.s3.eu-west-1.amazonaws.com/SocialMediaImages/adwords.png";
            case "snapchat":
                return "https://yrpri-eu-direct-assets.s3.eu-west-1.amazonaws.com/SocialMediaImages/snapchat.png";
            case "instagram":
                return "https://yrpri-eu-direct-assets.s3.eu-west-1.amazonaws.com/SocialMediaImages/instagram.png";
            case "twitter":
                return "https://yrpri-eu-direct-assets.s3.eu-west-1.amazonaws.com/SocialMediaImages/twitter.png";
            case "youtube":
                return "https://yrpri-eu-direct-assets.s3.eu-west-1.amazonaws.com/SocialMediaImages/youtube.png";
            case "linkedin":
                return "https://yrpri-eu-direct-assets.s3.eu-west-1.amazonaws.com/SocialMediaImages/linkedin.png";
            case "email":
                return "https://yrpri-eu-direct-assets.s3.eu-west-1.amazonaws.com/SocialMediaImages/email.png";
            case "tiktok":
                return "https://yrpri-eu-direct-assets.s3.eu-west-1.amazonaws.com/SocialMediaImages/tiktok.png";
            case "whatsapp":
                return "https://yrpri-eu-direct-assets.s3.eu-west-1.amazonaws.com/SocialMediaImages/whatsapp.png";
            case "other":
                return "https://yrpri-eu-direct-assets.s3.eu-west-1.amazonaws.com/SocialMediaImages/other.png";
            default:
                return "https://yrpri-eu-direct-assets.s3.eu-west-1.amazonaws.com/SocialMediaImages/other.png";
        }
    }
    async activate(medium) {
        this.mediumToActivate = medium;
        this.confirmedActive = false;
        this.haveCopied = false;
        await this.updateComplete;
        this.$$("#activateDialog").show();
    }
    async showMedium(medium) {
        this.mediumToShow = medium;
        await this.updateComplete;
        this.$$("#showMediumDialog").show();
    }
    cancelActivation() {
        this.mediumToActivate = undefined;
    }
    reallyActivate() {
        if (this.mediumToActivate) {
            this.mediumToActivate.active = true;
            this.fire("configurationUpdated", {
                campaignId: this.campaign.id,
                configuration: this.configuration,
            });
            this.mediumToActivate = undefined;
        }
        else {
            console.error("No medium to activate");
        }
    }
    activeCheckboxChanged(event) {
        this.confirmedActive = event.currentTarget.checked;
    }
    copyCurrentTextWithLink(medium) {
        const textWithLink = `${this.configuration.promotionText} ${medium.finaUrl}`;
        navigator.clipboard.writeText(textWithLink);
        this.haveCopied = true;
        let mediumName = this.t(medium.utm_medium);
        this.fire("display-snackbar", this.t("promotionWithLinksCopiedToClipboard") + ` ${mediumName}`);
    }
    copyCurrentText(medium) {
        navigator.clipboard.writeText(this.configuration.promotionText);
        this.haveCopied = true;
        let mediumName = this.t(medium.utm_medium);
        this.fire("display-snackbar", this.t("promotionTextCopiedToClipboard") + ` ${mediumName}`);
    }
    copyCurrentLink(medium) {
        navigator.clipboard.writeText(medium.finaUrl);
        this.haveCopied = true;
        let mediumName = this.t(medium.utm_medium);
        this.fire("display-snackbar", this.t("promotionLinkCopiedToClipboard") + ` ${mediumName}`);
    }
    closeShowMedium() {
        this.mediumToShow = undefined;
    }
    renderTextWithLink(medium) {
        const mediumName = this.t(medium.utm_medium);
        if (["facebook", "twitter", "linkedin"].includes(medium.utm_medium)) {
            return html `
        <div class="textWithLink layout vertical">
          <div>
            ${this.configuration.promotionText}
            <span class="url">${medium.finaUrl}</span>
          </div>
        </div>
        <div class="layout vertical center-center">
          <md-filled-button
            class="copyButton"
            @click="${() => this.copyCurrentTextWithLink(medium)}"
            .label="${this.t("copyTextAndLinkTo") +
                ` ${mediumName.toUpperCase()}`}"
          ></md-filled-button>
          <md-filled-button
            class="copyButton"
            @click="${() => this.copyCurrentLink(medium)}"
            .label="${this.t("copyLinkTo") + ` ${mediumName.toUpperCase()}`}"
          ></md-filled-button>
        </div>
      `;
        }
        else {
            return html `
        <div class="textWithLink layout vertical">
          <div>${this.configuration.promotionText}</div>
        </div>
        <div class="layout horizontal center-center">
          <md-filled-button
            class="copyButton"
            @click="${() => this.copyCurrentText(medium)}"
            .label="${this.t("copyTextTo") + ` ${mediumName.toUpperCase()}`}"
          ></md-filled-button>
        </div>
        <div class="textWithLink layout vertical">
          <div>
            <span class="url">${medium.finaUrl}</span>
          </div>
        </div>
        <div class="layout horizontal center-center">
          <md-filled-button
            class="copyButton"
            @click="${() => this.copyCurrentLink(medium)}"
            .label="${this.t("copyLinkTo") + ` ${mediumName.toUpperCase()}`}"
          ></md-filled-button>
        </div>
      `;
        }
    }
    renderActivateDialog() {
        let mediumName = this.t(this.mediumToActivate.utm_medium);
        return html `
      <md-dialog
        id="activateDialog"
        scrimClickAction=""
        escapeKeyAction=""
        modal
      >
        <div slot="heading">${this.t("activateMedium")}</div>
        <div class="layout vertical" slot="content">
          <div class="layout horizontal center-center">
            <yp-image
              sizing="cover"
              class="mediumActivationImage"
              .src="${this.getMediumImageUrl(this.mediumToActivate.utm_medium)}"
            >
            </yp-image>
          </div>
          <div class="activationInfo">
            ${this.t("activationInformation_1")} ${mediumName}.
            ${this.t("activationInformation_2")}
          </div>
          ${this.renderTextWithLink(this.mediumToActivate)}
          <label
            >${this.t("confirmYouHavePastedTheTextAndLink") + ` ${mediumName}`}
            <md-checkbox
              ?disabled="${!this.haveCopied}"
              name="activeConfirmed"
              @change="${this.activeCheckboxChanged}"
            ></md-checkbox>
          </label>
        </div>
        <md-text-button
          .label="${this.t("cancel")}"
          class="button"
          @click="${this.cancelActivation}"
          slot="actions"
        >
        </md-text-button>
        <md-tonal-button
          ?disabled="${!this.confirmedActive}"
          class="button okButton"
          .label="${this.t("activate")}"
          @click="${this.reallyActivate}"
          slot="actions"
        >
        </md-tonal-button>
      </md-dialog>
    `;
    }
    renderShowDialog() {
        return html `
      <md-dialog id="showMediumDialog">
        <div slot="heading">${this.t("textAndLinkDetails")}</div>
        <div class="layout vertical" slot="content">
          <div class="layout horizontal center-center">
            <yp-image
              sizing="cover"
              class="mediumActivationImage mediumShowImage"
              .src="${this.getMediumImageUrl(this.mediumToShow.utm_medium)}"
            >
            </yp-image>
          </div>
          ${this.renderTextWithLink(this.mediumToShow)}
        </div>
        <md-text-button
          .label="${this.t("close")}"
          class="button"
          @click="${this.closeShowMedium}"
          slot="actions"
        >
        </md-text-button>
      </md-dialog>
    `;
    }
    renderMedium(medium) {
        return html `
      <div class="mediumCard ${medium.active ? "" : "disabledCard"}">
        <div
          class="layout vertical center-center mediumInnerCard ${medium.active
            ? ""
            : "disabledCard"}"
        >
          <div>${this.t(medium.utm_medium)}</div>
          <yp-image
            class="mediumImage"
            sizing="contain"
            .src="${this.getMediumImageUrl(medium.utm_medium)}"
          >
          </yp-image>

          ${medium.active
            ? html `
                <md-text-button
                  class="mediumButtons"
                  .label="${this.t("show")}"
                  @click="${() => this.showMedium(medium)}"
                ></md-text-button>
              `
            : html `
                <md-elevated-button
                  .label="${this.t("activate")}"
                  class="mediumButtons"
                  @click="${() => this.activate(medium)}"
                ></md-elevated-button>
              `}
        </div>
      </div>
    `;
    }
    render() {
        return html `
      <div class="layout vertical mainContainer">
        <md-icon-button @click="${this.deleteCampaign}"
          ><md-icon>delete</md-icon></md-icon-button
        >
        <div class="layout horizontal">
          <div class="campaignName">
            ${this.campaign.configuration.utm_campaign}
          </div>
        </div>
        <div class="layout horizontal mediumsContainer">
          ${this.campaign.configuration.mediums.map((medium) => this.renderMedium(medium))}
        </div>
      </div>
      ${this.mediumToActivate ? this.renderActivateDialog() : nothing}
      ${this.mediumToShow ? this.renderShowDialog() : nothing}
    `;
    }
};
__decorate([
    property({ type: String })
], YpCampaign.prototype, "collectionType", void 0);
__decorate([
    property({ type: Number })
], YpCampaign.prototype, "collectionId", void 0);
__decorate([
    property({ type: Object })
], YpCampaign.prototype, "collection", void 0);
__decorate([
    property({ type: Object })
], YpCampaign.prototype, "campaign", void 0);
__decorate([
    property({ type: Object })
], YpCampaign.prototype, "campaignApi", void 0);
__decorate([
    property({ type: Object })
], YpCampaign.prototype, "mediumToActivate", void 0);
__decorate([
    property({ type: Object })
], YpCampaign.prototype, "mediumToShow", void 0);
__decorate([
    property({ type: Boolean })
], YpCampaign.prototype, "confirmedActive", void 0);
__decorate([
    property({ type: Boolean })
], YpCampaign.prototype, "haveCopied", void 0);
YpCampaign = __decorate([
    customElement("yp-campaign")
], YpCampaign);
export { YpCampaign };
//# sourceMappingURL=yp-campaign.js.map