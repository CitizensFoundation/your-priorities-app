import {
  YP_LIVE_WORKFLOW_VM_PROTOCOL,
  VmAgentAckPayloadSchema,
  type VmAgentAckPayload,
  type VmEvent,
} from "../contracts/index.js";

export type FetchLike = (
  input: string,
  init?: {
    method?: string;
    headers?: Record<string, string>;
    body?: string;
    signal?: AbortSignal;
  }
) => Promise<{
  ok: boolean;
  status: number;
  text(): Promise<string>;
}>;

export type VmAgentApiClientOptions = {
  apiBaseUrl: string;
  token: string;
  fetchImpl?: FetchLike;
};

export class VmAgentApiClient {
  private readonly apiBaseUrl: string;
  private readonly token: string;
  private readonly fetchImpl: FetchLike;

  constructor(options: VmAgentApiClientOptions) {
    this.apiBaseUrl = options.apiBaseUrl.replace(/\/+$/, "");
    this.token = options.token;
    this.fetchImpl = options.fetchImpl ?? fetch;
  }

  async sendEvent(
    messageType: VmEvent,
    data: object,
    options: { signal?: AbortSignal } = {}
  ): Promise<VmAgentAckPayload> {
    const response = await this.fetchImpl(`${this.apiBaseUrl}/api/live-workflows/vm/events`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${this.token}`,
        "content-type": "application/json",
      },
      signal: options.signal,
      body: JSON.stringify({
        protocol: YP_LIVE_WORKFLOW_VM_PROTOCOL,
        messageType,
        ts: new Date().toISOString(),
        data,
      }),
    });
    const text = await response.text();
    const body = text.length > 0 ? JSON.parse(text) : {};

    if (!response.ok) {
      const message = typeof body.error === "string" ? body.error : "VM agent API request failed";
      throw new Error(`${message} (${response.status})`);
    }

    return VmAgentAckPayloadSchema.parse(body);
  }
}
