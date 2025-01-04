import { LitElement, html, css, nothing } from "lit";
import { property, state, customElement } from "lit/decorators.js";
import "@material/web/button/filled-button.js";
import "@material/web/button/outlined-button.js";
import "@material/web/progress/linear-progress.js";
import { YpBaseElement } from "../common/yp-base-element.js";

/**
 * <yp-xls-download>
 * This component:
 *  - Accepts a collectionType ("group" or "community" etc.) and a collectionId
 *  - Calls /api/[type]/[id]/xls/start_report_creation to begin the job
 *  - Polls /api/[type]/[id]/[jobId]/report_creation_progress for status
 *  - Shows a simple button with spinner/progress bar and final "download" link
 *
 * Usage example:
 *
 *   <yp-xls-download
 *     collectionType="group"
 *     .collectionId="${123}"
 *     language="en"
 *   ></yp-xls-download>
 */
@customElement("yp-xls-download")
export class YpXlsDownload extends YpBaseElement {
  /**
   * "group" or "community" or whichever your server expects.
   */
  @property({ type: String }) collectionType = "group";

  /**
   * The numeric ID of your group or community.
   */
  @property({ type: Number }) collectionId!: number;

  /**
   * Whether to show the button label for generating XLS.
   * You might remove this or set it dynamically via i18n, etc.
   */
  @property({ type: String }) generateLabel = "Generate XLS";

  /**
   * If you want to show a final "Download XLS" button text.
   * Also could be i18n.
   */
  @property({ type: String }) downloadLabel = "Download XLS";

  /**
   * The progress of the XLS creation (0-100).
   * While this is set and < 100, we show a linear progress bar.
   */
  @state() private xlsProgress: number | undefined;

  /**
   * Error message from server or local fetch error.
   */
  @state() private xlsError: string | undefined;

  /**
   * The final XLS URL to allow user to download from.
   */
  @state() private xlsReportUrl: string | undefined;

  /**
   * If the link has expired after ~1 hour or we want to block future downloads.
   */
  @state() private xlsDownloadDisabled = false;

  /**
   * We build this URL for polling, e.g. `/api/groups/123/456/report_creation_progress`.
   */
  @state() private xlsReportCreationProgressUrl: string | undefined;

  /**
   * The job ID we get from the server after starting the generation.
   */
  @state() private xlsJobId: number | undefined;

  static override get styles() {
    return [
      super.styles,
      //TODO: Fix this hack below
      css`
        :host {
          display: block;
          text-align: center;
          margin: 16px auto;
        }
        .error {
          color: var(--md-sys-color-error, red);
          margin-bottom: 8px;
        }
        .infoText {
          font-size: 0.9em;
          margin-top: 8px;
          color: var(--md-sys-color-on-surface-variant, #555);
        }
        md-linear-progress {
          margin: 8px;
        }
        .expiredText {
          color: var(--md-sys-color-on-surface-variant, #888);
          font-style: italic;
        }

        .xlsDownloadContainer {
          display: flex;
          flex-direction: column;
          align-items: center;
          max-width: 200px
        }
      `,
    ];
  }

  override render() {
    return html`
      <div class="xlsDownloadContainer">
        <!-- Show any error -->
        <div class="error" ?hidden="${!this.xlsError}">${this.xlsError}</div>

        <!-- If we do NOT have a final report URL yet, show a "Generate XLS" button & optional spinner -->
        ${!this.xlsReportUrl
          ? html`
              <md-outlined-button
                @click="${this.startXlsGeneration}"
                ?disabled="${this.xlsProgress !== undefined &&
                this.xlsProgress < 100}"
              >
                ${this.xlsProgress === undefined
                  ? this.generateLabel
                  : this.t("generatingXls")}
              </md-outlined-button>

              <!-- If we have a numeric progress, show a linear progress bar -->
              ${this.xlsProgress !== undefined && this.xlsProgress < 100
                ? html`
                    <md-linear-progress
                      .value="${this.xlsProgress / 100}"
                    ></md-linear-progress>
                  `
                : nothing}
            `
          : html`
              <!-- If we have the final report link, show a "Download XLS" button -->
              <a
                href="${this.xlsReportUrl}"
                target="_blank"
                ?hidden="${this.xlsDownloadDisabled}"
              >
                <md-filled-button
                  id="downloadXlsButton"
                  ?disabled="${this.xlsDownloadDisabled}"
                >
                  ${this.downloadLabel}
                </md-filled-button>
              </a>

              <div class="infoText" hidden>
                ${this.xlsDownloadDisabled
                  ? this.t("downloadHasExpired")
                  : this.t("reportLinkInfo")}
              </div>
            `}
      </div>
    `;
  }

  /**
   * Fired when user clicks "Generate XLS" button.
   * 1) We'll PUT to start the job
   * 2) If success, store jobId, set progress ~5%
   * 3) Start polling the status
   */
  async startXlsGeneration() {
    this.xlsProgress = 0;
    this.xlsError = undefined;
    this.xlsReportUrl = undefined;
    this.xlsDownloadDisabled = false;

    // Build the "start creation" endpoint, e.g. /api/groups/123/xls/start_report_creation
    let url = `/api/${this.collectionType}s/${this.collectionId}/xls/start_report_creation`;
    if (this.language) {
      url += `?translateLanguage=${this.language}`;
    }

    try {
      const resp = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}), // if your server needs any data
      });
      const data = (await resp.json()) as YpReportData;
      this._startXlsCreationResponse(data);
    } catch (err: any) {
      console.error("Error starting XLS creation:", err);
      this.xlsError =
        (err && err.message) || "Error starting XLS creation (network issue)";
      this.xlsProgress = undefined;
    }
  }

  /**
   * Called when the server acknowledges the job was queued/started.
   * We store the jobId, set initial progress, build the poll URL, start polling.
   */
  private _startXlsCreationResponse(data: YpReportData) {
    if (!data || !data.jobId) {
      this.xlsError = this.t("jobIdNotReturned");
      this.xlsProgress = undefined;
      return;
    }
    this.xlsJobId = data.jobId;
    this.xlsProgress = 5;

    // e.g. /api/groups/123/789/report_creation_progress
    this.xlsReportCreationProgressUrl = `/api/${this.collectionType}s/${this.collectionId}/${this.xlsJobId}/report_creation_progress`;

    this._pollXlsProgress();
  }

  /**
   * Poll the server every second for progress until either error, done, or progress=100.
   */
  private _pollXlsProgress() {
    setTimeout(() => {
      this._reportXlsCreationProgress();
    }, 1000);
  }

  private async _reportXlsCreationProgress() {
    if (!this.xlsReportCreationProgressUrl) return;

    try {
      const resp = await fetch(this.xlsReportCreationProgressUrl);
      const data = (await resp.json()) as YpReportData;
      this._xlsReportCreationProgressResponse(data);
    } catch (err: any) {
      console.error("Error checking XLS creation progress:", err);
      this.xlsError =
        (err && err.message) || "Error checking XLS creation progress";
      this.xlsProgress = undefined;
    }
  }

  /**
   * - If progress < 100, poll again
   * - If error, show it
   * - If we have a final reportUrl, show "Download" button
   * - Expire the link after 59 minutes
   */
  private _xlsReportCreationProgressResponse(response: YpReportData) {
    if (response.error) {
      this.xlsError = this.t(response.error);
      this.xlsProgress = undefined;
      return;
    }

    if (typeof response.progress === "number") {
      this.xlsProgress = response.progress;
    }

    // Keep polling if < 100 and no error
    if (this.xlsProgress !== undefined && this.xlsProgress < 100) {
      this._pollXlsProgress();
    }

    if (response.data && response.data.reportUrl) {
      this.xlsReportUrl = response.data.reportUrl;
      // Expire after 59 minutes
      setTimeout(() => {
        this.xlsDownloadDisabled = true;
      }, 59 * 60 * 1000);
    }
  }
}
