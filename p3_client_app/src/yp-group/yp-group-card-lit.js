import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import '@polymer/iron-image/iron-image.js';
import '@polymer/iron-media-query/iron-media-query.js';
import '@polymer/paper-card/paper-card.js';
import '../yp-app-globals/yp-app-icons.js';
import { ypLanguageBehavior } from '../yp-behaviors/yp-language-behavior.js';
import './yp-group-stats.js';
import { GroupBehaviors } from './yp-group-behaviors.js';
import '../yp-membership-button/yp-membership-button.js';
import { ypTruncateBehavior } from '../yp-behaviors/yp-truncate-behavior.js';
import { ypMediaFormatsBehavior } from '../yp-behaviors/yp-media-formats-behavior.js';
import { ypGotoBehavior } from '../yp-behaviors/yp-goto-behavior.js';
import '../yp-magic-text/yp-magic-text.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { YpBaseElement } from '../yp-base-element.js';

class YpGroupCardLit extends YpBaseElement {
 static get properties() {
   return {
     group: {
      type: Object
     }
   }
 }

 static get styles() {
   return [
     css`
       :host {
         display: block;
         width: 416px;
       }

       .description {
        color: var(--primary-color-more-darker, #424242);
        line-height: var(--description-line-height, 1.3);
       }

      .groupCard {
        height: 445px;
        background-color: #fff;
      }

      .objectives {
        color: var(--primary-color-more-darker, #424242);
        line-height: var(--objectives-line-height, 1.3);
        padding: 16px;
      }

      .stats {
        position: absolute;
        bottom: 0px;
        right: 8px;
      }

      .group-name[archived] {
        background-color: #aaa;
      }

      iron-image[archived] {
        opacity: 0.85;
        filter: alpha(opacity=85);  }


      .post-image {
      }

      iron-image {
        width: 416px;
        height: 234px;
        display: block;
      }

      yp-group-stats {
        color: var(--primary-color-more-darker, #424242);
      }

      paper-card {
        background-color: #f00;
        vertical-align: text-top;
      }

      .informationText {
        vertical-align: text-top;
      }

      .group-name {
        margin: 0;
        font-size: var(--large-heading-size, 26px);
        padding: 8px;
        padding-top: 16px;
        padding-bottom: 16px;
        background-color: var(--primary-color-800);
        color: #FFF;
        font-weight: bold;
        cursor: pointer;
        vertical-align: middle;
        width: auto;
      }

      .group-name[featured] {
        font-size: 25px;
        background-color: var(--accent-color);
      }

      yp-membership-button[archived] {
        display: none;
      }

      yp-membership-button {
        position: absolute;
        right: 16px;
        top: 214px;
        width: 32px;
        height: 32px;
        color: var(--icon-general-color, #FFF);
      }

      .objectives {
        padding: 8px;
      }

      @media (max-width: 960px) {
        :host {
          max-width: 423px;
          width: 100%;
          padding-top: 0 !important;
        }

        .groupCard {
          margin-left: 0;
          margin-right: 0;
          padding-left: 0;
          padding-right: 0;
          width: 100%;
          height: 100%;
          padding-bottom: 38px;
        }

        yp-membership-button {
          top: 205px;
        }

        iron-image {
          width: 100%;
          height: 230px;
        }

        .group-name {
          width: auto;
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
      ${this.group ? html`
        <paper-card class="groupCard" animated="" elevation="${this.elevation}">
        <iron-image hidden="${!this.noImage}" header-mode\$="${this.headerMode}" archived="${this.archived}" sizing="cover" class="main-image withPointer" src="https://i.imgur.com/sdsFAoT.png" on-tap="_goToGroup"></iron-image>
        <iron-image hidden="${this.noImage}" archived="${this.archived}" class="logo withPointer" sizing="cover" on-tap="_goToGroup" preload="" src="${this.groupLogoImagePath}"></iron-image>
          <div id="groupName" class="group-name" archived="${this.archived}" featured="${this.featured}" on-tap="_goToGroup">
            <yp-magic-text text-type="groupName" content-language="${this.group.language}" disable-translation="${this.group.configuration.disableNameAutoTranslation}" text-only="" content="${this.groupName}" content-id="${this.group.id}">
            </yp-magic-text>
            <span hidden="${!this.archived}">-${this.t('archived')}</span>
          </div>
        <yp-magic-text id="objectives" class="objectives vertical withPointer" on-tap="_goToGroup" text-type="groupContent" content-language="${this.group.language}" text-only="" content="${this.groupObjectives}" content-id="${this.group.id}" truncate="200">
        </yp-magic-text>
        <yp-group-card-lit class="stats" group="${this.group}"></yp-group-card-lit>
        <yp-membership-button archived="${this.archived}" group="${this.group}"></yp-membership-button>
        </paper-card>
` : html``}
`
  }
}

window.customElements.define('yp-group-card-lit', YpGroupCardLit)
