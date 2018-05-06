import '../../../../@polymer/polymer/polymer.js';
import '../../../../@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import '../../../../@polymer/iron-image/iron-image.js';
import '../../../../@polymer/iron-media-query/iron-media-query.js';
import '../../../../@polymer/paper-card/paper-card.js';
import '../yp-app-globals/yp-app-icons.js';
import { ypLanguageBehavior } from '../yp-behaviors/yp-language-behavior.js';
import './yp-group-stats.js';
import { GroupBehaviors } from './yp-group-behaviors.js';
import '../yp-membership-button/yp-membership-button.js';
import { ypTruncateBehavior } from '../yp-behaviors/yp-truncate-behavior.js';
import { ypImageFormatsBehavior } from '../yp-behaviors/yp-image-formats-behavior.js';
import { ypGotoBehavior } from '../yp-behaviors/yp-goto-behavior.js';
import '../yp-magic-text/yp-magic-text.js';
import { Polymer } from '../../../../@polymer/polymer/lib/legacy/polymer-fn.js';
Polymer({
  _template: `
    <style include="iron-flex iron-flex-alignment">
      :host {
        display: block;
        @apply --layout-vertical;
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
        @apply --layout-vertical;
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
        height: 45px;
        padding: 14px;
        background-color: var(--primary-color-800);
        color: #FFF;
        font-weight: bold;
        cursor: pointer;
        vertical-align: middle;
        display: table-cell !important;
        width: 416px;
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

      @media (max-width: 420px) {
        :host {
          width: 304px;
        }

        .groupCard {
          margin-left: 0;
          margin-right: 8px;
          padding-left: 0;
          padding-right: 0;
          width: 304px;
        }

        iron-image {
          width: 304px;
          height: 165px;
        }

        .group-name {
          width: 304px;
        }
      }

      .withPointer {
        cursor: pointer;
      }

      [hidden] {
        display: none !important;
      }
    </style>

    <iron-media-query query="(min-width: 600px)" query-matches="{{wide}}"></iron-media-query>

    <template is="dom-if" if="[[group]]">
      <paper-card class="groupCard" animated="" elevation="[[elevation]]">
        <template is="dom-if" if="[[noImage]]">
          <iron-image header-mode\$="[[headerMode]]" archived\$="[[archived]]" sizing="cover" class="main-image withPointer" src="https://i.imgur.com/sdsFAoT.png" on-tap="_goToGroup"></iron-image>
        </template>
        <template is="dom-if" if="[[!noImage]]">
          <iron-image archived\$="[[archived]]" class="logo withPointer" sizing="cover" on-tap="_goToGroup" preload="" src="[[groupLogoImagePath]]"></iron-image>
        </template>
        <div id="groupName" class="group-name" archived\$="[[archived]]" featured\$="[[featured]]" on-tap="_goToGroup">
          <yp-magic-text text-type="groupName" content-language="[[group.language]]" disable-translation="[[group.configuration.disableNameAutoTranslation]]" text-only="" content="[[groupName]]" content-id="[[group.id]]">
          </yp-magic-text>
          <span hidden\$="[[!archived]]">- [[t('archived')]]</span>
        </div>
        <yp-magic-text id="objectives" class="objectives withPointer" on-tap="_goToGroup" text-type="groupContent" content-language="[[group.language]]" text-only="" content="[[groupObjectives]]" content-id="[[group.id]]" truncate="200">
        </yp-magic-text>
        <yp-group-stats class="stats" group="[[group]]"></yp-group-stats>
        <yp-membership-button archived\$="[[archived]]" group="[[group]]"></yp-membership-button>
      </paper-card>
    </template>
`,

  is: 'yp-group-card',

  behaviors: [
    ypLanguageBehavior,
    GroupBehaviors,
    ypTruncateBehavior,
    ypImageFormatsBehavior,
    ypGotoBehavior
  ]
});
