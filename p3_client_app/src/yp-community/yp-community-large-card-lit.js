import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import '@polymer/iron-image/iron-image.js';
import '@polymer/iron-media-query/iron-media-query.js';
import 'lite-signal/lite-signal.js';
import 'neon-animation-polymer-3/web-animations.js';
import '@polymer/paper-menu-button/paper-menu-button.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/paper-material/paper-material.js';
import '../yp-app-globals/yp-app-icons.js';
import { AccessHelpers } from '../yp-behaviors/access-helpers.js';
import { ypGotAdminRightsBehavior } from '../yp-behaviors/yp-got-admin-rights-behavior.js';
import { ypTruncateBehavior } from '../yp-behaviors/yp-truncate-behavior.js';
import { LargeCardBehaviors } from '../yp-behaviors/yp-large-card-behaviors.js';
import { ypGotoBehavior } from '../yp-behaviors/yp-goto-behavior.js';
import { ypMediaFormatsBehavior } from '../yp-behaviors/yp-media-formats-behavior.js';
import { CommunityBehaviors } from './yp-community-behaviors.js';
import './yp-community-stats-lit.js';
import '../yp-magic-text/yp-magic-text.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { dom } from '@polymer/polymer/lib/legacy/polymer.dom.js';
import { YpBaseElement } from '../yp-base-element.js';
import { propagate } from 'grpc';

class YpCommunityLargeCardLit extends YpBaseElement {
  static get properties() {
    return {
      community: {
        type: Object,
        observer: '_communityChanged'
      },

      hasCommunityAccess: {
        type: Boolean,
        value: false,
        computed: '_hasCommunityAccess(community, gotAdminRights)'
      },

      showMenuItem: {
        type: Boolean,
        value: false,
        computed: '_showMenuItem(hasCommunityAccess, community)'
      },

      communityVideoURL: {
        type: String,
        computed: '_communityVideoURL(community)'
      },

      communityVideoPosterURL: {
        type: String,
        computed: '_communityVideoPosterURL(community)'
      },

      hasCommunityAccessAndNotFolder: {
        type: Boolean,
        computed: '_hasCommunityAccessAndNotFolder(community, hasCommunityAccess)'
      },

      communityVideoId: Number,

      flaggedContentCount: {
        type: Number,
        value: null
      },

      exportLoginsUrl: {
        type: String,
        computed: '_exportLoginsUrl(hasCommunityAccess, community)'
      },

      exportUsersUrl: {
        type: String,
        computed: '_exportUsersUrl(hasCommunityAccess, community)'
      }
    };
  }
static get styles() {
  return [
    css`
      :host {
      }

      .communityAccess {
        padding-bottom: 8px;
      }

      .description {
        line-height: var(--description-line-height, 1.3);
      }

      video {
        outline: none !important;
      }

      .stats {
        position: absolute;
        bottom: 0;
        right: 8px;
      }

      .community-name {
        padding: 0;
        padding-bottom: 4px;
        padding-right: 1px;
        margin: 0;
        font-size: 24px;
        font-weight: 700;

      }

      iron-image, video {
        width: 432px;
        height: 243px;
      }

      .large-card {
        background-color: #fefefe;
        color: #333;
        height: 243px;
        width: 432px;
        padding: 0 !important;
        margin-top: 0 !important;
      }

      .image {
        width: 432px;
        height: 243px;
      }

      .description-and-stats {
        width: 100%;
      }

      .edit {
        color: #FFF;
        position: absolute;
        top: 0;
        right: 0px;
        padding-right: 0;
        margin-right: 0;
        z-index: 200;
      }

      .contentContainer {

      }

      .description-and-stats {
        padding-bottom: 32px;
      }


      .description {
        padding: 0;
        margin: 0;
        z-index: 100;
      }

      .communityDescription {
        padding-left: 16px;
        padding-right: 16px;
        padding-top: 16px;
      }

      .community-name {
        background-color: var(--primary-color-800, #000);
        color: #fafafa;
        padding-left: 16px;
        padding-top: 16px;
        padding-bottom: 16px;
        min-height: 31px;
        padding-right: 32px;
      }

      .textBox {
        margin-left: 32px;
        position: relative;
      }

      #welcomeHTML {
        width: 432px;
        max-width: 432px;
        overflow: hidden;
      }

      .k2017Image {
        height: 72px;
      }

      .k2017FeaturedImage {
        height: 85px;
      }

      .k2017extraMargin {
        margin-right: 68px;
        margin-left: 45px;
      }

      .k2017topPadding {
        padding: 8px;
      }

      .k2017topPadding a:link { color: #333 }
      .k2017topPadding a:visited { color: #333 }

      .k2017showOnlyMobile {
        display: none;
      }

      @media (max-width: 960px) {
        :host {
          max-width: 423px;
          padding: 0 !important;
          padding-top: 8px !important;
          width: 100%;
        }

        .k2017Image {
          height: 42px;
        }

        .k2017FeaturedImage {
          height: 55px;
        }

        .k2017extraMargin {
          margin-right: 52px;
          margin-left: 32px;
        }

        .k2017topPadding {
          padding-top: 4px;
        }

        .k2017hiddenMobile  {
          display: none;
        }

        .k2017showOnlyMobile {
          display: inline;
        }

        #welcomeHTML {
          width: 306px;
          max-width: 306px;
        }

        .large-card {
          width: 100%;
          height: 100%;
          margin-left: 8px;
          margin-right: 8px;
          margin-top: 8px !important;
        }

        .top-card {
          margin-bottom: 16px;
        }

        iron-image, video, .image {
          width: 100%;
          height: 230px;
        }

        .imageCard {
          height: 230px;
        }

        .imageCard[is-video] {
          background-color: transparent;
        }

        .community-name {
          font-size: 20px;
          min-height: 26px;
        }

        .communityDescription {
          padding-top: 6px;
          padding-bottom: 4px;
        }

        .stats {
        }

        .textBox {
          margin-left: 8px;
        }
      }

      @media (max-width: 420px) {
        iron-image, video, .image {
          height: 225px;
        }

        .imageCard {
          height: 225px;
        }
      }

      @media (max-width: 400px) {
        iron-image, video, .image {
          height: 210px;
        }

        .imageCard {
          height: 210px;
        }
      }

      @media (max-width: 375px) {
        iron-image, video, .image {
          height: 207px;
        }

        .imageCard {
          height: 205px;
        }
      }

      @media (max-width: 360px) {
        iron-image, video, .image {
          height: 200px;
        }

        .imageCard {
          height: 200px;
        }
      }

      @media (max-width: 320px) {
        iron-image, video, .image {
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
      <div class="layout horizontal wrap">
        <paper-material is-video="${this.communityVideoURL}" id="cardImage" .elevation="3" .animated="" class="large-card imageCard top-card">
          <div id="welcomeHTML" .title="(!community.configuration.welcomeHTML)" class="layout vertical center-center">
          </div>
          <div hidden="${this.community.configuration.welcomeHTML}">

           ${this.communityVideoURL ? html`
              <video id="videoPlayer" .dataId="${this.communityVideoId}" .controls="" .preload="meta" class="image pointer" src="${this.communityVideoURL}" .playsinline="" .poster="${thiscommunityVideoPosterURL}"></video>
            ` : html`
              <iron-image class="image" .sizing="cover" alt="${this.community.name}" src="${this.communityLogoImagePath}"></iron-image>
            `}

          </div>
        </paper-material>
        <paper-material id="card" .elevation="3" .animated="" class="large-card textBox">
          <div class="layout vertical">
            <div class="layout horizontal wrap">
              <div class="layout vertical description-and-stats">
                <div class="description">
                  <div class="community-name" role="heading" aria-level="1" aria-label="[[community.name]]">
                  ${this.communityVideoURL ? html`
                      <yp-magic-text text-type="communityName" content-language="[[community.language]]" disable-translation="[[community.configuration.disableNameAutoTranslation]]" text-only="" content="[[communityNameFull]]" content-id="[[community.id]]">
                      </yp-magic-text>
                  ` : ''}
                  </div>
                  <div hidden="" class="communityAccess">${this._communityAccessText(community.access)}</div>
                  <yp-magic-text id="description" class="communityDescription" .textType="communityContent" contentLanguage="${this.community.language}" .content="${this.community.description}" .contentId="${this.community.id}">
                  </yp-magic-text>
                </div>
              </div>
            </div>
            <paper-menu-button class="edit" .verticalAlign="top" .horizontalAlign="${this.editMenuAlign}" ?hidden="${!this.showMenuItem}">
              <paper-icon-button .ariaLabel="${this.t('openCommunityMenu')}" .icon="more-vert" slot="dropdown-trigger"></paper-icon-button>
              <paper-listbox slot="dropdown-content" on-iron-select="_menuSelection">
                <paper-item ?hidden="${!this.hasCommunityAccess}" id="editMenuItem">${this.t('community.edit')}</paper-item>
                <paper-item ?hidden="${!this.hasCommunityAccess}" id="usersMenuItem">${this.t('community.users')}</paper-item>
                <paper-item ?hidden="${!this.hasCommunityAccess}" id="adminsMenuItem">${this.t('community.admins')}</paper-item>
                <paper-item ?hidden="${!this.hasCommunityAccess}" id="pagesMenuItem">${this.t('pages.managePages')}</paper-item>
                <paper-item ?hidden="${!this.hasCommunityAccessAndNotFolder}" id="moderationMenuItem">
                  ${this.t('flaggedContent')} <span ?hidden="${!this.flaggedContentCount}">&nbsp; (${flaggedContentCount})</span>
                </paper-item>
                <paper-item ?hidden="${!this.hasCommunityAccessAndNotFolder}" id="moderationAllMenuItem">
                  ${this.t('manageAllContent')}
                </paper-item>
                <a ?hidden="${!this.hasCommunityAccess}" target="_blank" href="${this.exportLoginsUrl}"><paper-item id="exportLogins">${this.t('exportLogins')}</paper-item></a>
                <a ?hidden="${!this.hasCommunityAccess}" target="_blank" href\$="${this.exportUsersUrl}"><paper-item id="exportUsers">[[t('exportUsers')]]</paper-item></a>

                <paper-item ?hidden="${!this.hasCommunityAccess}" id="deleteMenuItem">${this.t('community.delete')}</paper-item>
                <paper-item ?hidden="${!this.hasCommunityAccessAndNotFolder}" id="anonymizeMenuItem">${this.t('anonymizeCommunityContent')}</paper-item>
                <paper-item ?hidden="${!this.hasCommunityAccessAndNotFolder}" id="deleteContentMenuItem">${this.t('deleteCommunityContent')}</paper-item>
                <paper-item ?hidden="${!this.hasCommunityAccessAndNotFolder}" id="bulkStatusUpdateMenuItem">${this.t('bulkStatusUpdate')}</paper-item>
                <paper-item id="addGroupMenuItem" hidden="${this.community.is_community_folder}">${this.t('group.new')}</paper-item>
                <paper-item ?hidden="" id="addCommunityFolderMenuItem">${this.t('newCommunityFolder')}</paper-item>
                <paper-item id="openAnalyticsApp" hidden?="${!this.hasCommunityAccess}">${this.t('openAnalyticsApp')}</paper-item>
                <paper-item id="openAdminApp" hidden$="[[!hasCommunityAccess]]">[[t('editTranslations')]]</paper-item>

              </paper-listbox>
            </paper-menu-button>
          </div>
          <yp-community-stats-lit class="stats" .community="${this.community}"></yp-community-stats-lit>
        </paper-material>
      </div>

      ${ (this.community && this.hasCommunityAccess) ? html`
        <yp-ajax ?hidden="" .disableUserError="" .method="GET" url="/api/communities/${this.community.id}/flagged_content_count" .auto="" @response="${this._setFlaggedContentCount}"></yp-ajax>
      ` : html``}

      <iron-media-query query="(max-width: 800px)" queryMatches="${this.narrowScreen}"></iron-media-query>
      <lite-signal @lite-signal-got-admin-rights="${this._gotAdminRights}"></lite-signal>
      <lite-signal @lite-signal-yp-pause-media-playback="${this._pauseMediaPlayback}"></lite-signal>
  `
}

/*
behaviors: [
  CommunityBehaviors,
  LargeCardBehaviors,
  AccessHelpers,
  ypGotAdminRightsBehavior,
  ypGotoBehavior,
  ypTruncateBehavior,
  ypMediaFormatsBehavior
],
*/

  _exportLoginsUrl(access, community) {
    if (access && community) {
      return '/api/communities/'+community.id+'/export_logins';
    } else {
      return null;
    }
  }

  _exportUsersUrl(access, community) {
    if (access && community) {
      return '/api/communities/'+community.id+'/export_users';
    } else {
      return null;
    }
  }

  _hasCommunityAccessAndNotFolder(community, hasCommunityAccess) {
    return (community && !community.is_community_folder && hasCommunityAccess) || false
  }

  _communityVideoURL(community) {
    if (community && community.configuration &&
      community.configuration.useVideoCover &&
      community.CommunityLogoVideos) {
      const videoURL = this._getVideoURL(community.CommunityLogoVideos);
      if (videoURL) {
        this.communityVideoId = community.CommunityLogoVideos[0].id;
        return videoURL;
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

  _communityVideoPosterURL(community) {
    if (community && community.configuration &&
      community.configuration.useVideoCover &&
      community.CommunityLogoVideos) {
      const videoPosterURL = this._getVideoPosterURL(community.CommunityLogoVideos, community.CommunityLogoImages);

      if (videoPosterURL) {
        return videoPosterURL;
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

  _showMenuItem(hasCommunityAccess, community) {
    return hasCommunityAccess || (community && !community.only_admins_can_create_groups)
  }

  _communityChanged(community, previousCommunity) {
    if (community && community.description) {
      this.async(function () {
        if (community.configuration && community.configuration.welcomeHTML &&
          community.configuration.welcomeHTML !== "" &&
          this.$$("#welcomeHTML")) {
            const div = document.createElement('div');
            div.innerHTML = community.configuration.welcomeHTML;
            this.$$("#welcomeHTML").innerHTML = "";
            dom(this.$$("#welcomeHTML")).appendChild(div);
        } else if (this.$$("#welcomeHTML")) {
         this.$$("#welcomeHTML").innerHTML = "";
        }
      });
      if (community.description.length>220 && community.name && community.name.length>30) {
        this.$$("#description").style.fontSize = "15px";
      } else {
        this.$$("#description").style.fontSize = "16px";
      }
    }
    this.setupMediaEventListeners(community, previousCommunity);
  }

  _hasCommunityAccess(community, gotAdminRights) {
    if (community && gotAdminRights) {
      if (this.checkCommunityAccess(community)!=null) {
        return true
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  _communityAccessText(access) {
    switch (access) {
      case 0:
        return this.t("community.public");
        break;
      case 1:
        return this.t("community.closed");
        break;
      case 2:
        return this.t("community.secret");
        break;
    }
  }

  _menuSelection(event, detail) {
    if (detail.item.id==="editMenuItem")
      this._openEdit();
    else if (detail.item.id==="deleteMenuItem")
      this._openDelete();
    else if (detail.item.id==="usersMenuItem")
      this._openUsersDialog();
    else if (detail.item.id==="adminsMenuItem")
      this._openAdminsDialog();
    else if (detail.item.id==="pagesMenuItem")
      this._openPagesDialog();
    else if (detail.item.id==="bulkStatusUpdateMenuItem")
      this._openBulkStatusUpdates();
    else if (detail.item.id==="addGroupMenuItem")
      this.fire('yp-new-group');
    else if (detail.item.id==="moderationMenuItem")
      this._openContentModeration();
    else if (detail.item.id==="moderationAllMenuItem")
      this._openAllContentModeration();
    else if (detail.item.id==="anonymizeMenuItem")
      this._openAnonymizeContent();
    else if (detail.item.id==="deleteContentMenuItem")
      this._openDeleteContent();
    else if (detail.item.id==="addCommunityFolderMenuItem")
      this.fire('yp-new-community-folder');
    else if (detail.item.id==="openAnalyticsApp")
      window.location = "/analytics/community/"+this.community.id;
    else if (detail.item.id==="openAdminApp")
      window.location = "/admin/community/"+this.community.id;
    this.$$("paper-listbox").select(null);
  }

  _openContentModeration() {
    window.appGlobals.activity('open', 'communityContentModeration');
    dom(document).querySelector('yp-app').getContentModerationAsync(function (dialog) {
      dialog.setup(null, this.community.id, null, false);
      dialog.open(this.community.name);
    }.bind(this));
  }

  _openAllContentModeration() {
    window.appGlobals.activity('open', 'communityAllContentModeration');
    dom(document).querySelector('yp-app').getContentModerationAsync(function (dialog) {
      dialog.setup(null, this.community.id, null, '/moderate_all_content');
      dialog.open(this.community.name);
    }.bind(this));
  }

  _openBulkStatusUpdates() {
    window.appGlobals.activity('open', 'community.bulkStatusUpdates');
    document.dispatchEvent(
      new CustomEvent("lite-signal", {
        bubbles: true,
        compose: true,
        detail: { name: 'open-bulk-status-updates', data: null }
      })
    );

    setTimeout(function () {
      dom(document).querySelector('yp-app').getDialogAsync("bulkStatusUpdateGrid", function (dialog) {
        dialog.open(this.community.id);
      }.bind(this));
    });
  }

  _openUsersDialog() {
    window.appGlobals.activity('open', 'community.users');
    dom(document).querySelector('yp-app').getUsersGridAsync(function (dialog) {
      dialog.setup(null, this.community.id, null, false);
      dialog.open(this.community.name);
    }.bind(this));
  }

  _openAdminsDialog() {
    window.appGlobals.activity('open', 'community.admins');
    dom(document).querySelector('yp-app').getUsersGridAsync(function (dialog) {
      dialog.setup(null, this.community.id, null, true);
      dialog.open(this.community.name);
    }.bind(this));
  }

  _openPagesDialog() {
    window.appGlobals.activity('open', 'community.pagesAdmin');
    dom(document).querySelector('yp-app').getDialogAsync("pagesGrid", function (dialog) {
      dialog.setup(null, this.community.id, null, false);
      dialog.open();
    }.bind(this));
  }

  _openDelete() {
    window.appGlobals.activity('open', 'community.delete');
    dom(document).querySelector('yp-app').getDialogAsync("apiActionDialog", function (dialog) {
      dialog.setup('/api/communities/' + this.community.id,
        this.t('communityDeleteConfirmation'),
        this._onDeleted.bind(this));
      dialog.open({finalDeleteWarning: true});
    }.bind(this));
  }

  _openDeleteContent() {
    window.appGlobals.activity('open', 'community.deleteContents');
    dom(document).querySelector('yp-app').getDialogAsync("apiActionDialog", function (dialog) {
      dialog.setup('/api/communities/' + this.community.id + '/delete_content',
        this.t('communityDeleteContentConfirmation'));
      dialog.open({finalDeleteWarning: true});
    }.bind(this));
  }

  _openAnonymizeContent() {
    window.appGlobals.activity('open', 'community.anonymize');
    dom(document).querySelector('yp-app').getDialogAsync("apiActionDialog", function (dialog) {
      dialog.setup('/api/communities/' + this.community.id + '/anonymize_content',
        this.t('communityAnonymizeConfirmation'), null, this.t('anonymize'));
      dialog.open({finalDeleteWarning: true});
    }.bind(this));
  }

  _openEdit() {
    window.appGlobals.activity('open', 'community.edit');
    dom(document).querySelector('yp-app').getDialogAsync("communityEdit", function (dialog) {
      dialog.setup(this.community, false, this._refresh.bind(this));
      dialog.open('edit', {communityId: this.community.id});
    }.bind(this));
  }

  _onDeleted() {
    this.redirectTo("/domain/"+this.community.domain_id);
    this.dispatchEvent(new CustomEvent('yp-refresh-domain', {bubbles: true, composed: true}));
  }

  _refresh(community) {
    if (community) {
      this.community = community;
    }
    this.fire("update-community");
  }
}

window.customElements.define('yp-community-large-card-lit', YpCommunityLargeCardLit)