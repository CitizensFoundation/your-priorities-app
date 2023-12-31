import Chart from 'chart.js/auto';
import './pl-top-stats.js';
import { PlausibleBaseGraph } from './pl-base-graph.js';
export declare class PlausibleGoalGraph extends PlausibleBaseGraph {
    events: string[];
    static get styles(): import("lit").CSSResult[];
    get filterInStatsFormat(): string;
    fetchGraphData(): Promise<unknown>;
    setGraphData(data: any): void;
    regenerateChart(): Chart<"line", string | any[], unknown>;
    renderHeader(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=pl-goal-graph.d.ts.map