import { YpAppGlobals } from "../yp-app/YpAppGlobals.js";
export class PsAppGlobals extends YpAppGlobals {
    constructor(serverApi) {
        super(serverApi, true);
        this.disableParentConstruction = true;
        this.agentsInstanceRegistry = new Map();
        this.connectorsInstanceRegistry = new Map();
        this.activeConnectorsInstanceRegistry = new Map();
        this.currentAgentListeners = [];
        this.addToAgentsRegistry = (agent) => {
            this.agentsInstanceRegistry.set(agent.id, agent);
        };
        this.addToConnectorsRegistry = (connector) => {
            this.connectorsInstanceRegistry.set(connector.id, connector);
        };
        this.currentRunningAgentId = undefined;
        this.parseQueryString();
        //this.earlName = this.getEarlName();
        this.originalReferrer = document.referrer;
    }
    setCurrentRunningAgentId(id) {
        this.currentRunningAgentId = id;
        this.notifyCurrentAgentListeners();
    }
    addCurrentAgentListener(callback) {
        this.currentAgentListeners.push(callback);
    }
    removeCurrentAgentListener(callback) {
        this.currentAgentListeners = this.currentAgentListeners.filter((listener) => listener !== callback);
    }
    notifyCurrentAgentListeners() {
        this.currentAgentListeners.forEach((listener) => listener(this.currentRunningAgentId));
    }
    getAgentInstance(agentId) {
        return this.agentsInstanceRegistry.get(agentId);
    }
    getConnectorInstance(connectorId) {
        return this.connectorsInstanceRegistry.get(connectorId);
    }
}
//# sourceMappingURL=PsAppGlobals.js.map