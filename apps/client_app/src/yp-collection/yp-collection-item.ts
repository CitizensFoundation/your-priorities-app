import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import '@polymer/iron-image/iron-image.js';
import '@polymer/paper-card/paper-card.js';
import '../yp-app-globals/yp-app-icons.js';
import './yp-community-stats.js';
import { CommunityBehaviors } from './yp-community-behaviors.js';
import { ypTruncateBehavior } from '../yp-behaviors/yp-truncate-behavior.js';
import { ypGotoBehavior } from '../yp-behaviors/yp-goto-behavior.js';
import '../yp-membership-button/yp-membership-button.js';
import { ypMediaFormatsBehavior } from '../yp-behaviors/yp-media-formats-behavior.js';
import '../yp-magic-text/yp-magic-text.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { YpBaseElement } from '../yp-base-element.js';

class YpCommunityCardLit extends YpBaseElement {
  static get properties() {
    return {
      community: {
        type: Object
      }
    }
  }

  static get styles() {
    return [
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

      .communityCard {
        height: 395px;
        width: 320px;
        background-color: #fff;
        padding: 0;
        margin: 0;
      }

      .communityCard[featured] {
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

      .community-name {
        font-size: 26px;
        padding: 14px;
        background-color: var(--primary-color-800);
        color: #FFF;
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
        color: var(--icon-general-color, #FFF);
      }

      .community-name[featured] {
        background-color: var(--accent-color);
      }

      .community-name[archived] {
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

        .communityCard {
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

    `, YpFlexLayout]
  }

render() {
  return html`
    <paper-card .featured="${this.featured}" class="communityCard" .animated="" .elevation="${this.elevation}">
      <div class="layout horizontal">

        ${this.noImage ? html`
          <iron-image .headerMode="${this.headerMode}" .archived="${this.archived}" .sizing="cover" class="main-image withPointer" src="https://i.imgur.com/sdsFAoT.png" @tap="${this._goToCommunity}"></iron-image>
        `: html`
          <iron-image .sizing="cover" .archived="${this.archived}" alt="${this.community.name}" .featured="${this.featured}" .preload="" src="${this.communityLogoImagePath}" class="post-image withPointer" @tap="${this._goToCommunity}"></iron-image>
        `}

      </div>
      <div class="informationText">
        <div class="community-name" .archived="${this.archived}" .featured="${this.featured}" @tap="${this._goToCommunity}">
          <yp-magic-text .textType="communityName" .contentLanguage="${this.community.language}" disable-translation="${this.community.configuration.disableNameAutoTranslation}" text-only="" .content="${this.communityName}" .contentId="${this.community.id}">
          </yp-magic-text>
          <span ?hidden="" .oldHidden="${!this.archived}">- ${this.t('archived')}</span>
        </div>
        <yp-magic-text id="description" class="description layout vertical withPointer" .featured="${this.featured}" @tap="${this._goToCommunity}" .textType="communityContent" .contentLanguage="${this.community.language}" .textOnly="" .content="${this.communityDescription}" .contentId="${this.community.id}" .truncate="130">
        </yp-magic-text>
      </div>
      <yp-community-stats class="stats" .community="${thiscommunity}"></yp-community-stats>

      ${!this.community.is_community_folder ? html`
        <yp-membership-button .archived="${this.archived}" .featured="${this.featured}" .community="${this.community}"></yp-membership-button>
      `: html``}

    </paper-card>
`

 }
}

window.customElements.define('yp-community-card-lit', YpCommunityCardLit)