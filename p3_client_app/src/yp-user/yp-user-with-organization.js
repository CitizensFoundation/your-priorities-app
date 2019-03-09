import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-image/iron-image.js';
import '@polymer/paper-fab/paper-fab.js';
import '@polymer/paper-button/paper-button.js';
import { ypLanguageBehavior } from '../yp-behaviors/yp-language-behavior.js';
import { ypMediaFormatsBehavior } from '../yp-behaviors/yp-media-formats-behavior.js';
import './yp-user-image.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
Polymer({
  _template: html`
    <style include="iron-flex iron-flex-alignment">
      yp-user-image {
        padding-right: 16px;
      }

      .name {
        padding-top: 4px;
        font-weight: bold;
        text-align: left;
      }

      .name[inverted] {
        color: var(--ak-user-name-color, #444);
      }

      .orgImage {
        margin-left: 8px;
        width: 48px;
        min-width: 48px;
        height: 48px;
      }

      .rousnded {
        -webkit-border-radius: 25px;
        -moz-border-radius: 25px;
        border-radius: 25px;
        display: block;
      }

      .organizationName {
        color: #eee;
        text-align: left;
      }

      .organizationName[inverted] {
        color: #676767;
      }

      @media (max-width: 600px) {
        .orgImage {
          margin-right: 8px;
          margin-left: 4px;
        }
      }

      [hidden] {
        display: none !important;
      }

      .mainArea {
        padding-right: 8px;
      }
    </style>

    <template is="dom-if" if="[[user]]">
      <div class="layout horizontal mainArea" title="[[userTitle]]">
        <yp-user-image titlefromuser="[[userTitle]]" user="[[user]]" hidden\$="[[hideImage]]"></yp-user-image>
        <div class="layout vertical">
          <div class="name" inverted\$="[[inverted]]">
            [[user.name]]
          </div>
          <div class="organizationName" inverted\$="[[inverted]]" hidden\$="[[!organizationName]]">
            [[organizationName]]
          </div>
        </div>
        <template is="dom-if" if="[[organizationImageUrl]]">
          <img width="48" height="48" sizing="cover" hidden\$="[[hideImage]]" class="orgImage" src\$="[[organizationImageUrl]]">
        </template>
      </div>
    </template>
`,

  is: 'yp-user-with-organization',

  behaviors: [
    ypLanguageBehavior,
    ypMediaFormatsBehavior
  ],

  properties: {
    user: {
      type: Object
    },

    titleDate: {
      type: Date
    },

    hideImage: {
      type: Boolean,
      value: false
    },

    userTitle: {
      type: String,
      computed: '_computeUserTitle(user, titleDate)'
    },

    inverted: {
      type: Boolean,
      value: false
    },

    organizationName: {
      type: String,
      computed: '_organizationName(user)'
    },

    organizationImageUrl: {
      type: String,
      computed: '_organizationImageUrl(user)'
    }
  },

  _computeUserTitle: function (user, titleDate) {
    if (user && titleDate) {
      return user.name + ' ' + moment(titleDate).fromNow();
    } else {
      return null;
    }
  },

  _organizationName: function (user) {
    if (user && user.OrganizationUsers && user.OrganizationUsers.length > 0 && user.OrganizationUsers[0].name) {
      return user.OrganizationUsers[0].name;
    } else {
      return null;
    }
  },

  _organizationImageUrl: function (user) {
    if (user && user.OrganizationUsers && user.OrganizationUsers.length > 0 &&
      user.OrganizationUsers[0].OrganizationLogoImages &&
      user.OrganizationUsers[0].OrganizationLogoImages.length > 0 &&
      user.OrganizationUsers[0].OrganizationLogoImages[0].formats) {
      return this.getImageFormatUrl(user.OrganizationUsers[0].OrganizationLogoImages, 2);
    } else {
      return null;
    }
  }
});
