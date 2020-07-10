import {  html, css } from 'lit-element';
import { YpBaseElement } from './YpBaseElement.js';
import '@vaadin/vaadin-grid';
import '@vaadin/vaadin-grid/vaadin-grid-column-group';
import '@material/mwc-button';
import '@material/mwc-textfield';
import '@material/mwc-checkbox';
import '@material/mwc-formfield';
import '@material/mwc-fab';


export class YpMarketingCampaigns extends YpBaseElement {
  static get properties() {
    return {
      listId: { type: String },
      listCampaigns: { type: Array },
      collectionType: { type: String },
      collectionId: { type: String },
      usersToAddList: { type: Array },
      usersToAddListText: { type: String }
    };
  }

  static get styles() {
    return [
      super.styles,
      css`
        main {
          flex-grow: 1;
        }

        .app-footer {
          font-size: calc(12px + 0.5vmin);
          align-items: center;
        }

        .app-footer a {
          margin-left: 5px;
        }

        vaadin-grid {
          margin: 24px;
          width: 100vw;
          max-width: 960px;
          background-color: transparent;
        }

        .mainArea {
          margin: 32px;
        }

        .campaignHeader {
          font-size: 20px;
          margin-top: 32px;
          max-width: 960px;
        }

        mwc-fab {
          margin-bottom: 16px;
        }

        .colSetting {
          text-align: center;
        }
    `];
  }

  constructor () {
    super();
    this.listCampaigns2 = [
      {
        date: "26/05/2020 21:46",
        sentCount: "11,413",
        sendToNewUsers: "x",
        openCount: "5,132",
        completedCount: "2,122",
        text: "This is a test survey and we ask you to complete it before the 15. June 2020. Click on this link to participate: https://yrpri.org/s/2893?ymt=3546944411"
      }
    ];
  }

  firstUpdated() {
    super.firstUpdated();
    const campaignNameArea = this.$$("#campaignName");
    campaignNameArea.validityTransform = (newValue, nativeValidity) => {
      if (!nativeValidity.valid) {
        if (nativeValidity.tooLong) {
          const hasDog = newValue.includes('dog');
          // changes to make to the nativeValidity
          return {
            valid: hasDog,
            tooLong: !hasDog
          };
        } else {
          // no changes
          return {};
        }
      } else {
        const isValid = true;
        // changes to make to the native validity
        return {
          valid: isValid,
          // or whatever type of ValidityState prop you would like to set (if any)
          customError: !isValid,
        };
      }
    }
  }

  connectedCallback() {
    super.connectedCallback();
    this.collectionType = "community";
    this.collectionId = 974;
  }

  campaignNameChanged (event) {
    this.campaignName = event.target.value;
  }

  campaignText (event) {
    this.campaignText = event.target.value;
  }

  addNewCampaign () {
    if (this.usersToAddListText) {
      const usersTexts = this.usersToAddListText.split("\n");
      const campaignObjectsToAdd = [];
      usersTexts.forEach((userContact) => {
        if (userContact) {
          campaignObjectsToAdd.push(
            {
              id: Math.floor(Math.random() * 1420),
              user_id: 1,
              sms: userContact,
              email: "",
              sentCount: 0,
              openCount: 0,
              completedCount: 0
            });
        }
      });

      this.listCampaigns = [...campaignObjectsToAdd.concat(this.listCampaigns)];
      const campaignNameArea = this.$$("#campaignName");
      campaignNameArea.value = null;
      this.usersToAddListText = null;
    }
  }

  newCampaign() {
    this.fire('open-new-campaign');
  }

  render() {
    return html`
      <div class="layout vertical center-center mainArea">
        <div class="layout vertical center-center">
          <mwc-fab @click="${this.newCampaign}" extended icon="create" label="${this.t('sendNewCampaign')}"></mwc-fab>
        </div>

        <div class="layout verical center-center" hidden>
          <div class="layout horizontal campaignHeader">
            ${this.t('sentCampaigns')}
          </div>
        </div>

        <div class="layout horizontal center-center">
          <vaadin-grid .items="${this.listCampaigns}">
            <vaadin-grid-column path="date" header="${this.t("date")}"></vaadin-grid-column>
            <vaadin-grid-column-group resizable>
              <template class="header">${this.t('settings')}</template>
              <vaadin-grid-column class="colSetting" path="sendToNewUsers" flex-grow="0" header="${this.t("sendToNewUsersShort")}"></vaadin-grid-column>
              <vaadin-grid-column class="colSetting" path="sendToHaveOpened" flex-grow="0" header="${this.t("sendToHaveOpenedShort")}"></vaadin-grid-column>
              <vaadin-grid-column class="colSetting" path="sendToHaveCompleted" flex-grow="0" header="${this.t("sendToHaveCompletedShort")}"></vaadin-grid-column>
            </vaadin-grid-column-group>
            <vaadin-grid-column-group resizable>
              <template class="header">${this.t('counts')}</template>
              <vaadin-grid-column path="sentCount" header="${this.t("sentCount")}" text-align="end" width="120px" flex-grow="0"></vaadin-grid-column>
              <vaadin-grid-column path="openCount" header="${this.t("openCount")}" text-align="end" width="120px" flex-grow="0"></vaadin-grid-column>
              <vaadin-grid-column path="completedCount" header="${this.t("completedCount")}" text-align="end" width="120px" flex-grow="0"></vaadin-grid-column>
            </vaadin-grid-column-group>

            <vaadin-grid-column  path="text" flex-grow="0" header="${this.t("message")}"></vaadin-grid-column>
          </vaadin-grid>
        </div>
      </div>
    `;
  }
}

customElements.define('yp-marketing-campaigns', YpMarketingCampaigns);