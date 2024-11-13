import { YpBaseElement } from "../../common/yp-base-element.js";
import "@material/web/iconbutton/filled-icon-button.js";
import { YpAssistantServerApi } from "../AssistantServerApi.js";
export declare class YpAgentConfigurationWidget extends YpBaseElement {
    agentId: number;
    agentName: string;
    subscriptionId: string;
    domainId: number;
    agentDescription: string;
    agentImageUrl: string;
    requiredQuestions: string;
    serverApi: YpAssistantServerApi;
    constructor();
    static get styles(): any[];
    submitConfiguration(): Promise<void>;
    render(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=yp-agent-configuration-widget.d.ts.map