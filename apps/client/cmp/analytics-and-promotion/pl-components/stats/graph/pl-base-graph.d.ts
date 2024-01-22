import { nothing } from 'lit';
import Chart from 'chart.js/auto';
import './pl-top-stats.js';
import { PlausibleBaseElementWithState } from '../../pl-base-element-with-state.js';
export declare abstract class PlausibleBaseGraph extends PlausibleBaseElementWithState {
    graphData: any;
    ctx: CanvasRenderingContext2D | null;
    darkTheme: boolean;
    chart: Chart | undefined;
    canvasElement: HTMLCanvasElement;
    exported: boolean;
    history: any;
    chartTitle: string;
    label: string;
    gradientColorStop1: string;
    gradientColorStop2: string;
    prevGradientColorStop1: string;
    prevGradientColorStop2: string;
    borderColor: string;
    pointBackgroundColor: string;
    pointHoverBackgroundColor: string;
    prevPointHoverBackgroundColor: string;
    prevBorderColor: string;
    chartHeigh: number;
    chartWidth: number;
    metrics: PlausibleTimeseriesMetricsOptions;
    method: "aggregate" | "timeseries";
    regenerateChart(): any;
    fetchGraphData(): any;
    constructor();
    static get styles(): import("lit").CSSResult[];
    connectedCallback(): void;
    firstUpdated(_changedProperties: Map<string | number | symbol, unknown>): void;
    updated(changedProperties: Map<string | number | symbol, unknown>): void;
    disconnectedCallback(): void;
    buildDataSet(plot: string | any[], present_index: number, ctx: {
        createLinearGradient: (arg0: number, arg1: number, arg2: number, arg3: number) => any;
    }, isPrevious?: boolean): ({
        label: string;
        data: any[];
        borderWidth: number;
        borderColor: string;
        pointBackgroundColor: string;
        pointHoverBackgroundColor: string;
        pointBorderColor: string;
        pointHoverRadius: number;
        backgroundColor: any;
        fill: boolean;
        borderDash?: undefined;
    } | {
        label: string;
        data: any[];
        borderWidth: number;
        borderDash: number[];
        borderColor: string;
        pointHoverBackgroundColor: string;
        pointBorderColor: string;
        pointHoverRadius: number;
        backgroundColor: any;
        fill: boolean;
        pointBackgroundColor?: undefined;
    })[] | {
        label: string;
        data: string | any[];
        borderWidth: number;
        borderColor: string;
        pointHoverBackgroundColor: string;
        pointBorderColor: string;
        pointHoverRadius: number;
        backgroundColor: any;
        fill: boolean;
    }[] | {
        label: string;
        data: string | any[];
        borderWidth: number;
        borderColor: string;
        pointHoverBackgroundColor: string;
        pointBorderColor: string;
        pointHoverBorderColor: string;
        pointHoverRadius: number;
        backgroundColor: any;
        fill: boolean;
    }[];
    transformCustomDateForStatsQuery(query: PlausibleQueryData): PlausibleQueryData;
    repositionTooltip(e: MouseEvent): void;
    /**
     * The current ticks' limits are set to treat iPad (regular/Mini/Pro) as a regular screen.
     * @param {*} chart - The chart instance.
     * @param {*} dimensions - An object containing the new dimensions *of the chart.*
     */
    updateWindowDimensions(chart: Chart, dimensions: any): void;
    pollExportReady(): void;
    downloadSpinner(): void;
    graphTooltip(graphData: {
        interval: string;
        labels: {
            [x: string]: any;
        };
    }, mainCanvasElement: {
        getBoundingClientRect: () => any;
    }, tooltipElement: any): (context: {
        tooltip: any;
    }) => void;
    onClick(e: CustomEvent): void;
    downloadLink(): import("lit-html").TemplateResult<1> | typeof nothing;
    renderHeader(): void;
    render(): import("lit-html").TemplateResult<1> | typeof nothing;
}
//# sourceMappingURL=pl-base-graph.d.ts.map