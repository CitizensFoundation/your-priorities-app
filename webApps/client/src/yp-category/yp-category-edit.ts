import { html, css, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";

import "../yp-edit-dialog/yp-edit-dialog.js";
import "../yp-file-upload/yp-file-upload.js";

import { YpEditBase } from "../common/yp-edit-base.js";
import { YpFileUpload } from "../yp-file-upload/yp-file-upload.js";
import { YpConfirmationDialog } from "../yp-dialog-container/yp-confirmation-dialog.js";

@customElement("yp-category-edit")
export class YpCategoryEdit extends YpEditBase {
  @property({ type: Object })
  category: YpCategoryData | undefined;

  @property({ type: Object })
  group!: YpGroupData;

  @property({ type: Number })
  uploadedIconImageId: number | undefined;

  @property({ type: Object })
  deletedFunction: Function | undefined;

  @property({ type: String })
  action = "/categories";

  static override get styles() {
    return [
      super.styles,
      css`
        md-outlined-text-field {
          margin-bottom: 16px;
        }

        .deleteButton {
          --md-sys-color-primary: var(--md-sys-color-error);
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

        ${!this.new
          ? html`<md-text-button
              slot="actions"
              class="deleteButton"
              @click="${this._deleteCategory}"
              >${this.t("deleteCategory")}</md-text-button
            >`
          : nothing}
      </yp-edit-dialog>
    `;
  }

  clear() {
    this.category = { id: -1, name: "", count: 0 } as YpCategoryData;
    this.uploadedIconImageId = undefined;
    (this.$$("#iconImageUpload") as YpFileUpload)?.clear();
  }

  _deleteCategory() {
    window.appDialogs.getDialogAsync(
      "confirmationDialog",
      (dialog: YpConfirmationDialog) => {
        dialog.open(
          this.t("deleteCategory"),
          this._reallyDeleteCategory.bind(this),
          false,
          true
        );
      }
    );
  }

  async _reallyDeleteCategory() {
    if (this.category) {
      await window.adminServerApi.deleteCategory(this.category.id);
      if (typeof this.deletedFunction === "function") {
        this.deletedFunction(this.category);
      }
      this.close();
      window.appGlobals.notifyUserViaToast(this.t("categoryDeleted"));
    }
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
    this.deletedFunction = deletedFunction;
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
