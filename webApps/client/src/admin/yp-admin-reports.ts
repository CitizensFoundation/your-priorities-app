//import 'chart.js';
import { LitElement, PropertyValueMap, css, html, nothing } from "lit";
import { property, customElement, state } from "lit/decorators.js";
import "@material/web/textfield/outlined-text-field.js";
import "@material/web/button/filled-button.js";
import "@material/web/select/outlined-select.js";
import "@material/web/select/select-option.js";
import "@material/web/progress/linear-progress.js";
import "@material/web/tabs/tabs.js";
import "@material/web/tabs/secondary-tab.js";

import { YpAdminPage } from "./yp-admin-page.js";
import { MdTabs } from "@material/web/tabs/tabs.js";

@customElement("yp-admin-reports")
export class YpAdminReports extends YpAdminPage {
  @property({ type: String })
  action = "/api/communities";

  @property({ type: String })
  type: "fraudAuditReport" | "docx" | "xls" | "usersxls" | undefined;

  @property({ type: Number })
  progress: number | undefined;

  @property({ type: Number })
  selectedTab = 0;

  @property({ type: String })
  error: string | undefined;

  @property({ type: Number })
  jobId: number | undefined;

  @property({ type: String })
  reportUrl: string | undefined;

  @property({ type: String })
  reportGenerationUrl: string | undefined;

  @property({ type: Boolean })
  downloadDisabled = false;

  @property({ type: Boolean })
  isAllOurIdeasGroup = false;

  @property({ type: String })
  toastText: string | undefined;

  @property({ type: Boolean })
  autoTranslateActive = false;

  @property({ type: Number })
  selectedFraudAuditId: number | undefined;

  @state() fraudAuditSelectionActive = false;

  @property({ type: Array })
  fraudAuditsAvailable: YpFraudAuditData[] | undefined;

  @property({ type: Boolean })
  waitingOnFraudAudits = false;

  @property({ type: String })
  reportCreationProgressUrl: string | undefined;


  override connectedCallback(): void {
    super.connectedCallback();
    if (this.collectionType == "group" && this.collection && (this.collection as YpGroupData).configuration.allOurIdeas) {
      this.isAllOurIdeasGroup = true;
    } else {
      this.isAllOurIdeasGroup = false;
    }
  }

  fraudItemSelection(event: CustomEvent) {
    this.selectedFraudAuditId = parseInt(
      (event.target as HTMLElement).getAttribute("data-args")!
    );
    this.startReportCreation();
  }

  startReportCreation() {
    let url = this.action; // Adjust the URL as needed
    if (this.isAllOurIdeasGroup) {
      url = `/api/allOurIdeas/${this.collectionId}/start_report_creation`;
    }
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

  startReportCreationResponse(data: YpReportData) {
    this.jobId = data.jobId;
    this.progress = undefined;
    let baseUrl =
      this.collectionType == "group"
        ? `/api/groups/${this.collectionId}`
        : `/api/communities/${this.collectionId}`;
    if (this.isAllOurIdeasGroup) {
      baseUrl = `/api/allOurIdeas/${this.collectionId}`;
    }
    this.reportCreationProgressUrl = `${baseUrl}/${this.jobId}/report_creation_progress`;
    this.pollLaterForProgress();
  }

  pollLaterForProgress() {
    setTimeout(() => {
      this.reportCreationProgress();
    }, 1000);
  }

  reportCreationProgress() {
    fetch(this.reportCreationProgressUrl!)
      .then((response) => response.json())
      .then((data) => this.reportCreationProgressResponse(data))
      .catch((error) => console.error("Error:", error));
  }

  formatAuditReportDates(data: YpFraudAuditData[]) {
    return data.map((item) => {
      if (item.date) {
        // Use date-fns or another library if you need date formatting
        // item.date = format(new Date(item.date), "dd/MM/yyyy HH:mm:ss");
        item.date = new Date(item.date).toLocaleString();
      }
      return item;
    });
  }

  fraudAuditsAjaxResponse(event: CustomEvent) {
    this.waitingOnFraudAudits = false;
    this.fraudAuditsAvailable = this.formatAuditReportDates(
      event.detail.response
    );
  }

  reportCreationProgressResponse(response: YpReportData) {
    if (
      !response.error &&
      response.progress != null &&
      response.progress < 100
    ) {
      this.pollLaterForProgress();
    }

    this.progress = response.progress!;
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
  override updated(changedProperties: Map<string | number | symbol, unknown>) {
    if (
      changedProperties.has("type") ||
      changedProperties.has("selectedFraudAuditId")
    ) {
      this.fraudAuditSelectionActive =
        this.type === "fraudAuditReport" && !this.selectedFraudAuditId;
    }
  }

  startGeneration() {
    if (this.type == "fraudAuditReport") {
      this.waitingOnFraudAudits = true;
      this.progress = 0;
      const response = window.adminServerApi.adminMethod(
        this.reportGenerationUrl!,
        "GET"
      ) as unknown as YpFraudAuditData[];
      this.waitingOnFraudAudits = false;
      this.progress = undefined;
      this.fraudAuditsAvailable = this.formatAuditReportDates(response);
    } else {
      this.startReportCreationAjax(this.reportGenerationUrl!);
    }
  }

  startReportCreationAjax(url: string) {
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

  getFraudAuditsAjax(url: string) {
    fetch(url)
      .then((response) => response.json())
      .then((data) =>
        this.fraudAuditsAjaxResponse({ detail: { response: data } } as any)
      )
      .catch((error) => console.error("Error:", error));
  }

  static override get styles() {
    return [
      super.styles,
      css`
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
      `,
    ];
  }

  protected override firstUpdated(
    _changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
  ): void {
    setTimeout(() => {
      this._tabChanged();
    });
  }

  _tabChanged() {
    const tabs = this.$$("#tabs") as MdTabs;
    this.selectedTab = tabs.activeTabIndex;
    this.reportGenerationUrl = undefined;
    this.reportUrl = undefined;
    if (this.collectionType == "group") {
      if (tabs.activeTabIndex === 0) {
        this.type = "xls";
        this.toastText = this.t("haveCreatedXLsReport");
      } else if (tabs.activeTabIndex === 1) {
        this.type = "docx";
        this.toastText = this.t("haveCreatedDocxReport");
      }
      this.reportGenerationUrl = `/api/groups/${this.collectionId}/${this.type}/start_report_creation`;
    } else if (this.collectionType == "community") {
      if (tabs.activeTabIndex === 0) {
        this.type = "usersxls";
        this.reportGenerationUrl = `/api/communities/${this.collectionId}/${this.type}/start_report_creation`;
        this.toastText = this.t("haveCreatedXLsReport");
      } else if (tabs.activeTabIndex === 1) {
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
    return html`
      <div class="layout vertical center-center startButton">
        <md-outlined-button @click="${this.startGeneration}">
          ${this.t("startReportCreation")}
        </md-outlined-button>
        ${this.progress !== undefined
          ? html`<md-linear-progress
              .value="${this.progress / 100}"
            ></md-linear-progress> `
          : nothing}
      </div>
    `;
  }

  renderDownload() {
    return html`
      ${this.fraudAuditSelectionActive
        ? html`
            ${this.waitingOnFraudAudits
              ? html`<md-linear-progress indeterminate></md-linear-progress>`
              : html`
                  <div class="auditContainer layout vertical center-center">
                    ${this.fraudAuditsAvailable?.map(
                      (fraudItem) => html`
                        <md-text-button
                          raised
                          class="layout horizontal fraudItemSelection"
                          data-args="${fraudItem.logId}"
                          @click="${this.fraudItemSelection}"
                        >
                          ${fraudItem.date}<br />${fraudItem.userName}
                        </md-text-button>
                      `
                    )}
                  </div>
                `}
          `
        : html`
            <div class="error" ?hidden="${!this.error}">${this.error}</div>
            ${this.reportUrl
              ? html`
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

  override render() {
    return html`
      <md-tabs
        id="tabs"
        @change="${this._tabChanged}"
        .activeTabIndex="${this.selectedTab}"
        id="paperTabs"
      >
        ${this.collectionType == "group"
          ? html`
              <md-secondary-tab
                >${this.t("createXlsReport")}<md-icon
                  >lightbulb_outline</md-icon
                ></md-secondary-tab
              >
              <md-secondary-tab
                ?hidden="${this.isAllOurIdeasGroup}"
                >${this.t("createDocxReport")}<md-icon
                  >lightbulb_outline</md-icon
                ></md-secondary-tab
              >
            `
          : nothing}
        ${this.collectionType == "community"
          ? html`
              <md-secondary-tab
                >${this.t("createXlsUsersReport")}<md-icon
                  >lightbulb_outline</md-icon
                ></md-secondary-tab
              >
              <md-secondary-tab
                ?hidden="${!(this.collection as YpCommunityData).configuration
                  .enableFraudDetection}"
                >${this.t("downloadFraudAuditReport")}<md-icon
                  >lightbulb_outline</md-icon
                ></md-secondary-tab
              >
            `
          : nothing}
      </md-tabs>
      <div class="layout vertical center-center">
        ${this.reportGenerationUrl &&
        !this.reportUrl &&
        !this.fraudAuditsAvailable
          ? this.renderStart()
          : this.renderDownload()}
      </div>
    `;
  }
}
