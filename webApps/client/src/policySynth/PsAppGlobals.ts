import { YpAppGlobals } from "../yp-app/YpAppGlobals.js";
import { PsServerApi } from "./PsServerApi.js";

export class PsAppGlobals extends YpAppGlobals {
  originalReferrer: string;
  disableParentConstruction = true;
  exernalGoalParamsWhiteList: string | undefined;

  agentsInstanceRegistry: Map<number, PsAgentAttributes> = new Map();
  connectorsInstanceRegistry: Map<number, PsAgentConnectorAttributes> =
    new Map();

  currentRunningAgentId: number | undefined;
  currentAgentListeners: any[] = [];

  constructor(serverApi: PsServerApi) {
    super(serverApi as any, true);
    this.currentRunningAgentId = undefined;
    this.parseQueryString();
    //this.earlName = this.getEarlName();
    this.originalReferrer = document.referrer;
  }

  setCurrentRunningAgentId(id: number | undefined) {
    this.currentRunningAgentId = id;
    this.notifyCurrentAgentListeners();
  }

  addCurrentAgentListener(callback: Function) {
    this.currentAgentListeners.push(callback);
  }

  removeCurrentAgentListener(callback: Function) {
    this.currentAgentListeners = this.currentAgentListeners.filter(
      (listener) => listener !== callback
    );
  }

  notifyCurrentAgentListeners() {
    this.currentAgentListeners.forEach((listener) =>
      listener(this.currentRunningAgentId)
    );
  }

  addToAgentsRegistry = (agent: PsAgentAttributes): void => {
    this.agentsInstanceRegistry.set(agent.id, agent);
  };

  addToConnectorsRegistry = (connector: PsAgentConnectorAttributes): void => {
    this.connectorsInstanceRegistry.set(connector.id, connector);
  };

  getAgentInstance(agentId: number): PsAgentAttributes | undefined {
    return this.agentsInstanceRegistry.get(agentId);
  }

  getConnectorInstance(
    connectorId: number
  ): PsAgentConnectorAttributes | undefined {
    return this.connectorsInstanceRegistry.get(connectorId);
  }
}
