import { YpBaseElement } from "../../common/yp-base-element";
export declare class YpAgentRunWidget extends YpBaseElement {
    agentProductId: number;
    runId: number;
    agentId: number;
    agentName: string;
    agentDescription: string;
    agentImageUrl: string;
    workflowStatus: string;
    workflow: string;
    maxRunsPerCycle: number;
    get parsedWorkflow(): YpWorkflowConfiguration;
    static get styles(): any[];
    private getStepClass;
    private renderStep;
    private renderIcon;
    private renderAgentHeader;
    get shouldDisableStopButton(): boolean;
    get shouldDisableStartButton(): boolean;
    get isRunning(): boolean;
    renderAgentRunningStatus(): import("lit-html").TemplateResult<1>;
    renderStartStopButtons(): import("lit-html").TemplateResult<1>;
    render(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=yp-agent-run-widget.d.ts.map