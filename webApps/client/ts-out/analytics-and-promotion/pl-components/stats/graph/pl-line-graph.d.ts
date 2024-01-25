import { nothing } from 'lit';
import Chart from 'chart.js/auto';
import './pl-top-stats.js';
import { PlausibleBaseElementWithState } from '../../pl-base-element-with-state.js';
export declare class PlausibleLineGraph extends PlausibleBaseElementWithState {
    graphData: any;
    metric: string;
    ctx: CanvasRenderingContext2D | null;
    darkTheme: boolean;
    chart: Chart | undefined;
    updateMetric: Function | undefined;
    history: any;
    topStatData: PlausibleTopStatsData | undefined;
    canvasElement: HTMLCanvasElement;
    exported: boolean;
    constructor();
    static get styles(): import("lit").CSSResult[];
    updated(changedProperties: Map<string | number | symbol, unknown>): void;
    regenerateChart(): Chart<"line", any[], unknown>;
    repositionTooltip(e: MouseEvent): void;
    connectedCallback(): void;
    protected firstUpdated(_changedProperties: Map<string | number | symbol, unknown>): void;
    disconnectedCallback(): void;
    /**
     * The current ticks' limits are set to treat iPad (regular/Mini/Pro) as a regular screen.
     * @param {*} chart - The chart instance.
     * @param {*} dimensions - An object containing the new dimensions *of the chart.*
     */
    updateWindowDimensions(chart: Chart, dimensions: any): void;
    onClick(e: CustomEvent): void;
    pollExportReady(): void;
    downloadSpinner(): void;
    downloadLink(): import("lit-html").TemplateResult<1> | typeof nothing;
    samplingNotice(): import("lit-html").TemplateResult<1> | typeof nothing;
    importedNotice(): import("lit-html").TemplateResult<1> | typeof nothing;
    render(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=pl-line-graph.d.ts.map