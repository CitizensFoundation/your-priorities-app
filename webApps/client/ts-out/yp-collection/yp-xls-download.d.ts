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
export declare class YpXlsDownload extends YpBaseElement {
    /**
     * "group" or "community" or whichever your server expects.
     */
    collectionType: string;
    /**
     * The numeric ID of your group or community.
     */
    collectionId: number;
    /**
     * Whether to show the button label for generating XLS.
     * You might remove this or set it dynamically via i18n, etc.
     */
    generateLabel: string;
    /**
     * If you want to show a final "Download XLS" button text.
     * Also could be i18n.
     */
    downloadLabel: string;
    /**
     * The progress of the XLS creation (0-100).
     * While this is set and < 100, we show a linear progress bar.
     */
    private xlsProgress;
    /**
     * Error message from server or local fetch error.
     */
    private xlsError;
    /**
     * The final XLS URL to allow user to download from.
     */
    private xlsReportUrl;
    /**
     * If the link has expired after ~1 hour or we want to block future downloads.
     */
    private xlsDownloadDisabled;
    /**
     * We build this URL for polling, e.g. `/api/groups/123/456/report_creation_progress`.
     */
    private xlsReportCreationProgressUrl;
    /**
     * The job ID we get from the server after starting the generation.
     */
    private xlsJobId;
    static get styles(): any[];
    render(): import("lit-html").TemplateResult<1>;
    /**
     * Fired when user clicks "Generate XLS" button.
     * 1) We'll PUT to start the job
     * 2) If success, store jobId, set progress ~5%
     * 3) Start polling the status
     */
    startXlsGeneration(): Promise<void>;
    /**
     * Called when the server acknowledges the job was queued/started.
     * We store the jobId, set initial progress, build the poll URL, start polling.
     */
    private _startXlsCreationResponse;
    /**
     * Poll the server every second for progress until either error, done, or progress=100.
     */
    private _pollXlsProgress;
    private _reportXlsCreationProgress;
    /**
     * - If progress < 100, poll again
     * - If error, show it
     * - If we have a final reportUrl, show "Download" button
     * - Expire the link after 59 minutes
     */
    private _xlsReportCreationProgressResponse;
}
//# sourceMappingURL=yp-xls-download.d.ts.map