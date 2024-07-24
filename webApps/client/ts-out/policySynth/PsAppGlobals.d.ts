import { YpAppGlobals } from "../yp-app/YpAppGlobals.js";
import { PsServerApi } from "./PsServerApi.js";
export declare class PsAppGlobals extends YpAppGlobals {
    originalReferrer: string;
    disableParentConstruction: boolean;
    exernalGoalParamsWhiteList: string | undefined;
    agentsInstanceRegistry: Map<number, PsAgentAttributes>;
    connectorsInstanceRegistry: Map<number, PsAgentConnectorAttributes>;
    currentRunningAgentId: number | undefined;
    currentAgentListeners: any[];
    constructor(serverApi: PsServerApi);
    setCurrentRunningAgentId(id: number | undefined): void;
    addCurrentAgentListener(callback: Function): void;
    removeCurrentAgentListener(callback: Function): void;
    notifyCurrentAgentListeners(): void;
    addToAgentsRegistry: (agent: PsAgentAttributes) => void;
    addToConnectorsRegistry: (connector: PsAgentConnectorAttributes) => void;
    getAgentInstance(agentId: number): PsAgentAttributes | undefined;
    getConnectorInstance(connectorId: number): PsAgentConnectorAttributes | undefined;
}
//# sourceMappingURL=PsAppGlobals.d.ts.map