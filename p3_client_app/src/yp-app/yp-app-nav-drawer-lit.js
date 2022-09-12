import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import 'lite-signal/lite-signal.js';
import '@polymer/paper-item/paper-item.js';
import '../yp-app-globals/yp-language-selector.js';
import { ypGotoBehavior } from '../yp-behaviors/yp-goto-behavior.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { dom } from '@polymer/polymer/lib/legacy/polymer.dom.js';

class YpAppNavDrawerLit extends YpBaseElement {
  static get properties() {
    return {
      homeLink: {
        type: Object
      },

      user: {
        type: Object,
        observer: '_userChanged'
      },

      opened: {
        type: Boolean
      },

      route: {
        type: String
      },

      myAdminGroups: {
        type: Array,
        value: null
      },

      myAdminCommunities: {
        type: Array,
        value: null
      },

      myGroups: {
        type: Array
      },

      myCommunities: {
        type: Array
      },

      myDomains: {
        type: Array
      }
    }
  }

  static get styles() {
    return [
      css`

      paper-material {
        z-index: 1000;
        background-color: #FFF;
      }

      .header {
        padding-top: 16px;
        font-weight: bold;
        padding-bottom: 8px;
        font-size: 18px;
        padding-left: 8px;
      }

      .thumbNail {
        width: 42px;
        height: 24px;
        padding-top: 24px;
        margin-left: 12px;
      }

      .material {
        background-color: #FFF;
        color: var(--primary-color-800)
      }

      paper-item {
        cursor: pointer;
      }

      iron-icon {
        width: 42px;
        height: 42px;
        cursor: pointer;
      }

      .languageSelector {
        margin-left: 8px;
        margin-right: 8px;
      }

      yp-language-selector {
        padding-top: 0;
      }

      [hidden] {
        display: none !important;
      }
    `, YpFlexLayout]
  }

  render() {
    return html`
    <paper-material .elevation="0" class="material">
      <div ?hidden="${!this.homeLink}">
        <div class="header layout vertical center-center">
          <iron-icon .icon="home" @tap="${this._goBack}"></iron-icon>
          <paper-item @tap="${this._goBack}">${this.homeLink.name}</paper-item>
        </div>
      </div>
      <div class="languageSelector layout vertical self-start">
        <yp-language-selector class="languageSelector" .selectedLocale="${this.language}"></yp-language-selector>
      </div>
      <div class="layout vertical" ?hidden="${!this.user}">
        <div ?hidden="">
          <div class="header">${this.t('myDomains')}</div>

          ${ this.myDomains.map(domain => html`
            <paper-item data-args="${this.domain.id}" @tap="${this._goToDomain}">${this.domain.name}</paper-item>
          `)}

        </div>
        <div ?hidden="${!this.myAdminCommunities}">
          <div class="header">${this.t('myAdminCommunities')}</div>

          ${ this.myAdminCommunities.map(community => html`
           <div class="layout horizontal">
              <paper-item data-args="${this.community.id}" @tap="${this._goToCommunity}">${this.community.name}</paper-item>
            </div>
          `)}

        </div>

        <div ?hidden="${!this.myAdminGroups}">
          <div class="header">${this.t('myAdminGroups')}</div>

          ${ this.myAdminGroups.map(group => html`
          <paper-item data-args="${this.group.id}" @tap="${this._goToGroup}">${this.group.name}</paper-item>
          `)}

        </div>

        <div class="header">${this.t('myCommunities')}</div>

        ${ this.myCommunities.map(community => html`
          <div class="layout horizontal">
            <paper-item data-args="${this.community.id}" @tap="${this._goToCommunity}">${this.community.name}</paper-item>
          </div>
        `)}

        <div class="header">${this.t('myGroups')}</div>

        ${ this.myGroups.map(group => html`
        <paper-item data-args="${this.group.id}" @tap="${this._goToGroup}">${this.group.name}</paper-item>
        `)}

      </div>
    </paper-material>
    <lite-signal @lite-signal-got-memberships="${this._userMembershipsReady}"></lite-signal>
    <lite-signal @lite-signal-got-admin-rights="${this._reset}"></lite-signal>
`
  }

/*
  behaviors: [
    ypGotoBehavior
  ],
*/


  _goBack(event) {
    if (this.homeLink) {
      this.redirectTo('/'+this.homeLink.type+'/'+this.homeLink.id);
      this.fire('yp-toggle-nav-drawer');
    }
  }

  _goToGroup(event) {
    this.redirectTo("/group/"+ event.target.getAttribute('data-args'));
    this.fire('yp-toggle-nav-drawer');
  }

  _goToCommunity(event) {
    this.redirectTo("/community/"+ event.target.getAttribute('data-args'));
    this.fire('yp-toggle-nav-drawer');
  }

  _goToDomain(event) {
    this.redirectTo("/domain/"+ event.target.getAttribute('data-args'));
    this.fire('yp-toggle-nav-drawer');
  }

  _userMembershipsReady() {
    this._reset();
  }

  _userChanged(user) {
    if (user) {
      this._reset();
    }
  }

  _reset() {
    if (window.appUser && window.appUser.memberships) {
      const groupUsers = __.reject(window.appUser.memberships.GroupUsers, function (item) {
        return item.name=="hidden_public_group_for_domain_level_points";
      });
      this.myGroups = __.take(groupUsers, 1000);
      this.myCommunities = __.take(window.appUser.memberships.CommunityUsers, 500);
      this.myDomains = __.take(window.appUser.memberships.DomainUsers, 3);
    } else {
      this.myGroups = null;
      this.myCommunities = null;
      this.myDomains = null;
    }

    if (window.appUser && window.appUser.adminRights &&
        window.appUser.adminRights.CommunityAdmins && window.appUser.adminRights.CommunityAdmins.length>0) {
      this.myAdminCommunities = window.appUser.adminRights.CommunityAdmins;
    } else {
      this.myAdminCommunities = null;
    }

    if (window.appUser && window.appUser.adminRights &&
      window.appUser.adminRights.GroupAdmins && window.appUser.adminRights.GroupAdmins.length>0) {
      const groupAdmins = __.reject(window.appUser.adminRights.GroupAdmins, function (item) {
        return item.name=="hidden_public_group_for_domain_level_points";
      });
      this.myAdminGroups = groupAdmins;
    } else {
      this.myAdminGroups = null;
    }
  }

  _openEdit() {
    dom(document).querySelector('yp-app').getDialogAsync("userEdit", function (dialog) {
      dialog.setup(this.user, false, null);
      dialog.open('edit', { userId: this.user.id });
    }.bind(this));
  }
}

window.customElements.define('yp-app-nav-drawer-lit', YpAppNavDrawerLit)