import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-image/iron-image.js';
import 'lite-signal/lite-signal.js';
import '@polymer/paper-fab/paper-fab.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import './yp-user-image.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { dom } from '@polymer/polymer/lib/legacy/polymer.dom.js';
import { YpBaseElement } from '../yp-base-element.js';

class YpUserInfoLit extends YpBaseElement {
  static get properties() {
    return {
      user: {
        type: Object,
        value: null,
        notify: true
      }
    }
  }

  static get styles() {
    return [
      css`

      :host {
        display: block;
      }

      .avatar-container {
        position: relative;
        border: 2px solid #FF9800;
        border-radius: 50%;
        height: 90px;
        padding: 2px;
        width: 90px;
        margin: 20px auto;
      }

      .contact-info {
        margin: 0 20px;
        padding-bottom: 4px;
        text-align: center;
      }

      .contact-info .name {
        font-weight: bold;
      }

      .contact-info .email {
        color: #999;
      }

      .buttons {
        margin-top: 8px;
      }

      .hasPointer {
        cursor: pointer;
      }
      paper-button {
        margin-top: 12px;
        margin-bottom: 8px;
      }
    `, YpFlexLayout]
  }

  render() {
    return html`
    <lite-signal @lite-signal-yp-language="${this._languageEvent}"></lite-signal>
    ${ this.user ? html`
      <div class="mainContainer">
        <div class="avatar-container">
          <yp-user-image class="hasPointer" large .user="${this.user}" @tap="${this._openEdit}"></yp-user-image>
        </div>
        <div class="contact-info">
          <div class="name">${this.user.name}</div>
          <div class="email">${this.user.email}</div>
          <div class="layout vertical center-justified buttons">
            <paper-button raised .icon="create" .title="${this.t('user.edit')}" @tap="${this._openEdit}">${this.t('user.edit')}</paper-button>
            <paper-button raised .icon="create" .title="${this.t('myContent')}" @tap="${this._openAllContentModeration}">${this.t('myContent')}</paper-button>
            <paper-button raised .icon="input" .title="${this.t('user.logout')}" @tap="${this._logout}">${this.t('user.logout')}</paper-button>
          </div>
        </div>
      </div>
    ` : html``}
    `
  }

  _openAllContentModeration() {
    window.appGlobals.activity('open', 'userAllContentModeration');
    dom(document).querySelector('yp-app').getContentModerationAsync(function (dialog) {
      dialog.setup(null, null, null, '/moderate_all_content', this.user.id);
      dialog.open(this.user.name);
    }.bind(this));
  }

  _openEdit() {
    this.fire('open-user-edit');
  }

  _logout() {
    window.appUser.logout();
  }
}

window.customElements.define('yp-user-info-lit', YpUserInfoLit)
