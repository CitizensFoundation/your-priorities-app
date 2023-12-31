interface GraphData {
    interval: string;
    labels: string[];
}
interface CanvasElement extends HTMLElement {
    getBoundingClientRect: () => DOMRect;
}
export declare const dateFormatter: (interval: string, longForm?: boolean) => (isoDate: string, _index?: number, _ticks?: any) => string | undefined;
export declare const GraphTooltip: (graphData: GraphData, metric: string, mainCanvasElement: CanvasElement, tooltipElement: HTMLElement) => (context: any) => void;
export declare const buildDataSet: (plot: Array<number | undefined>, present_index: number | null, ctx: CanvasRenderingContext2D, label: string, isPrevious: boolean) => ({
    label: string;
    data: (number | undefined)[];
    borderWidth: number;
    borderColor: string;
    pointBackgroundColor: string;
    pointHoverBackgroundColor: string;
    pointBorderColor: string;
    pointHoverRadius: number;
    backgroundColor: CanvasGradient;
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
    backgroundColor: CanvasGradient;
    fill: boolean;
    pointBackgroundColor?: undefined;
})[] | {
    label: string;
    data: (number | undefined)[];
    borderWidth: number;
    borderColor: string;
    pointHoverBackgroundColor: string;
    pointBorderColor: string;
    pointHoverRadius: number;
    backgroundColor: CanvasGradient;
    fill: boolean;
}[] | {
    label: string;
    data: (number | undefined)[];
    borderWidth: number;
    borderColor: string;
    pointHoverBackgroundColor: string;
    pointBorderColor: string;
    pointHoverBorderColor: string;
    pointHoverRadius: number;
    backgroundColor: CanvasGradient;
    fill: boolean;
}[];
export {};
//# sourceMappingURL=graph-util.d.ts.map