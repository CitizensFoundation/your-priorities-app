var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import "@material/web/dialog/dialog.js";
import "@material/web/list/list-item.js";
import "@material/web/list/list.js";
import "@material/web/button/filled-button.js";
import "@material/web/button/text-button.js";
import "@material/web/icon/icon.js";
import "@material/web/iconbutton/icon-button.js";
import "@material/web/progress/circular-progress.js";
import "@material/web/textfield/outlined-text-field.js";
import { YpBaseElement } from "../common/yp-base-element";
import { YpMediaHelpers } from "../common/YpMediaHelpers";
import "./yp-organization-edit.js";
let YpOrganizationGrid = class YpOrganizationGrid extends YpBaseElement {
    static get styles() {
        return [
            super.styles,
            css `
        .header {
          font-weight: bold;
          padding: 10px;
          background-color: #f0f0f0;
        }

        .addOrgButton {
          margin-top: 16px;
          margin-bottom: 64px;
        }

        .list {
          display: table;
          width: 100%;
          border-collapse: collapse;
          background-color: #fff;
        }

        .pageItem {
          display: table-cell;
          padding: 10px;
          text-align: left;
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

        .locale {
          width: 30px;
          cursor: pointer;
        }

        md-button {
          display: table-cell;
          padding: 10px;
          border: 1px solid #ddd;
        }

        .orgLogo {
          height: 75px;
          width: 75px;
        }

        [hidden] {
          display: none !important;
        }
      `,
        ];
    }
    constructor() {
        super();
    }
    async connectedCallback() {
        super.connectedCallback();
        this.refresh();
    }
    async refresh() {
        this.organizations = (await window.adminServerApi.adminMethod(`/api/organizations/${this.domainId}/domainOrganizations`, "GET"));
    }
    render() {
        return html `
      <div class="header">${this.t("organizationsAdmin")}</div>
      <md-list class="list">
        ${this.organizations?.map((organization) => html `
            <md-list-item class="layout horizontal">
              <div class="pageItem">
                <img
                  src="${this._organizationImageUrl(organization)}"
                  class="orgLogo"
                />
              </div>
              <div class="pageItem id">${organization.name}</div>
              <div class="pageItem description">
                ${organization.description}
              </div>
              <div class="pageItem website">${organization.website}</div>

              <div class="layout horizontal">
                <md-text-button
                  @click="${() => this._editOrganization(organization)}"
                >
                  ${this.t("update")}
                </md-text-button>
                <md-icon-button
                  @click="${() => this._deleteOrganization(organization)}"
                  .label="${this.t("delete")}"
                  ><md-icon>delete</md-icon></md-icon-button
                >
              </div>
            </md-list-item>
          `)}
      </md-list>

      <div class="layout vertical center-center">
        <md-outlined-button
          class="addOrgButton"
          @click="${this._createOrganization}"
          >${this.t("createOrganization")}</md-outlined-button
        >
      </div>

      <yp-organization-edit
        id="editDialog"
        .domainId="${this.domainId}"
      ></yp-organization-edit>
    `;
    }
    _deleteOrganization(organization) {
        this.organizationToDeleteId = organization.id;
        window.appDialogs.getDialogAsync("confirmationDialog", (dialog) => {
            dialog.open(this.t("areYouSureYouWantToDeleteThisOrganization"), this._reallyDeleteOrganization.bind(this), true, false);
        });
    }
    async _reallyDeleteOrganization() {
        try {
            await window.adminServerApi.adminMethod(`/api/organizations/${this.organizationToDeleteId}`, "DELETE");
            this.refresh();
        }
        catch (e) {
            console.error(e);
        }
    }
    _afterEdit() {
        const editDialog = this.shadowRoot.getElementById("editDialog");
        editDialog.close();
        this.refresh();
    }
    _createOrganization() {
        const editDialog = this.shadowRoot.getElementById("editDialog");
        editDialog.setup(undefined, true, this._afterEdit.bind(this));
        editDialog.open(true, {});
    }
    _editOrganization(organization) {
        const editDialog = this.shadowRoot.getElementById("editDialog");
        editDialog.organization = organization;
        editDialog.setup(organization, false, this._afterEdit.bind(this));
        editDialog.open(false, {});
    }
    _organizationImageUrl(organization) {
        if (organization.OrganizationLogoImages) {
            return YpMediaHelpers.getImageFormatUrl(organization.OrganizationLogoImages, 2);
        }
        else {
            return null;
        }
    }
};
__decorate([
    property({ type: Array })
], YpOrganizationGrid.prototype, "organizations", void 0);
__decorate([
    property({ type: String })
], YpOrganizationGrid.prototype, "headerText", void 0);
__decorate([
    property({ type: String })
], YpOrganizationGrid.prototype, "domainId", void 0);
__decorate([
    property({ type: Object })
], YpOrganizationGrid.prototype, "selected", void 0);
YpOrganizationGrid = __decorate([
    customElement("yp-organization-grid")
], YpOrganizationGrid);
export { YpOrganizationGrid };
//# sourceMappingURL=yp-organization-grid.js.map