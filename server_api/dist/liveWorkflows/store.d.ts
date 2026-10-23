import { type Sequelize, type Model } from "sequelize";
export interface WorkflowTransaction {
    state: YpWorkflowState;
    get<T>(kind: string, id: string): Promise<T | undefined>;
    put<T>(kind: string, id: string, data: T): Promise<void>;
    remove(kind: string, id: string): Promise<void>;
    list<T>(kind: string): Promise<T[]>;
    emit(type: string, data: Record<string, YpWorkflowJson>, key?: string): Promise<void>;
}
export interface WorkflowStore {
    create(state: YpWorkflowState): Promise<void>;
    transact<T>(groupId: number, work: (tx: WorkflowTransaction) => Promise<T>): Promise<T>;
    events(groupId: number, after: number, limit?: number): Promise<YpWorkflowEvent[]>;
    groups(): Promise<number[]>;
}
/** One locked workspace row serializes leases, run transitions, and all money reservations.
 * The lock and ledger writes share the same Postgres transaction, across API processes. */
export declare class SequelizeWorkflowStore implements WorkflowStore {
    readonly sequelize: Sequelize;
    readonly Workspace: import("sequelize").ModelCtor<Model<any, any>>;
    readonly Document: import("sequelize").ModelCtor<Model<any, any>>;
    readonly Event: import("sequelize").ModelCtor<Model<any, any>>;
    constructor(sequelize: Sequelize);
    create(state: YpWorkflowState): Promise<void>;
    groups(): Promise<number[]>;
    transact<T>(groupId: number, work: (tx: WorkflowTransaction) => Promise<T>): Promise<T>;
    private makeTransaction;
    events(groupId: number, after: number, limit?: number): Promise<YpWorkflowEvent[]>;
}
