var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { property } from "lit/decorators.js";
import { YpBaseElement } from "../common/yp-base-element.js";
export class YpStreamingLlmBase extends YpBaseElement {
    get ws() {
        // This returns the static WebSocket from the class constructor
        return this.constructor.ws;
    }
    set ws(value) {
        this.constructor.ws = value;
    }
    constructor() {
        super();
        this.chatLog = [];
        this.webSocketsErrorCount = 0;
        this.currentFollowUpQuestions = "";
        this.programmaticScroll = false;
        this.disableAutoScroll = false;
        this.scrollStart = 0;
        // Keeping an instance property for interface compatibility.
        // (This value will be used from the first subscriber when creating the connection.)
        this.defaultDevWsPort = 4242;
        // An instance flag so that an element can opt out of receiving socket events.
        this.disableWebsockets = false;
    }
    connectedCallback() {
        super.connectedCallback();
        if (!this.disableWebsockets) {
            // Add this instance to the list of subscribers
            YpStreamingLlmBase.subscribers.add(this);
            // If no shared connection exists or if it’s closed, create a new one.
            if (!YpStreamingLlmBase.ws ||
                YpStreamingLlmBase.ws.readyState === WebSocket.CLOSED) {
                YpStreamingLlmBase.initWebSocketsStatic(this);
            }
        }
    }
    /**
     * Initializes the shared WebSocket connection.
     * Uses the defaultDevWsPort from the provided instance (or first subscriber) for the URL.
     */
    static initWebSocketsStatic(instance) {
        let defaultPort = 4242;
        if (instance) {
            defaultPort = instance.defaultDevWsPort;
        }
        else if (YpStreamingLlmBase.subscribers.size > 0) {
            const firstSub = YpStreamingLlmBase.subscribers.values().next().value;
            if (firstSub) {
                defaultPort = firstSub.defaultDevWsPort;
            }
        }
        const storedClientId = localStorage.getItem("ypWsClientId") || "";
        const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
        // Use port 443 for wss, or the defaultPort for ws.
        const port = protocol === "wss:" ? 443 : defaultPort;
        const endpoint = `${protocol}//${window.location.hostname}${port ? ":" + port : ""}/${storedClientId ? "?clientId=" + storedClientId : ""}`;
        // Reset the manually closed flag (if we’re reconnecting)
        YpStreamingLlmBase.wsManuallyClosed = false;
        YpStreamingLlmBase.ws = new WebSocket(endpoint);
        console.log("Attempting to connect to", endpoint);
        YpStreamingLlmBase.ws.onopen = () => {
            console.log("WebSocket open");
            // Reset reconnect parameters on a successful connection.
            YpStreamingLlmBase.reconnectDelay = 1000;
            YpStreamingLlmBase.reconnectionAttempts = 1;
        };
        YpStreamingLlmBase.ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            // Update the clientId if the server provides one, and notify all subscribers.
            if (data.clientId) {
                console.log("Received clientId from server:", data.clientId);
                localStorage.setItem("ypWsClientId", data.clientId);
                YpStreamingLlmBase.subscribers.forEach((sub) => {
                    sub.wsClientId = data.clientId;
                });
            }
            // Dispatch the event to every subscriber’s onMessage method.
            YpStreamingLlmBase.subscribers.forEach((sub) => {
                sub.onMessage(event);
            });
        };
        YpStreamingLlmBase.ws.onclose = (ev) => {
            console.warn("WebSocket closed:", ev.reason);
            YpStreamingLlmBase.scheduleReconnect();
        };
        YpStreamingLlmBase.ws.onerror = (err) => {
            console.error("WebSocket error:", err);
            YpStreamingLlmBase.scheduleReconnect();
        };
    }
    static scheduleReconnect() {
        // Do not attempt to reconnect if the socket was manually closed.
        if (YpStreamingLlmBase.wsManuallyClosed)
            return;
        if (YpStreamingLlmBase.reconnectTimer) {
            window.clearTimeout(YpStreamingLlmBase.reconnectTimer);
        }
        YpStreamingLlmBase.reconnectTimer = window.setTimeout(() => {
            console.log("Reconnecting...");
            YpStreamingLlmBase.initWebSocketsStatic();
            YpStreamingLlmBase.reconnectDelay = Math.min(YpStreamingLlmBase.reconnectDelay *
                YpStreamingLlmBase.reconnectionAttempts, 30000);
            YpStreamingLlmBase.reconnectionAttempts++;
        }, YpStreamingLlmBase.reconnectDelay);
    }
    sendClientMessage(payload) {
        console.info("Sending client message");
        if (YpStreamingLlmBase.ws &&
            YpStreamingLlmBase.ws.readyState === WebSocket.OPEN) {
            YpStreamingLlmBase.ws.send(payload);
        }
        else {
            console.error("WebSocket not open; cannot send message");
            if (YpStreamingLlmBase.ws?.readyState !== WebSocket.CONNECTING) {
                YpStreamingLlmBase.scheduleReconnect();
            }
        }
    }
    sendMessage(action, payload) {
        console.info("Sending message");
        if (YpStreamingLlmBase.ws &&
            YpStreamingLlmBase.ws.readyState === WebSocket.OPEN) {
            YpStreamingLlmBase.ws.send(JSON.stringify({
                clientId: this.wsClientId,
                action,
                payload,
            }));
        }
        else {
            console.error("WebSocket not open; cannot send message");
            if (YpStreamingLlmBase.ws?.readyState !== WebSocket.CONNECTING) {
                YpStreamingLlmBase.scheduleReconnect();
            }
        }
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        console.info("Disconnected callback called, clearing heartbeat intervals and reconnect timer");
        if (YpStreamingLlmBase.reconnectTimer) {
            clearTimeout(YpStreamingLlmBase.reconnectTimer);
        }
        // Remove this instance from the subscribers.
        YpStreamingLlmBase.subscribers.delete(this);
        // If no instances remain, close the shared connection.
        if (YpStreamingLlmBase.subscribers.size === 0 && YpStreamingLlmBase.ws) {
            YpStreamingLlmBase.wsManuallyClosed = true;
            YpStreamingLlmBase.ws.close();
        }
    }
    async onMessage(event) {
        const data = JSON.parse(event.data);
        // Process messages as before
        switch (data.sender) {
            case "assistant":
                await this.addChatBotElement(data);
                break;
            case "user":
                this.addChatUserElement(data);
                break;
        }
        if (data.type !== "stream_followup" &&
            data.type !== "voice_input" &&
            data.type !== "updated_workflow" &&
            data.type !== "heartbeat_ack" && // already handled
            data.type !== "hiddenContextMessage") {
            this.scrollDown();
        }
    }
    addUserChatBotMessage(userMessage) {
        this.addChatBotElement({
            sender: "user",
            type: "start",
            message: userMessage,
        });
    }
    addThinkingChatBotMessage() {
        this.addChatBotElement({
            sender: "assistant",
            type: "thinking",
            message: "",
        });
    }
    addChatUserElement(data) {
        this.chatLog = [...this.chatLog, data];
    }
    get simplifiedChatLog() {
        let chatLog = this.chatLog.filter((chatMessage) => chatMessage.type !== "thinking" &&
            chatMessage.type !== "noStreaming" &&
            chatMessage.sender !== "system");
        return chatLog.map((chatMessage) => {
            return {
                ...chatMessage,
                message: chatMessage.rawMessage
                    ? chatMessage.rawMessage
                    : chatMessage.message,
            };
        });
    }
    reset() {
        this.chatLog = [];
        if (YpStreamingLlmBase.ws) {
            YpStreamingLlmBase.ws.close();
            // Clear the static socket so it can be re-established.
            YpStreamingLlmBase.ws = null;
            if (YpStreamingLlmBase.subscribers.size > 0) {
                YpStreamingLlmBase.initWebSocketsStatic();
            }
        }
        this.serverMemoryId = undefined;
        this.requestUpdate();
    }
}
// ----------------- Static Shared WebSocket & State -------------------
YpStreamingLlmBase.ws = null;
YpStreamingLlmBase.subscribers = new Set();
YpStreamingLlmBase.reconnectDelay = 1000;
YpStreamingLlmBase.reconnectionAttempts = 1;
YpStreamingLlmBase.wsManuallyClosed = false;
__decorate([
    property({ type: Array })
], YpStreamingLlmBase.prototype, "chatLog", void 0);
__decorate([
    property({ type: String })
], YpStreamingLlmBase.prototype, "wsClientId", void 0);
__decorate([
    property({ type: Number })
], YpStreamingLlmBase.prototype, "webSocketsErrorCount", void 0);
__decorate([
    property({ type: String })
], YpStreamingLlmBase.prototype, "wsEndpoint", void 0);
__decorate([
    property({ type: String })
], YpStreamingLlmBase.prototype, "currentFollowUpQuestions", void 0);
__decorate([
    property({ type: Boolean })
], YpStreamingLlmBase.prototype, "programmaticScroll", void 0);
__decorate([
    property({ type: Boolean })
], YpStreamingLlmBase.prototype, "disableAutoScroll", void 0);
__decorate([
    property({ type: Number })
], YpStreamingLlmBase.prototype, "scrollStart", void 0);
__decorate([
    property({ type: String })
], YpStreamingLlmBase.prototype, "serverMemoryId", void 0);
__decorate([
    property({ type: Number })
], YpStreamingLlmBase.prototype, "defaultDevWsPort", void 0);
//# sourceMappingURL=yp-streaming-llm-base.js.map