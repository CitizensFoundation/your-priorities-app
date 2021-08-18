import '@material/mwc-button';
import '@material/mwc-dialog';
import '@material/mwc-textfield';
import '@material/mwc-textarea';
import { LitElement, css, html, nothing } from 'lit';
import { property, customElement } from 'lit/decorators.js';

import { YpBaseElement } from '../@yrpri/common/yp-base-element';
import { YpFormattingHelpers } from '../@yrpri/common/YpFormattingHelpers';
import '@vaadin/vaadin-grid/vaadin-grid.js';
import type { GridElement } from '@vaadin/vaadin-grid/vaadin-grid.js';

import '@polymer/iron-ajax';
import { IronAjaxElement } from '@polymer/iron-ajax';

import '@polymer/paper-listbox';
import { PaperListboxElement } from '@polymer/paper-listbox';

import '@material/mwc-dialog';
import { Dialog } from '@material/mwc-dialog';
import { sortBy } from 'lodash-es';
import { Button } from '@material/mwc-button';

@customElement('yp-pages-grid')
export class YpPagesGrid extends YpBaseElement {
  @property({ type: Array })
  pages: Array<YpHelpPageData> | undefined;

  @property({ type: String })
  headerText: string | undefined;

  @property({ type: Number })
  domainId: number | undefined;

  @property({ type: Number })
  communityId: number | undefined;

  @property({ type: Number })
  groupId: number | undefined;

  @property({ type: Object })
  currentlyEditingPage: YpHelpPageData | undefined;

  @property({ type: String })
  modelType: string | undefined;

  @property({ type: String })
  newLocaleValue: string | undefined;

  @property({ type: String })
  currentlyEditingLocale: string | undefined;

  @property({ type: String })
  currentlyEditingTitle: string | undefined;

  @property({ type: String })
  currentlyEditingContent: string | undefined;

  static get prossperties() {
    return {
      groupId: {
        type: Number,
        observer: '_groupIdChanged',
      },

      domainId: {
        type: Number,
        observer: '_domainIdChanged',
      },

      communityId: {
        type: Number,
        observer: '_communityIdChanged',
      },
    };
  }

  static get styles() {
    return [
      css`
        #dialog {
          width: 90%;
          max-height: 90%;
          background-color: #fff;
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
          background-color: #fff;
        }

        #editPageLocale[rtl] {
          direction: rtl;
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

        .localeInputContasiner {
          padding: 2px;
          margin-bottom: 8px;
          border: solid 1px #999;
        }

        .buttons {
          margin-right: 16px;
        }
      `,
    ];
  }

  render() {
    return html`

      <h2>${this.headerText}</h2>
      <div class="flex"></div>
        <div class="layout horizontal">
          <mwc-button id="addPageButton" @click="${
            this._addPage
          }" .label="${this.t('pages.addPage')}"></mwc-button>
        </div>
      </div>
      <div id="scrollable">
      ${this.pages?.map(page => {
        return html`
          <div class="layout horizontal">
            <div class="pageItem id">
              ${page.id}
            </div>
            <div class="pageItem title">
              ${page.title.en}
            </div>

            ${this._toLocaleArray(page.title).map(
              item => html`
                <div class="layout vertical center-center">
                  <a
                    class="locale"
                    .data-args-page="${page}"
                    .data-args-locale="${page.locale}"
                    @click="${this._editPageLocale}"
                    >${item.locale}</a
                  >
                </div>
              `
            )}

            <mwc-textfield
              class="localeInput"
              length="2"
              maxlength="2"
              .value="${this.newLocaleValue || ""}"
            ></mwc-textfield>

            <mwc-button
              data-args="${page.id}"
              @click="${this._addLocale}"
              .label="${this.t('pages.addLocale')}"
            ></mwc-button>
            <div ?hidden="${page.published}">
              <mwc-button
                data-args="${page.id}"
                @click="${this._publishPage}"
                .label="${this.t('pages.publish')}"
              ></mwc-button>
            </div>
            <div ?hidden="${!page.published}">
              <mwc-button
                data-args="${page.id}"
                @click="${this._unPublishPage}"
                .label="${this.t('pages.unPublish')}"
              ></mwc-button>
            </div>
            <mwc-button
              data-args="${page.id}"
              @click="${this._deletePage}"
              .label="${this.t('pages.deletePage')}"
            ></mwc-button>
          </div>
        `;
      })}
      </div>

      <div class="buttons">
        <mwc-button dialogDismiss .label="${this.t('close')}"></mwc-button>
      </div>

    <mwc-dialog id="editPageLocale" modal class="layout vertical" ?rtl="${
      this.rtl
    }">
      <h2>${this.t('pages.editPageLocale')}</h2>

      <mwc-textfield id="title" name="title" type="text" .label="${this.t(
        'pages.title'
      )}" .value="${
      this.currentlyEditingTitle || ''
    }" maxlength="60" charCounter class="mainInput">
        </mwc-textfield>

        <mwc-textarea id="content" name="content" .value="${
          this.currentlyEditingContent || ""
        }" .label="${this.t('pages.content')}" rows="7" maxRows="10">
        </mwc-textarea>

        <div class="buttons">
        <mwc-button @click="${
          this._closePageLocale
        }" dialogDismiss .label="${this.t('close')}"></mwc-button>
        <mwc-button @click="${
          this._updatePageLocale
        }" dialogDismiss .label="${this.t('save')}"></mwc-button>
      </div>

    </mwc-dialog>

    <div class="layout horizontal center-center">
      <iron-ajax id="ajax" @response="${this._pagesResponse}"></iron-ajax>
      <iron-ajax method="POST" id="newPageAjax" @response="${
        this._newPageResponse
      }"></iron-ajax>
      <iron-ajax method="DELETE" id="deletePageAjax" @response="${
        this._deletePageResponse
      }"></iron-ajax>
      <iron-ajax method="PUT" id="updatePageAjax" @response="${
        this._updatePageResponse
      }"></iron-ajax>
      <iron-ajax method="PUT" id="publishPageAjax" @response="${
        this._publishPageResponse
      }"></iron-ajax>
      <iron-ajax method="PUT" id="unPublishPageAjax" @response="${
        this._unPublishPageResponse
      }"></iron-ajax>
    </div>
    `;
  }

  /*
  behaviors: [
    WordWrap
  ],
*/

  _toLocaleArray(obj: any) {
    const array = Object.keys(obj).map(function (key) {
      return {
        locale: key,
        value: obj[key],
      };
    });

    return (sortBy(array, function (o) {
      return o.value;
    }) as unknown) as Array<YpHelpPageData>;
  }


  _editPageLocale(event: CustomEvent) {
    const currentlyEditingPageTxt =  (event.target as HTMLElement).getAttribute('data-args-page');
    this.currentlyEditingPage = JSON.parse(currentlyEditingPageTxt!);
    this.currentlyEditingLocale = (event.target as HTMLElement).getAttribute('data-args-locale')!;
    this.currentlyEditingContent = this.currentlyEditingPage!['content'][this.currentlyEditingLocale];
    this.currentlyEditingTitle = this.currentlyEditingPage!['title'][this.currentlyEditingLocale];
    (this.$$('#editPageLocale') as Dialog).open = true;
  }

  _closePageLocale() {
    this.currentlyEditingPage = undefined;
    this.currentlyEditingLocale = undefined;
    this.currentlyEditingContent = undefined;
    this.currentlyEditingTitle = undefined;
  }

  _dispatchAjax(ajax: IronAjaxElement, pageId: number | undefined, path: string) {
    let pageIdPath;
    if (pageId) {
      pageIdPath = '/' + pageId + '/' + path;
    } else {
      pageIdPath = '/' + path;
    }
    if (this.modelType == 'groups' && this.groupId) {
      ajax.url = '/api/' + this.modelType + '/' + this.groupId + pageIdPath;
      ajax.generateRequest();
    } else if (this.modelType == 'communities' && this.communityId) {
      ajax.url = '/api/' + this.modelType + '/' + this.communityId + pageIdPath;
      ajax.generateRequest();
    } else if (this.modelType == 'domains' && this.domainId) {
      ajax.url = '/api/' + this.modelType + '/' + this.domainId + pageIdPath;
      ajax.generateRequest();
    } else {
      console.warn("Can't find model type or ids");
    }
  }

  _updatePageLocale() {
    (this.$$('#updatePageAjax') as IronAjaxElement).body = {
      locale: this.currentlyEditingLocale,
      content: this.currentlyEditingContent,
      title: this.currentlyEditingTitle,
    };
    this._dispatchAjax(
      this.$$('#updatePageAjax') as IronAjaxElement,
      this.currentlyEditingPage!.id,
      'update_page_locale'
    );
    this._closePageLocale();
  }

  _publishPage(event: CustomEvent) {
    (this.$$('#updatePageAjax') as IronAjaxElement).body = {};
    const pageId = (event.target as HTMLElement).getAttribute('data-args');
    this._dispatchAjax(
      this.$$('#updatePageAjax') as IronAjaxElement,
      parseInt(pageId!),
      'publish_page'
    );
  }

  _publishPageResponse() {
    window.appGlobals.notifyUserViaToast(this.t('pages.pagePublished'));
    (this.$$('#ajax') as IronAjaxElement).generateRequest();
  }

  _unPublishPage(event: CustomEvent) {
    (this.$$('#updatePageAjax') as IronAjaxElement).body = {};
    const pageId = (event.target as HTMLElement).getAttribute('data-args');
    this._dispatchAjax(
      this.$$('#updatePageAjax') as IronAjaxElement,
      parseInt(pageId!),
      'un_publish_page'
    );
  }

  _unPublishPageResponse() {
    window.appGlobals.notifyUserViaToast(this.t('pages.pageUnPublished'));
    (this.$$('#ajax') as IronAjaxElement).generateRequest();
  }

  _deletePage(event: CustomEvent) {
    (this.$$('#deletePageAjax') as IronAjaxElement).body = {};
    const pageId = (event.target as HTMLElement).getAttribute('data-args');
    this._dispatchAjax(
      this.$$('#deletePageAjax') as IronAjaxElement,
      parseInt(pageId!),
      'delete_page'
    );
  }

  _deletePageResponse() {
    window.appGlobals.notifyUserViaToast(this.t('pages.pageDeleted'));
    (this.$$('#ajax') as IronAjaxElement).generateRequest();
  }

  _addLocale(event: CustomEvent) {
    if (this.newLocaleValue && this.newLocaleValue.length > 1) {
      const pageId = (event.target as HTMLElement).getAttribute('data-args');
      (this.$$('#updatePageAjax') as IronAjaxElement).body = {
        locale: this.newLocaleValue.toLowerCase(),
        content: '',
        title: '',
      };
      this._dispatchAjax(
        this.$$('#updatePageAjax') as IronAjaxElement,
        parseInt(pageId!),
        'update_page_locale'
      );
      this.newLocaleValue = undefined;
    }
  }

  _addPage() {
    (this.$$('#newPageAjax') as IronAjaxElement).body = {};
    (this.$$('#addPageButton') as Button).disabled = true;
    this._dispatchAjax(
      this.$$('#newPageAjax') as IronAjaxElement,
      undefined,
      'add_page'
    );
  }

  _newPageResponse() {
    window.appGlobals.notifyUserViaToast(this.t('pages.newPageCreated'));
    (this.$$('#ajax') as IronAjaxElement).generateRequest();
    (this.$$('#addPageButton') as Button).disabled = false;
  }

  _updatePageResponse() {
    window.appGlobals.notifyUserViaToast(this.t('posts.updated'));
    (this.$$('#ajax') as IronAjaxElement).generateRequest();
  }

  _domainIdChanged() {
    if (this.domainId) {
      this.modelType = 'domains';
      this._generateRequest(this.domainId);
    }
  }

  _groupIdChanged() {
    if (this.groupId) {
      this.modelType = 'groups';
      this._generateRequest(this.groupId);
    }
  }

  _communityIdChanged() {
    if (this.communityId) {
      this.modelType = 'communities';
      this._generateRequest(this.communityId);
    }
  }

  _generateRequest(id: number) {
    (this.$$('#ajax') as IronAjaxElement).url =
      '/api/' + this.modelType + '/' + id + '/pages_for_admin';
    (this.$$('#ajax') as IronAjaxElement).generateRequest();
  }

  _pagesResponse(event: CustomEvent) {
    this.pages = event.detail.response;
  }

  setup(
    groupId: number,
    communityId: number,
    domainId: number,
    adminUsers: boolean
  ) {
    this.groupId = undefined;
    this.communityId = undefined;
    this.domainId = undefined;
    this.pages = undefined;

    if (groupId) this.groupId = groupId;

    if (communityId) this.communityId = communityId;

    if (domainId) this.domainId = domainId;

    this._setupHeaderText();
  }

  open() {
    (this.$$('#dialog') as Dialog).open = true;
  }

  _setupHeaderText() {
    if (this.groupId) {
      this.headerText = this.t('group.pages');
    } else if (this.communityId) {
      this.headerText = this.t('community.pages');
    } else if (this.domainId) {
      this.headerText = this.t('domain.pages');
    }
  }
}
