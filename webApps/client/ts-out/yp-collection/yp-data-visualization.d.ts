import { YpBaseElement } from '../common/yp-base-element.js';
import "@material/web/icon/icon.js";
export declare class YpDataVisualization extends YpBaseElement {
    group: YpGroupData;
    static get styles(): any[];
    get canvasSize(): 135 | 190;
    firstUpdated(changedProperties: Map<string | number | symbol, unknown>): void;
    formatAmount(amount: number): string;
    _drawCharts(): void;
    _drawChart(chartId: string, percentDone: number, labelText: string, color: string, hideGray?: boolean): void;
    render(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=yp-data-visualization.d.ts.map