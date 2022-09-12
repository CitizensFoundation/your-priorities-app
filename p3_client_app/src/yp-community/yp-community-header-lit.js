import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import '@polymer/iron-image/iron-image.js';
import '@polymer/iron-media-query/iron-media-query.js';
import 'lite-signal/lite-signal.js';
import '@polymer/paper-menu-button/paper-menu-button.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '../yp-app-globals/yp-app-icons.js';
import { AccessHelpers } from '../yp-behaviors/access-helpers.js';
import { ypGotAdminRightsBehavior } from '../yp-behaviors/yp-got-admin-rights-behavior.js';
import { ypTruncateBehavior } from '../yp-behaviors/yp-truncate-behavior.js';
import { LargeCardBehaviors } from '../yp-behaviors/yp-large-card-behaviors.js';
import { ypGotoBehavior } from '../yp-behaviors/yp-goto-behavior.js';
import { ypMediaFormatsBehavior } from '../yp-behaviors/yp-media-formats-behavior.js';
import { CommunityBehaviors } from './yp-community-behaviors.js';
import './yp-community-stats.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { dom } from '@polymer/polymer/lib/legacy/polymer.dom.js';
import { YpBaseElement } from '../yp-base-element.js';

class YpCommunityHeaderLit extends YpBaseElement {
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
      }
    }
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
        background-color: rgba(250,250,250,0.0);
        color: #111;
        font-size: 18px;
        text-align: center;
        max-width: 750px;
        padding-left: 16px;
        padding-right: 16px;
      }

      .stats {
        background-color: rgba(250,250,250,0.0);
        --main-stats-color-on-white: #000;
      }


      iron-image {
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
        width: 100px;
        height: 100px;
        margin-top: 8px;
      }

      .edit {
        color: #FFF;
        padding-right: 0;
        margin-right: 0;
      }

      .contentContainer {

      }

      .textBox {
        margin-right: 32px;
      }

      .community-name {
        background-color: rgba(250,250,250,0.0);
        color: #222;
        font-weight: bold;
        font-size: 58px;
        padding-top: 8px;
        padding-left: 16px;
        padding-right: 16px;
      }

      .nameBorder {
        border-bottom: 2px solid;
        margin-bottom: 8px;
        margin-top: 8px;
        margin-left: 180px;
        margin-right: 180px;
      }

      @media (max-width: 945px) {
        :host {
          width: 306px;
        }

        .large-card {
          width: 306px;
          height: 100%;
        }

        .top-card {
          margin-bottom: 16px;
        }

        .edit {
        }

        .community-name {
          font-size: 28px;
          text-align: center;
          padding-top: 4px;
          padding-bottom: 4px;
        }

        .description {
          font-size: 17px;
        }

        .communityDescription {
          padding-top: 6px;
          padding-bottom: 4px;
        }

        .stats {
        }

        .textBox {
          margin-right: 0;
        }
      }

      .rounded-even-more {
        -webkit-border-radius: 90px;
        -moz-border-radius: 90px;
        border-radius: 90px;
        display: block;
        vertical-align: top;
        align: center;
        -webkit-transform-style: preserve-3d;
      }

      [hidden] {
        display: none !important;
      }
    `, YpFlexLayout]
  }

  render() {
    return html`
      <div class="layout vertical center-center">
        <iron-image class="image rounded-even-more" .sizing="cover" src="${this.communityLogoImagePath}"></iron-image>
        <div class="community-name rounded-even-more">
          ${this.communityNameFull}
        </div>
        <div class="layout horizontal center-center">
          <yp-community-stats class="stats" .community="${this.community}"></yp-community-stats>
        </div>
        <div class="description layout horizontal center-center rounded-even-more ">
          <div id="description" class="communityDescription">
          </div>
          <div>
            <paper-menu-button class="edit" .verticalAlign="top" .horizontalAlign="${this.editMenuAlign}" ?hidden="${!this.hasCommunityAccess}">
              <paper-icon-button .ariaLabel="${this.t('openCommunityMenu')}" .icon="more-vert" slot="dropdown-trigger"></paper-icon-button>
              <paper-listbox slot="dropdown-content" @iron-select="${this._menuSelection}" .selected="${this.selectedMenuItem}">
                <paper-item id="editMenuItem">${this.t('community.edit')}</paper-item>
                <paper-item id="usersMenuItem">${this.t('community.users')}</paper-item>
                <paper-item id="adminsMenuItem">${this.t('community.admins')}</paper-item>
                <paper-item id="deleteMenuItem">${this.t('community.delete')}</paper-item>
                <paper-item id="pagesMenuItem">${this.t('pages.managePages')}</paper-item>
                <paper-item id="bulkStatusUpdateMenuItem">${this.t('bulkStatusUpdate')}</paper-item>
              </paper-listbox>
            </paper-menu-button>
          </div>
        </div>
      </div>

    <iron-media-query query="(max-width: 800px)" query-matches="${this.narrowScreen}"></iron-media-query>
    <lite-signal @lite-signal-got-admin-rights="${this._gotAdminRights}"></lite-signal>
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

  _communityChanged(community) {
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
    if (detail.item.id=="editMenuItem")
      this._openEdit();
    else if (detail.item.id=="deleteMenuItem")
      this._openDelete();
    else if (detail.item.id=="usersMenuItem")
      this._openUsersDialog();
    else if (detail.item.id=="adminsMenuItem")
      this._openAdminsDialog();
    else if (detail.item.id=="pagesMenuItem")
      this._openPagesDialog();
    else if (detail.item.id="bulkStatusUpdateMenuItem")
      this._openBulkStatusUpdates();
    this.selectedMenuItem = null;
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

    dom(document).querySelector('yp-app').getDialogAsync("bulkStatusUpdateGrid", function (dialog) {
      dialog.open(this.community.id);
    }.bind(this));
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
      dialog.open();
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
    dom(document).querySelector('yp-app').getDialogAsync("apiActionDialog", function (dialog) {
      dialog.setup('/api/communities/' + this.community.id,
        this.t('community.deleteConfirmation'),
        this._onDeleted.bind(this));
      dialog.open();
    }.bind(this));
  }

  _openEdit() {
    dom(document).querySelector('yp-app').getDialogAsync("communityEdit", function (dialog) {
      dialog.setup(this.community, false, this._refresh.bind(this));
      dialog.open('edit', {communityId: this.community.id});
    }.bind(this));
  }

  _onDeleted() {
    this.redirectTo("/domain/"+this.community.domain_id);
  }

  _refresh(community) {
    if (community) {
      this.community = community;
    }
    this.fire("update-community");
  }
}

window.customElements.define('yp-community-header-lit', YpCommunityHeaderLit)