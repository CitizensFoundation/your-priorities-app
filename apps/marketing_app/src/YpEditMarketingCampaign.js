import {  html, css } from 'lit-element';
import { YpBaseElement } from './YpBaseElement.js';
import '@vaadin/vaadin-grid';
import '@vaadin/vaadin-grid/vaadin-grid-column-group';
import '@material/mwc-button';
import '@material/mwc-textfield';
import '@material/mwc-textarea';
import '@material/mwc-checkbox';
import '@material/mwc-radio';
import '@material/mwc-formfield';
import '@material/mwc-dialog';


export class YpEditMarketingCampaign extends YpBaseElement {
  static get properties() {
    return {
      campaginId: { type: Number },
      isNewEntry: { type: Boolean },
      progressActive: { type: Boolean },
      campaign: { type: Object },
      previewMessage: { type: String }
    };
  }

  static get styles() {
    return [
      super.styles,
      css`
        mwc-textarea, mwc-textfield {
          width: 100%;
          max-width: 960px;
          --mdc-notched-outline-trailing-border-radius: 0 28px 28px 0;
        }


        mwc-textarea {
          height: 150px;
        }

        .addCampaign {
          margin-top: 8px;
          max-width: 960px;
          margin-bottom: 8px;
        }

        mwc-formfield[nowrap] {
          width: 200px;
        }

        mwc-dialog div {
          flex-direction: column;
        }

        mwc-dialog div, mwc-radio {
          display: flex;
        }

        #campaignText {
          margin-top: 24px;
        }

        .subHeader {
          margin-top: 16px;
        }


        .previewMessage {
          white-space: pre-wrap;
          color: #000;
        }

        .redAndBold {
          color: #F00;
          font-weight: bold;
        }


    `];
  }

  constructor () {
    super();
    this.listCampaigns = [
    ];
  }

  open (newEntry, campaign) {
    if (newEntry) {
      this.newEntry = true;
      this.campaign = {};
      this.heading = this.t("sendNewCampaign");
      this.updateButtonText = this.t("send");
    } else {
      this.newEntry = false;
      this.campaign = campaign;
      this.heading = this.t("editCampaign");
      this.updateButtonText = this.t("update");
    }
    const dialog = this.$$("#editDialog");
    dialog.open = true;
  }

  firstUpdated() {
    super.firstUpdated();
  }

  connectedCallback() {
    super.connectedCallback();
    this.collectionType = "community";
    this.collectionId = 974;
    this.campaign = { text: "" };
  }

  updateCampaign () {
    const campaign = {
      name: this.$$("#campaignName").value,
      text: this.$$("#campaignText").value,
      sendToNewUser: this.$$("#sendToNewUser").checked,
      sendToHaveParticipated: this.$$("#sendToHaveParticipated").checked,
      sendToHaveOpened: this.$$("#sendToHaveOpened").checked
    }

    let updateUrl;
    let method;

    if (this.newEntry) {
      updateUrl = '/api/campaigns';
      method = "POST";
    } else {
      updateUrl = '/api/campaigns/'+this.campaignId;
      method = "PUT";
    }
  }

  textKeyUp() {
    this.previewMessage = this.$$("#campaignText").value+" https://yrpri.org/s/2893?yti=5432";
  }

  render() {
    return html`
      <mwc-dialog heading="${this.heading}" escapeKeyAction="none" scrimClickAction="none" id="editDialog" modal>
        <div>
          <div class="layout horizontal wrap">
            <mwc-formfield label="${this.t('sendToNewUsers')}" nowrap>
              <mwc-checkbox ?checked="${this.campaign.sendToNewUser}"></mwc-checkbox>
            </mwc-formfield>

            <mwc-formfield label="${this.t('sendToHaveOpened')}" nowrap>
              <mwc-checkbox ?checked="${this.campaign.sendToHaveOpened}"></mwc-checkbox>
            </mwc-formfield>

            <mwc-formfield label="${this.t('sendToHaveNotOpened')}" nowrap>
              <mwc-checkbox ?checked="${this.campaign.sendToHaveNotOpened}"></mwc-checkbox>
            </mwc-formfield>

            <mwc-formfield label="${this.t('sendToHaveCompleted')}" nowrap>
              <mwc-checkbox id="sendToHaveCompleted" ?checked="${this.campaign.sendToHaveCompleted}"></mwc-checkbox>
            </mwc-formfield>
          </div>

          <div class="subHeader">
            ${this.t('includeLinkQuestion')}
          </div>

          <div class="layout horizontal">
            <mwc-formfield label="${this.t('includeNoLink')}" nowrap>
              <mwc-radio name="useLink" value="includeNoLink"></mwc-radio>
            </mwc-formfield>

            <mwc-formfield label="${this.t('includeLinkToGroup')}" nowrap>
              <mwc-radio name="useLink" value="includeLinkToGroup"></mwc-radio>
            </mwc-formfield>

            <mwc-formfield label="${this.t('includeLinkToSurvey')}" nowrap>
              <mwc-radio name="useLink" checked value="includeLinkToSurvey"></mwc-radio>
            </mwc-formfield>
          </div>

          <mwc-textarea @keyup="${this.textKeyUp}" id="campaignText" charCounter outlined maxLength="120" label="${this.t('campaignText')}" helper="${this.t('max120chars')}"></mwc-textarea>

          <div class="subHeader" ?hidden="${!this.previewMessage}">
            ${this.t('preview')}
          </div>

          <div class="previewMessage">${this.previewMessage}</div>


          <div class="subHeader redAndBold layout horizontal center-center" ?hidden="${!this.previewMessage}">
            ${this.t('sendTo')} 11,413 ${this.t('users')}
          </div>

        </div>

        <mwc-linear-progress ?hidden="${!this.progressActive}" indeterminate></mwc-linear-progress>
        <div dialogAction="none"></div>

        <mwc-button
            ?disabled="${this.progressActive}"
            @click="${this.updateCampaign}"
            slot="primaryAction">
          ${this.updateButtonText}
        </mwc-button>
        <mwc-button
            dialogAction="cancel"
            slot="secondaryAction">
          ${this.t('cancel')}
        </mwc-button>
      </mwc-dialog>
    `;
  }
}

customElements.define('yp-edit-marketing-campaign', YpEditMarketingCampaign);