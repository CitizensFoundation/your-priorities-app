import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-image/iron-image.js';
import 'lite-signal/lite-signal.js';
import '@polymer/iron-pages/iron-pages.js';
import '@polymer/paper-fab/paper-fab.js';
import '@polymer/paper-tabs/paper-tabs.js';
import '@polymer/paper-tabs/paper-tab.js';
import '@material/mwc-button';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-input/paper-textarea.js';
import '@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js';
import '@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import '@polymer/paper-listbox/paper-listbox.js';
import { AccessHelpers } from '../yp-behaviors/access-helpers.js';
import { ypOfficialStatusOptions } from '../yp-behaviors/yp-official-status-options.js';
import '../yp-ajax/yp-ajax.js';
import { WordWrap } from '../yp-behaviors/word-wrap.js';
import { ypPostMoveBehavior } from '../yp-post/yp-post-move-behavior.js';
import './yp-bulk-status-update-templates.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { dom } from '@polymer/polymer/lib/legacy/polymer.dom.js';
import { YpBaseElement } from '../yp-base-element.js';
import { YpFlexLayout } from '../yp-flex-layout.js';
import { render } from 'pug';

class YpBulkStatusUpdateConfigLit extends YpBaseElement {
  static get properties() {
    return {
      bulkStatusUpdates: {
        type: Array,
        notify: true
      },

      templates: {
        type: Array,
        notify: true
      },

      communityId: Number,

      headerText: {
        type: String
      },

      selected: {
        type: Object
      },

      config: {
        type: Object,
        observer: '_configChanged'
      },

      haveGotMoveGroups: {
        type: Boolean,
        value: false
      },

      selectedGroup: String,

      closeAfterSave: {
        type: Boolean,
        value: false
      },

      templatesWithNone: {
        type: Array,
        computed: '_templatesWithNone(templates)'
      }
    }
  }

  static get styles() {
    return [
      css`

      #dialog {
        width: 100%;
        max-height: 100%;
        background-color: #f0f0f0;
      }

      .postsList {
        color: #000;
        height: 800px;
        width: 100%;
        overflow: auto;
      }

      .pageItem {
        padding-right: 16px;
      }

      .postOfficialStatus {
        width: 100px;
      }

      .postName {
        max-width: 600px;
        font-size: 18px;
        padding-right: 8px;
      }

      .groupName {
        width: 100%;
        border-bottom: 1px dashed;
        margin-bottom: 16px;
        font-size: 22px;
      }

      .postIgnore {
        width: 90px;
      }

      .postDropdown {
        width: 150px;
        margin: 16px;
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
        height: 200px;
        max-height: 220px;
        overflow: auto;
      }

      .localeInput {
        width: 26px;
      }

      .pageItem {
        padding-top: 8px;
      }

      paper-listbox {
        z-index: 100;
      }

      .dropdown-content {
        z-index: 1000;
      }

      paper-item {
        z-index: 10000;
      }

      .postUniqueMessage {
        width: 300px;
      }

      a {
        color: #333;
      }

      paper-material {
        margin: 16px;
        padding: 24px;
        background-color: #FFF;
      }

      .postItem {
        height: 300px;
        min-height: 300px;
      }

      paper-tab {
        font-size: 14px;
      }

      .id {
        width: 60px;
        font-size: 18px;
      }

      paper-listbox {
        max-height: 220px;
      }
    `, YpFlexLayout]
  }

  render() {
    return html`
    <paper-dialog id="dialog" modal>
      <h2>${this.t('bulkStatusUdateConfig')}</h2>
      <paper-dialog-scrollable>
        <div class="layout horizontal wrap">
          <paper-tabs .selected="${this.selectedGroup}" .attrForSelected="name">
            ${ this.config.groups .map(group => html`
              <paper-tab .name="${this.group.name}">${this._getHeadGroupName(group.name)}</paper-tab>
            `)}
          </paper-tabs>
        </div>
        <iron-pages .attrForSelected="name" .selected="${this.selectedGroup}">

          ${ this.config.group.map(group => html`
            <section .name="${this.group.name}">
              <div class="layout vertical postsList">
                ${ this._selectedGroup(selectedGroup, group.name) ? html`
                  ${ this._orderPosts(group.posts).map(post => html`
                    <div class="layout horizontal postItem">
                      <paper-material .elevation="2" class="layout horizontal">
                        <div class="layout vertical">
                          <div class="layout horizontal">
                          <div class="id">${this.post.id}</div>
                            <div class="postName">
                              <a target="_blank" href="/post/${this.post.id}">${this.post.name}</a>
                            </div>
                            <div class="postOfficialStatus">
                              ${this._officialStatusOptionsName(post.currentOfficialStatus)}
                            </div>
                          </div>
                          <div class="layout horizontal">
                            <div class="postDropdown">
                              <paper-dropdown-menu .label="${this.t('post.statusChangeSelectNewStatus')}">
                                <paper-listbox slot="dropdown-content" attrForSelected="name" data-args="${this.post}" .selected="${this.post.newOfficialStatus}" @iron-select="${this._selectNewOfficialStatus}">
                                  ${ this.officialStatusOptions.map(group => html`
                                    <paper-item .name="${this.statusOption.official_value}">${this.statusOption.translatedName}</paper-item>
                                  `)}
                                </paper-listbox>
                              </paper-dropdown-menu>
                            </div>
                            <div class="postDropdown">
                              <paper-dropdown-menu .label="${this.t('moveToGroup')}">
                                <paper-listbox slot="dropdown-content" attrForSelected="name" data-args="${this.post}" .selected="${this.post.moveToGroupId}">
                                  ${ this.templatesWithNone .map(statusOption => html`
                                    <paper-item .name="${this.templateOption.title}">${this.templateOption.title}</paper-item>
                                  `)}
                                </paper-listbox>
                              </paper-dropdown-menu>
                            </div>
                            <div class="postDropdown">
                              <paper-dropdown-menu .label="${this.t('moveToGroup')}">
                                <paper-listbox slot="dropdown-content" attrForSelected="name" data-args="${this.post}" .selected="${this.post.moveToGroupId}">
                                  ${ this.availableGroups.map(group => html`
                                    <paper-item .name="${this.group.id}">${this.group.name}</paper-item>
                                  `)}
                                </paper-listbox>
                              </paper-dropdown-menu>
                            </div>
                            <div class="postUniqueMessage">
                              <paper-textarea id="emailFooter" .name="emailFooter" .alwaysFloatLabel="${this.post.uniqueStatusMessage}" .value="${this.post.uniqueStatusMessage}" .label="${this.t('uniqueStatusMessage')}" .rows="4" .maxRows="4" .maxlength="30000" class="mainInput">
                              </paper-textarea>
                            </div>
                          </div>
                        </div>
                      </paper-material>
                    </div>
                  `)}
                ` : html``}
              </div>
            </section>
          `)}
        </iron-pages>

        <div class="layout horizontal center-center">
          <yp-ajax .method="GET" id="getAvailableGroupsAjax" url="/api/users/available/groups" @response="${this._getGroupsResponse}"></yp-ajax>
          <yp-ajax .method="PUT" id="updateConfigAjax" url="/api/bulk_status_updates/[[bulkStatusUpdate.community_id]]/[[bulkStatusUpdate.id]]/updateConfig" @response="${this._updateConfigResponse}"></yp-ajax>
          <yp-ajax .method="GET" id="getBulkStatusUpdatesAjax" @response="${this._bulkStatusUpdateResponse}"></yp-ajax>
        </div>
      </paper-dialog-scrollable>
      <div class="buttons">
        <mwc-button @click="${this._saveAndClose}" .label="${this.t('close')}"></mwc-button>
        <mwc-button @click="${this._editTemplates}" .label="${this.t('editTemplates')}"></mwc-button>
        <mwc-button @click="${this._save}" .label="${this.t('save')}"></mwc-button>
      </div>

    </paper-dialog>
`
  }

/*
  behaviors: [
    AccessHelpers,
    WordWrap,
    ypOfficialStatusOptions,
    ypPostMoveBehavior
  ],
*/

  _getGroupsResponse(event, detail) {
    if (detail.response) {
      const groups = [];
      groups = groups.concat(window.appUser.adminRights.GroupAdmins, window.appUser.memberships.GroupUsers);
      groups = groups.concat(detail.response.groups);
      groups = this._uniqueInDomain(groups, detail.response.domainId);
      //this.set("availableGroups", groups);
    }
  }

  _templatesWithNone(templates) {
    if (templates) {
      return this.templates.concat(['None']);
    } else {
      return ['None'];
    }
  }

  _onIronResize(e) {
    e.stopImmediatePropagation();
  }

  _getHeadGroupName(name) {
    if (name)
      return name.split(' ')[0];
    else
      return "";
  }

  _selectedGroup(selectedGroup, currentGroup) {
    console.log(selectedGroup+" - "+currentGroup);
    return selectedGroup == currentGroup;
  }

  reset() {
    this.config = null;
    this.templates = null;
    this.bulkStatusUpdates = null;
  }

/*
  observers: [
    '_templatesChanged(templates.*)',
    '_groupsChanged(config.*)'
  ],
*/

  _saveAndClose() {
    this.closeAfterSave = true;
    this._save();
  }

  _orderPosts(posts) {
    return posts.sort(function (a, b) {
      return a.id-b.id;
    });
  }

  _updatedTemplates(event, detail) {
    this.templates = detail;
    this.$$("#updateConfigAjax").body = { configValue: this.templates, configName: 'templates' };
    this.$$("#updateConfigAjax").generateRequest();
  }

  _templatesChanged(change) {
  }

  _groupsChanged(change) {
  }

  _save() {
    this.$$("#updateConfigAjax").body = { configValue: this.config, configName: 'config' };
    this.$$("#updateConfigAjax").generateRequest();
  }

  _selectNewOfficialStatus(event, detail) {
    let newOfficialStatus = detail.item.name;
    const post = JSON.parse(event.target.getAttribute('data-args'));
    const configCopy = JSON.parse(JSON.stringify(this.config));
    this.config.groups.forEach(function (group, groupIndex) {
      group.posts.forEach(function (inPost, postIndex) {
        if (post.id == inPost.id) {
          configCopy.groups[groupIndex].posts[postIndex].newOfficialStatus = newOfficialStatus;
        }
      }.bind(this));
    }.bind(this));
    this.config = configCopy;
  }

  _configChanged(config) {
    if (config && !this.haveGotMoveGroups) {
      this.$$("#getAvailableGroupsAjax").generateRequest();
      this.haveGotMoveGroups = true;
    }
  }

  _updateConfigResponse() {
    window.appGlobals.notifyUserViaToast(this.t('saved'));
    if (this.closeAfterSave) {
      this.closeAfterSave = false;
      this.$$("#dialog").close();
    }
  }

  _newBulkStatusUpdate() {
    dom(document).querySelector('yp-app').getDialogAsync("bulkStatusUpdateEdit", function (dialog) {
      dialog.setup(null, true, null);
      dialog.open('new', {});
    });
  }

  _editBulkStatusUpdate(event) {
    let bulkStatusUpdate = JSON.parse(event.target.getAttribute('data-args'));
    dom(document).querySelector('yp-app').getDialogAsync("bulkStatusUpdateEdit", function (dialog) {
      dialog._clear();
      dialog.setup(bulkStatusUpdate, false, null);
      dialog.open('edit', {bulkStatusUpdateId: bulkStatusUpdate.id});
    });
  }

  _editTemplates() {
    dom(document).querySelector('yp-app').getDialogAsync("bulkStatusUpdateEditTemplates", function (dialog) {
      dialog.open(this.templates);
    }.bind(this));
  }

  open(bulkStatusUpdate) {
    this.config = bulkStatusUpdate.config;
    this.templates = bulkStatusUpdate.templates;
    this.bulkStatusUpdate = bulkStatusUpdate;
    this.$$("#dialog").open();
  }
}


window.customElements.define('yp-bulk-status-update-config-lit', YpBulkStatusUpdateConfigLit)