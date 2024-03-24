var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
//import 'chart.js';
import { css, html, nothing } from "lit";
import { property, customElement, state } from "lit/decorators.js";
import "@material/web/textfield/outlined-text-field.js";
import "@material/web/button/filled-button.js";
import "@material/web/select/outlined-select.js";
import "@material/web/select/select-option.js";
import "@material/web/progress/linear-progress.js";
import "@material/web/tabs/tabs.js";
import "@material/web/tabs/secondary-tab.js";
import { YpAdminPage } from "./yp-admin-page.js";
let YpAdminReports = class YpAdminReports extends YpAdminPage {
    constructor() {
        super(...arguments);
        this.action = "/api/communities";
        this.selectedTab = 0;
        this.downloadDisabled = false;
        this.autoTranslateActive = false;
        this.fraudAuditSelectionActive = false;
        this.waitingOnFraudAudits = false;
    }
    refresh() {
        this.reportUrl = undefined;
        this.reportGenerationUrl = undefined;
        this.error = undefined;
        this.progress = undefined;
        this.selectedFraudAuditId = undefined;
        this.fraudAuditsAvailable = undefined;
        this.waitingOnFraudAudits = false;
        this.fraudAuditSelectionActive = false;
        this._tabChanged();
    }
    connectedCallback() {
        super.connectedCallback();
        if (this.collectionType == "group" &&
            this.collection &&
            this.collection.configuration.allOurIdeas) {
            this.allOurIdeasQuestionId = this.collection.configuration.allOurIdeas?.earl?.question_id;
        }
        else {
            this.allOurIdeasQuestionId = undefined;
        }
        this.addGlobalListener("yp-refresh-admin-content", this.refresh.bind(this));
    }
    disconnectedCallback() {
        this.removeGlobalListener("yp-refresh-admin-content", this.refresh.bind(this));
        super.disconnectedCallback();
    }
    fraudItemSelection(event) {
        this.selectedFraudAuditId = parseInt(event.target.getAttribute("data-args"));
        this.startReportCreation();
    }
    startReportCreation() {
        let url = this.action; // Adjust the URL as needed
        const body = {
            selectedFraudAuditId: this.selectedFraudAuditId,
        };
        this.progress = 0;
        fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        })
            .then((response) => response.json())
            .then((data) => this.startReportCreationResponse(data))
            .catch((error) => {
            console.error("Error:", error);
            this.progress = undefined;
        });
    }
    startReportCreationResponse(data) {
        this.jobId = data.jobId;
        this.progress = 5;
        let baseUrl = this.collectionType == "group"
            ? `/api/groups/${this.collectionId}`
            : `/api/communities/${this.collectionId}`;
        if (this.allOurIdeasQuestionId) {
            baseUrl = `/api/allOurIdeas/${this.collectionId}`;
            this.reportCreationProgressUrl = `${baseUrl}/${this.jobId}/report_creation_progress?questionId=${this.allOurIdeasQuestionId}`;
        }
        else {
            this.reportCreationProgressUrl = `${baseUrl}/${this.jobId}/report_creation_progress`;
        }
        this.pollLaterForProgress();
    }
    pollLaterForProgress() {
        setTimeout(() => {
            this.reportCreationProgress();
        }, 1000);
    }
    reportCreationProgress() {
        fetch(this.reportCreationProgressUrl)
            .then((response) => response.json())
            .then((data) => this.reportCreationProgressResponse(data))
            .catch((error) => console.error("Error:", error));
    }
    formatAuditReportDates(data) {
        return data.map((item) => {
            if (item.date) {
                // Use date-fns or another library if you need date formatting
                // item.date = format(new Date(item.date), "dd/MM/yyyy HH:mm:ss");
                item.date = new Date(item.date).toLocaleString();
            }
            return item;
        });
    }
    fraudAuditsAjaxResponse(event) {
        this.waitingOnFraudAudits = false;
        this.fraudAuditsAvailable = this.formatAuditReportDates(event.detail.response);
    }
    reportCreationProgressResponse(response) {
        if (!response.error &&
            response.progress != null &&
            response.progress < 100) {
            this.pollLaterForProgress();
        }
        this.progress = response.progress;
        if (response.error) {
            this.error = this.t(response.error); // Assuming `this.t` is a translation method you have
        }
        if (response.data) {
            this.reportUrl = response.data.reportUrl;
            setTimeout(() => {
                this.downloadDisabled = true;
            }, 59 * 60 * 1000); // 59 minutes
        }
    }
    // Use updated property instead of a method for fraudAuditSelectionActive
    updated(changedProperties) {
        if (changedProperties.has("type") ||
            changedProperties.has("selectedFraudAuditId")) {
            this.fraudAuditSelectionActive =
                this.type === "fraudAuditReport" && !this.selectedFraudAuditId;
        }
    }
    startGeneration() {
        if (this.type == "fraudAuditReport") {
            this.waitingOnFraudAudits = true;
            this.progress = 0;
            const response = window.adminServerApi.adminMethod(this.reportGenerationUrl, "GET");
            this.waitingOnFraudAudits = false;
            this.progress = undefined;
            this.fraudAuditsAvailable = this.formatAuditReportDates(response);
        }
        else {
            this.startReportCreationAjax(this.reportGenerationUrl);
        }
    }
    startReportCreationAjax(url) {
        this.progress = 0;
        fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({}), // Adjust body as needed
        })
            .then((response) => response.json())
            .then((data) => this.startReportCreationResponse(data))
            .catch((error) => console.error("Error:", error));
    }
    getFraudAuditsAjax(url) {
        fetch(url)
            .then((response) => response.json())
            .then((data) => this.fraudAuditsAjaxResponse({ detail: { response: data } }))
            .catch((error) => console.error("Error:", error));
    }
    static get styles() {
        return [
            super.styles,
            css `
        md-filled-button {
          margin-top: 32px;
          margin-bottom: 16px;
        }

        md-outlined-button {
          margin-top: 32px;
          margin-bottom: 16px;
        }

        md-linear-progress {
          width: 320px;
          margin-top: 8px;
        }

        md-tabs {
          max-width: 650px;
          width: 605px;
        }
        @media (max-width: 650px) {
          md-tabs {
            width: 100%;
          }
        }
      `,
        ];
    }
    firstUpdated(_changedProperties) {
        setTimeout(() => {
            this._tabChanged();
        });
    }
    _tabChanged() {
        const tabs = this.$$("#tabs");
        this.selectedTab = tabs.activeTabIndex;
        this.reportGenerationUrl = undefined;
        this.reportUrl = undefined;
        if (this.collectionType == "group") {
            if (tabs.activeTabIndex === 0) {
                this.type = "xls";
                this.toastText = this.t("haveCreatedXLsReport");
            }
            else if (tabs.activeTabIndex === 1) {
                this.type = "docx";
                this.toastText = this.t("haveCreatedDocxReport");
            }
            this.reportGenerationUrl = `/api/groups/${this.collectionId}/${this.type}/start_report_creation`;
            if (this.allOurIdeasQuestionId) {
                this.reportGenerationUrl = `/api/allOurIdeas/${this.collectionId}/${this.type}/start_report_creation?questionId=${this.allOurIdeasQuestionId}`;
            }
        }
        else if (this.collectionType == "community") {
            if (tabs.activeTabIndex === 0) {
                this.type = "usersxls";
                this.reportGenerationUrl = `/api/communities/${this.collectionId}/${this.type}/start_report_creation`;
                this.toastText = this.t("haveCreatedXLsReport");
            }
            else if (tabs.activeTabIndex === 1) {
                this.type = "fraudAuditReport";
                this.reportGenerationUrl = `/api/communities/${this.collectionId}/getFraudAudits`;
                this.toastText = this.t("haveCreatedFraudAuditReport");
            }
        }
        if (window.autoTranslate) {
            this.reportGenerationUrl += `?translateLanguage=${this.language}`;
        }
    }
    renderStart() {
        return html `
      <div class="layout vertical center-center startButton">
        <md-outlined-button @click="${this.startGeneration}">
          ${this.t("startReportCreation")}
        </md-outlined-button>
        ${this.progress !== undefined
            ? html `<md-linear-progress
              .value="${this.progress / 100}"
            ></md-linear-progress> `
            : nothing}
      </div>
    `;
    }
    renderDownload() {
        return html `
      ${this.fraudAuditSelectionActive
            ? html `
            ${this.waitingOnFraudAudits
                ? html `<md-linear-progress indeterminate></md-linear-progress>`
                : html `
                  <div class="auditContainer layout vertical center-center">
                    ${this.fraudAuditsAvailable?.map((fraudItem) => html `
                        <md-text-button
                          raised
                          class="layout horizontal fraudItemSelection"
                          data-args="${fraudItem.logId}"
                          @click="${this.fraudItemSelection}"
                        >
                          ${fraudItem.date}<br />${fraudItem.userName}
                        </md-text-button>
                      `)}
                  </div>
                `}
          `
            : html `
            <div class="error" ?hidden="${!this.error}">${this.error}</div>
            ${this.reportUrl
                ? html `
                  <a
                    href="${this.reportUrl}"
                    target="_blank"
                    ?hidden="${this.downloadDisabled}"
                  >
                    <md-filled-button
                      id="downloadReportButton"
                      ?disabled="${this.downloadDisabled}"
                      raised
                    >
                      ${this.t("downloadReport")}
                    </md-filled-button>
                  </a>
                  <div class="infoText reportText">
                    ${this.t("reportLinkInfo")}
                  </div>
                  <div
                    class="infoText expiredText"
                    ?hidden="${!this.downloadDisabled}"
                  >
                    ${this.t("downloadHasExpired")}
                  </div>
                `
                : nothing}
          `}
    `;
    }
    render() {
        return html `
      <div class="layout vertical center-center">
        <md-tabs
          id="tabs"
          @change="${this._tabChanged}"
          .activeTabIndex="${this.selectedTab}"
          id="paperTabs"
        >
          ${this.collectionType == "group"
            ? html `
                <md-secondary-tab
                  >${this.t("createXlsReport")}<md-icon
                    >lightbulb_outline</md-icon
                  ></md-secondary-tab
                >
                <md-secondary-tab
                  ?hidden="${this.allOurIdeasQuestionId != undefined}"
                  >${this.t("createDocxReport")}<md-icon
                    >lightbulb_outline</md-icon
                  ></md-secondary-tab
                >
              `
            : nothing}
          ${this.collectionType == "community"
            ? html `
                <md-secondary-tab
                  >${this.t("createXlsUsersReport")}<md-icon
                    >lightbulb_outline</md-icon
                  ></md-secondary-tab
                >
                <md-secondary-tab
                  ?hidden="${!this.collection.configuration
                .enableFraudDetection}"
                  >${this.t("downloadFraudAuditReport")}<md-icon
                    >lightbulb_outline</md-icon
                  ></md-secondary-tab
                >
              `
            : nothing}
        </md-tabs>
      </div>
      <div class="layout vertical center-center">
        ${this.reportGenerationUrl &&
            !this.reportUrl &&
            !this.fraudAuditsAvailable
            ? this.renderStart()
            : this.renderDownload()}
      </div>
    `;
    }
};
__decorate([
    property({ type: String })
], YpAdminReports.prototype, "action", void 0);
__decorate([
    property({ type: String })
], YpAdminReports.prototype, "type", void 0);
__decorate([
    property({ type: Number })
], YpAdminReports.prototype, "progress", void 0);
__decorate([
    property({ type: Number })
], YpAdminReports.prototype, "selectedTab", void 0);
__decorate([
    property({ type: String })
], YpAdminReports.prototype, "error", void 0);
__decorate([
    property({ type: Number })
], YpAdminReports.prototype, "jobId", void 0);
__decorate([
    property({ type: String })
], YpAdminReports.prototype, "reportUrl", void 0);
__decorate([
    property({ type: String })
], YpAdminReports.prototype, "reportGenerationUrl", void 0);
__decorate([
    property({ type: Boolean })
], YpAdminReports.prototype, "downloadDisabled", void 0);
__decorate([
    property({ type: Number })
], YpAdminReports.prototype, "allOurIdeasQuestionId", void 0);
__decorate([
    property({ type: String })
], YpAdminReports.prototype, "toastText", void 0);
__decorate([
    property({ type: Boolean })
], YpAdminReports.prototype, "autoTranslateActive", void 0);
__decorate([
    property({ type: Number })
], YpAdminReports.prototype, "selectedFraudAuditId", void 0);
__decorate([
    state()
], YpAdminReports.prototype, "fraudAuditSelectionActive", void 0);
__decorate([
    property({ type: Array })
], YpAdminReports.prototype, "fraudAuditsAvailable", void 0);
__decorate([
    property({ type: Boolean })
], YpAdminReports.prototype, "waitingOnFraudAudits", void 0);
__decorate([
    property({ type: String })
], YpAdminReports.prototype, "reportCreationProgressUrl", void 0);
YpAdminReports = __decorate([
    customElement("yp-admin-reports")
], YpAdminReports);
export { YpAdminReports };
//# sourceMappingURL=yp-admin-reports.js.map