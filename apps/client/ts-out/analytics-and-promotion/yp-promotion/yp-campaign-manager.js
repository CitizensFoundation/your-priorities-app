var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { css, html } from 'lit';
import { property, customElement, query } from 'lit/decorators.js';
import { YpBaseElementWithLogin } from '../../common/yp-base-element-with-login';
import '@material/web/fab/fab.js';
import './yp-new-campaign.js';
import './yp-campaign.js';
import { YpCampaignApi } from './YpCampaignApi';
let YpCampaignManager = class YpCampaignManager extends YpBaseElementWithLogin {
    constructor() {
        super(...arguments);
        this.campaignApi = new YpCampaignApi();
    }
    firstUpdated() {
        this.getCampaigns();
    }
    newCampaign() {
        this.newCampaignElement.open();
    }
    getTrackingUrl(campaign, medium) {
        const fullHost = location.protocol + '//' + location.host;
        const url = `${fullHost}/${this.collectionType}/${this.collectionId}?utm_source=${campaign.configuration.utm_source}&utm_medium=${medium}&utm_campaign=${campaign.configuration.utm_campaign}&utm_content=${campaign.id}`;
        const encodedUrl = encodeURI(url);
        return encodedUrl;
    }
    async createCampaign(event) {
        const data = event.detail;
        const configuration = {
            utm_campaign: data.name,
            utm_source: this.collection.name,
            audience: data.targetAudience,
            promotionText: data.promotionText,
            shareImageUrl: data.shareImageUrl,
            mediums: [],
        };
        const campaign = (await this.campaignApi.createCampaign(this.collectionType, this.collectionId, {
            configuration,
        }));
        campaign.configuration.utm_content = `${campaign.id}`;
        const mediums = [];
        for (let i = 0; i < data.mediums.length; i++) {
            const medium = data.mediums[i];
            mediums.push({
                utm_medium: medium,
                finaUrl: this.getTrackingUrl(campaign, medium),
                active: false,
            });
        }
        campaign.configuration.mediums = mediums;
        await this.campaignApi.updateCampaign(this.collectionType, this.collectionId, campaign.id, {
            configuration: campaign.configuration,
        });
        this.getCampaigns();
    }
    async campaignConfigurationUpdated(event) {
        await this.campaignApi.updateCampaign(this.collectionType, this.collectionId, event.detail.campaignId, {
            configuration: event.detail.configuration,
        });
    }
    async getCampaigns() {
        this.campaignToDelete = undefined;
        this.campaigns = await this.campaignApi.getCampaigns(this.collectionType, this.collectionId);
    }
    async reallyDeleteCampaign() {
        try {
            await this.campaignApi.deleteCampaign(this.collectionType, this.collectionId, this.campaignToDelete);
        }
        catch (error) {
            this.campaignToDelete = undefined;
            console.error(error);
        }
        this.getCampaigns();
    }
    deleteCampaign(event) {
        this.campaignToDelete = event.detail;
        this.$$('#deleteConfirmationDialog').show();
    }
    cancelDeleteCampaign() {
        this.campaignToDelete = undefined;
    }
    static get styles() {
        return [
            super.styles,
            css `
        .mainContainer {
          width: 100%;
          margin-top: 32px;
        }

        @media (max-width: 1100px) {
          .mainContainer {
            width: 100%;
            max-width: calc(100vw - 80px);
          }
        }

        md-fab {
          margin-top: 32px;
          margin-bottom: 0;
        }

        .fabContainer {
          width: 1000px;
        }

        @media (max-width: 1100px) {
          .fabContainer {
            width: 100%;
          }
        }
      `,
        ];
    }
    renderDeleteConfirmationDialog() {
        return html `
      <md-dialog id="deleteConfirmationDialog" crimClickAction escapeKeyAction>
        <div class="layout horizontal center-center">
          <div class="headerText" slot="headline">${this.t('reallyDeletePromotion')}</div>
        </div>
        <md-text-button
          .label="${this.t('cancel')}"
          class="button"
          dialogAction="cancel"
          @click="${this.cancelDeleteCampaign}"
          slot="actions"
        >
        </md-text-button>
        <md-tonal-button
          dialogAction="ok"
          class="button okButton"
          .label="${this.t('delete')}"
          @click="${this.reallyDeleteCampaign}"
          slot="actions"
        >
        </md-tonal-button>
      </md-dialog>
    `;
    }
    renderCampaign(campaign) {
        return html `<yp-campaign
      @configurationUpdated="${this.campaignConfigurationUpdated}"
      .campaignApi="${this.campaignApi}"
      @deleteCampaign="${this.deleteCampaign}"
      .collectionType="${this.collectionType}"
      .collection="${this.collection}"
      .collectionId="${this.collectionId}"
      .campaign="${campaign}"
    ></yp-campaign>`;
    }
    render() {
        return html `
      <yp-new-campaign
        .collectionType="${this.collectionType}"
        .collection="${this.collection}"
        .collectionId="${this.collectionId}"
        @save="${this.createCampaign}"
      ></yp-new-campaign>
      <div class="layout horizontal center-center fabContainer">
        <md-fab
          .label="${this.t('newTrackingPromotion')}"
          @click="${this.newCampaign}"
        ><md-icon slot="icon">add</md-icon></md-fab>
      </div>
      <div class="layout vertical start mainContainer">
        <div class="layout vertical">
          ${this.campaigns?.map(campaign => this.renderCampaign(campaign))}
        </div>
      </div>
      ${this.renderDeleteConfirmationDialog()}
    `;
    }
};
__decorate([
    property({ type: String })
], YpCampaignManager.prototype, "collectionType", void 0);
__decorate([
    property({ type: Number })
], YpCampaignManager.prototype, "collectionId", void 0);
__decorate([
    property({ type: Object })
], YpCampaignManager.prototype, "collection", void 0);
__decorate([
    property({ type: Array })
], YpCampaignManager.prototype, "campaigns", void 0);
__decorate([
    query('yp-new-campaign')
], YpCampaignManager.prototype, "newCampaignElement", void 0);
YpCampaignManager = __decorate([
    customElement('yp-campaign-manager')
], YpCampaignManager);
export { YpCampaignManager };
//# sourceMappingURL=yp-campaign-manager.js.map