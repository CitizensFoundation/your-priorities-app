var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import "@material/web/button/text-button.js";
import "@material/web/dialog/dialog.js";
import "./yp-registration-questions.js";
import { YpBaseElement } from "../common/yp-base-element.js";
let YpRegistrationQuestionsDialog = class YpRegistrationQuestionsDialog extends YpBaseElement {
    static get styles() {
        return [
            super.styles,
            css `
        [hidden] {
          display: none !important;
        }

        md-dialog[open][is-safari] {
          height: 100%;
        }

        yp-registration-questions {
          margin-top: 0;
          min-height: 15px;
          margin-bottom: 16px;
          text-align: left;
        }

        .upper {
          text-transform: capitalize;
        }
      `,
        ];
    }
    logout() {
        this.close();
        window.appUser.logout();
        setTimeout(() => {
            window.location.reload();
        }, 450);
    }
    render() {
        return html `
      <md-dialog
        id="dialog"
        @cancel="${this.scrimDisableAction}"
        ?is-safari="${this.isSafari}"
      >
        <div slot="headline">${this.t("registrationQuestionsInfo")}</div>
        <div slot="content">
          <yp-registration-questions
            id="registrationQuestions"
            @dom-change="${this._questionsUpdated}"
            @question-changed="${this._questionsUpdated}"
            @resize-scroller="${this._questionsUpdated}"
            .group="${this.registrationQuestionsGroup}"
          ></yp-registration-questions>
        </div>

        <div slot="actions">
          <md-text-button @click="${this.logout}"
            ><span class="upper">${this.t("user.logout")}</span></md-text-button
          >
          <md-text-button @click="${this._validateAndSend}" autofocus
            ><span class="upper"
              >${this.t("completeLogin")}</span
            ></md-text-button
          >
        </div>
      </md-dialog>
    `;
    }
    _onEnter(event) {
        if (event.keyCode == 13) {
            event.stopPropagation();
            this._validateAndSend();
        }
    }
    _questionsUpdated() {
        setTimeout(() => {
            //this.$$("#scrollable").fire('iron-resize');
        }, 100);
    }
    async _validateAndSend() {
        const registrationQuestions = this.$$("#registrationQuestions");
        if (registrationQuestions.validate()) {
            window.appGlobals.activity("submit", "registrationAnswers");
            //TODO: Check all serverApi for catch errors and how to handle that
            await window.appGlobals.serverApi.sendRegistrationQuestions(registrationQuestions.getAnswers());
            window.appUser.setHasRegistrationAnswers();
            this.fireGlobal("yp-registration-questions-done");
            this.close();
            return true;
        }
        else {
            //this.fire("yp-error", this.t("user.completeForm"));
            return false;
        }
    }
    async open(registrationQuestionsGroup) {
        this.registrationQuestionsGroup = registrationQuestionsGroup;
        this.requestUpdate();
        await this.updateComplete;
        this.$$("#dialog").show();
    }
    close() {
        this.$$("#dialog").close();
    }
};
__decorate([
    property({ type: Object })
], YpRegistrationQuestionsDialog.prototype, "registrationQuestionsGroup", void 0);
YpRegistrationQuestionsDialog = __decorate([
    customElement("yp-registration-questions-dialog")
], YpRegistrationQuestionsDialog);
export { YpRegistrationQuestionsDialog };
//# sourceMappingURL=yp-registration-questions-dialog.js.map