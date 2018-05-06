import '../../../../@polymer/polymer/polymer.js';
import '../../../../@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import '../../../../@polymer/iron-image/iron-image.js';
import '../../../../@polymer/paper-card/paper-card.js';
import '../yp-app-globals/yp-app-icons.js';
import { ypLanguageBehavior } from '../yp-behaviors/yp-language-behavior.js';
import './yp-community-stats.js';
import { CommunityBehaviors } from './yp-community-behaviors.js';
import { ypTruncateBehavior } from '../yp-behaviors/yp-truncate-behavior.js';
import { ypGotoBehavior } from '../yp-behaviors/yp-goto-behavior.js';
import '../yp-membership-button/yp-membership-button.js';
import { ypImageFormatsBehavior } from '../yp-behaviors/yp-image-formats-behavior.js';
import '../yp-magic-text/yp-magic-text.js';
import { Polymer } from '../../../../@polymer/polymer/lib/legacy/polymer-fn.js';
Polymer({
  _template: `
    <style include="iron-flex iron-flex-alignment">
      :host {
        @apply --layout-vertical;
      }

      .description {
        @apply --layout-vertical;
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
        height: 42px;
        padding: 14px;
        background-color: var(--primary-color-800);
        color: #FFF;
        cursor: pointer;
        vertical-align: middle;
        display: table-cell;
        width: 320px;
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

      @media (max-width: 480px) {
        :host {
          width: 304px;
        }


        yp-membership-button {
          top: 146px;
        }

        .communityCard {
          margin-right: 8px;
          height: 430px;
          padding-left: 0;
          padding-right: 0;
          width: 304px;
        }

        iron-image {
          width: 304px;
          height: 165px;
        }

        iron-image[featured] {
        }

        .description {
          margin-bottom: 32px;
        }
      }

      @media (max-width: 680px) {
        .communityCard[featured] {
          width: 304px;
        }

        .secondImage {
          display: none;
        }
      }

      .withPointer {
        cursor: pointer;
      }

      [hidden] {
        display: none !important;
      }
    </style>

    <lite-signal on-lite-signal-yp-language="_languageEvent"></lite-signal>

    <template is="dom-if" if="[[community]]">
      <paper-card featured\$="[[featured]]" class="communityCard" animated="" elevation="[[elevation]]">
        <div class="layout horizontal">
          <template is="dom-if" if="[[noImage]]">
            <iron-image header-mode\$="[[headerMode]]" archived\$="[[archived]]" sizing="cover" class="main-image withPointer" src="https://i.imgur.com/sdsFAoT.png" on-tap="_goToCommunity"></iron-image>
          </template>
          <template is="dom-if" if="[[!noImage]]">
            <iron-image sizing="cover" archived\$="[[archived]]" featured\$="[[featured]]" preload="" src="[[communityLogoImagePath]]" class="post-image withPointer" on-tap="_goToCommunity"></iron-image>
          </template>
        </div>
        <div class="informationText">
          <div class="community-name" archived\$="[[archived]]" featured\$="[[featured]]" on-tap="_goToCommunity">
            <yp-magic-text text-type="communityName" content-language="[[community.language]]" disable-translation="[[community.configuration.disableNameAutoTranslation]]" text-only="" content="[[communityName]]" content-id="[[community.id]]">
            </yp-magic-text>
            <span hidden="" old-hidden\$="[[!archived]]">- [[t('archived')]]</span>
          </div>

          <yp-magic-text id="description" class="description withPointer" featured\$="[[featured]]" on-tap="_goToCommunit" text-type="communityContent" content-language="[[community.language]]" text-only="" content="[[communityDescription]]" content-id="[[community.id]]" truncate="130">
          </yp-magic-text>
        </div>
        <yp-community-stats class="stats" community="[[community]]"></yp-community-stats>
        <yp-membership-button archived\$="[[archived]]" featured\$="[[featured]]" community="[[community]]"></yp-membership-button>
      </paper-card>
    </template>
`,

  is: 'yp-community-card',

  behaviors: [
    ypLanguageBehavior,
    CommunityBehaviors,
    ypTruncateBehavior,
    ypImageFormatsBehavior,
    ypGotoBehavior
  ],

  properties: {
  }
});
