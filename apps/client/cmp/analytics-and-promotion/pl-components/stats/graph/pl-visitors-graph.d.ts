import './pl-top-stats.js';
import './pl-line-graph.js';
import { PlausibleBaseElementWithState } from '../../pl-base-element-with-state';
export declare class PlausibleVisitorsGraph extends PlausibleBaseElementWithState {
    history: any;
    metric: string;
    topStatData: PlausibleTopStatsData | undefined | null;
    graphData: any;
    useTopStatsForCurrentVisitors: boolean;
    constructor();
    static get styles(): import("lit").CSSResult[];
    connectedCallback(): void;
    updated(changedProperties: Map<string | number | symbol, unknown>): void;
    firstUpdated(): void;
    updateMetric(newMetric: string): void;
    fetchGraphData(): void;
    fetchTopStatData(): void;
    renderInner(): import("lit-html").TemplateResult<1>;
    render(): import("lit-html").TemplateResult<1>;
}
export declare const METRIC_MAPPING: Record<string, string>;
export declare const METRIC_LABELS: Record<string, string>;
export declare const METRIC_FORMATTER: Record<string, any>;
//# sourceMappingURL=pl-visitors-graph.d.ts.map