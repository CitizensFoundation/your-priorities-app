import { YpBaseElement } from "../../common/yp-base-element.js";
export declare class YpAgentRunWidget extends YpBaseElement {
    agentProductId: number;
    runId: number;
    agentId: number;
    wsClientId: string;
    topLevelWorkflowGroupId: number;
    agentName: string;
    agentDescription: string;
    agentImageUrl: string;
    workflowStatus: string;
    private agentState;
    private latestMessage;
    private progress;
    private statusInterval;
    workflow: string;
    maxRunsPerCycle: number;
    private api;
    constructor();
    get parsedWorkflow(): YpWorkflowConfiguration;
    connectedCallback(): void;
    disconnectedCallback(): void;
    private startStatusUpdates;
    private stopStatusUpdates;
    private updateAgentStatus;
    private startAgent;
    private stopAgent;
    static get styles(): any[];
    private getStepClass;
    private renderStep;
    private renderIcon;
    private renderAgentHeader;
    get shouldDisableStopButton(): boolean;
    get shouldDisableStartButton(): boolean;
    get isRunning(): boolean;
    private renderAgentRunningStatus;
    renderStartStopButtons(): import("lit-html").TemplateResult<1>;
    render(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=yp-agent-run-widget.d.ts.map