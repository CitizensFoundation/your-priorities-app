import '@material/web/radio/radio.js';
import '@material/web/button/elevated-button.js';
import '@material/web/button/text-button.js';
import '@material/web/button/outlined-button.js';
import '@material/web/button/filled-button.js';
import '@material/web/checkbox/checkbox.js';
import '@material/web/iconbutton/icon-button.js';
import '../../common/yp-image.js';
import { YpCampaign } from '../yp-promotion/yp-campaign';
export declare class YpCampaignAnalysis extends YpCampaign {
    static get styles(): (any[] | import("lit").CSSResult)[];
    renderMediumTopStats(medium: YpCampaignAnalyticsMediumData): import("lit-html").TemplateResult<1>;
    renderMedium(medium: YpCampaignAnalyticsMediumData): import("lit-html").TemplateResult<1>;
    get orderedMedium(): YpCampaignMediumData[];
    render(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=yp-campaign-analysis.d.ts.map