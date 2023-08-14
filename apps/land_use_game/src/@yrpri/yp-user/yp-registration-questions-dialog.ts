import { html, css } from "lit";
import { customElement, property } from "lit/decorators.js";

import "@material/web/button/text-button.js";
import "@material/web/dialog/dialog.js";

import "./yp-registration-questions.js";

import { YpBaseElement } from "../common/yp-base-element.js";

import { YpRegistrationQuestions } from "./yp-registration-questions.js";
import { Dialog } from "@material/web/dialog/internal/dialog.js";

@customElement("yp-registration-questions-dialog")
export class YpRegistrationQuestionsDialog extends YpBaseElement {
  @property({ type: Object })
  registrationQuestionsGroup: YpGroupData | undefined;

  static get styles() {
    return [
      super.styles,
      css`
        [hidden] {
          display: none !important;
        }

        md-dialog {
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
    return html`
      <md-dialog id="dialog" escapeKeyAction="" scrimClickAction="">
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
            ><span class="upper">${this.t("save")}</span></md-text-button
          >
        </div>
      </md-dialog>
    `;
  }

  _onEnter(event: KeyboardEvent) {
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
    const registrationQuestions = this.$$(
      "#registrationQuestions"
    ) as YpRegistrationQuestions;
    if (registrationQuestions.validate()) {
      window.appGlobals.activity("submit", "registrationAnswers");
      //TODO: Check all serverApi for catch errors and how to handle that
      await window.appGlobals.serverApi.sendRegistrationQuestions(
        registrationQuestions.getAnswers()
      );
      window.appUser.setHasRegistrationAnswers();
      this.fireGlobal("yp-registration-questions-done");
      this.close();
    } else {
      this.fire("yp-error", this.t("user.completeForm"));
      return false;
    }
  }

  async open(registrationQuestionsGroup: YpGroupData) {
    this.registrationQuestionsGroup = registrationQuestionsGroup;
    this.requestUpdate();

    await this.updateComplete;

    (this.$$("#dialog") as Dialog).show();
  }

  close() {
    (this.$$("#dialog") as Dialog).close();
  }
}
