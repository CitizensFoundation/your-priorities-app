import { html, css, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";

import "../yp-edit-dialog/yp-edit-dialog.js";
import "../yp-file-upload/yp-file-upload.js";

import { YpEditBase } from "../common/yp-edit-base.js";
import { YpFileUpload } from "../yp-file-upload/yp-file-upload.js";

@customElement("yp-category-edit")
export class YpCategoryEdit extends YpEditBase {
  @property({ type: Object })
  category: YpCategoryData | undefined;

  @property({ type: Object })
  group!: YpGroupData;

  @property({ type: Number })
  uploadedIconImageId: number | undefined;

  @property({ type: String })
  action = "/categories";

  static override get styles() {
    return [
      super.styles,
      css`
        md-outlined-text-field {
          margin-bottom: 16px;
        }
      `,
    ];
  }

  override render() {
    return html`
      <yp-edit-dialog
        id="editDialog"
        .title="${this.editHeaderText!}"
        icon="category"
        .action="${this.action}"
        method="${this.method}"
        .saveText="${this.saveText}"
        .snackbarText="${this.snackbarText}"
      >
        <h2 slot="h2">${this.editHeaderText}</h2>
        <md-outlined-text-field
          id="name"
          name="name"
          type="text"
          label="${this.t("name")}"
          .value="${this.category?.name || ""}"
          maxlength="60"
          charCounter
          class="mainInput"
        ></md-outlined-text-field>
        <yp-file-upload
          id="iconImageUpload"
          raised
          buttonIcon="photo_camera"
          .buttonText="${this.t("image.logo.upload")}"
          target="/api/images?itemType=category-icon"
          method="POST"
          @success="${this._logoImageUploaded}"
        ></yp-file-upload>
        ${this.uploadedIconImageId
          ? html`<input
              type="hidden"
              name="uploadedIconImageId"
              .value="${this.uploadedIconImageId}"
            />`
          : nothing}
      </yp-edit-dialog>
    `;
  }

  clear() {
    this.category = { id: -1, name: "", count: 0 } as YpCategoryData;
    this.uploadedIconImageId = undefined;
    (this.$$("#iconImageUpload") as YpFileUpload)?.clear();
  }

  setup(
    group: YpGroupData,
    newNotEdit: boolean,
    refreshFunction: Function,
    deletedFunction: Function,
    category?: YpCategoryData
  ) {
    this.group = group;
    this.new = newNotEdit;
    this.refreshFunction = refreshFunction;
    this.category = category ? { ...category } : { id: -1, name: "", count: 0 };
    if (category) {
      this.action = `/categories/${category.id}`;
    } else {
      this.action = `/groups/${this.group.id}/categories`;
    }
    this.setupTranslation();
  }

  setupTranslation() {
    if (this.new) {
      this.editHeaderText = this.t("New category");
      this.snackbarText = this.t("category.toast.created");
      this.saveText = this.t("create");
    } else {
      this.editHeaderText = this.t("Update category info");
      this.snackbarText = this.t("category.toast.updated");
      this.saveText = this.t("update");
    }
  }
}
