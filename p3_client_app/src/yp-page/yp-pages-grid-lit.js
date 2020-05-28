import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-image/iron-image.js';
import '@polymer/iron-list/iron-list.js';
import '@polymer/paper-fab/paper-fab.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-input/paper-textarea.js';
import '@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js';
import '../yp-ajax/yp-ajax.js';
import { WordWrap } from '../yp-behaviors/word-wrap.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { YpBaseElement } from '../yp-base-element.js';

class YpPagesGridLit extends YpBaseElement {
  static get properties() {
    return {
      pages: {
        type: Array,
        notify: true
      },

      headerText: {
        type: String
      },

      groupId: {
        type: Number,
        observer: '_groupIdChanged'
      },

      domainId: {
        type: Number,
        observer: '_domainIdChanged'
      },

      communityId: {
        type: Number,
        observer: '_communityIdChanged'
      },

      selected: {
        type: Object
      },

      modelType: {
        type: String
      },

      newLocaleValue: {
        type: String
      },

      currentlyEditingLocale: {
        type: String
      },

      currentlyEditingPage: {
        type: Object
      },

      currentlyEditingTitle: {
        type: String
      },

      currentlyEditingContent: {
        type: String
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
    `, YpFlexLayout]
  }

  render() {
    return html`
    <paper-dialog id="editPageLocale" .modal class="layout vertical">
      <h2>${this.t('pages.editPageLocale')}</h2>

      <paper-dialog-scrollable>
        <paper-input id="title" .name="title" .type="text" .label="${this.t('pages.title')}" .value="${this.currentlyEditingTitle}" .maxlength="60" .charCounter class="mainInput">
        </paper-input>

        <paper-textarea id="content" .name="content" .value="${this.currentlyEditingContent}" .alwaysFloatLabel="${this.currentlyEditingContent}" .label="${this.t('pages.content')}" .rows="7" .maxRows="10">
        </paper-textarea>
      </paper-dialog-scrollable>


      <div class="buttons">
        <paper-button @tap="${this._closePageLocale}" .dialogDismiss>${this.t('close')}</paper-button>
        <paper-button @tap="${this._updatePageLocale}" .dialogDismiss>${this.t('save')}</paper-button>
      </div>
    </paper-dialog>

    <paper-dialog id="dialog">
      <h2>${this.headerText}</h2>
      <iron-list .items="${this.pages}" as="page">
        <template>
          <div class="layout horizontal">
            <div class="pageItem id">
              ${this.page.id}
            </div>
            <div class="pageItem title">
              ${this.page.title.en}
            </div>

            ${ this._toLocaleArray(page.title).map(item => html`
              <div class="layout vertical center-center">
                <a class="locale" data-args-page="${this.page}" data-args-locale="${this.item.locale}" @tap="${this._editPageLocale}">${this.item.locale}</a>
              </div>
            `)}

            <paper-input @label-float class="localeInput" .length="2" .maxlength="2" .value="${this.newLocaleValue}"></paper-input>
            <paper-button data-args="${this.page.id}" @tap="${this._addLocale}">${this.t('pages.addLocale')}</paper-button>
            <div ?hidden="${this.page.publaished}">
              <paper-button data-args="${this.page.id}" @tap="${this._publishPage}">${this.t('pages.publish')}</paper-button>
            </div>
            <div ?hidden="${!this.page.published}">
              <paper-button data-args="${this.page.id}" @tap="${this._unPublishPage}">${this.t('pages.unPublish')}</paper-button>
            </div>
            <paper-button data-args="${this.page.id}" @tap="${this._deletePage}">${this.t('pages.deletePage')}</paper-button>
          </div>
        </template>
      </iron-list>
      <div class="layout horizontal">
        <paper-button id="addPageButton" @tap="${this._addPage}">${this.t('pages.addPage')}</paper-button>
      </div>

      <div class="buttons">
        <paper-button .dialogDismiss>${this.t('close')}</paper-button>
      </div>
    </paper-dialog>

    <div class="layout horizontal center-center">
      <yp-ajax id="ajax" @response="${this._pagesResponse}"></yp-ajax>
      <yp-ajax .method="POST" id="newPageAjax" @response="${this._newPageResponse}"></yp-ajax>
      <yp-ajax .method="DELETE" id="deletePageAjax" @response="${this._deletePageResponse}"></yp-ajax>
      <yp-ajax .method="PUT" id="updatePageAjax" @response="${this._updatePageResponse}"></yp-ajax>
      <yp-ajax .method="PUT" id="publishPageAjax" @response="${this._publishPageResponse}"></yp-ajax>
      <yp-ajax .method="PUT" id="unPublishPageAjax" @response="${this._unPublishPageResponse}"></yp-ajax>
    </div>
    `
  }

/*
  behaviors: [
    WordWrap
  ],
*/


  _toLocaleArray(obj) {
    const array = Object.keys(obj).map(function(key) {
      return {
        locale: key,
        value: obj[key]
      };
    });

    return __.sortBy(array, function(o) { return o.item; });
  }

  _editPageLocale(event) {
    this.set('currentlyEditingPage', JSON.parse(event.target.getAttribute('data-args-page')));
    this.set('currentlyEditingLocale', event.target.getAttribute('data-args-locale'));
    this.set('currentlyEditingContent',this.wordwrap(120)(this.currentlyEditingPage["content"][this.currentlyEditingLocale]));
    this.set('currentlyEditingTitle',this.currentlyEditingPage["title"][this.currentlyEditingLocale]);
    this.$$("#editPageLocale").open();
  }

  _closePageLocale() {
    this.set('currentlyEditingPage', null);
    this.set('currentlyEditingLocale', null);
    this.set('currentlyEditingContent', null);
    this.set('currentlyEditingTitle', null);
  }

  _dispatchAjax(ajax, pageId, path) {
    let pageIdPath;
    if (pageId) {
      pageIdPath = "/" + pageId + "/" + path;
    } else {
      pageIdPath = "/" + path;
    }
    if (this.modelType=="groups" && this.groupId) {
      ajax.url = "/api/" + this.modelType + "/" + this.groupId + pageIdPath;
      ajax.generateRequest();
    } else if (this.modelType=="communities" && this.communityId) {
      ajax.url = "/api/" + this.modelType + "/" + this.communityId +  pageIdPath;
      ajax.generateRequest();
    } else if (this.modelType=="domains" && this.domainId) {
      ajax.url = "/api/" + this.modelType + "/" + this.domainId + pageIdPath;
      ajax.generateRequest();
    } else {
      console.warn("Can't find model type or ids");
    }
  }

  _updatePageLocale() {
    this.$$("#updatePageAjax").body = {
      locale: this.currentlyEditingLocale,
      content: this.currentlyEditingContent,
      title: this.currentlyEditingTitle
    };
    this._dispatchAjax(this.$$("#updatePageAjax"), this.currentlyEditingPage.id, "update_page_locale")
    this._closePageLocale();
  }

  _publishPage(event) {
    this.$$("#updatePageAjax").body = {};
    const pageId = event.target.getAttribute('data-args');
    this._dispatchAjax(this.$$("#updatePageAjax"), pageId, "publish_page")
  }

  _publishPageResponse() {
    window.appGlobals.notifyUserViaToast(this.t('pages.pagePublished'));
    this.$$("#ajax").generateRequest();
  }

  _unPublishPage(event) {
    this.$$("#updatePageAjax").body = {};
    const pageId = event.target.getAttribute('data-args');
    this._dispatchAjax(this.$$("#updatePageAjax"), pageId, "un_publish_page")
  }

  _unPublishPageResponse() {
    window.appGlobals.notifyUserViaToast(this.t('pages.pageUnPublished'));
    this.$$("#ajax").generateRequest();
  }

  _deletePage(event) {
    this.$$("#deletePageAjax").body = {};
    const pageId = event.target.getAttribute('data-args');
    this._dispatchAjax(this.$$("#deletePageAjax"), pageId, "delete_page")
  }

  _deletePageResponse() {
    window.appGlobals.notifyUserViaToast(this.t('pages.pageDeleted'));
    this.$$("#ajax").generateRequest();
  }

  _addLocale(event) {
    if (this.newLocaleValue && this.newLocaleValue.length>1) {
      const pageId = event.target.getAttribute('data-args');
      this.$$("#updatePageAjax").body = {
        locale: this.newLocaleValue.toLowerCase(),
        content: '',
        title: ''
      };
      this._dispatchAjax(this.$$("#updatePageAjax"), pageId, "update_page_locale")
      this.set('newLocaleValue', null);
    }
  }

  _addPage(event) {
    this.$$("#newPageAjax").body = {};
    this.$$("#addPageButton").disabled = true;
    this._dispatchAjax(this.$$("#newPageAjax"), null, "add_page")
  }

  _newPageResponse() {
    window.appGlobals.notifyUserViaToast(this.t('pages.newPageCreated'));
    this.$$("#ajax").generateRequest();
    this.$$("#addPageButton").disabled = false;
  }

  _updatePageResponse() {
    window.appGlobals.notifyUserViaToast(this.t('posts.updated'));
    this.$$("#ajax").generateRequest();
  }

  _domainIdChanged(newGroupId) {
    if (newGroupId) {
      this.set('modelType', 'domains');
      this._generateRequest(newGroupId);
    }
  }

  _groupIdChanged(newGroupId) {
    if (newGroupId) {
      this.set('modelType', 'groups');
      this._generateRequest(newGroupId);
    }
  }

  _communityIdChanged(newCommunityId) {
    if (newCommunityId) {
      this.set('modelType', 'communities');
      this._generateRequest(newCommunityId);
    }
  }

  _generateRequest(id) {
    this.$$("#ajax").url = "/api/"+this.modelType+"/"+id+"/pages_for_admin";
    this.$$("#ajax").generateRequest();
  }

  _pagesResponse(event, detail) {
    this.set('pages', detail.response);
  }

  setup(groupId, communityId, domainId, adminUsers) {
    this.set('groupId', null);
    this.set('communityId', null);
    this.set('domainId', null);
    this.set('pages', null);

    if (groupId)
      this.set('groupId', groupId);

    if (communityId)
      this.set('communityId', communityId);

    if (domainId)
      this.set('domainId', domainId);

    this._setupHeaderText();
  }

  open() {
    this.$$("#dialog").open();
  }

  _setupHeaderText() {
    if (this.groupId) {
      this.set('headerText', this.t('group.pages'));
    } else if (this.communityId) {
      this.set('headerText', this.t('community.pages'));
    } else if (this.domainId) {
      this.set('headerText', this.t('domain.pages'));
    }
  }
}

window.customElements.define('yp-pages-grid-lit', YpPagesGridLit)