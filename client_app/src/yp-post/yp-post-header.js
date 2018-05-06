import '../../../../@polymer/polymer/polymer.js';
import '../../../../@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import '../../../../@polymer/iron-image/iron-image.js';
import '../../../../lite-signal/lite-signal.js';
import '../../../../@polymer/paper-menu-button/paper-menu-button.js';
import '../../../../@polymer/paper-listbox/paper-listbox.js';
import '../../../../@polymer/paper-icon-button/paper-icon-button.js';
import '../yp-app-globals/yp-app-icons.js';
import { ypLanguageBehavior } from '../yp-behaviors/yp-language-behavior.js';
import { AccessHelpers } from '../yp-behaviors/access-helpers.js';
import { ypGotAdminRightsBehavior } from '../yp-behaviors/yp-got-admin-rights-behavior.js';
import { ypLoggedInUserBehavior } from '../yp-behaviors/yp-logged-in-user-behavior.js';
import { ypGotoBehavior } from '../yp-behaviors/yp-goto-behavior.js';
import { ypTruncateBehavior } from '../yp-behaviors/yp-truncate-behavior.js';
import { ypImageFormatsBehavior } from '../yp-behaviors/yp-image-formats-behavior.js';
import '../yp-user/yp-user-with-organization.js';
import '../yp-magic-text/yp-magic-text.js';
import './yp-post-actions.js';
import './yp-post-cover-media.js';
import { YpPostBehavior } from './yp-post-behaviors.js';
import { Polymer } from '../../../../@polymer/polymer/lib/legacy/polymer-fn.js';
import { dom } from '../../../../@polymer/polymer/lib/legacy/polymer.dom.js';
Polymer({
  _template: `
    <style include="iron-flex iron-flex-alignment">
      :host {
        display: block;
      }

      .infoContainer {
        @apply --layout-vertical;
        color: var(--primary-color-more-darker, #424242);
        line-height: var(--description-line-height, 1.3);
        width: 540px;
        padding: 0px;
        padding-bottom: 16px;
        padding-top: 16px;
      }

      .voting {
        @apply --layout-horizontal;
        @apply --layout-center;
        text-align: center;
        padding-left: 16px;
        padding-right: 24px;
      }

      .card-actions {
      }

      yp-post-actions {
        position: absolute;
        right: 8px;
        bottom: 0px;
      }

      .edit {
        color: #eee;
        position: absolute;
        top: 0;
        right: 0;
        padding-right: 0;
        margin-right: 0;
      }

      .post-name {
        margin: 0;
        font-size: var(--extra-large-heading-size, 28px);
        background-color: var(--primary-color-600);
        color: #FFF;
        padding: 16px;
        cursor: pointer;
        font-weight: bold;
        min-height: 33px;
      }

      .category-icon {
        width: 100px;
        height: 100px;
      }

      .category-image-container {
        text-align: right;
        margin-top: -52px;
      }

      .postCardCursor {
        cursor: pointer;
      }

      yp-post-cover-media {
        position: relative;
        width: 420px;
        height: 232px;
      }

      .postCard {
        width: 960px;
        background-color: #fff;
        @apply --layout-horizontal;
        position: relative;
      }

      .description {
        padding-bottom: 2px;
        padding-left: 8px;
        padding-right: 8px;
      }

      paper-icon-button {
        position: absolute;
        top: 0;
        right: 0;
      }

      .userInfo {
        color: #ddd;
        font-size: 17px;
      }

      @media (max-width: 960px) {
        :host {
          width: 600px;
        }

        .postCard {
          width: 600px;
          @apply --layout-wrap;
        }

        yp-post-cover-media {
          width: 420px;
          height: 232px;
        }

        .voting {
          padding-left: 0;
          padding-right: 0;
        }

        .card-actions {
          left: 24px;
          right: 0;
          width: 320px;
        }

        .card-content {
          width: 600px !important;
          padding-bottom: 74px;
        }

        .infoContainer {
          width: 100%;
        }

        .description[no-user-info] {
          padding-bottom: 32px;
        }

        .userInfo {
          font-size: 14px;
        }

        .mediaAndInfoContainer {
          @apply --layout-center-center;
        }
      }

      @media (max-width: 800px) {
        .post-name {
          font-size: 22px;
          min-height: 21px;
        }
      }

      @media (max-width: 420px) {
        :host {
          width: 304px;
        }

        .postCard {
          height: 100% !important;
          width: 304px !important;
        }

        yp-post-cover-media {
          width: 304px !important;
          height: 168px !important;
        }

        .card-actions {
          left: 0;
          width: 280px;
        }

        .post-name {
          font-size: 18px;
        }

        .description {
          padding-bottom: 32px;
          font-size: 15px;
        }
      }

      .userWithOrg {
        --ak-user-name-color: #555555;
      }

      [hidden] {
        display: none !important;
      }
    </style>
    <lite-signal on-lite-signal-yp-language="_languageEvent"></lite-signal>
    <lite-signal on-lite-signal-logged-in="_userLoggedIn"></lite-signal>

    <div class="layout horizontal center-center">
      <paper-material class="postCard" elevation="[[elevation]]" animated="">
        <div class="layout vertical wrap">
          <div class="post-name layout vertical" on-tap="goToPostIfNotHeader">
            <div>
              <yp-magic-text text-type="postName" content-language="[[post.language]]" content="[[postName]]" content-id="[[post.id]]">
              </yp-magic-text>
            </div>
            <template is="dom-if" if="[[post.Group.configuration.showWhoPostedPosts]]">
              <div class="layout horizontal userInfo">
                <yp-user-with-organization class="userWithOrg" hide-image="" title-date="[[post.user.name]]" user\$="[[post.User]]"></yp-user-with-organization>
              </div>
            </template>
          </div>
          <div class="layout horizontal wrap mediaAndInfoContainer">
            <yp-post-cover-media header-mode\$="[[headerMode]]" post="[[post]]"></yp-post-cover-media>
            <div class="layout vertical">
              <div class="infoContainer">
                <yp-magic-text id="description" text-type="postContent" content-language="[[post.language]]" content="[[post.description]]" no-user-info\$="[[!post.Group.configuration.showWhoPostedPosts]]" content-id="[[post.id]]" class="description" truncate="500" more-text="{{t('readMore')}}" close-dialog-text="[[t('close')]]">
                </yp-magic-text>
              </div>
              <div class="card-actions">
                <yp-post-actions floating="" header-mode="[[headerMode]]" elevation="-1" endorse-mode="[[endorseMode]]" class="voting" post="[[post]]"></yp-post-actions>
              </div>
            </div>
            <template is="dom-if" if="[[headerMode]]">
              <template is="dom-if" if="[[loggedInUser]]">
                <paper-menu-button vertical-align="top" horizontal-align="right" class="edit">
                  <paper-icon-button icon="more-vert" slot="dropdown-trigger"></paper-icon-button>
                  <paper-listbox slot="dropdown-content" on-iron-select="_menuSelection">
                    <template is="dom-if" if="[[hasPostAccess]]">
                      <paper-item id="editMenuItem">[[t('post.edit')]]</paper-item>
                      <paper-item id="moveMenuItem">[[t('post.move')]]</paper-item>
                      <paper-item hidden\$="[[!checkPostAdminOnlyAccess(post)]]" id="statusChangeMenuItem">[[t('post.statusChange')]]</paper-item>
                      <paper-item id="deleteMenuItem">[[t('post.delete')]]</paper-item>
                    </template>
                    <paper-item id="reportMenuItem">[[t('post.report')]]</paper-item>
                  </paper-listbox>
                </paper-menu-button>
              </template>
            </template>
          </div>
        </div>
      </paper-material>
    </div>
    <lite-signal on-lite-signal-got-admin-rights="_gotAdminRights"></lite-signal>
`,

  is: 'yp-post-header',

  behaviors: [
    ypLanguageBehavior,
    YpPostBehavior,
    AccessHelpers,
    ypGotAdminRightsBehavior,
    ypLoggedInUserBehavior,
    ypGotoBehavior,
    ypTruncateBehavior,
    ypImageFormatsBehavior
  ],

  properties: {

    selectedMenuItem: {
      type: String
    },

    headerMode: {
      type: Boolean,
      value: false
    },

    elevation: {
      type: Number,
      value: 2
    },

    post: {
      type: Object,
      observer: '_postChanged'
    },

    hasPostAccess: {
      type: Boolean,
      value: false,
      notify: true,
      computed: '_hasPostAccess(post, gotAdminRights)'
    }
  },

  _hasPostAccess: function(post, gotAdminRights) {
    if (post && gotAdminRights) {
      if (this.checkPostAccess(post)!=null) {
        return true
      } else {
        return false;
      }
    } else {
      return false;
    }
  },

  goToPostIfNotHeader: function () {
    if (!this.headerMode) {
      this.goToPost();
    }
  },

  _postChanged: function (post) {
    if (post && post.description) {
      this.async(function () {
        var description = this.$$("#description");
        if (description) {
          // Special case for law Issue from a parliement
          if (post.data && post.data.dataType=='lawIssue' && post.data.issueStatus) {
            description.content += " - "+post.data.issueStatus;
          }
        } else {
          console.error("Can't find description element");
        }
      });
    }
  },

  updateDescriptionIfEmpty: function (description) {
    if (!this.post.description || this.post.description=='') {
      this.set('post.description', description);
    }
  },

  _refresh: function () {
    dom(document).querySelector('yp-app').getDialogAsync("postEdit", function (dialog) {
      dialog.selected = 0;
      this.fire('refresh');
    }.bind(this));
  },

  _menuSelection: function (event, detail) {
    if (detail.item.id=="editMenuItem")
      this._openEdit();
    else if (detail.item.id=="deleteMenuItem")
      this._openDelete();
    else if (detail.item.id=="statusChangeMenuItem")
      this._openPostStatusChange();
    else if (detail.item.id=="moveMenuItem")
      this._openMovePost();
    else if (detail.item.id=="reportMenuItem")
      this._openReport();

    this.$$("paper-listbox").select(null);
  },

  _openMovePost: function () {
    dom(document).querySelector('yp-app').getDialogAsync("postMove", function (dialog) {
      dialog.setupAndOpen(this.post, this._refresh.bind(this));
    }.bind(this));
  },

  _openPostStatusChange: function () {
    dom(document).querySelector('yp-app').getDialogAsync("postStatusChangeEdit", function (dialog) {
      dialog.setup(this.post, null, this._refresh.bind(this));
      dialog.open('new', {postId: this.post.id, statusChange: true});
    }.bind(this));
  },

  _openEdit: function () {
    window.appGlobals.activity('open', 'post.edit');
    dom(document).querySelector('yp-app').getDialogAsync("postEdit", function (dialog) {
      dialog.setup(this.post, false, this._refresh.bind(this), this.post.Group);
      dialog.open('edit', {postId: this.post.id });
    }.bind(this));
  },

  _openReport: function () {
    window.appGlobals.activity('open', 'post.report');
    dom(document).querySelector('yp-app').getDialogAsync("apiActionDialog", function (dialog) {
      dialog.setup('/api/posts/' + this.post.id + '/report',
        this.t('reportConfirmation'),
        this._onReport.bind(this),
        this.t('post.report'),
        'PUT');
      dialog.open();
    }.bind(this));
  },

  _openDelete: function () {
    window.appGlobals.activity('open', 'post.delete');
    dom(document).querySelector('yp-app').getDialogAsync("apiActionDialog", function (dialog) {
      dialog.setup('/api/posts/' + this.post.id,
        this.t('post.deleteConfirmation'),
        this._onDeleted.bind(this));
      dialog.open();
    }.bind(this));
  },

  _onReport: function () {
    window.appGlobals.notifyUserViaToast(this.t('post.report')+': '+this.post.name);
  },

  _onDeleted: function () {
    this.dispatchEvent(new CustomEvent('yp-refresh-group', {bubbles: true, composed: true}));
    this.redirectTo("/group/"+this.post.group_id);
  }
});
