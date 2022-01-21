import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import '@polymer/iron-image/iron-image.js';
import 'lite-signal/lite-signal.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/paper-menu-button/paper-menu-button.js';
import 'neon-animation-polymer-3/web-animations.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/paper-item/paper-item.js';
import '../yp-app-globals/yp-app-icons.js';
import { AccessHelpers } from '../yp-behaviors/access-helpers.js';
import { ypGotAdminRightsBehavior } from '../yp-behaviors/yp-got-admin-rights-behavior.js';
import { LargeCardBehaviors } from '../yp-behaviors/yp-large-card-behaviors.js';
import { ypGotoBehavior } from '../yp-behaviors/yp-goto-behavior.js';
import { ypTruncateBehavior } from '../yp-behaviors/yp-truncate-behavior.js';
import { ypMediaFormatsBehavior } from '../yp-behaviors/yp-media-formats-behavior.js';
import '../yp-magic-text/yp-magic-text.js';
import './yp-group-stats-lit.js';
import { GroupBehaviors } from './yp-group-behaviors.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { dom } from '@polymer/polymer/lib/legacy/polymer.dom.js';
import { YpBaseElement } from '../yp-base-element.js';
import { YpFlexLayout } from '../yp-flex-layout.js';

class YpGroupCardLargeLit extends YpBaseElement {
  static get properties() {
    return {
      group: {
        type: Object,
        observer: '_groupChanged'
      },

      hasGroupAccess: {
        type: Boolean,
        value: false,
        computed: '_hasGroupAccess(group, gotAdminRights)'
      },

      groupAccessText: {
        type: String,
        computed: '_groupAccessText(group, language)'
      },

      showMenuItem: {
        type: Boolean,
        value: false,
        computed: '_showMenuItem(hasGroupAccess, group)'
      },

      exportUrl: {
        type: String,
        computed: '_exportUrl(hasGroupAccess, group)'
      },

      exportUrlDocx: {
        type: String,
        computed: '_exportUrlDocx(hasGroupAccess, group, language, autoTranslateActive)'
      },

      autoTranslateActive: {
        type: Boolean,
        value: false
      },

      autoTranslateActive: {
        type: Boolean,
        value: false
      },

      groupVideoURL: {
        type: String,
        value: null
      },

      groupVideoPosterURL: {
        type: String,
        value: null
      },

      groupVideoId: Number,

      flaggedContentCount: {
        type: Number,
        value: null
      },
    }
  }

  static get styles() {
    return [
      css`

      .groupAccess {
        padding-bottom: 8px;
      }

      .group-name {
        padding-bottom: 4px;
        margin: 0;
        font-size: 24px;
        font-weight: 700;
      }

      .group-name[admin] {
        padding-right: 32px;
      }

      video {
        outline: none !important;
      }

      .objectives {
      }

      .groupCard {
        background-color: #fefefe;
        color: #333;
        height: 243px;
        width: 432px;
        padding: 0 !important;
        margin-top: 0 !important;
      }

      .stats {
        position: absolute;
        bottom: 0px;
        right: 8px;
      }

      .edit {
        color: #FFF;
        position: absolute;
        top: 0;
        right: 0;
        padding-right: 0;
        margin-right: 0;
      }

      .description-and-stats {
        width: 100%;
      }

      .newCategory {
        color: var( --primary-background-color,#F2F2F2);
        position: absolute;
        top: 64px;
        right: 0;
      }

      iron-image, video {
        width: 432px;
        height: 243px;
      }


      .description {
        padding: 0;
        margin: 0;
      }

      .groupDescription {
        padding-left: 16px;
        padding-right: 16px;
        padding-top: 16px;
        font-size: var(--group-description-font-size, 16px);
      }

      .group-name {
        background-color: var(--primary-color-800, #000);
        color: #fafafa;
        padding-left: 16px;
        padding-top: 16px;
        padding-bottom: 16px;
        padding-right: 32px !important;
        min-height: 28px;
      }

      .textBox {
        margin-left: 32px;
        position: relative;
      }

      @media (max-width: 960px) {
        :host {
          max-width: 423px;
          width: 100%;
        }

        .groupCard {
          margin-bottom: 16px;
          width: 100%;
          height: 100%;
          margin-left: 8px;
          margin-right: 8px;
        }

        .top-card {
          margin-top: 16px !important;
        }

        iron-image, video {
          width: 100%;
          height: 230px;
        }

        .imageCard {
          height: 230px;
        }

        .imageCard[is-video] {
          background-color: transparent;
        }

        .group-name {
          font-size: 20px;
          min-height: 24px;
        }

        .groupDescription {
          padding-top: 6px;
          padding-bottom: 42px;
        }

        .stats {
        }
      }


      @media (max-width: 420px) {
        iron-image, video {
          height: 225px;
        }

        .imageCard {
          height: 225px;
        }
      }

      @media (max-width: 375px) {
        iron-image, video {
          height: 207px;
        }

        .imageCard {
          height: 205px;
        }
      }

      @media (max-width: 360px) {
        iron-image, video {
          height: 200px;
        }

        .imageCard {
          height: 200px;
        }
      }

      @media (max-width: 320px) {
        iron-image, video {
          height: 180px;
        }

        .imageCard {
          height: 180px;
        }
      }


      [hidden] {
        display: none !important;
      }

      a {
        text-decoration: none;
        color: inherit;
      }
    `, YpFlexLayout]
  }

  render() {
    return html`
      <lite-signal @lite-signal-yp-pause-media-playback="${this._pauseMediaPlayback}"></lite-signal>
      <lite-signal on-lite-signal-yp-auto-translate="_autoTranslateEvent"></lite-signal>

      <div class="layout horizontal center-center wrap">
        <paper-material id="cardImage" .elevation="3" is-video="${this.groupVideoURL}" .animated="" class="groupCard imageCard top-card">

        ${ this.groupVideoURL ? html`
          <video id="videoPlayer" data-id="${this.groupVideoId}" .controls="" .preload="meta" class="logo" src="${this.groupVideoURL}" playsinline .poster="${this.groupVideoPosterURL}"></video>
        ` : html`
          <iron-image class="logo" .sizing="cover" alt="${this.group.name}" preload src="${this.groupLogoImagePath}"></iron-image>
        `  }

        </paper-material>
        <paper-material id="card" .elevation="3" animated-shadow class="groupCard textBox">
        <div class="layout vertical">
          <div class="layout horizontal wrap">
            <div class="layout vertical description-and-stats">
              <div class="description">
                <div class="group-name" admin="${this.hasGroupAccess}"  role="heading" aria-level="1" aria-label="${this.group.name}">
                  <yp-magic-text id="groupName" text-type="groupName" .contentLanguage="${this.group.language}" disable-translation="${this.group.configuration.disableNameAutoTranslation}" .textOnly .content="${this.groupName}" content-id="${this.group.id}">
                  </yp-magic-text>
                </div>
              <div ?hidden="" class="groupAccess">${this.groupAccessText}</div>
              <yp-magic-text id="objectives" class="groupDescription" ?simpleFormat="${group.configuration.simpleFormatDescription}" .textType="groupContent" .contentLanguage="${this.group.language}" .content="${this.group.objectives}" .content-id="${this.group.id}">
              </yp-magic-text>
            </div>
          </div>
          <paper-menu-button class="edit" horizontal-align="${this.editMenuAlign}" ?hidden="${!this.showMenuItem}">
          <paper-icon-button aria-label="${this.t('openGroupMenu')}" icon="more-vert" slot="dropdown-trigger"></paper-icon-button>
          <paper-listbox slot="dropdown-content" on-iron-select="_menuSelection">
              <paper-item ?hidden="${!this.hasGroupAccess}" id="editMenuItem">${this.t('group.edit')}</paper-item>
              <paper-item ?hidden="${!this.hasGroupAccess}" id="newCategoryMenuItem">${this.t('category.new')}</paper-item>
              <paper-item ?hidden="${!this.hasGroupAccess}" id="usersMenuItem">${this.t('group.users')}</paper-item>
              <paper-item ?hidden="${!this.hasGroupAccess}" id="adminsMenuItem">${this.t('group.admins')}</paper-item>
              <paper-item ?hidden="${!this.hasGroupAccess}" id="pagesMenuItem">${this.t('pages.managePages')}</paper-item>
              <paper-item ?hidden="${!this.hasGroupAccess}" id="moderationMenuItem">
              ${this.t('flaggedContent')} <span ?hidden="${!this.flaggedContentCount}">&nbsp; (${this.flaggedContentCount})</span>
              </paper-item>
              <paper-item ?hidden="${!this.hasGroupAccess}" id="moderationAllMenuItem">
              ${this.t('manageAllContent')}
              </paper-item>
              <paper-item ?hidden="${!this.hasGroupAccess}" id="exportXlsMenuItem">${this.t('exportGroupXls')}</paper-item>
              <paper-item ?hidden="${!this.hasGroupAccess}" id="exportDocxMenuItem">${this.t('exportGroupDocx')}</paper-item>
              <paper-item ?hidden="${!this.hasGroupAccess}" id="deleteMenuItem">${this.t('group.delete')}</paper-item>
              <paper-item ?hidden="${!this.hasGroupAccess}" id="anonymizeMenuItem">${this.t('anonymizeGroupContent')}</paper-item>
              <paper-item ?hidden="${!this.hasGroupAccess}" id="deleteContentMenuItem">${this.t('deleteGroupContent')}</paper-item>
              <paper-item id="addPostMenuItem">${this.t('post.new')}</paper-item>
              <paper-item id="openAnalyticsApp"  ?hidden="${!this.hasGroupAccess}">${this.t('openAnalyticsApp')}</paper-item>
          </paper-listbox>
          </paper-menu-button>
        </div>
        <yp-group-stats-lit class="stats" .group="${this.group}"></yp-group-stats-lit>

      </div>

        ${ (this.group && this.hasGroupAccess) ? html`
          <yp-ajax ?hidden="" disable-user-error="" .method="GET" url="/api/groups/${this.group.id}/flagged_content_count" .auto="" @response="${this_setFlaggedContentCount}"></yp-ajax>
        ` : html``}

        <iron-media-query .query="(max-width: 800px)" .query-matches="${this.narrowScreen}"></iron-media-query>
        <lite-signal @lite-signal-got-admin-rights="${this._gotAdminRights}"></lite-signal>
      </paper-material>
      <!--TODO: Fix rougue div-->
      </div>
  `
}

  /*behaviors: [
     GroupBehaviors,
    LargeCardBehaviors,
    AccessHelpers,
    ypGotAdminRightsBehavior,
    ypGotoBehavior,
    ypTruncateBehavior,
    ypMediaFormatsBehavior
  ]
  */

  _autoTranslateEvent(event, detail) {
    this.autoTranslateActive = detail;
  }


  _exportUrl(access, group) {
    if (access && group) {
      return '/api/groups/'+group.id+'/export_group';
    } else {
      return null;
    }
  }

  _exportUrlDocx(access, group, language, autoTranslate) {
    if (access && group && language) {
      var langInfo = "";
      if (autoTranslate) {
        langInfo = "?translateLanguage="+language;
      }
      return '/api/groups/'+group.id+'/export_group_docx'+langInfo;
    } else {
      return null;
    }
  }

  _showMenuItem(hasGroupAccess, group) {
    return hasGroupAccess || (group && group.configuration && group.configuration.canAddNewPosts===true)
  }

  _hasGroupAccess(group, gotAdminRights) {
    if (group && gotAdminRights) {
      return (this.checkGroupAccess(group)!=null);
    } else {
      return false;
    }
  }

  resetGroup() {
    this.group = null;
  }

  _groupChanged(group, previousGroup) {
    if (group && group.objectives && group.objectives.length>200) {
      this.$$("#objectives").style.fontSize = "15px";
    } else {
      this.$$("#objectives").style.fontSize = "16px";
    }

    if (group && group.configuration && group.configuration.useVideoCover && group.GroupLogoVideos) {
      const videoURL = this._getVideoURL(group.GroupLogoVideos);
      var videoPosterURL = this._getVideoPosterURL(group.GroupLogoVideos, group.GroupLogoImages);
      if (videoURL && videoPosterURL) {
        this.groupVideoURL = videoURL;
        this.groupVideoPosterURL = videoPosterURL;
        this.groupVideoId = group.GroupLogoVideos[0].id;
      } else {
        this._resetVideo();
      }
    } else {
      this._resetVideo();
    }

    this.setupMediaEventListeners(group, previousGroup);
  }

  _resetVideo() {
    this.groupVideoURL = null;
    this.groupVideoPosterURL = null;
  }

  _groupAccessText(group, language) {
    if (group && language) {
      switch (group.access) {
        case 0: // Public
          return this.t("group.public");
          break;
        case 1: // Closed
          return this.t("group.closed");
          break;
        case 2: //Secret
          return this.t("group.secret");
          break;
      }
    } else {
      return "";
    }
  }

  _menuSelection(event, detail) {
    if (detail.item.id==="editMenuItem")
      this._openEdit();
    else if (detail.item.id==="newCategoryMenuItem")
      this._openCategoryEdit();
    else if (detail.item.id==="deleteMenuItem")
      this._openDelete();
    else if (detail.item.id==="usersMenuItem")
      this._openUsersDialog();
    else if (detail.item.id==="adminsMenuItem")
      this._openAdminsDialog();
    else if (detail.item.id==="pagesMenuItem")
      this._openPagesDialog();
    else if (detail.item.id==="addPostMenuItem")
      this.fire('yp-post-new');
    else if (detail.item.id==="deleteContentMenuItem")
      this._openDeleteContent();
    else if (detail.item.id==="moderationMenuItem")
      this._openContentModeration();
    else if (detail.item.id==="exportDocxMenuItem")
      this._openCreateDocxReport();
    else if (detail.item.id==="exportXlsMenuItem")
      this._openCreateXlsReport();
    else if (detail.item.id==="moderationAllMenuItem")
      this._openAllContentModeration();
    else if (detail.item.id==="anonymizeMenuItem")
      this._openAnonymizeContent();
    else if (detail.item.id==="openAnalyticsApp")
      window.location = "/analytics/group/"+this.group.id;
    this.$$("paper-listbox").select(null);
  }

  _openContentModeration() {
    window.appGlobals.activity('open', 'groupContentModeration');
    dom(document).querySelector('yp-app').getContentModerationAsync(function (dialog) {
      dialog.setup(this.group.id, null, null, false);
      dialog.open(this.group.name);
    }.bind(this));
  }

  _openAllContentModeration() {
    window.appGlobals.activity('open', 'communityAllContentModeration');
    dom(document).querySelector('yp-app').getContentModerationAsync(function (dialog) {
      dialog.setup(this.group.id, null, null, '/moderate_all_content');
      dialog.open(this.group.name);
    }.bind(this));
  }

  _openPagesDialog() {
    window.appGlobals.activity('open', 'group.pagesAdmin');
    dom(document).querySelector('yp-app').getDialogAsync("pagesGrid", function (dialog) {
      dialog.setup(this.group.id, null, null, false);
      dialog.open();
    }.bind(this));
  }

  _openUsersDialog() {
    window.appGlobals.activity('open', 'group.users');
    dom(document).querySelector('yp-app').getUsersGridAsync(function (dialog) {
      dialog.setup(this.group.id, null, null, false);
      dialog.open(this.group.name);
    }.bind(this));
  }

  _openAdminsDialog() {
    window.appGlobals.activity('open', 'group.admins');
    dom(document).querySelector('yp-app').getUsersGridAsync(function (dialog) {
      dialog.setup(this.group.id, null, null, true);
      dialog.open(this.group.name);
    }.bind(this));
  }

  _openEdit() {
    window.appGlobals.activity('open', 'group.edit');
    dom(document).querySelector('yp-app').getDialogAsync("groupEdit", function (dialog) {
      dialog._clear();
      this._refreshGroup(this.group.id, function (group) {
        dialog.setup(group, false, this._refresh.bind(this));
        dialog.open('edit', {groupId: group.id});
      }.bind(this));
    }.bind(this));
  }

  _refreshGroup(groupId, callback) {
    const ajax = document.createElement('iron-ajax');
    ajax.url = '/api/groups/'+groupId;
    ajax.handleAs = 'json';
    ajax.contentType = 'application/json';
    ajax.body = {};
    ajax.addEventListener('response', function (event, detail) {
      callback(event.detail.response.group);
    }.bind(this));
    ajax.addEventListener('error', function (event, detail) {
      console.error("Couldn't refresh group");
    }.bind(this));
    ajax.generateRequest();
  }

  _openCreateDocxReport() {
    window.appGlobals.activity('open', 'createReportDocx');
    dom(document).querySelector('yp-app').getCreateReportAsync(function (dialog) {
      dialog.setupAndOpen("docx",this.group, null);
    }.bind(this));
  }

  _openCreateXlsReport() {
    window.appGlobals.activity('open', 'createReportXls');
    dom(document).querySelector('yp-app').getCreateReportAsync(function (dialog) {
      dialog.setupAndOpen("xls",this.group, null);
    }.bind(this));
  }

  _openDelete() {
    window.appGlobals.activity('open', 'group.delete');
    dom(document).querySelector('yp-app').getDialogAsync("apiActionDialog", function (dialog) {
      dialog.setup('/api/groups/' + this.group.id,
        this.t('groupDeleteConfirmation'),
        this._onDeleted.bind(this));
      dialog.open({finalDeleteWarning: true});
    }.bind(this));
  }

  _openDeleteContent() {
    window.appGlobals.activity('open', 'group.deleteContent');
    dom(document).querySelector('yp-app').getDialogAsync("apiActionDialog", function (dialog) {
      dialog.setup('/api/groups/' + this.group.id + '/delete_content',
        this.t('groupDeleteContentConfirmation'));
      dialog.open({finalDeleteWarning: true});
    }.bind(this));
  }

  _openAnonymizeContent() {
    window.appGlobals.activity('open', 'group.anonymize');
    dom(document).querySelector('yp-app').getDialogAsync("apiActionDialog", function (dialog) {
      dialog.setup('/api/groups/' + this.group.id + '/anonymize_content',
        this.t('groupAnonymizeConfirmation'), null, this.t('anonymize'));
      dialog.open({finalDeleteWarning: true});
    }.bind(this));
  }

  _openCategoryEdit() {
    window.appGlobals.activity('open', 'category.new');
    dom(document).querySelector('yp-app').getDialogAsync("categoryEdit", function (dialog) {
      dialog.setup(this.group, true, this._refreshCategory.bind(this));
      dialog.open("new", {groupId: this.group.id});
    }.bind(this));
  }

  _refreshCategory(category) {
    this.fire("update-group");
  }

  _onDeleted() {
    this.dispatchEvent(new CustomEvent('yp-refresh-community', {bubbles: true, composed: true}));
    this.redirectTo("/community/"+this.group.community_id);
  }

  _newCategory() {
    this.$$("#newCategory").open('new', { groupId: this.group.id });
  }

  _refresh(group) {
    if (group) {
      this.group = group;
    }
    this.fire("update-group");
  }
}

window.customElements.define('yp-group-card-large-lit', YpGroupCardLargeLit)
