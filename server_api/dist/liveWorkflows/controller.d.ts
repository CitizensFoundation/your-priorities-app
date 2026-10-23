import type { IncomingMessage } from "node:http";
import type WebSocket from "ws";
import { WorkflowService, type WorkflowActor } from "./workflowService.js";
import { AssetService } from "./assets.js";
import { ModelGateway } from "./modelGateway.js";
import { HostDirectory } from "./secrets.js";
import { VmBrokerRegistry } from "./services/vmBrokerRegistry.js";
export interface LiveWorkflowControllerDependencies {
    service: WorkflowService;
    assets: AssetService;
    groupAccess(groupId: number, userId: number): Promise<WorkflowActor>;
    groupChoices(userId: number, search: string): Promise<{
        id: number;
        name: string;
    }[]>;
}
/** Keep application database bootstrap out of isolated integration harnesses. */
export declare function createLiveWorkflowsController(): Promise<LiveWorkflowsController>;
export declare class LiveWorkflowsController {
    private readonly dependencies;
    readonly path = "/api/live-workflows";
    readonly router: import("express-serve-static-core").Router;
    get service(): WorkflowService;
    get broker(): VmBrokerRegistry;
    get hosts(): HostDirectory;
    get store(): import("./store.js").WorkflowStore;
    get models(): ModelGateway;
    get connectors(): import("./connectors.js").ConnectorService;
    get assets(): AssetService;
    readonly ready: Promise<void>;
    private readonly recovery;
    constructor(dependencies: LiveWorkflowControllerDependencies);
    close(): void;
    private route;
    private group;
    private actor;
    private host;
    private hostGroup;
    private routes;
    private download;
    private vmRoutes;
    acceptVmConnection(socket: WebSocket, request: IncomingMessage): boolean;
}
