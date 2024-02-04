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

@customElement("aoi-survey-intro")
export class AoiSurveyIntro extends YpBaseElement {
  @property({ type: Object })
  earl!: AoiEarlData;

  @property({ type: Object })
  group!: YpGroupData;

  @property({ type: Object })
  question!: AoiQuestionData;

  @property({ type: Boolean })
  isAdmin = false;

  private footer: Element | null | undefined = null;
  private footerEnd: Element | null | undefined = null;
  private footerTopObserver: IntersectionObserver | null = null;
  private footerEndObserver: IntersectionObserver | null = null;

  override async connectedCallback() {
    super.connectedCallback();
    window.appGlobals.activity("Intro - open");
    this.isAdmin = YpAccessHelpers.checkGroupAccess(this.group);
  }

  override disconnectedCallback(): void {
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

  override firstUpdated() {
    this.setupFooterObserver();
  }

  _openAnalyticsAndPromption() {
    YpNavHelpers.redirectTo(`/analytics/group/${this.group!.id}`);
  }

  _openAdmin() {
    YpNavHelpers.redirectTo(`/admin/group/${this.group!.id}`);
  }

  renderAdminButtons() {
    return html`
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

    this.footerTopObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            window.appGlobals.activity("Footer - start is visible");
            this.footerTopObserver?.disconnect();
          }
        });
      },
      { rootMargin: "-200px 0px" }
    );

    this.footerEndObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            window.appGlobals.activity("Footer - end is visible");
            this.footerEndObserver?.disconnect();
          }
        });
      },
      { rootMargin: "0px" }
    );

    if (this.footer) this.footerTopObserver.observe(this.footer);
    if (this.footerEnd) this.footerEndObserver.observe(this.footerEnd);
  }

  get formattedDescription() {
    return (this.earl.configuration!.welcome_message || "").replace(
      /(\n)/g,
      "<br>"
    );
  }

  clickStart() {
    this.fire("startVoting");
    window.appGlobals.activity("Intro - click start");
  }

  clickResults() {
    this.fire("openResults");
  }

  static override get styles() {
    return [
      ...super.styles,
      SharedStyles,
      css`
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
          font-size: 16px;
          letter-spacing: 0.04em;
          line-height: 1.5;
          border-radius: 8px;
          max-width: 560px;
          vertical-align: center;
          margin-bottom: 16px;
          margin-top: 16px;
          padding: 24px;
          color: var(--md-sys-color-primary);
          background-color: var(--md-sys-color-on-primary);
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
            width: 332px;
            height: 187px;
          }

          .description {
            max-width: 300px;
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

  override render() {
    if (this.question) {
      return html`
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
            text-only
            truncate="300"
            .content="${this.question.name}"
            .contentLanguage="${this.group.language}"
            textType="aoiQuestionName"
          ></yp-magic-text>
        </div>
        <div class="description">${this.formattedDescription}</div>
        ${this.earl.active
          ? html`
              <md-fab
                extended
                variant="primary"
                class="fab"
                @click="${this.clickStart}"
                .label="${this.t("Start Voting")}"
                ><md-icon slot="icon">thumbs_up_down</md-icon></md-fab
              >
            `
          : html`
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
    } else {
      return nothing;
    }
  }
}
