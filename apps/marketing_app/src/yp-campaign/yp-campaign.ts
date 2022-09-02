import { LitElement, css, html } from 'lit';
import { property, customElement, query } from 'lit/decorators.js';
import { YpBaseElementWithLogin } from '../@yrpri/common/yp-base-element-with-login';

import '@material/web/fab/fab-extended.js';
import './yp-new-ad-group.js';
import { YpNewAdGroup } from './yp-new-ad-group.js';

@customElement('yp-campaign')
export class YpCampaign extends YpBaseElementWithLogin {
  @property({ type: String })
  collectionType!: string;

  @property({ type: Number })
  collectionId!: number | string;

  @property({ type: Object })
  collection: YpCollectionData | undefined;

  @property({ type: Object })
  campaign: YpCampaignData | undefined;

  @query("yp-new-ad-group")
  private newAdGroupElement!: YpNewAdGroup;

  setupTestData() {
    this.campaign = {
      id: 1,
      created_at: '2020-01-01T00:00:00.000Z',
      updated_at: '2020-01-01T00:00:00.000Z',
      community_id: 1234,
      user_id: 850,
      configuration: {},
      adGroups: [
        {
          id: 1,
          created_at: '2020-01-01T00:00:00.000Z',
          updated_at: '2020-01-01T00:00:00.000Z',
          name: 'Ad Group 1',
          configuration: {},
          user_id: 850,
          ads: [
            {
              id: 1,
              created_at: '2020-01-01T00:00:00.000Z',
              updated_at: '2020-01-01T00:00:00.000Z',
              name: 'Ad 1',
              configuration: {
                utm_campaign: 'Eastbourne Action Network',
                utm_source: 'Your Priorities',
                utm_medium: 'Twitter',
                utm_content: 'a-1',
                content: 'This is an ad',
              },
              user_id: 850,
              language: 'en',
            },
          ],
        },
      ],
    };
  }

  static get styles() {
    return [
      super.styles,
      css`
        .mainContainer {
          width: 100%;
          margin-top: 32px;
          height: 100%;
        }

        md-fab-extended {
          position: absolute;
          bottom: 24px;
          right: 24px;
        }
      `,
    ];
  }

  newAdGroup() {
    this.newAdGroupElement.open();
  }

  render() {
    return html`
      <yp-new-ad-group></yp-new-ad-group>
      <div class="layout vertical start mainContainer">
        <div>
          <md-fab-extended
            .label="${this.t('newTrackingPromotion')}"
            icon="add"
            @click="${this.newAdGroup}"
          ></md-fab-extended>
        </div>
      </div>
    `;
  }
}
