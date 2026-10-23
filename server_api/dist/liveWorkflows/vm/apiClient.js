import { YP_LIVE_WORKFLOW_VM_PROTOCOL, VmAgentAckPayloadSchema, } from "../contracts/index.js";
export class VmAgentApiClient {
    constructor(options) {
        this.apiBaseUrl = options.apiBaseUrl.replace(/\/+$/, "");
        this.token = options.token;
        this.fetchImpl = options.fetchImpl ?? fetch;
    }
    async sendEvent(messageType, data, options = {}) {
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
