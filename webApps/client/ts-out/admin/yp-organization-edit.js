var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, css, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import "@material/web/textfield/outlined-text-field.js";
import "../yp-file-upload/yp-file-upload.js";
import "../yp-edit-dialog/yp-edit-dialog.js";
import { YpEditBase } from "../common/yp-edit-base.js";
let YpOrganizationEdit = class YpOrganizationEdit extends YpEditBase {
    constructor() {
        super(...arguments);
        this.organizationAccess = "public";
        this.action = "/organizations";
    }
    static get styles() {
        return [
            super.styles,
            css `
        :host {
          display: block;
        }

        .additionalSettings {
          padding-top: 16px;
        }

        md-outlined-text-field {
          margin-bottom: 16px;
        }

        .half {
          width: 50%;
        }
      `,
        ];
    }
    connectedCallback() {
        super.connectedCallback();
        this.action = `/organizations/${this.domainId}`;
    }
    render() {
        return html `
      <yp-edit-dialog
        id="editDialog"
        .title="${this.editHeaderText}"
        icon="business-center"
        .action="${this.action}"
        method="${this.method}"
        .saveText="${this.saveText}"
        .snackbarText="${this.snackbarText}"
      >
        <h2 slot="h2">${this.editHeaderText}</h2>

        <div class="layout vertical">
          <md-outlined-text-field
            id="name"
            name="name"
            type="text"
            label="${this.t("name")}"
            .value="${this.organization?.name || ""}"
            maxlength="60"
            charCounter
            class="mainInput"
          ></md-outlined-text-field>

          <md-outlined-text-field
            type="textarea"
            id="description"
            name="description"
            .value="${this.organization?.description || ""}"
            label="${this.t("description")}"
            charCounter
            rows="2"
            max-rows="5"
            maxlength="300"
            class="mainInput"
          ></md-outlined-text-field>

          <md-outlined-text-field
            id="website"
            name="website"
            type="text"
            label="${this.t("website")}"
            .value="${this.organization?.website || ""}"
            maxlength="256"
            charCounter
            class="mainInput"
          ></md-outlined-text-field>
        </div>

        <div class="layout horizontal center-center">
          <div class="layout vertical additionalSettings half">
            <yp-file-upload
              id="logoImageUpload"
              raised
              buttonIcon="photo_camera"
              .buttonText="${this.t("image.logo.upload")}"
              target="/api/images?itemType=organization-logo"
              method="POST"
              @success="${this._logoImageUploaded}"
            >
            </yp-file-upload>
          </div>
        </div>

        ${this.uploadedLogoImageId
            ? html ` <input
              type="hidden"
              name="uploadedLogoImageId"
              .value="${this.uploadedLogoImageId}"
            />`
            : nothing}
      </yp-edit-dialog>
    `;
    }
    clear() {
        this.organization = { id: -1, name: "", description: "", website: "" };
        this.uploadedLogoImageId = undefined;
        this.$$("#logoImageUpload").clear();
    }
    setup(organization, newNotEdit, refreshFunction) {
        this.clear();
        if (!organization) {
            this.organization = { id: -1, name: "", description: "" };
            this.action = `/organizations/${this.domainId}`;
        }
        else {
            this.organization = organization;
            this.action = `/organizations/${this.organization.id}`;
        }
        this.new = newNotEdit;
        this.refreshFunction = refreshFunction;
        this.setupTranslation();
    }
    setupTranslation() {
        if (this.new) {
            this.editHeaderText = this.t("organization.new");
            this.snackbarText = this.t("organization.toast.created");
            this.saveText = this.t("create");
        }
        else {
            this.editHeaderText = this.t("Update organization info");
            this.snackbarText = this.t("organization.toast.updated");
            this.saveText = this.t("update");
        }
    }
};
__decorate([
    property({ type: Object })
], YpOrganizationEdit.prototype, "organization", void 0);
__decorate([
    property({ type: String })
], YpOrganizationEdit.prototype, "organizationAccess", void 0);
__decorate([
    property({ type: Number })
], YpOrganizationEdit.prototype, "domainId", void 0);
__decorate([
    property({ type: String })
], YpOrganizationEdit.prototype, "action", void 0);
__decorate([
    property({ type: Number })
], YpOrganizationEdit.prototype, "uploadedLogoImageId", void 0);
YpOrganizationEdit = __decorate([
    customElement("yp-organization-edit")
], YpOrganizationEdit);
export { YpOrganizationEdit };
//# sourceMappingURL=yp-organization-edit.js.map