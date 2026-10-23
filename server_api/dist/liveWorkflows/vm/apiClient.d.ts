import { type VmAgentAckPayload, type VmEvent } from "../contracts/index.js";
export type FetchLike = (input: string, init?: {
    method?: string;
    headers?: Record<string, string>;
    body?: string;
    signal?: AbortSignal;
}) => Promise<{
    ok: boolean;
    status: number;
    text(): Promise<string>;
}>;
export type VmAgentApiClientOptions = {
    apiBaseUrl: string;
    token: string;
    fetchImpl?: FetchLike;
};
export declare class VmAgentApiClient {
    private readonly apiBaseUrl;
    private readonly token;
    private readonly fetchImpl;
    constructor(options: VmAgentApiClientOptions);
    sendEvent(messageType: VmEvent, data: object, options?: {
        signal?: AbortSignal;
    }): Promise<VmAgentAckPayload>;
}
