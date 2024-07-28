import { dia, shapes, util } from "@joint/core";
export declare class AgentsShapeView extends dia.ElementView {
    private observer;
    remove(): this;
    render(): this;
    private setupRunningObserver;
    updateNodePosition: (() => void) & util.Cancelable;
}
export declare class AgentShape extends shapes.standard.Rectangle {
    defaults(): object;
    view: typeof AgentsShapeView;
}
//# sourceMappingURL=ps-agent-shape.d.ts.map