import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import '@polymer/iron-icon/iron-icon.js';
import '../yp-app-globals/yp-app-icons.js';
import { ypRemoveClassBehavior } from '../yp-behaviors/yp-remove-class-behavior.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { YpBaseElement } from '../yp-base-element.js';
import { YpFlexLayout } from '../yp-flex-layout.js';

class YpMembershipButtonLit extends YpBaseElement {
  static get properties() {
    return {
      community: {
        type: Object,
        observer: "_communityChanged"
      },

      group: {
        type: Object,
        observer: "_groupChanged"
      },

      membershipValue: {
        type: Boolean,
        value: false
      },

      disabled: {
        type: Boolean,
        value: false
      },

      large: {
        type: Boolean,
        value: false
      }
    }
  }

  static get styles() {
    return [
      css`

      :host {
        background-color: transparent;
      }

      paper-fab {
        background-color: #999;
        color: #FFF;
        --paper-fab-iron-icon: {
          color: #fff;
        };
      }

      .heartButton {
        color: #999;
        cursor: pointer;
        width: 36px;
        height: 36px;
      }

      .member {
        background-color: var(--accent-color);
      }

      [hidden] {
        display: none !important;
      }
    `, YpFlexLayout]
  }

  render() {
    return html`
    <paper-fab .mini="" .elevation="5" id="button" .title="${this.t('toggleMembership')}" @tap="${this._toggleMembership}" ?disabled="${this.disabled}" class="heartButton" .icon="favorite"></paper-fab>
    <yp-ajax class="ajax" id="membershipAjax" ?hidden="${this.disabled}" .method="POST" @response="${this._membershipResponse}"></yp-ajax>

    <lite-signal @lite-signal-got-memberships="${this._updateMembershipFromSignal}"></lite-signal>
    `
  }

/*
  behaviors: [
    ypRemoveClassBehavior
  ],
*/

  _communityChanged(community) {
    if (community) {
      this._updateMembership();
    }
  }

  _groupChanged(group) {
    if (group) {
      this._updateMembership();
    }
  }

  _updateMembershipFromSignal() {
    this._updateMembership();type
  }

  _updateMembership() {
    if (window.appUser && window.appUser.loggedIn() && window.appUser.membershipsIndex) {
      if (this.community) {
        this.membershipValue = window.appUser.membershipsIndex.communities[this.community.id];
      } else if (this.group) {
        this.membershipValue = window.appUser.membershipsIndex.groups[this.group.id];
      } else {
        this.membershipValue = false;
      }
    } else {
      this.membershipValue = false;
    }
    this._resetClasses();
  }

  _resetClasses() {
    if (this.membershipValue) {
      this.$$("#button").className += " " + "member";
    } else {
      this.removeClass(this.$$("#button"), "member");
    }
  }

  _membershipResponse(event, detail) {
    this.disabled = false;
    this.membershipValue = detail.response.membershipValue;
    if (this.membershipValue) {
      window.appGlobals.notifyUserViaToast(this.t('membership.joined')+ " " + detail.response.name);
    } else {
      window.appGlobals.notifyUserViaToast(this.t('membership.left')+ " " + detail.response.name);
    }
    this._resetClasses();
    if (detail.response.membershipValue===true) {
      if (this.community) {
        window.appUser.membershipsIndex.communities[this.community.id] = true;
      } else if (this.group) {
        window.appUser.membershipsIndex.groups[this.group.id] = true;
      }
    } else {
      if (this.community) {
        window.appUser.membershipsIndex.communities[this.community.id] = null;
      } else if (this.group) {
        window.appUser.membershipsIndex.groups[this.group.id] = null;
      }
    }
  }

  generateMembershipFromLogin(value) {
    if (this.community) {
      if (!window.appUser.membershipsIndex.communities[this.community.id]) {
        this.generateMembership(value);
      }
    } else if (this.group) {
      if (!window.appUser.membershipsIndex.groups[this.group.id]) {
        this.generateMembership(value);
      }
    }
  }

  _toggleMembership() {
    if (this.community) {
      window.appGlobals.activity('clicked', 'toggleCommunityMembership', this.community.id);
    } else if (this.group) {
      window.appGlobals.activity('clicked', 'toggleGroupMembership', this.group.id);
    }
    this.generateMembership(!this.membershipValue)
  }

  generateMembership(value) {
    this.disabled = true;
    if (window.appUser.loggedIn()===true) {
      if (this.community) {
        this.$$("#membershipAjax").url = "/api/communities/" + this.community.id + "/user_membership";
      } else if (this.group) {
        this.$$("#membershipAjax").url = "/api/groups/" + this.group.id + "/user_membership";
      }
      this.$$("#membershipAjax").body = { value: value };

      if (value) {
        this.$$("#membershipAjax").method = "POST";
      } else {
        this.$$("#membershipAjax").method = "DELETE";
      }
      this.$$("#membershipAjax").generateRequest();
    } else {
      this.disabled = false;
      window.appUser.loginForMembership(this, { value: value } );
    }
  }
}

window.customElements.define('yp-membership-button-lit', YpMembershipButtonLit)