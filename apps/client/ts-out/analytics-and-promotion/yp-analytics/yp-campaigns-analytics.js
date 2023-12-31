var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { css, html } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import { YpCampaignApi } from '../yp-promotion/YpCampaignApi.js';
import { PlausibleBaseElementWithState } from '../pl-components/pl-base-element-with-state';
import * as api from '../pl-components/api.js';
import './yp-campaign-analysis.js';
import structuredClone from '@ungap/structured-clone';
let YpCampaignsAnalytics = class YpCampaignsAnalytics extends PlausibleBaseElementWithState {
    constructor() {
        super(...arguments);
        this.noData = false;
        this.campaignApi = new YpCampaignApi();
    }
    connectedCallback() {
        super.connectedCallback();
        if (this.timer)
            this.timer.onTick(this.getCampaigns.bind(this));
    }
    static get styles() {
        return [
            css `
        .mainContainer {
          width: 1000px;
          margin-top: 32px;
          min-height: 310px;
        }

        @media (max-width: 1100px) {
          .mainContainer {
            width: 100%;
            max-width: calc(100vw - 80px);
          }
        }

        .textInfo {
          margin-top: 32px;
          text-align: center;
          padding: 16px;
        }

        .smallContainer {
          min-height: 60px;
          height: 60px;
        }
      `,
        ];
    }
    updated(changedProperties) {
        super.updated(changedProperties);
        if (changedProperties.has('query')) {
            this.foundCampaigns = undefined;
            this.getCampaigns();
        }
    }
    async getCampaigns() {
        this.campaigns = await this.campaignApi.getCampaigns(this.collectionType, this.collectionId);
        const utmContents = await api.get(this.proxyUrl, `/api/stats/${encodeURIComponent(this.site.domain)}/utm_contents`, this.query);
        if (utmContents && utmContents.length > 0) {
            const campaignIds = utmContents.map((c) => {
                if (!isNaN(c.name))
                    return parseInt(c.name);
                else
                    return c.name || '';
            });
            if (campaignIds.length > 0) {
                const utmMediums = await api.get(this.proxyUrl, `/api/stats/${encodeURIComponent(this.site.domain)}/utm_mediums`, this.query);
                if (utmMediums && utmMediums.length > 0) {
                    const foundCampaigns = this.campaigns?.filter(c => {
                        return campaignIds.includes(c.id);
                    });
                    if (foundCampaigns && foundCampaigns.length > 0) {
                        for (let c = 0; c < foundCampaigns.length; c++) {
                            foundCampaigns[c] = await this.getSourceData(foundCampaigns[c], utmMediums);
                        }
                    }
                    this.foundCampaigns = foundCampaigns;
                }
            }
        }
        if (!this.foundCampaigns) {
            this.foundCampaigns = [];
        }
    }
    async getSourceData(campaign, utmMediums) {
        const query = structuredClone(this.query);
        const avilableMediums = utmMediums.map((m) => {
            return m.name.toLowerCase();
        });
        const mediumsToSearch = campaign.configuration.mediums.filter(m => {
            return avilableMediums.includes(m.utm_medium);
        });
        query.filters['utm_content'] = `${campaign.id}`;
        for (let m = 0; m < mediumsToSearch.length; m++) {
            const medium = mediumsToSearch[m];
            query.filters['utm_medium'] = medium.utm_medium;
            const topStatsData = (await api.get(this.proxyUrl, `/api/stats/${encodeURIComponent(this.site.domain)}/top-stats`, query));
            /*const goalGraph = new PlausibleGoalGraph();
      
            goalGraph.query = query;
            goalGraph.site = this.site;
            goalGraph.proxyUrl = this.proxyUrl;
            goalGraph.method = "aggregate";
            debugger;
            goalGraph.events = [
              'endorse_up - completed',
              'endorse_down - completed',
              'pointHelpful - completed',
              'pointNotHelpful - completed',
              'post.ratings - add',
            ];
      
            const endorseGoalData = await goalGraph.fetchGraphData() as PlausibleAggregateResultsData;
      
            goalGraph.events = [
              'newPost - completed',
              'newPointAgainst - completed',
              'newPointFor - completed',
            ];
      
            const newContentGoalData = await goalGraph.fetchGraphData() as PlausibleAggregateResultsData;
      */
            medium.topStats = [
                topStatsData.top_stats[0],
                topStatsData.top_stats[1],
                //       { name: this.t("Visitors new content"), value: newContentGoalData.results.visitors.value },
                //       { name: this.t("Visitors endorsing"), value: endorseGoalData.results.visitors.value },
            ];
        }
        campaign.configuration.mediums = mediumsToSearch;
        return campaign;
    }
    renderCampaign(campaign) {
        return html `<yp-campaign-analysis
      .campaignApi="${this.campaignApi}"
      .collectionType="${this.collectionType}"
      .collection="${this.collection}"
      .collectionId="${this.collectionId}"
      .campaign="${campaign}"
    ></yp-campaign-analysis>`;
    }
    render() {
        if (this.foundCampaigns && this.foundCampaigns.length > 0) {
            return html `
        <div class="layout vertical start mainContainer">
          <div class="layout vertical">
            ${this.foundCampaigns?.map(campaign => this.renderCampaign(campaign))}
          </div>
        </div>
      `;
        }
        else if (this.foundCampaigns) {
            return html `
        <div
          class="layout horizontal center-center mainContainer smallContainer"
        >
          <div class="textInfo">${this.t('No campaigns found')}</div>
        </div>
      `;
        }
        else {
            return html ` <div class="layout horizontal center-center mainContainer">
        <div class="layout horizontal center-center">
          <div class="textInfo">${this.t('Loading...')}</div>
        </div>
      </div>`;
        }
    }
};
__decorate([
    property({ type: String })
], YpCampaignsAnalytics.prototype, "collectionType", void 0);
__decorate([
    property({ type: Number })
], YpCampaignsAnalytics.prototype, "collectionId", void 0);
__decorate([
    property({ type: Object })
], YpCampaignsAnalytics.prototype, "collection", void 0);
__decorate([
    property({ type: Array })
], YpCampaignsAnalytics.prototype, "campaigns", void 0);
__decorate([
    property({ type: Array })
], YpCampaignsAnalytics.prototype, "foundCampaigns", void 0);
__decorate([
    property({ type: Boolean })
], YpCampaignsAnalytics.prototype, "noData", void 0);
YpCampaignsAnalytics = __decorate([
    customElement('yp-campaigns-analytics')
], YpCampaignsAnalytics);
export { YpCampaignsAnalytics };
//# sourceMappingURL=yp-campaigns-analytics.js.map