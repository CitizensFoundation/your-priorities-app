import { LitElement, css, html } from 'lit';
import { property, customElement, query } from 'lit/decorators.js';
import { YpBaseElementWithLogin } from '../@yrpri/common/yp-base-element-with-login';

import '@material/web/fab/fab-extended.js';
import './yp-new-promotion.js';
import { YpNewPromotion } from './yp-new-promotion.js';

@customElement('yp-promotion-manager')
export class YpPromotionManager extends YpBaseElementWithLogin {
  @property({ type: String })
  collectionType!: string;

  @property({ type: Number })
  collectionId!: number | string;

  @property({ type: Object })
  collection: YpCollectionData | undefined;

  @property({ type: Array })
  promotions: YpPromotionData[] | undefined;

  @query('yp-new-promotion')
  private newPromotionElement!: YpNewPromotion;

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

  newPromotion() {
    this.newPromotionElement.open();
  }

  savePromotion(event: CustomEvent) {
    console.log('savePromotion', event);
  }

  render() {
    return html`
      <yp-new-promotion
        .collectionType="${this.collectionType}"
        .collection="${this.collection}"
        .collectionId="${this.collectionId}"
        @save="${this.savePromotion}"
      ></yp-new-promotion>
      <div class="layout vertical start mainContainer">
        <div>
          <md-fab-extended
            .label="${this.t('newTrackingPromotion')}"
            icon="add"
            @click="${this.newPromotion}"
          ></md-fab-extended>
        </div>
      </div>
    `;
  }
}
