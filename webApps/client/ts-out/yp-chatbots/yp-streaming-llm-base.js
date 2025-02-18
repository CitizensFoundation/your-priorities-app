var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { property } from "lit/decorators.js";
import { YpBaseElement } from "../common/yp-base-element.js";
export class YpStreamingLlmBase extends YpBaseElement {
    constructor() {
        super();
        this.chatLog = [];
        this.webSocketsErrorCount = 0;
        this.scrollElementSelector = "#chat-messages";
        this.useMainWindowScroll = false;
        this.userScrolled = false;
        this.currentFollowUpQuestions = "";
        this.programmaticScroll = false;
        this.disableAutoScroll = false;
        this.scrollStart = 0;
        this.defaultDevWsPort = 4242;
        this.disableWebsockets = false;
        this.wsManuallyClosed = false;
        this.heartbeatAcked = false;
        this.reconnectDelay = 2000;
        this.isConnecting = false;
        this.heartBeatRate = 50000;
    }
    connectedCallback() {
        super.connectedCallback();
        if (!this.disableWebsockets) {
            this.initWebSockets();
        }
    }
    initWebSockets() {
        // Prevent multiple connections:
        if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
            console.info("WebSocket is already connected or connecting, skipping new connection.");
            return;
        }
        if (this.isConnecting) {
            console.info("WebSocket connection is already in progress.");
            return;
        }
        this.isConnecting = true;
        // Clear heartbeat intervals/timeouts if any
        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
            this.heartbeatInterval = undefined;
        }
        if (this.heartbeatTimeout) {
            clearTimeout(this.heartbeatTimeout);
            this.heartbeatTimeout = undefined;
        }
        let endpoint;
        if (window.location.hostname === "localhost" ||
            window.location.hostname.startsWith("192.168")) {
            endpoint = `ws://${window.location.hostname}:${this.defaultDevWsPort}`;
        }
        else {
            endpoint = `wss://${window.location.hostname}:443`;
        }
        try {
            this.ws = new WebSocket(endpoint);
            console.info("WebSocket: Attempting connection to", endpoint);
            // Setup temporary message handler for handshake
            this.ws.onmessage = (event) => {
                const data = JSON.parse(event.data);
                if (data.clientId) {
                    this.wsClientId = data.clientId;
                    console.info(`Received clientId: ${this.wsClientId}`);
                    this.fire("yp-ws-opened", { clientId: this.wsClientId });
                    // Switch to main message handler and start heartbeat
                    this.ws.onmessage = this.onMessage.bind(this);
                    this.startHeartbeat();
                    this.isConnecting = false;
                }
                else if (data.type === "heartbeat_ack") {
                    this.heartbeatAcked = true;
                    console.debug("Heartbeat ack received");
                }
                else {
                    // Fallback for other messages before handshake completes
                    this.onMessage(event);
                }
            };
            this.ws.onopen = () => {
                console.info("WebSocket connection opened");
                // Immediately send a heartbeat to kick things off
                this.sendHeartbeat();
            };
            this.ws.onerror = (error) => {
                console.error("WebSocket error:", error);
                this.scheduleReconnect();
                this.fire("yp-ws-error", { error });
            };
            this.ws.onclose = (event) => {
                console.warn("WebSocket closed:", event);
                this.scheduleReconnect();
                this.fire("yp-ws-closed");
            };
        }
        catch (error) {
            console.error("Error initializing WebSocket:", error);
            this.scheduleReconnect();
            this.fire("yp-ws-error", { error });
            this.isConnecting = false;
        }
    }
    startHeartbeat() {
        // Clear any previous intervals/timeouts
        console.info("Starting heartbeat");
        if (this.heartbeatInterval)
            clearInterval(this.heartbeatInterval);
        if (this.heartbeatTimeout)
            clearTimeout(this.heartbeatTimeout);
        this.heartbeatInterval = window.setInterval(() => {
            this.heartbeatAcked = false;
            this.sendHeartbeat();
            if (this.heartbeatTimeout) {
                clearTimeout(this.heartbeatTimeout);
            }
            this.heartbeatTimeout = window.setTimeout(() => {
                if (!this.heartbeatAcked) {
                    console.error("Heartbeat ack not received, reconnecting...");
                    this.ws && this.ws.close(); // onclose will trigger reconnect
                }
            }, this.heartBeatRate * 0.8);
        }, this.heartBeatRate);
    }
    sendHeartbeat() {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            console.info("Sending heartbeat");
            this.ws.send(JSON.stringify({ type: "heartbeat" }));
        }
        else {
            console.error("Cannot send heartbeat, socket not open");
        }
    }
    scheduleReconnect() {
        console.info("Scheduling reconnect");
        if (this.wsManuallyClosed)
            return;
        console.info("Clearing heartbeat intervals and reconnect timer");
        // Clear heartbeat intervals and any previous reconnect timer
        if (this.heartbeatInterval)
            clearInterval(this.heartbeatInterval);
        if (this.heartbeatTimeout)
            clearTimeout(this.heartbeatTimeout);
        if (this.reconnectTimer)
            clearTimeout(this.reconnectTimer);
        this.heartbeatInterval = undefined;
        this.heartbeatTimeout = undefined;
        this.reconnectTimer = window.setTimeout(() => {
            console.info("Reconnecting WebSocket...");
            this.initWebSockets();
            // Increase delay for subsequent attempts (optional max cap can be added)
            this.reconnectDelay *= 1.5;
        }, this.reconnectDelay);
    }
    sendMessage(action, payload) {
        console.info("Sending message");
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({
                clientId: this.wsClientId,
                action,
                payload,
            }));
        }
        else {
            console.error("WebSocket not open; cannot send message");
        }
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        console.info("Disconnected callback called, clearing heartbeat intervals and reconnect timer");
        if (this.heartbeatInterval)
            clearInterval(this.heartbeatInterval);
        if (this.heartbeatTimeout)
            clearTimeout(this.heartbeatTimeout);
        if (this.reconnectTimer)
            clearTimeout(this.reconnectTimer);
        if (this.ws) {
            this.wsManuallyClosed = true;
            this.ws.close();
        }
        // Reset our connection flag
        this.isConnecting = false;
    }
    async onMessage(event) {
        const data = JSON.parse(event.data);
        // Add a small check for heartbeat_ack:
        if (data.type === "heartbeat_ack") {
            this.heartbeatAcked = true;
            console.info("Heartbeat ack received");
            // Possibly return here or break,
            // but if heartbeat_ack can coincide with other message data, handle that
            return;
        }
        // If there's also a chance we get a "clientId" again,
        // you could handle that as well. But probably not needed.
        // Then handle your normal "assistant"/"user" messages
        switch (data.sender) {
            case "assistant":
                this.addChatBotElement(data);
                break;
            case "user":
                this.addChatUserElement(data);
                break;
        }
        // If it's not any of these streaming or heartbeat messages, scroll
        if (data.type !== "stream_followup" &&
            data.type !== "voice_input" &&
            data.type !== "updated_workflow" &&
            data.type !== "heartbeat_ack" && // you already handled that
            data.type !== "hiddenContextMessage") {
            this.scrollDown();
        }
    }
    scrollDown() {
        if (this.disableAutoScroll) {
            return;
        }
        if (!this.userScrolled &&
            (this.$$(this.scrollElementSelector) || this.useMainWindowScroll)) {
            this.programmaticScroll = true;
            let element;
            if (this.useMainWindowScroll) {
                element = window.document.documentElement;
            }
            else if (this.$$(this.scrollElementSelector)) {
                element = this.$$(this.scrollElementSelector);
            }
            if (element?.tagName === "INPUT" ||
                element?.tagName === "TEXTAREA" ||
                element?.tagName === "MD-OUTLINED-TEXT-FIELD") {
                // Move the cursor to the end of the text
                element.selectionStart = element.selectionEnd = element.value.length;
                element.scrollTop = element.scrollHeight - 100;
            }
            else {
                // For non-text field elements, use scrollTop and scrollHeight to scroll
                element.scrollTop = element.scrollHeight;
            }
            setTimeout(() => {
                this.programmaticScroll = false;
            }, 100);
        }
        else {
            console.error("User scrolled, not scrolling down");
        }
    }
    handleScroll() {
        if (this.disableAutoScroll) {
            return;
        }
        if (this.programmaticScroll ||
            (!this.$$(this.scrollElementSelector) && !this.useMainWindowScroll)) {
            console.error(`handleScroll: programmaticScroll: ${this.programmaticScroll} or scrollElementSelector: ${this.scrollElementSelector} not found`);
            return;
        }
        let currentScrollTop = 0;
        if (this.$$(this.scrollElementSelector)) {
            currentScrollTop = this.$$(this.scrollElementSelector).scrollTop;
        }
        else if (this.useMainWindowScroll) {
            currentScrollTop = window.scrollY;
        }
        if (this.scrollStart === 0) {
            // Initial scroll
            this.scrollStart = currentScrollTop;
        }
        const threshold = 10;
        let atBottom;
        if (this.useMainWindowScroll) {
            atBottom =
                this.$$(this.scrollElementSelector).scrollHeight -
                    currentScrollTop -
                    this.$$(this.scrollElementSelector).clientHeight <=
                    threshold;
        }
        else if (this.$$(this.scrollElementSelector)) {
            atBottom =
                document.documentElement.scrollHeight -
                    currentScrollTop -
                    window.innerHeight <=
                    threshold;
        }
        if (atBottom) {
            this.userScrolled = false;
            this.scrollStart = 0; // Reset scroll start
        }
        else if (Math.abs(this.scrollStart - currentScrollTop) > threshold) {
            this.userScrolled = true;
            // Optionally reset scrollStart here if you want to continuously check for threshold scroll
            // this.scrollStart = currentScrollTop;
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
        let chatLog = this.chatLog.filter((chatMessage) => chatMessage.type != "thinking" &&
            chatMessage.type != "noStreaming" &&
            chatMessage.sender != "system");
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
        if (this.ws) {
            this.ws.close();
            this.initWebSockets();
        }
        this.serverMemoryId = undefined;
        this.requestUpdate();
    }
}
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
], YpStreamingLlmBase.prototype, "scrollElementSelector", void 0);
__decorate([
    property({ type: Boolean })
], YpStreamingLlmBase.prototype, "useMainWindowScroll", void 0);
__decorate([
    property({ type: Boolean })
], YpStreamingLlmBase.prototype, "userScrolled", void 0);
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