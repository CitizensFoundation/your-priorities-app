import '@polymer/iron-image/iron-image.js';
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
import { IronAjaxElement } from '@polymer/iron-ajax';
import { LitElement, css, html, nothing } from 'lit';
import { property, customElement } from 'lit/decorators.js';

import { YpBaseElement } from '../@yrpri/common/yp-base-element';
import { YpImage } from '../@yrpri/common/yp-image';
import { YpFormattingHelpers } from '../@yrpri/common/YpFormattingHelpers';
import { YpMediaHelpers } from '../@yrpri/common/YpMediaHelpers';

import { YpOfficialStatusHelper } from '../@yrpri/common/YpOfficialStatusHelper';
import { YpThemeManager } from '../@yrpri/yp-app/YpThemeManager';
import { PaperDialogElement } from '@polymer/paper-dialog';

@customElement('yp-bulk-status-update-config')
export class YpBulkStatusUpdateConfig extends YpBaseElement {
  @property({ type: Array })
  templates: Array<YpBulkStatusUpdateTemplatesData> | undefined;

  @property({ type: Number })
  communityId: number | undefined;

  @property({ type: String })
  headerText: string | undefined;

  @property({ type: Object })
  config: YpBulkStatusUpdateConfigData | undefined;

  @property({ type: Boolean })
  haveGotMoveGroups = false;

  @property({ type: String })
  selectedGroup: string | undefined;

  @property({ type: Boolean })
  closeAfterSave = false;

  updated(changedProperties: Map<string | number | symbol, unknown>): void {
    super.updated(changedProperties);

    if (changedProperties.has('config')) {
      this._configChanged();
    }
  }

  static get styles() {
    return [
      super.styles,
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
          background-color: #fff;
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
          background-color: #fff;
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
      `,
    ];
  }

  render() {
    return html`
      <paper-dialog id="dialog" modal>
        <h2>${this.t('bulkStatusUdateConfig')}</h2>
        <paper-dialog-scrollable>
          <div class="layout horizontal wrap">
            <paper-tabs
              .selected="${this.selectedGroup}"
              attrForSelected="name"
            >
              ${this.config ? this.config.groups.map(
                group => html`
                  <paper-tab .name="${group.name}"
                    >${this._getHeadGroupName(group.name)}</paper-tab
                  >
                `
              ) : nothing}
            </paper-tabs>
          </div>
          <iron-pages attrForSelected="name" .selected="${this.selectedGroup}">
            ${this.config
              ? html`
                  ${this.config.groups.map(
                    group => html`
                      <section .name="${group.name}">
                        <div class="layout vertical postsList">
                          ${this._selectedGroup(this.selectedGroup, group.name)
                            ? html`
                                ${this._orderPosts(group.posts).map(
                                  post => html`
                                    <div class="layout horizontal postItem">
                                      <paper-material
                                        elevation="2"
                                        class="layout horizontal"
                                      >
                                        <div class="layout vertical">
                                          <div class="layout horizontal">
                                            <div class="id">${post.id}</div>
                                            <div class="postName">
                                              <a
                                                target="_blank"
                                                href="/post/${post.id}"
                                                >${post.name}</a
                                              >
                                            </div>
                                            <div class="postOfficialStatus">
                                              ${this._officialStatusOptionsName(
                                                post.currentOfficialStatus
                                              )}
                                            </div>
                                          </div>
                                          <div class="layout horizontal">
                                            <div class="postDropdown">
                                              <paper-dropdown-menu
                                                .label="${this.t(
                                                  'post.statusChangeSelectNewStatus'
                                                )}"
                                              >
                                                <paper-listbox
                                                  slot="dropdown-content"
                                                  attrForSelected="name"
                                                  data-args="${post}"
                                                  .selected="${post.newOfficialStatus}"
                                                  @iron-select="${this
                                                    ._selectNewOfficialStatus}"
                                                >
                                                  ${this.officialStatusOptions.map(
                                                    statusOption => html`
                                                      <paper-item
                                                        .name="${statusOption
                                                          .official_value}"
                                                        >${statusOption
                                                          .translatedName}</paper-item
                                                      >
                                                    `
                                                  )}
                                                </paper-listbox>
                                              </paper-dropdown-menu>
                                            </div>
                                            <div class="postDropdown">
                                              <paper-dropdown-menu
                                                .label="${this.t(
                                                  'moveToGroup'
                                                )}"
                                              >
                                                <paper-listbox
                                                  slot="dropdown-content"
                                                  attrForSelected="name"
                                                  data-args="${post}"
                                                  ?selected="${post.moveToGroupId !=
                                                  null}"
                                                >
                                                  ${this.templatesWithNone.map(
                                                    templateOption => html`
                                                      <paper-item
                                                        .name="${templateOption
                                                          .title}"
                                                        >${templateOption
                                                          .title}</paper-item
                                                      >
                                                    `
                                                  )}
                                                </paper-listbox>
                                              </paper-dropdown-menu>
                                            </div>
                                            <div class="postDropdown">
                                              <paper-dropdown-menu
                                                .label="${this.t(
                                                  'moveToGroup'
                                                )}"
                                              >
                                                <paper-listbox
                                                  slot="dropdown-content"
                                                  attrForSelected="name"
                                                  data-args="${post}"
                                                  .selected="${post.moveToGroupId}"
                                                >
                                                  ${this.availableGroups.map(
                                                    group => html`
                                                      <paper-item
                                                        .name="${group.id}"
                                                        >${group.name}</paper-item
                                                      >
                                                    `
                                                  )}
                                                </paper-listbox>
                                              </paper-dropdown-menu>
                                            </div>
                                            <div class="postUniqueMessage">
                                              <paper-textarea
                                                id="emailFooter"
                                                name="emailFooter"
                                                ?alwaysFloatLabel="${post.uniqueStatusMessage !=
                                                null}"
                                                .value="${post.uniqueStatusMessage}"
                                                .label="${this.t(
                                                  'uniqueStatusMessage'
                                                )}"
                                                rows="4"
                                                maxRows="4"
                                                maxlength="30000"
                                                class="mainInput"
                                              >
                                              </paper-textarea>
                                            </div>
                                          </div>
                                        </div>
                                      </paper-material>
                                    </div>
                                  `
                                )}
                              `
                            : html``}
                        </div>
                      </section>
                    `
                  )}
                `
              : nothing}
          </iron-pages>

          <div class="layout horizontal center-center">
            <iron-ajax
              method="GET"
              id="getAvailableGroupsAjax"
              url="/api/users/available/groups"
              @response="${this._getGroupsResponse}"
            ></iron-ajax>
            <iron-ajax
              method="PUT"
              id="updateConfigAjax"
              url="/api/bulk_status_updates/[[bulkStatusUpdate.community_id]]/[[bulkStatusUpdate.id]]/updateConfig"
              @response="${this._updateConfigResponse}"
            ></iron-ajax>
          </div>
        </paper-dialog-scrollable>
        <div class="buttons">
          <mwc-button
            @click="${this._saveAndClose}"
            .label="${this.t('close')}"
          ></mwc-button>
          <mwc-button
            @click="${this._editTemplates}"
            .label="${this.t('editTemplates')}"
          ></mwc-button>
          <mwc-button
            @click="${this._save}"
            .label="${this.t('save')}"
          ></mwc-button>
        </div>
      </paper-dialog>
    `;
  }

  /*
  behaviors: [
    AccessHelpers,
    WordWrap,
    ypOfficialStatusOptions,
    ypPostMoveBehavior
  ],
*/

  _getGroupsResponse(event: CustomEvent) {
    if (event.detail.response) {
      let groups: Array<any> = [];
      groups = groups.concat(
        window.appUser!.adminRights!.GroupAdmins,
        window.appUser!.memberships!.GroupUsers
      );
      groups = groups.concat(event.detail.response.groups);
      groups = this._uniqueInDomain(groups, event.detail.response.domainId);
      //this.set("availableGroups", groups);
    }
  }

  get templatesWithNone() {
    if (this.templates) {
      return this.templates.concat([{title: 'None', posts: [], content: '' }]);
    } else {
      return [{title: 'None', posts: [], content: '' }];
    }
  }

  _onIronResize(event: CustomEvent) {
    event.stopImmediatePropagation();
  }

  _getHeadGroupName(name: string) {
    if (name) return name.split(' ')[0];
    else return '';
  }

  _selectedGroup(selectedGroup: string, currentGroup: string) {
    console.log(selectedGroup + ' - ' + currentGroup);
    return selectedGroup == currentGroup;
  }

  reset() {
    this.config = undefined;
    this.templates = undefined;
  }

  _saveAndClose() {
    this.closeAfterSave = true;
    this._save();
  }

  _orderPosts(posts: Array<YpStatusUpdatePostData>) {
    return posts.sort((a, b) => {
      return a.id - b.id;
    });
  }

  _updatedTemplates(event: CustomEvent) {
    this.templates = event.detail;
    (this.$$('#updateConfigAjax') as IronAjaxElement).body = {
      configValue: this.templates,
      configName: 'templates',
    };
    (this.$$('#updateConfigAjax') as IronAjaxElement).generateRequest();
  }

  _save() {
    (this.$$('#updateConfigAjax') as IronAjaxElement).body = {
      configValue: this.config,
      configName: 'config',
    };
    (this.$$('#updateConfigAjax') as IronAjaxElement).generateRequest();
  }

  _selectNewOfficialStatus(event: CustomEvent) {
    let newOfficialStatus = event.detail.item.name;
    const post = JSON.parse((event.target as HTMLElement).getAttribute('data-args') || '[]');
    const configCopy = JSON.parse(JSON.stringify(this.config));
    this.config!.groups.forEach((group, groupIndex) => {
      group.posts.forEach((inPost, postIndex) => {
        if (post.id == inPost.id) {
          configCopy.groups[groupIndex].posts[
            postIndex
          ].newOfficialStatus = newOfficialStatus;
        }
      });
    });
    this.config = configCopy;
  }

  _configChanged() {
    if (this.config && !this.haveGotMoveGroups) {
      (this.$$('#getAvailableGroupsAjax') as IronAjaxElement).generateRequest();
      this.haveGotMoveGroups = true;
    }
  }

  _updateConfigResponse() {
    window.appGlobals.notifyUserViaToast(this.t('saved'));
    if (this.closeAfterSave) {
      this.closeAfterSave = false;
      (this.$$('#dialog') as PaperDialogElement).close();
    }
  }

  _newBulkStatusUpdate() {
    window.appDialogs.getDialogAsync('bulkStatusUpdateEdit', dialog => {
      dialog.setup(null, true, null);
      dialog.open('new', {});
    });
  }

  _editBulkStatusUpdate(event: CustomEvent) {
    let bulkStatusUpdate = JSON.parse(
      (event.target as HTMLElement).getAttribute('data-args') || '[]'
    );
    window.appDialogs.getDialogAsync('bulkStatusUpdateEdit', dialog => {
      dialog._clear();
      dialog.setup(bulkStatusUpdate, false, null);
      dialog.open('edit', { bulkStatusUpdateId: bulkStatusUpdate.id });
    });
  }

  _editTemplates() {
    window.appDialogs.getDialogAsync(
      'bulkStatusUpdateEditTemplates',
      dialog => {
        dialog.open(this.templates);
      }
    );
  }

  open(bulkStatusUpdate: YpStatusUpdateData) {
    this.config = bulkStatusUpdate.config;
    this.templates = bulkStatusUpdate.templates;
    (this.$$('#dialog') as PaperDialogElement).open();
  }
}
