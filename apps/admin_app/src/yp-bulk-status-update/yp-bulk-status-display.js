import { IronAjaxElement } from '@polymer/iron-ajax';
import { LitElement, css, html, nothing } from 'lit';
import { property, customElement } from 'lit/decorators.js';

import { YpBaseElement } from '../@yrpri/common/yp-base-element';
import { YpImage } from '../@yrpri/common/yp-image';
import { YpFormattingHelpers } from '../@yrpri/common/YpFormattingHelpers';
import { YpMediaHelpers } from '../@yrpri/common/YpMediaHelpers';

import { YpOfficialStatusHelper } from '../@yrpri/common/YpOfficialStatusHelper';
import { YpThemeManager } from '../@yrpri/yp-app/YpThemeManager';

@customElement('yp-bulk-status-display')
export class YpBulkStatusDisplay extends YpBaseElement {
  @property({ type: Object })
  config: YpBulkStatusUpdateConfigData | undefined;

  @property({ type: Object })
  templates: Record<string, YpBulkStatusUpdateTemplatesData> | undefined;

  @property({ type: Object })
  community: YpCommunityData | undefined;

  @property({ type: Number })
  statusUpdateId: number | undefined;

  @property({ type: Number })
  userId: number | undefined;

  @property({ type: Boolean })
  hideGroupName = false;

  @property({ type: Boolean })
  byTemplate = false;

  @property({ type: Boolean })
  gotModifiedTemplates = false;

  updated(changedProperties: Map<string | number | symbol, unknown>): void {
    super.updated(changedProperties);

    if (changedProperties.has('community')) {
      this._communityChanged();
    }

    if (
      changedProperties.has('userId') &&
      this.userId &&
      changedProperties.has('statusUpdateId') &&
      this.statusUpdateId
    ) {
      setTimeout(() => {
        (this.$$('#ajax') as IronAjaxElement).generateRequest();
      }, 20);
    }
  }

  static get styles() {
    return [
      super.styles,
      css`
        .statusMaterial {
          background-color: #fff;
          padding: 16px;
          margin: 32px;
          margin-top: 16px;
        }

        a {
          color: #000;
        }

        .detail {
          max-width: 400px;
          margin: 8px;
          padding: 8px;
        }

        .openCloseButton {
          cursor: pointer;
          margin-top: 8px;
        }

        .ideaLink {
          cursor: pointer;
          text-decoration: underline;
        }

        .postName {
          margin-top: 8px;
        }

        .mainHeader {
          margin: 16px;
          margin-bottom: 0;
        }

        .infoText {
          padding-top: 8px;
          padding-right: 8px;
          padding-left: 8px;
        }

        .voteText {
          font-size: 19px;
        }

        .topArea {
          background-color: var(--primary-background-color);
          background-image: var(--top-area-background-image, none);
          height: 300px;
          padding-top: 0;
          margin-top: -24px;
        }

        .headerMaterial {
          padding: 16px;
          background-color: #fcfcfc;
          padding-top: 8px;
          padding-bottom: 24px;
        }

        @media (max-width: 900px) {
          .topArea {
            height: auto;
          }

          .statusMaterial {
            background-color: #fff;
            padding: 16px;
            margin: 16px;
            margin-top: 8px;
          }
        }

        [hidden] {
          display: none !important;
        }

        .templateList {
          background-color: #fff;
          padding: 32px;
        }
      `,
    ];
  }

  render() {
    return html`
      <div class="layout vertical center-center topArea">
        <paper-material
          elevation="5"
          class="headerMaterial layout vertical center-center"
        >
          <h2 class="mainHeader">
            ${this.t('bulkStatusUdateFor')}: ${this.community?.name}
          </h2>
          <div class="infoText">${this.t('bulkStatusUdateForInfo')}</div>
        </paper-material>
      </div>

      ${!this.byTemplate && this.config
        ? html`
            ${this.config.groups.map(
              group => html`
                <paper-material
                  elevation="2"
                  class="statusMaterial layout horizontal center-center wrap"
                >
                  ${this._orderGroupStatuses(group.statuses).map(
                    (status: YpBulkStatusUpdateStatusData) => html`
                      <div class="layout vertical self-start">
                        <h1 ?hidden="${this.hideGroupName}">
                          ${group.name}
                        </h1>
                        <h2>
                          ${YpOfficialStatusHelper.officialStatusOptionsNamePlural(
                            status.official_status, this.t
                          )}
                        </h2>

                        ${status.posts.map(
                          post => html`
                            <div class="layout vertical">
                              <div class="layout horizontal">
                                <iron-icon
                                  class="openCloseButton"
                                  data-args="${post.id}"
                                  icon="keyboard-arrow-right"
                                  @tap="${this._toggleOpen}"
                                ></iron-icon>
                                <div class="postName">
                                  <div
                                    class="ideaLink"
                                    data-args="${post.id}"
                                    @tap="${this._toggleOpen}"
                                  >
                                    ${post.name}
                                  </div>
                                </div>
                              </div>
                              <div
                                id="detail_${post.id}"
                                class="detail"
                                hidden
                              >
                                <div
                                  class="reason"
                                  ?hidden="${post.uniqueStatusMessage!=null}"
                                >
                                  ${this._getTemplate(
                                    post.selectedTemplateName!
                                  )}
                                </div>
                                <div
                                  class="reason"
                                  ?hidden="${!post.uniqueStatusMessage}"
                                >
                                  ${post.uniqueStatusMessage}
                                </div>
                                <div class="postName">
                                  ${this.t('urlLink')}:
                                  <a
                                    target="_blank"
                                    href="/post/${post.id}"
                                    >${post.name}</a
                                  >
                                </div>
                              </div>
                            </div>
                          `
                        )}
                      </div>
                    `
                  )}
                </paper-material>
              `
            )}
          `
        : html``}
      ${this.gotModifiedTemplates
        ? html`
            <div class="templateList">
              ${this._toArray(this.templates).map(
                (template: YpBulkStatusUpdateTemplatesData) => html`
                  <h2>${template.title}</h2>

                  ${template.posts.map(
                    post => html`
                      <div class="postName">
                        <a target="_blank" href="/post/${this.post.id}"
                          >${post.name}</a
                        >
                      </div>
                    `
                  )}
                `
              )}
            </div>
          `
        : html``}

      <iron-ajax
        id="ajax"
        url="/api/users/${this.userId}/status_update/${this.statusUpdateId}"
        @response="${this._response}"
      ></iron-ajax>
    `;
  }

  _toArray(object: any) {
    return Object.values(object) as Array<YpBulkStatusUpdateTemplatesData>;
  }

  _communityChanged() {
    if (
      this.community &&
      this.community.CommunityHeaderImages &&
      this.community.CommunityHeaderImages.length > 0
    ) {
      this.setupTopHeaderImage(this.community.CommunityHeaderImages);
    }
  }

  setupTopHeaderImage(image: Array<YpImageData>) {
    let path;
    if (image) {
      path = 'url(' + YpMediaHelpers.getImageFormatUrl(image, 0) + ')';
    } else {
      path = 'none';
    }
    window.app.style.setProperty( '--top-area-background-image', path);
  }

  _orderGroupStatuses(statuses: Array<YpBulkStatusUpdateStatusData>) {
    const order = {
      '-1': 3,
      '0': 2,
      '-2': 1,
      '2': 0,
    };

    return statuses.sort(function (a, b) {
      return (
        //@ts-ignore
        order[a.official_status.toString()] - order[b.official_status.toString()]
      );
    });
  }

  _getTemplate(templateName: string) {
    if (templateName && this.templates && this.templates[templateName]) {
      return this.templates[templateName].content.replace(
        'www.kosning.reykjavik.is',
        'kosning.reykjavik.is'
      );
    } else {
      return 'Vantar upplýsingar';
    }
  }

  _toggleOpen(event: CustomEvent) {
    event = event || window.event;
    const eventTarget = event.target || event.srcElement;
    const postId = (eventTarget as HTMLElement).getAttribute('data-args');
    (this.$$('#detail_' + postId) as HTMLElement).hidden = !(this.$$('#detail_' + postId) as HTMLElement).hidden;
  }

  _response(event: CustomEvent) {
    const detail = event.detail;
    this.config = detail.response.config;
    const templates = {};
    detail.response.templates.forEach((template: YpBulkStatusUpdateTemplatesData) => {
      this.templates![template.title] = template;
    });
    this.templates = templates;
    this.community = detail.response.community;
    this.fire('change-header', {
      headerTitle: YpFormattingHelpers.truncate(this.community!.name, 80),
      documentTitle:
        this.t('bulkStatusUdateFor') +
        ' ' +
        YpFormattingHelpers.truncate(this.community!.name, 80),
      headerDescription: '', //this.truncate(this.post.Group.objectives,45),
      backPath: '/community/' + this.community!.id,
    });

    if (this.byTemplate && this.templates && this.config) {
      this.config.groups.forEach(
         group => {
          group.statuses.forEach(
           groupItems => {
              groupItems.posts.forEach(
               (post) => {
                  if (
                    post.selectedTemplateName &&
                    this.templates![post.selectedTemplateName]
                  ) {
                    if (!this.templates![post.selectedTemplateName].posts) {
                      this.templates![post.selectedTemplateName].posts = [];
                    }
                    this.templates![post.selectedTemplateName].posts.push(post);
                    console.log(
                      'Pusing to:' +
                        post.selectedTemplateName +
                        ' id:' +
                        post.id
                    );
                  } else {
                    if (!this.templates!['No template']) {
                      this.templates!['No template'] = { title: 'No template', content: '', posts: [] };
                      this.templates!['No template'].posts = [];
                    }
                    this.templates!['No template'].posts.push(post);
                  }
                }
              );
            }
          );
        }
      );
      this._toArray(this.templates).forEach(
        template => {
          if (!template.posts || template.posts.length == 0) {
            delete this.templates![template.title];
          }
        }
      );
      this.gotModifiedTemplates = true;
    }
  }
}
