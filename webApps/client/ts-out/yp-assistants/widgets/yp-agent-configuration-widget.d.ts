import { YpBaseElement } from "../../common/yp-base-element.js";
import "@material/web/iconbutton/filled-icon-button.js";
import { YpAssistantServerApi } from "../AssistantServerApi.js";
export declare class YpAgentConfigurationWidget extends YpBaseElement {
    agentProductId: number;
    agentName: string;
    subscriptionId: string;
    domainId: number;
    agentDescription: string;
    agentImageUrl: string;
    requiredQuestions: string;
    requiredQuestionsAnswered: string;
    haveSubmittedConfigurationPastSecond: boolean;
    serverApi: YpAssistantServerApi;
    constructor();
    connectedCallback(): void;
    disconnectedCallback(): void;
    static get styles(): any[];
    firstUpdated(): Promise<void>;
    getAgentConfiguration(): Promise<void>;
    getPrefillValue(question: YpStructuredQuestionData): string | number | true;
    submitConfiguration(): Promise<void>;
    sendError(message: string): void;
    get parsedRequiredQuestions(): YpStructuredQuestionData[];
    get parsedRequiredQuestionsAnswered(): YpStructuredAnswer[];
    private renderAgentHeader;
    render(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=yp-agent-configuration-widget.d.ts.map