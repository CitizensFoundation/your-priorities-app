import { property, html, css, customElement } from 'lit-element';
import { nothing, TemplateResult } from 'lit-html';
import { ifDefined } from 'lit-html/directives/if-defined';
import { unsafeHTML } from 'lit-html/directives/unsafe-html';

import { YpBaseElement } from '../@yrpri/yp-base-element.js';
import { YpAccessHelpers } from '../@yrpri/YpAccessHelpers.js';
import { YpMediaHelpers } from '../@yrpri/YpMediaHelpers.js';
import { ShadowStyles } from '../@yrpri/ShadowStyles.js';
import { Menu } from '@material/mwc-menu';
import { YpCollectionHelpers } from '../@yrpri/YpCollectionHelpers.js';

import '@polymer/iron-image';
import '../yp-magic-text/yp-magic-text.js';
import './yp-collection-stats.js';
import { YpGroup } from './yp-group.js';
import { YpNavHelpers } from '../@yrpri/YpNavHelpers.js';

@customElement('yp-collection-item-card')
export class YpCollectionItemCard extends YpBaseElement {
  @property({ type: Object })
  item: YpCollectionData | undefined;

  @property({ type: String })
  itemType: string | undefined;

  @property({ type: Object })
  collection: YpCollectionData | undefined;

  static get styles() {
    return [
      super.styles,
      ShadowStyles,
      css`
        .description {
          color: var(--primary-color-more-darker, #424242);
          line-height: var(--description-line-height, 1.3);
          padding: 8px;
          margin-top: 4px;
        }

        .stats {
          color: var(--primary-color-more-darker, #424242);
          position: absolute;
          bottom: 0;
          right: 8px;
        }

        .post-image {
          width: 100%;
        }

        .collectionCard {
          height: 395px;
          width: 320px;
          background-color: #fff;
          padding: 0;
          margin: 0;
        }

        .collectionCard[featured] {
        }

        iron-image {
          width: 320px;
          height: 180px;
        }

        iron-image[featured] {
        }

        .card-content {
          padding: 0;
          padding-bottom: 48px;
        }

        iron-image {
          padding: 0;
          margin: 0;
        }

        iron-image {
          padding: 0;
          margin: 0;
        }

        paper-card {
          background-color: #f00;
          vertical-align: text-top;
        }

        .informationText {
          vertical-align: text-top;
        }

        .collection-name {
          font-size: 26px;
          padding: 14px;
          background-color: var(--primary-color-800);
          color: #fff;
          cursor: pointer;
          vertical-align: middle;
          width: auto;
        }

        iron-image[archived] {
        }

        yp-membership-button {
          position: absolute;
          top: 159px;
          right: 18px;
          width: 30px;
          height: 30px;
          color: var(--icon-general-color, #fff);
        }

        .collection-name[featured] {
          background-color: var(--accent-color);
        }

        .collection-name[archived] {
          background-color: #aaa;
        }

        yp-membership-button[archived] {
          display: none;
        }

        @media (max-width: 960px) {
          :host {
            max-width: 423px;
            width: 100%;
            padding-top: 0 !important;
          }

          yp-membership-button {
            top: 205px;
          }

          .collectionCard {
            margin-left: 0;
            margin-right: 0;
            padding-left: 0;
            padding-right: 0;
            width: 100%;
            height: 100%;
            padding-bottom: 8px;
          }

          iron-image {
            width: 100%;
            height: 230px;
          }

          iron-image[featured] {
          }

          .description {
            margin-bottom: 32px;
          }
        }

        @media (max-width: 420px) {
          iron-image {
            height: 225px;
          }

          yp-membership-button {
            top: 205px;
          }
        }

        @media (max-width: 375px) {
          iron-image {
            height: 207px;
          }

          yp-membership-button {
            top: 185px;
          }
        }

        @media (max-width: 360px) {
          iron-image {
            height: 200px;
          }
        }

        @media (max-width: 320px) {
          iron-image {
            height: 180px;
          }

          yp-membership-button {
            top: 155px;
          }
        }

        .withPointer {
          cursor: pointer;
        }

        [hidden] {
          display: none !important;
        }

        a {
          text-decoration: none;
        }
      `,
    ];
  }

  get archived(): boolean {
    return this.item?.status === 'archived';
  }

  get featured(): boolean {
    return this.item?.status === 'featured';
  }

  goToItem(event: CustomEvent) {
    event.preventDefault();
    if (event.currentTarget && event.currentTarget) {
      const href = (event.currentTarget as HTMLElement).getAttribute('href');
      if (href) {
        YpNavHelpers.redirectTo(href);
      }
    }
  }


  render() {
    if (this.item && (this.item as YpGroupData).Community) {
      this.collection = (this.item as YpGroupData).Community;
      this.itemType = 'group';
    } else if (this.item && (this.item as YpCommunityData).Domain) {
      this.collection = (this.item as YpCommunityData).Domain;
      this.itemType = 'community';
    }

    return this.item && this.collection
      ? html`
          <a
            href="/${this.itemType}/${this.item.id}"
            @click="${this.goToItem}"
            class="layout vertical center-center">
            <div
              ?featured="${this.featured}"
              class="collectionCard shadow-elevation-8dp shadow-transaction">
              <div class="layout horizontal">
                ${YpCollectionHelpers.logoImagePath(this.itemType, this.item)
                  ? html`
                      <iron-image
                        sizing="cover"
                        ?archived="${this.archived}"
                        alt="${this.collection.name}"
                        ?featured="${this.featured}"
                        preload
                        .src="${YpCollectionHelpers.logoImagePath(
                          this.itemType,
                          this.item
                        )}"
                        class="post-image withPointer"></iron-image>
                    `
                  : html`
                      <iron-image
                        ?archived="${this.archived}"
                        sizing="cover"
                        class="main-image withPointer"
                        src="https://i.imgur.com/sdsFAoT.png"></iron-image>
                    `}
              </div>
              <div class="informationText">
                <div
                  class="collection-name"
                  ?archived="${this.archived}"
                  ?featured="${this.featured}">
                  <yp-magic-text
                    .textType="${YpCollectionHelpers.nameTextType(
                      this.itemType
                    )}"
                    .contentLanguage="${this.item?.language}"
                    ?disableTranslation="${this.collection.configuration
                      ?.disableNameAutoTranslation}"
                    text-only
                    .content="${this.item.name}"
                    .contentId="${this.item.id}"></yp-magic-text>
                  <span hidden ?oldHidden="${!this.archived}">
                    - ${this.t('archived')}
                  </span>
                </div>
                <yp-magic-text
                  id="description"
                  class="description layout vertical withPointer"
                  ?featured="${this.featured}"
                  textType="collectionContent"
                  .textType="${YpCollectionHelpers.descriptionTextType(
                    this.itemType
                  )}"
                  .contentLanguage="${this.item.language}"
                  textOnly
                  remove-urls
                  .content="${this.item.description || this.item.objectives}"
                  .contentId="${this.collection.id}"
                  truncate="130">
                </yp-magic-text>
              </div>

              <yp-collection-stats
                class="stats"
                .collectionType="${this.itemType}"
                .collection="${this.item}"></yp-collection-stats>

              ${!this.collection
                ? html`
                    <yp-membership-button
                      .archived="${this.archived}"
                      .featured="${this.featured}"
                      .collection="${this.collection}"></yp-membership-button>
                  `
                : html``}
            </div>
          </a>
        `
      : nothing;
  }
}
