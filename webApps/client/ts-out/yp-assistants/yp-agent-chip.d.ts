import { YpBaseElement } from "../common/yp-base-element.js";
import '@material/web/iconbutton/filled-icon-button.js';
export declare class YpAgentChip extends YpBaseElement {
    agentId: number;
    agentName: string;
    agentDescription: string;
    agentImageUrl: string;
    isSelected: string | undefined;
    static get styles(): any[];
    render(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=yp-agent-chip.d.ts.map