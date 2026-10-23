export type VmAgentState = {
    vmHostId?: string;
};
export interface VmAgentStateStore {
    read(): Promise<VmAgentState>;
    write(state: VmAgentState): Promise<void>;
}
export declare class FileVmAgentStateStore implements VmAgentStateStore {
    private readonly filePath;
    constructor(filePath: string);
    read(): Promise<VmAgentState>;
    write(state: VmAgentState): Promise<void>;
}
