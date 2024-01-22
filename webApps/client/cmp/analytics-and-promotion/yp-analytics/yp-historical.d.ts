import { PlausibleHistorical } from '../pl-components/pl-historical.js';
import '../pl-components/stats/graph/pl-goal-graph.js';
import './yp-campaigns-analytics.js';
import '@material/web/iconbutton/icon-button.js';
export declare class YpHistorical extends PlausibleHistorical {
    collection: YpCollectionData;
    collectionType: string;
    collectionId: number;
    static get styles(): import("lit").CSSResult[];
    constructor();
    render(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=yp-historical.d.ts.map