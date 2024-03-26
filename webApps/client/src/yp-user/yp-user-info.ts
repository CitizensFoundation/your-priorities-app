import { html, css } from "lit";
import { customElement, property } from "lit/decorators.js";

import "@material/web/button/text-button.js";
import "@material/web/button/outlined-button.js";

import { YpBaseElement } from "../common/yp-base-element.js";

import "./yp-user-image.js";

@customElement("yp-user-info")
export class YpUserInfo extends YpBaseElement {
  @property({ type: Object })
  user!: YpUserData;

  static override get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
        }

        .avatar-container {
          position: relative;
          border: 2px solid var(--md-sys-color-primary);
          border-radius: 50%;
          height: 90px;
          padding: 2px;
          width: 90px;
          margin: 20px auto;
        }

        .contact-info {
          margin: 0 20px;
          padding-bottom: 4px;
          text-align: center;
        }

        .contact-info .name {
          font-weight: bold;
        }

        .contact-info .email {
        }

        .buttons {
          margin-top: 8px;
        }

        .hasPointer {
          cursor: pointer;
        }
        md-outlined-button {
          margin-top: 12px;
          margin-bottom: 8px;
        }
      `,
    ];
  }

  //TODO: Renable My content
  override render() {
    return html`
      ${this.user
        ? html`
            <div class="mainContainer">
              <div class="avatar-container">
                <yp-user-image
                  class="hasPointer"
                  large
                  .user="${this.user}"
                  @click="${this._openEdit}"
                ></yp-user-image>
              </div>
              <div class="contact-info">
                <div class="name">${this.user.name}</div>
                <div class="email">${this.user.email}</div>
                <div class="layout vertical center-justified buttons">
                  <md-outlined-button @click="${this._openEdit}"
                    >${this.t("user.edit")}</md-outlined-button
                  >
                  <md-outlined-button hidden @click="${this._openAllContentModeration}"
                    >${this.t("myContent")}</md-outlined-button
                  >
                  <md-outlined-button @click="${this._logout}"
                    >${this.t("user.logout")}</md-outlined-button
                  >
                </div>
              </div>
            </div>
          `
        : html``}
    `;
  }

  _openAllContentModeration() {
    window.appGlobals.activity("open", "userAllContentModeration");
    //TODO: News
    /*window.appDialogs.getContentModerationAsync( (dialog) => {
      dialog.setup(null, null, null, '/moderate_all_content', this.user.id);
      dialog.open(this.user.name);
    });*/
  }

  _openEdit() {
    this.fire("open-user-edit");
  }

  _logout() {
    window.appUser.logout();
  }
}
