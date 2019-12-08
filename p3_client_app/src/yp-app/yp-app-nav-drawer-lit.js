import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import 'lite-signal/lite-signal.js';
import '@polymer/paper-item/paper-item.js';
import '../yp-app-globals/yp-language-selector.js';
import { ypLanguageBehavior } from '../yp-behaviors/yp-language-behavior.js';
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
    ${this.app ? html`
    <paper-material .elevation="0" class="material">
      <div ?hidden="${!this.homeLink}">
        <div class="header layout vertical center-center">
          <iron-icon .icon="home" @tap="${this._goBack}"></iron-icon>
          <paper-item @tap="${this._goBack}">${this.homeLink.name}</paper-item>
        </div>
      </div>
      <div class="languageSelector layout vertical self-start">
        <yp-language-selector class="languageSelector"></yp-language-selector>
      </div>
      <div class="layout vertical" ?hidden="${!this.user}">
        <div ?hidden="">
          <div class="header">${this.t('myDomains')}</div>
          <template is="dom-repeat" .items="${this.myDomains}" as="domain">
            <paper-item data-args="${this.domain.id}" @tap="${this._goToDomain}">${this.domain.name}</paper-item>
          </template>
        </div>

        <div ?hidden="${!this.myAdminCommunities}">
          <div class="header">${this.t('myAdminCommunities')}</div>
          <template is="dom-repeat" items="${this.myAdminCommunities}" as="community">
            <div class="layout horizontal">
              <paper-item data-args="${this.community.id}" @tap="${this._goToCommunity}">${this.community.name}</paper-item>
            </div>
          </template>
        </div>

        <div ?hidden="${!this.myAdminGroups}">
          <div class="header">${this.t('myAdminGroups')}</div>
          <template is="dom-repeat" items="${this.myAdminGroups}" as="group">
            <paper-item data-args="${this.group.id}" @tap="${this._goToGroup}">${this.group.name}</paper-item>
          </template>
        </div>

        <div class="header">${this.t('myCommunities')}</div>
        <template is="dom-repeat" .items="${this.myCommunities}" as="community">
          <div class="layout horizontal">
            <paper-item data-args="${this.community.id}" @tap="${this._goToCommunity}">${this.community.name}</paper-item>
          </div>
        </template>

        <div class="header">${this.t('myGroups')}</div>
        <template is="dom-repeat" items="${this.myGroups}" as="group">
          <paper-item data-args="${this.group.id}" @tap="${this._goToGroup}">${this.group.name}</paper-item>
        </template>
      </div>
    </paper-material>
    <lite-signal @lite-signal-got-memberships="${this._userMembershipsReady}"></lite-signal>
    <lite-signal @lite-signal-got-admin-rights="${this._reset}"></lite-signal>
` : html``}
`  
  }

/*
  behaviors: [
    ypLanguageBehavior,
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
      var groupUsers = __.reject(window.appUser.memberships.GroupUsers, function (item) {
        return item.name=="hidden_public_group_for_domain_level_points";
      });
      this.set('myGroups', __.take(groupUsers, 1000));
      this.set('myCommunities', __.take(window.appUser.memberships.CommunityUsers, 500));
      this.set('myDomains', __.take(window.appUser.memberships.DomainUsers, 3));
    } else {
      this.set('myGroups', null);
      this.set('myCommunities', null);
      this.set('myDomains', null);
    }

    if (window.appUser && window.appUser.adminRights &&
        window.appUser.adminRights.CommunityAdmins && window.appUser.adminRights.CommunityAdmins.length>0) {
      this.set('myAdminCommunities', window.appUser.adminRights.CommunityAdmins);
    } else {
      this.set('myAdminCommunities', null);
    }

    if (window.appUser && window.appUser.adminRights &&
      window.appUser.adminRights.GroupAdmins && window.appUser.adminRights.GroupAdmins.length>0) {
      var groupAdmins = __.reject(window.appUser.adminRights.GroupAdmins, function (item) {
        return item.name=="hidden_public_group_for_domain_level_points";
      });
      this.set('myAdminGroups', groupAdmins);
    } else {
      this.set('myAdminGroups', null);
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