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

import '../@yrpri/yp-image.js';
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
          line-height: var(--description-line-height, 1.3);
          padding: 8px;
          padding: 16px;
        }

        .stats {
          position: absolute;
          bottom: 0;
          right: 38px;
        }

        .post-image {
          width: 100%;
        }

        .collectionCard {
          width: 860px;
          background-color: var(--mdc-theme-surface);
          color: var(--mdc-theme-on-surface);
          margin: 0;
          position: relative;
        }

        .collectionCard[featured] {
        }

        yp-image {
          width: 320px !important;
          height: 180px  !important;;
        }

        yp-image[featured] {
        }

        .card-content {
          padding: 0;
          padding-bottom: 48px;
        }

        yp-image {
          padding: 0;
          margin: 0;
        }

        yp-image {
          padding: 0;
          margin: 0;
        }

        .collectionCard {
          vertical-align: text-top;
        }

        .informationText {
          vertical-align: text-top;
        }

        .collection-name {
          font-size: var(--mdc-typography-headline2-font-size);
          font-weight: var(--mdc-typography-headline2-font-weight);
          cursor: pointer;
          padding: 16px;
          padding-bottom: 0;
          vertical-align: middle;
          width: auto;
        }

        yp-image[archived] {
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

          yp-image {
            width: 100%;
            height: 230px;
          }

          yp-image[featured] {
          }

          .description {
            margin-bottom: 32px;
          }
        }

        @media (max-width: 420px) {
          yp-image {
            height: 225px;
          }

          yp-membership-button {
            top: 205px;
          }
        }

        @media (max-width: 375px) {
          yp-image {
            height: 207px;
          }

          yp-membership-button {
            top: 185px;
          }
        }

        @media (max-width: 360px) {
          yp-image {
            height: 200px;
          }
        }

        @media (max-width: 320px) {
          yp-image {
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
      ? html`<a
            href="/${this.itemType}/${this.item.id}"
            @click="${this.goToItem}"
            class="">
            <div
              ?featured="${this.featured}"
              class="collectionCard shadow-elevation-4dp shadow-transaction layout horizontal">
              <div class="layout horizontal">
                ${YpCollectionHelpers.logoImagePath(this.itemType, this.item)
                  ? html`
                      <yp-image
                        sizing="cover"
                        ?archived="${this.archived}"
                        alt="${this.collection.name}"
                        ?featured="${this.featured}"
                        preload
                        .src="${YpCollectionHelpers.logoImagePath(
                          this.itemType,
                          this.item
                        )}"
                        class="post-image withPointer"></yp-image>
                    `
                  : html`
                      <yp-image
                        ?archived="${this.archived}"
                        sizing="cover"
                        class="main-image withPointer"
                        src="https://i.imgur.com/sdsFAoT.png"></yp-image>
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
                  removeUrls
                  .content="${this.item.description || this.item.objectives}"
                  .contentId="${this.collection.id}"
                  truncate="300">
                </yp-magic-text>
              </div>

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
