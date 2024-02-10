var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { css, html, nothing } from "lit";
import { property, customElement } from "lit/decorators.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { YpBaseElement } from "../../common/yp-base-element.js";
import { YpMediaHelpers } from "../../common/YpMediaHelpers.js";
import "../../common/yp-image.js";
import "@material/web/fab/fab.js";
import { SharedStyles } from "./SharedStyles.js";
import { YpNavHelpers } from "../../common/YpNavHelpers.js";
import { YpAccessHelpers } from "../../common/YpAccessHelpers.js";
let AoiSurveyIntro = class AoiSurveyIntro extends YpBaseElement {
    constructor() {
        super(...arguments);
        this.isAdmin = false;
        this.footer = null;
        this.footerEnd = null;
        this.footerTopObserver = null;
        this.footerEndObserver = null;
    }
    async connectedCallback() {
        super.connectedCallback();
        window.appGlobals.activity("Intro - open");
        this.isAdmin = YpAccessHelpers.checkGroupAccess(this.group);
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        window.appGlobals.activity(`Intro - close`);
        if (this.footerTopObserver) {
            this.footerTopObserver.disconnect();
            this.footerTopObserver = null;
        }
        if (this.footerEndObserver) {
            this.footerEndObserver.disconnect();
            this.footerEndObserver = null;
        }
    }
    firstUpdated() {
        this.setupFooterObserver();
    }
    _openAnalyticsAndPromption() {
        YpNavHelpers.redirectTo(`/analytics/group/${this.group.id}`);
    }
    _openAdmin() {
        YpNavHelpers.redirectTo(`/admin/group/${this.group.id}`);
    }
    renderAdminButtons() {
        return html `
      <div class="layout horizontal adminButtons">
        <md-icon-button
          id="menuButton"
          @click="${this._openAnalyticsAndPromption}"
          title="${this.t("Analytics")}"
          ><md-icon>analytics</md-icon>
        </md-icon-button>
        <md-icon-button
          id="menuButton"
          @click="${this._openAdmin}"
          title="${this.t("Admin")}"
          ><md-icon>settings</md-icon>
        </md-icon-button>
      </div>
    `;
    }
    setupFooterObserver() {
        this.footer = this.shadowRoot?.querySelector("#footerStart");
        this.footerEnd = this.shadowRoot?.querySelector("#footerEnd");
        this.footerTopObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    window.appGlobals.activity("Footer - start is visible");
                    this.footerTopObserver?.disconnect();
                }
            });
        }, { rootMargin: "-200px 0px" });
        this.footerEndObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    window.appGlobals.activity("Footer - end is visible");
                    this.footerEndObserver?.disconnect();
                }
            });
        }, { rootMargin: "0px" });
        if (this.footer)
            this.footerTopObserver.observe(this.footer);
        if (this.footerEnd)
            this.footerEndObserver.observe(this.footerEnd);
    }
    get formattedDescription() {
        return (this.earl.configuration.welcome_message || "").replace(/(\n)/g, "<br>");
    }
    clickStart() {
        this.fire("startVoting");
        window.appGlobals.activity("Intro - click start");
    }
    clickResults() {
        this.fire("openResults");
    }
    static get styles() {
        return [
            ...super.styles,
            SharedStyles,
            css `
        .footerHtml {
          margin: 16px;
          max-width: 600px;
          line-height: 1.5;
          color: var(--md-sys-color-on-background);
        }

        .adminButtons {
          margin-top: 16px;
        }

        .footerHtml a {
          color: var(--md-sys-color-on-background);
        }

        .fab {
          margin-top: 16px;
          margin-bottom: 8px;
          cursor: pointer !important;
        }

        .description {
          font-size: 18px;
          letter-spacing: 0.04em;
          line-height: 1.5;
          border-radius: 8px;
          max-width: 560px;
          vertical-align: center;
          margin-bottom: 16px;
          margin-top: 8px;
          padding: 16px;
          padding-left: 0;
          padding-right: 0;
        }

        :host {
        }

        .image {
          width: 632px;
          height: 356px;
          margin-top: 32px;
        }

        .questionTitle {
          max-width: 588px;
          width: 588px;
          padding: 20px;
          line-height: 1.5;
        }

        .questionTitle[dark-mode] {
          margin-top: 24px;
        }

        @media (max-width: 960px) {
          .image {
            width: 300px;
            height: 169px;
          }

          .questionTitle {
            max-width: 100%;
            width: 100%;
            padding: 16px;
            line-height: 1.5;
          }

          .description {
            max-width: 100%;
          }

          .footerHtml {
            max-width: 100%;
          }

          .questionTitle[dark-mode] {
          }

          .darkModeButton {
            margin-left: 12px;
            margin-right: 12px;
          }
        }
      `,
        ];
    }
    render() {
        if (this.question) {
            return html `
      <div class="topContainer layout vertical wrap center-center">
        <yp-image
          class="column image"
          sizing="contain"
          src="${YpMediaHelpers.getImageFormatUrl(this.group.GroupLogoImages)}"
        ></yp-image>
        <div class="questionTitle" ?dark-mode="${this.themeDarkMode}">
          <yp-magic-text
            id="answerText"
            .contentId="${this.group.id}"
            .extraId="${this.question.id}"
            textOnly
            truncate="300"
            .content="${this.question.name}"
            .contentLanguage="${this.group.language}"
            textType="aoiQuestionName"
          ></yp-magic-text>
        </div>
        <div class="description">${this.formattedDescription}</div>
        ${this.earl.active
                ? html `
              <md-fab
                extended
                variant="primary"
                class="fab"
                @click="${this.clickStart}"
                .label="${this.t("Start Voting")}"
                ><md-icon slot="icon">thumbs_up_down</md-icon></md-fab
              >
            `
                : html `
              <md-fab
                extended
                variant="primary"
                class="fab"
                @click="${this.clickResults}"
                .label="${this.t("Open Results")}"
                ><md-icon slot="icon">grading</md-icon></md-fab
              >
            `}
        ${this.isAdmin ? this.renderAdminButtons() : nothing}
        <div id="footerStart" class="footerHtml">
          ${this.earl.configuration && this.earl.configuration.welcome_html
                ? unsafeHTML(this.earl.configuration.welcome_html)
                : nothing}
        </div>
        <div id="footerEnd">&nbsp;</div>
      </div>
    `;
        }
        else {
            return nothing;
        }
    }
};
__decorate([
    property({ type: Object })
], AoiSurveyIntro.prototype, "earl", void 0);
__decorate([
    property({ type: Object })
], AoiSurveyIntro.prototype, "group", void 0);
__decorate([
    property({ type: Object })
], AoiSurveyIntro.prototype, "question", void 0);
__decorate([
    property({ type: Boolean })
], AoiSurveyIntro.prototype, "isAdmin", void 0);
AoiSurveyIntro = __decorate([
    customElement("aoi-survey-intro")
], AoiSurveyIntro);
export { AoiSurveyIntro };
//# sourceMappingURL=aoi-survey-intro.js.map