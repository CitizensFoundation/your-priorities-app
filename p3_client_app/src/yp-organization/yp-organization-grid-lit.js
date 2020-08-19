import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-image/iron-image.js';
import 'lite-signal/lite-signal.js';
import '@polymer/iron-list/iron-list.js';
import '@polymer/paper-fab/paper-fab.js';
import '@material/mwc-button';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-input/paper-textarea.js';
import '@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js';
import '../yp-ajax/yp-ajax.js';
import { WordWrap } from '../yp-behaviors/word-wrap.js';
import { ypMediaFormatsBehavior } from '../yp-behaviors/yp-media-formats-behavior.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { dom } from '@polymer/polymer/lib/legacy/polymer.dom.js';
import { YpBaseElement } from '../yp-base-element.js';

class YpOrganizationGridLit extends YpBaseElement {
  static get properties() {
    return {
      organizations: {
        type: Array,
        notify: true
      },

      availableOrganizations: {
        type: Array
      },

      headerText: {
        type: String
      },

      selected: {
        type: Object
      }
    }
  }

  static get styles() {
    return [
      css`

      #dialog {
        width: 90%;
        max-height: 90%;
        background-color: #FFF;
      }

      iron-list {
        color: #000;
        height: 500px;
        width: 100%;
      }

      .pageItem {
        padding-right: 16px;
      }

      .id {
        width: 60px;
      }

      .title {
        width: 200px;
      }

      .email {
        width: 240px;
      }

      #editPageLocale {
        width: 80%;
        max-height: 80%;
        background-color: #FFF;
      }

      .locale {
        width: 30px;
        cursor: pointer;
      }

      paper-textarea {
        height: 60%;
      }

      .localeInput {
        width: 26px;
      }

      .pageItem {
        padding-top: 8px;
      }

      [hidden] {
        display: none !important;
      }
  `,YpFlexLayout]
  }

  render() {
    return html`
    <paper-dialog id="selectOrganizationDialog" .modal>
      <h2>${this.t('users.selectOrganization')}</h2>
      <paper-dialog-scrollable>
        <paper-listbox>

          ${ this.availableOrganizations.map(item => html`
           <paper-item @tap="${this._selectOrganization}" id="${item.id}">${item.name}</paper-item>
          `)}

        </paper-listbox>
      </paper-dialog-scrollable>

      <div class="buttons">
        <mwc-button .dialogDismiss .label="${this.t('Close')}"></mwc-button>
      </div>
    </paper-dialog>

    <paper-dialog id="dialog">
      <h2>${this.headerText}</h2>
      <paper-dialog-scrollable>
        <iron-list .items="${this.availableOrganizations}" as="organization">
          <template>
            <div class="layout horizontal">
              <div class="pageItem id">
                ${this.organization.name}
              </div>
              <div class="pageItem title">
                ${this._organizationImageUrl(organization)}
              </div>
              <mwc-button data-args="${this.organization}" @click="${this._editOrganization}" .label="${this.t('update')}"></mwc-button>
            </div>
          </template>
        </iron-list>

        <iron-list .items="${this.users}" as="user">
          <template>
            <div class="layout horizontal">
              <div class="userItem id">
                ${this.user.id}
              </div>
              <div class="userItem name">
                ${this.user.name}
              </div>
              <div class="userItem email">
                ${this.user.email}
              </div>

              ${ !this._userOrganizationName(user) ? html`
                <div class="organization">
                  <mwc-button data-args="${this.user.id}" @click="${this._addToOrganization}" .label="${this.t('users.addToOrganization')}"></mwc-button>
                </div>
              ` : html``}

              <div class="organization" ?hidden="${!this._userOrganizationName(user)}">
                <div class="organizationName">
                  ${this._userOrganizationName(user)}
                </div>
                <mwc-button data-args="${this.user.id}" data-args-org="${this._userOrganizationId(user)}" @click="${this._removeFromOrganization}" .label="${this.t('users.removeFromOrganization')}"></mwc-button>
              </div>
            </div>
          </template>
        </iron-list>
      </paper-dialog-scrollable>

      <div class="buttons">
        <mwc-button .dialogDismiss .label="${this.t('close')}"></mwc-button>
      </div>
    </paper-dialog>

    <div class="layout horizontal center-center">
      <yp-ajax .method="DELETE" id="removeOrganizationAjax" @response="_removeOrganizationResponse"></yp-ajax>
      <yp-ajax .method="POST" id="addOrganizationAjax" @response="_addOrganizationResponse"></yp-ajax>
    </div>
    `
  }

  /*
  behaviors: [
    WordWrap,
    ypMediaFormatsBehavior
  ],
*/

  _newOrganization() {
    dom(document).querySelector('yp-app').getDialogAsync("organizationEdit", function (dialog) {
      dialog.setup(null, true, null);
      dialog.open('new', {});
    }.bind(this));
  }

  _editOrganization(event) {
    const organization = JSON.parse(event.target.getAttribute('data-args'));
    dom(document).querySelector('yp-app').getDialogAsync("organizationEdit", function (dialog) {
      dialog._clear();
      dialog.setup(organization, false, null);
      dialog.open('edit', {organizationId: organization.id});
    }.bind(this));
  }

  _organizationImageUrl(organization) {
    if (organization.OrganizationLogoImages) {
      return this.getImageFormatUrl(organization.OrganizationLogoImages, 2);
    } else {
      return null;
    }
  }

  _availableOrganizations() {
    if (window.appUser.adminRights && window.appUser.adminRights.OrganizationAdmins) {
      return  window.appUser.adminRights.OrganizationAdmins;
    } else {
      return [];
    }
  }

  _addToOrganization(event) {
    this.userIdForSelectingOrganization = event.target.getAttribute('data-args');
    this.$$("#selectOrganizationDialog").open();
  }

  _removeFromOrganization(event) {
    const userId = event.target.getAttribute('data-args');
    const organizationId = event.target.getAttribute('data-args-org');
    this.$$("#removeOrganizationAjax").body = {};
    this.$$("#removeOrganizationAjax").url = "/api/organizations/" + organizationId + "/" + userId + "/remove_user";
    this.$$("#removeOrganizationAjax").generateRequest();
  }

  _selectOrganization(event, detail) {
    this.$$("#addOrganizationAjax").body = {};
    this.$$("#addOrganizationAjax").url = "/api/organizations/" + event.target.id + "/" + this.userIdForSelectingOrganization + "/add_user";
    this.$$("#addOrganizationAjax").generateRequest();
    this.$$("#selectOrganizationDialog").close();
  }

  _addOrganizationResponse(event, detail) {
    window.appGlobals.notifyUserViaToast(this.t('users.organizationUserAdded')+' '+ detail.response.email);
    this.$$("#ajax").generateRequest();
  }

  _removeOrganizationResponse(event, detail) {
    window.appGlobals.notifyUserViaToast(this.t('users.organizationUserRemoved')+' '+ detail.response.email);
    this.$$("#ajax").generateRequest();
  }

  open() {
    this.availableOrganizations = this._availableOrganizations();
    this.$$("#dialog").open();
  }
}

window.customElements.define('yp-organization-grid-lit', YpOrganizationGridLit)
