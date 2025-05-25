import { LitElement, html, css, nothing } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import "@material/web/dialog/dialog.js";
import "@material/web/list/list-item.js";
import "@material/web/list/list.js";
import "@material/web/button/filled-button.js";
import "@material/web/button/text-button.js";
import "@material/web/icon/icon.js";
import "@material/web/iconbutton/icon-button.js";
import "@material/web/progress/circular-progress.js";
import "@material/web/textfield/outlined-text-field.js";
import { MdDialog } from "@material/web/dialog/dialog.js";
import { YpBaseElement } from "../common/yp-base-element";
import { YpFormattingHelpers } from "../common/YpFormattingHelpers";
import { YpMediaHelpers } from "../common/YpMediaHelpers";

import "./yp-organization-edit.js";
import { YpOrganizationEdit } from "./yp-organization-edit.js";
import { YpConfirmationDialog } from "../yp-dialog-container/yp-confirmation-dialog";

@customElement("yp-organization-grid")
export class YpOrganizationGrid extends YpBaseElement {
  @property({ type: Array })
  organizations: Array<any> | undefined;

  @property({ type: String })
  headerText: string | undefined;

  @property({ type: String })
  domainId: string | undefined;

  @property({ type: Object })
  selected: any | undefined;

  organizationToDeleteId: number | undefined;

  static override get styles() {
    return [
      super.styles,
      css`
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

  override async connectedCallback(): Promise<void> {
    super.connectedCallback();
    this.refresh();
  }

  async refresh() {
    this.organizations = (await window.adminServerApi.adminMethod(
      `/api/organizations/${this.domainId}/domainOrganizations`,
      "GET"
    )) as YpOrganizationData[];
  }

  override render() {
    return html`
      <div class="header">${this.t("organizationsAdmin")}</div>
      <md-list class="list">
        ${this.organizations?.map(
          (organization) => html`
            <md-list-item class="layout horizontal">
              <div class="pageItem">
                <img
                  src="${this._organizationImageUrl(organization)}"
                  alt="${organization.name}"
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
          `
        )}
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

  _deleteOrganization(organization: YpOrganizationData) {
    this.organizationToDeleteId = organization.id;
    window.appDialogs.getDialogAsync(
      "confirmationDialog",
      (dialog: YpConfirmationDialog) => {
        dialog.open(
          this.t("areYouSureYouWantToDeleteThisOrganization"),
          this._reallyDeleteOrganization.bind(this),
          true,
          false
        );
      }
    );
  }

  async _reallyDeleteOrganization() {
    try {
      await window.adminServerApi.adminMethod(
        `/api/organizations/${this.organizationToDeleteId}`,
        "DELETE"
      );
      this.refresh();
    } catch (e) {
      console.error(e);
    }
  }

  _afterEdit() {
    const editDialog = this.shadowRoot!.getElementById(
      "editDialog"
    ) as YpOrganizationEdit;
    editDialog.close();
    this.refresh();
  }

  _createOrganization() {
    const editDialog = this.shadowRoot!.getElementById(
      "editDialog"
    ) as YpOrganizationEdit;
    editDialog.setup(undefined, true, this._afterEdit.bind(this));
    editDialog.open(true, {});
  }

  _editOrganization(organization: any) {
    const editDialog = this.shadowRoot!.getElementById(
      "editDialog"
    ) as YpOrganizationEdit;
    editDialog.organization = organization;
    editDialog.setup(organization, false, this._afterEdit.bind(this));
    editDialog.open(false, {});
  }

  _organizationImageUrl(organization: any): string | null {
    if (organization.OrgLogoImgs) {
      return YpMediaHelpers.getImageFormatUrl(
        organization.OrgLogoImgs,
        2
      );
    } else {
      return null;
    }
  }
}
