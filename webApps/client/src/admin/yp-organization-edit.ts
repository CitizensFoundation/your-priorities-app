import { html, css, LitElement, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import "@material/web/textfield/outlined-text-field.js";

import "../yp-file-upload/yp-file-upload.js";
import "../yp-edit-dialog/yp-edit-dialog.js";
import { YpBaseElement } from "../common/yp-base-element.js";
import { YpFileUpload } from "../yp-file-upload/yp-file-upload.js";
import { YpEditBase } from "../common/yp-edit-base.js";

@customElement("yp-organization-edit")
export class YpOrganizationEdit extends YpEditBase {
  @property({ type: Object })
  organization: YpOrganizationData | undefined;

  @property({ type: String })
  organizationAccess: string = "public";

  @property({ type: Number })
  domainId: number | undefined;

  @property({ type: String })
  action: string = "/organizations";

  @property({ type: Number })
  override uploadedLogoImageId: number | undefined;

  static override get styles() {
    return [
      super.styles,
      css`
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

  override connectedCallback(): void {
    super.connectedCallback();
    this.action = `/organizations/${this.domainId}`;
  }

  override render() {
    return html`
      <yp-edit-dialog
        id="editDialog"
        .title="${this.editHeaderText!}"
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
          ? html` <input
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
    (this.$$("#logoImageUpload") as YpFileUpload).clear();
  }

  setup(
    organization: YpOrganizationData | undefined,
    newNotEdit: boolean,
    refreshFunction: Function
  ) {
    this.clear();
    if (!organization) {
      this.organization = { id: -1, name: "", description: "" };
      this.action = `/organizations/${this.domainId}`;
    } else {
      this.organization = organization;
      this.action = `/organizations/${this.organization!.id}`;
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
    } else {
      this.editHeaderText = this.t("Update organization info");
      this.snackbarText = this.t("organization.toast.updated");
      this.saveText = this.t("update");
    }
  }
}
