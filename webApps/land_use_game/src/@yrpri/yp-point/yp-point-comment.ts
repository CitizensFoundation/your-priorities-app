import { html, css, nothing } from "lit";
import { property, customElement } from "lit/decorators.js";

import "@material/mwc-icon-button";
import "@material/web/iconbutton/icon-button.js";

import "../yp-user/yp-user-image.js";
import "../yp-user/yp-user-with-organization.js";
import "./yp-point-actions.js";

import { YpAccessHelpers } from "../common/YpAccessHelpers.js";
import { YpBaseElementWithLogin } from "../common/yp-base-element-with-login.js";
import { YpConfirmationDialog } from "../yp-dialog-container/yp-confirmation-dialog.js";
import { YpApiActionDialog } from "../yp-api-action-dialog/yp-api-action-dialog.js";
import { Layouts } from "../../flexbox-literals/classes.js";

@customElement("yp-point-comment")
export class YpPointComment extends YpBaseElementWithLogin {
  @property({ type: Object })
  point: YpPointData | undefined;

  @property({ type: Object })
  user: YpUserData | undefined;

  @property({ type: Boolean })
  hideUser = false;

  updated(changedProperties: Map<string | number | symbol, unknown>): void {
    super.updated(changedProperties);

    if (changedProperties.has("point")) {
      this._pointChanged();
    }
  }

  static get styles() {
    return [
      Layouts,
      css`
        .userName {
        }

        .extraActions {
          margin-top: 16px;
        }

        yp-user-image {
          padding-top: 16px;
          padding-right: 8px;
        }

        .userName {
          padding-bottom: 4px;
        }

        .comment {
          margin-left: 8px;
          margin-right: 8px;
          padding-bottom: 4px;
          margin-bottom: 8px;
          padding-top: 16px;
          max-width: 300px;
        }

        .commentDash {
          border-bottom: dashed;
          border-bottom-width: 1px;
        }

        yp-point-actions {
          padding-top: 8px;
        }

        #reportPointIconButton {
          width: 36px;
          height: 36px;
        }

        [hidden] {
          display: none !important;
        }

        #deleteButton {
        }
      `,
    ];
  }

  render() {
    return this.point
      ? html`
          <div class="layout ${this.wide ? "horizontal" : "vertical"}">
            <div class="layout horizontal">
              <yp-user-with-organization
                .user="${this.user}"
              ></yp-user-with-organization>
            </div>
            <div class="layout vertical">
              <div class="comment">
                ${this.point.content}
                <div class="layout horizontal">
                  <yp-point-actions
                    .point="${this.point}"
                    hideSharing
                  ></yp-point-actions>
                  <div class="extraActions layout horizontal">
                    <md-icon-button
                      ?hisdden=""
                      ?hidsddden="${!this.loggedInUser}"
                      hidden
                      .label="${this.t("point.report")}"
                      id="reportPointIconButton"
                      @click="${this._reportPoint}"
                      ><md-icon>warning</md-icon></md-icon-button
                    >

                    ${this.hasPointAccess
                      ? html`
                          <div class="layout horizontal self-end">
                            <md-icon-button
                              id="deleteButton"
                              .label="${this.t("delete")}"
                              @click="${this._deletePoint}"
                              ><md-icon>clear</md-icon></md-icon-button
                            >
                          </div>
                        `
                      : html``}
                  </div>
                </div>
              </div>
            </div>
          </div>
        `
      : nothing;
  }

  connectedCallback() {
    super.connectedCallback();
    this.addGlobalListener("yp-logged-in", this.requestUpdate.bind(this));
    this.addGlobalListener(
      "yp-got-admin-rights",
      this.requestUpdate.bind(this)
    );
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeGlobalListener("yp-logged-in", this.requestUpdate.bind(this));
    this.removeGlobalListener(
      "yp-got-admin-rights",
      this.requestUpdate.bind(this)
    );
  }

  _deletePoint() {
    window.appDialogs.getDialogAsync(
      "confirmationDialog",
      (dialog: YpConfirmationDialog) => {
        dialog.open(
          this.t("point.confirmDelete"),
          this._reallyDeletePoint.bind(this)
        );
      }
    );
  }

  async _reallyDeletePoint() {
    if (this.point) {
      await window.serverApi.deletePoint(this.point.id);
      this.fire("yp-point-deleted", { pointId: this.point!.id });
      this.fire("iron-resize");
      this.point = undefined;
    }
  }

  _reportPoint() {
    window.appGlobals.activity("open", "point.report");
    window.appDialogs.getDialogAsync(
      "apiActionDialog",
      (dialog: YpApiActionDialog) => {
        dialog.setup(
          "/api/points/" + this.point!.id + "/report",
          this.t("reportConfirmation"),
          this._onReport.bind(this),
          this.t("point.report"),
          "PUT"
        );
        dialog.open();
      }
    );
  }

  _onReport() {
    window.appGlobals.notifyUserViaToast(
      this.t("point.report") + ": " + this.point!.content
    );
  }

  _pointChanged() {
    if (this.point) {
      this.user = this.point.PointRevisions![0].User;
    } else {
      this.user = undefined;
    }
  }

  get hasPointAccess() {
    return this.point && YpAccessHelpers.checkPointAccess(this.point);
  }

  loginName() {
    return this.point && this.point.PointRevisions![0].User.name;
  }
}
