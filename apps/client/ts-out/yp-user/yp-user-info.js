var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import "@material/web/button/text-button.js";
import "@material/web/button/outlined-button.js";
import { YpBaseElement } from "../common/yp-base-element.js";
import "./yp-user-image.js";
let YpUserInfo = class YpUserInfo extends YpBaseElement {
    static get styles() {
        return [
            super.styles,
            css `
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
    render() {
        return html `
      ${this.user
            ? html `
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
                  <md-outlined-button @click="${this._openAllContentModeration}"
                    >${this.t("myContent")}</md-outlined-button
                  >
                  <md-outlined-button @click="${this._logout}"
                    >${this.t("user.logout")}</md-outlined-button
                  >
                </div>
              </div>
            </div>
          `
            : html ``}
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
};
__decorate([
    property({ type: Object })
], YpUserInfo.prototype, "user", void 0);
YpUserInfo = __decorate([
    customElement("yp-user-info")
], YpUserInfo);
export { YpUserInfo };
//# sourceMappingURL=yp-user-info.js.map