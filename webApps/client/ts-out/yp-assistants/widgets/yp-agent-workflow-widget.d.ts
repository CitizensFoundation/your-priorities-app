import { YpBaseElement } from "../../common/yp-base-element";
export declare class YpAgentWorkflowWidget extends YpBaseElement {
    agentProductId: string;
    runId: string;
    agentName: string;
    agentDescription: string;
    workflowStatus: string;
    workflow: string;
    get parsedWorkflow(): YpWorkflowConfiguration;
    static get styles(): any[];
    private getStepClass;
    private renderStep;
    private renderIcon;
    render(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=yp-agent-workflow-widget.d.ts.map