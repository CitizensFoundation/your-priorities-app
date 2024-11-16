import { YpBaseElement } from "../../common/yp-base-element";
export declare class YpAgentRunWidget extends YpBaseElement {
    agentProductId: string;
    runId: string;
    agentName: string;
    agentDescription: string;
    agentImageUrl: string;
    workflowStatus: string;
    workflow: string;
    get parsedWorkflow(): YpWorkflowConfiguration;
    static get styles(): any[];
    private getStepClass;
    private renderStep;
    private renderIcon;
    private renderAgentHeader;
    render(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=yp-agent-run-widget.d.ts.map