var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { css, html, nothing } from "lit";
import { property, customElement, query } from "lit/decorators.js";
import { YpBaseElement } from "../common/yp-base-element.js";
import "@material/web/button/text-button.js";
import "@material/web/button/filled-button.js";
import "@material/web/textfield/outlined-text-field.js";
import "@material/web/dialog/dialog.js";
let YpPagesGrid = class YpPagesGrid extends YpBaseElement {
    updated(changedProperties) {
        super.updated(changedProperties);
        if (changedProperties.has("groupId") ||
            changedProperties.has("communityId") ||
            changedProperties.has("domainId")) {
            this._updateCollection();
        }
    }
    static get styles() {
        return [
            super.styles,
            css `
        #dialog {
          width: 90%;
          max-height: 90%;
        }

        .pageItem {
          padding-right: 16px;
        }

        #editPageLocale {
          width: 80%;
          max-height: 80%;
        }

        #editPageLocale[rtl] {
          direction: rtl;
        }

        .locale {
          width: 30px;
          cursor: pointer;
        }

        .localeInput {
          width: 60px;
          margin-right: 12px;
          margin-left: 16px;
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

        .pageItem {
          margin-right: 16px;
        }

        .addLocaleButton {
          margin-right: 16px;
        }

        #addPageButton {
          margin: 24px;
        }
      `,
        ];
    }
    titleChanged() {
        this.currentlyEditingTitle = this.$$("#title").value;
    }
    contentChanged() {
        this.currentlyEditingContent = this.$$("#content").value;
    }
    render() {
        if (this.pages) {
            return html `
        <h2>${this.headerText}</h2>
        <div id="scrollable">
          ${this.pages?.map((page) => {
                return html `
              <div class="layout horizontal">
                <div class="pageItem id">${page.id}</div>
                <div class="pageItem title">${page.title.en}</div>

                ${this._toLocaleArray(page.title).map((item) => html `
                    <div class="layout vertical center-center">
                      <md-text-button
                        class="locale"
                        data-args-page="${JSON.stringify(page)}"
                        data-args-locale="${item.locale}"
                        @click="${this._editPageLocale}"
                        >${item.locale}</md-text-button
                      >
                    </div>
                  `)}

                <md-outlined-text-field
                  class="localeInput"
                  id="localeInput"
                  length="2"
                  maxlength="2"
                ></md-outlined-text-field>

                <md-text-button
                  data-args="${page.id}"
                  class="addLocaleButton"
                  @click="${this._addLocale}"
                  >${this.t("pages.addLocale")}</md-text-button
                >
                <md-text-button
                  ?hidden="${page.published}"
                  data-args="${page.id}"
                  @click="${this._publishPage}"
                  >${this.t("pages.publish")}</md-text-button
                >

                <md-text-button
                  data-args="${page.id}"
                  ?hidden="${!page.published}"
                  @click="${this._unPublishPage}"
                  >${this.t("pages.unPublish")}</md-text-button
                >

                <md-text-button
                  data-args="${page.id}"
                  @click="${this._deletePage}"
                  >${this.t("pages.deletePage")}</md-text-button
                >
              </div>
            `;
            })}
        </div>

        <div class="layout horizontal">
          <md-filled-button id="addPageButton" @click="${this._addPage}"
            >${this.t("pages.addPage")}</md-filled-button
          >
        </div>

        <md-dialog
          id="editPageLocale"
          modal
          class="layout vertical"
          ?rtl="${this.rtl}"
        >
          <h2 slot="headline">${this.t("pages.editPageLocale")}</h2>
          <div slot="content" class="layout vertical">
            <md-outlined-text-field
              @change="${this.titleChanged}"
              id="title"
              name="title"
              type="text"
              .label="${this.t("pages.title")}"
              .value="${this.currentlyEditingTitle || ""}"
              maxlength="60"
              charCounter
              class="mainInput"
            >
            </md-outlined-text-field>

            <md-outlined-text-field
              @change="${this.contentChanged}"
              id="content"
              name="content"
              type="textarea"
              .value="${this.currentlyEditingContent || ""}"
              .label="${this.t("pages.content")}"
              rows="7"
              maxRows="10"
            >
            </md-outlined-text-field>
          </div>

          <div class="buttons" slot="actions">
            <md-text-button @click="${this._closePageLocale}" dialogDismiss
              >${this.t("close")}</md-text-button
            >
            <md-text-button @click="${this._updatePageLocale}" dialogDismiss
              >${this.t("save")}</md-text-button
            >
          </div>
        </md-dialog>
      `;
        }
        else {
            return nothing;
        }
    }
    /*
    behaviors: [
      WordWrap
    ],
  */
    _toLocaleArray(obj) {
        const array = Object.keys(obj).map((key) => ({
            locale: key,
            value: obj[key],
        }));
        return array.sort((a, b) => a.value.localeCompare(b.value));
    }
    async _editPageLocale(event) {
        const target = event.target;
        const currentlyEditingPageTxt = target.getAttribute("data-args-page");
        this.currentlyEditingPage = JSON.parse(currentlyEditingPageTxt);
        this.currentlyEditingLocale = target.getAttribute("data-args-locale");
        this.currentlyEditingContent =
            this.currentlyEditingPage["content"][this.currentlyEditingLocale];
        this.currentlyEditingTitle =
            this.currentlyEditingPage["title"][this.currentlyEditingLocale];
        const dialog = this.shadowRoot.querySelector("#editPageLocale");
        if (dialog) {
            dialog.open = true;
        }
    }
    _closePageLocale() {
        this.currentlyEditingPage = undefined;
        this.currentlyEditingLocale = undefined;
        this.currentlyEditingContent = undefined;
        this.currentlyEditingTitle = undefined;
        this.$$("#editPageLocale").close();
    }
    async _dispatchAdminServerApiRequest(pageId, path, method, body = {}) {
        let pageIdPath = pageId ? `/${pageId}/${path}` : `/${path}`;
        let url = "";
        if (this.modelType === "groups" && this.groupId) {
            url = `/api/${this.modelType}/${this.groupId}${pageIdPath}`;
        }
        else if (this.modelType === "communities" && this.communityId) {
            url = `/api/${this.modelType}/${this.communityId}${pageIdPath}`;
        }
        else if (this.modelType === "domains" && this.domainId) {
            url = `/api/${this.modelType}/${this.domainId}${pageIdPath}`;
        }
        else {
            console.warn("Can't find model type or ids");
            return;
        }
        try {
            return await window.adminServerApi.adminMethod(url, method, body);
        }
        catch (error) {
            console.error("Error dispatching admin server API request:", error);
        }
    }
    async _updatePageLocale() {
        await this._dispatchAdminServerApiRequest(this.currentlyEditingPage.id, "update_page_locale", "PUT", {
            locale: this.currentlyEditingLocale,
            content: this.currentlyEditingContent,
            title: this.currentlyEditingTitle,
        });
        this._updateCollection();
        this._closePageLocale();
    }
    async _publishPage(event) {
        const pageId = event.target.getAttribute("data-args");
        await this._dispatchAdminServerApiRequest(parseInt(pageId), "publish_page", "PUT");
        this._publishPageResponse();
    }
    async _publishPageResponse() {
        window.appGlobals.notifyUserViaToast(this.t("pages.pagePublished"));
        await this._unPublishPageResponse();
    }
    async _unPublishPage(event) {
        const pageId = event.target.getAttribute("data-args");
        await this._dispatchAdminServerApiRequest(parseInt(pageId), "un_publish_page", "PUT");
        this._unPublishPageResponse();
    }
    async _unPublishPageResponse() {
        window.appGlobals.notifyUserViaToast(this.t("pages.pageUnPublished"));
        await this._updateCollection();
    }
    async _refreshPages() {
        await this._dispatchAdminServerApiRequest(undefined, "pages", "GET");
    }
    async _deletePage(event) {
        const pageId = event.target.getAttribute("data-args");
        await this._dispatchAdminServerApiRequest(parseInt(pageId), "delete_page", "DELETE");
        this._deletePageResponse();
    }
    async _deletePageResponse() {
        window.appGlobals.notifyUserViaToast(this.t("pages.pageDeleted"));
        await this._updateCollection();
    }
    async _addLocale(event) {
        if (this.newLocaleInput && this.newLocaleInput.value.length > 1) {
            const pageId = event.target.getAttribute("data-args");
            await this._dispatchAdminServerApiRequest(parseInt(pageId), "update_page_locale", "PUT", {
                locale: this.newLocaleInput.value.toLowerCase(),
                content: "",
                title: "",
            });
            this._updateCollection();
        }
    }
    async _addPage() {
        const addButton = this.shadowRoot.querySelector("#addPageButton");
        if (addButton) {
            addButton.disabled = true;
        }
        await this._dispatchAdminServerApiRequest(undefined, "add_page", "POST");
        this._generateRequest();
        if (addButton) {
            addButton.disabled = false;
        }
    }
    async _newPageResponse() {
        window.appGlobals.notifyUserViaToast(this.t("pages.newPageCreated"));
        await this._refreshPages();
    }
    async _updatePageResponse() {
        window.appGlobals.notifyUserViaToast(this.t("posts.updated"));
        await this._refreshPages();
    }
    _updateCollection() {
        if (this.domainId) {
            this.modelType = "domains";
            this._generateRequest(this.domainId);
        }
        if (this.groupId) {
            this.modelType = "groups";
            this._generateRequest(this.groupId);
        }
        if (this.communityId) {
            this.modelType = "communities";
            this._generateRequest(this.communityId);
        }
    }
    async _generateRequest(id = undefined) {
        this.pages = await this._dispatchAdminServerApiRequest(undefined, "pages_for_admin", "GET");
    }
    _pagesResponse(event) {
        this.pages = event.detail.response;
    }
    setup(groupId, communityId, domainId, adminUsers) {
        this.groupId = undefined;
        this.communityId = undefined;
        this.domainId = undefined;
        this.pages = undefined;
        if (groupId)
            this.groupId = groupId;
        if (communityId)
            this.communityId = communityId;
        if (domainId)
            this.domainId = domainId;
        this._setupHeaderText();
    }
    open() {
        const dialog = this.shadowRoot.querySelector("#dialog");
        if (dialog) {
            dialog.open = true;
        }
    }
    _setupHeaderText() {
        if (this.groupId) {
            this.headerText = this.t("group.pages");
        }
        else if (this.communityId) {
            this.headerText = this.t("community.pages");
        }
        else if (this.domainId) {
            this.headerText = this.t("domain.pages");
        }
    }
};
__decorate([
    property({ type: Array })
], YpPagesGrid.prototype, "pages", void 0);
__decorate([
    property({ type: String })
], YpPagesGrid.prototype, "headerText", void 0);
__decorate([
    property({ type: Number })
], YpPagesGrid.prototype, "domainId", void 0);
__decorate([
    property({ type: Number })
], YpPagesGrid.prototype, "communityId", void 0);
__decorate([
    property({ type: Number })
], YpPagesGrid.prototype, "groupId", void 0);
__decorate([
    property({ type: Object })
], YpPagesGrid.prototype, "currentlyEditingPage", void 0);
__decorate([
    property({ type: String })
], YpPagesGrid.prototype, "modelType", void 0);
__decorate([
    query("#localeInput")
], YpPagesGrid.prototype, "newLocaleInput", void 0);
__decorate([
    property({ type: String })
], YpPagesGrid.prototype, "currentlyEditingLocale", void 0);
__decorate([
    property({ type: String })
], YpPagesGrid.prototype, "currentlyEditingTitle", void 0);
__decorate([
    property({ type: String })
], YpPagesGrid.prototype, "currentlyEditingContent", void 0);
YpPagesGrid = __decorate([
    customElement("yp-pages-grid")
], YpPagesGrid);
export { YpPagesGrid };
//# sourceMappingURL=yp-pages-grid.js.map