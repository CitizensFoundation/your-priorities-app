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
        this.userScrolled = false;
        this.currentFollowUpQuestions = "";
        this.programmaticScroll = false;
        this.scrollStart = 0;
        this.defaultDevWsPort = 4242;
        this.disableWebsockets = false;
        this.wsManuallyClosed = false;
        this.heartBeatRate = 55000;
    }
    connectedCallback() {
        super.connectedCallback();
        if (!this.disableWebsockets) {
            this.initWebSockets();
        }
    }
    initWebSockets() {
        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
            this.heartbeatInterval = undefined;
        }
        let wsEndpoint;
        if (window.location.hostname === "localhost" ||
            window.location.hostname === "192.1.168") {
            wsEndpoint = `ws://${window.location.hostname}:${this.defaultDevWsPort}`;
        }
        else {
            wsEndpoint = `wss://${window.location.hostname}:443`;
        }
        try {
            this.ws = new WebSocket(wsEndpoint);
            console.error("WebSocket Opened");
            this.ws.onmessage = this.onMessage.bind(this);
            this.ws.onopen = this.onWsOpen.bind(this);
            this.ws.onerror = (error) => {
                //TODO: Try to resend the last message
                this.webSocketsErrorCount++;
                console.error("WebSocket Error " + error);
                setTimeout(() => this.initWebSockets(), this.webSocketsErrorCount > 1
                    ? this.webSocketsErrorCount * 1000
                    : 2000);
                this.fire("yp-ws-error", { error: error });
            };
            this.ws.onclose = (error) => {
                console.error("WebSocket Close " + error);
                this.webSocketsErrorCount++;
                if (!this.wsManuallyClosed) {
                    setTimeout(() => this.initWebSockets(), this.webSocketsErrorCount > 1
                        ? this.webSocketsErrorCount * 1000
                        : 2000);
                }
                this.fire("yp-ws-closed");
            };
        }
        catch (error) {
            console.error("WebSocket Error " + error);
            this.webSocketsErrorCount++;
            setTimeout(() => this.initWebSockets(), this.webSocketsErrorCount > 1 ? this.webSocketsErrorCount * 1000 : 1500);
            this.fire("yp-ws-error", { error: error });
        }
    }
    sendHeartbeat() {
        if (this.ws.readyState === WebSocket.OPEN) {
            console.error("Sending heartbeath");
            this.ws.send(JSON.stringify({ type: "heartbeat" }));
        }
        else {
            console.error("WebSocket not open");
        }
    }
    onWsOpen() {
        console.error("WebSocket onWsOpen");
        this.sendHeartbeat();
        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
        }
        //@ts-ignore
        this.heartbeatInterval = setInterval(() => this.sendHeartbeat(), this.heartBeatRate);
        this.ws.onmessage = (messageEvent) => {
            const data = JSON.parse(messageEvent.data);
            if (data.clientId) {
                this.wsClientId = data.clientId;
                this.ws.onmessage = this.onMessage.bind(this);
                console.error(`WebSocket clientId: ${this.wsClientId}`);
                this.fire("yp-ws-opened", { clientId: this.wsClientId });
            }
            else {
                console.error("Error: No clientId received from server!");
            }
        };
    }
    handleScroll() {
        if (this.programmaticScroll || !this.$$(this.scrollElementSelector)) {
            return;
        }
        const currentScrollTop = this.$$(this.scrollElementSelector).scrollTop;
        if (this.scrollStart === 0) {
            // Initial scroll
            this.scrollStart = currentScrollTop;
        }
        const threshold = 10;
        const atBottom = this.$$(this.scrollElementSelector).scrollHeight -
            currentScrollTop -
            this.$$(this.scrollElementSelector).clientHeight <=
            threshold;
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
    disconnectedCallback() {
        super.disconnectedCallback();
        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
            this.heartbeatInterval = undefined;
        }
        if (this.ws) {
            this.wsManuallyClosed = true;
            this.ws.close();
        }
    }
    async onMessage(event) {
        const data = JSON.parse(event.data);
        switch (data.sender) {
            case "assistant":
                this.addChatBotElement(data);
                break;
            case "user":
                this.addChatUserElement(data);
                break;
        }
        if (data.type !== "stream_followup") {
            this.scrollDown();
        }
    }
    scrollDown() {
        if (!this.userScrolled && this.$$(this.scrollElementSelector)) {
            this.programmaticScroll = true;
            const element = this.$$(this.scrollElementSelector);
            if (element.tagName === "INPUT" ||
                element.tagName === "TEXTAREA" ||
                element.tagName === "MD-OUTLINED-TEXT-FIELD") {
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
            chatMessage.sender != "system" &&
            chatMessage.message);
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
    property({ type: Object })
], YpStreamingLlmBase.prototype, "ws", void 0);
__decorate([
    property({ type: String })
], YpStreamingLlmBase.prototype, "scrollElementSelector", void 0);
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
    property({ type: Number })
], YpStreamingLlmBase.prototype, "scrollStart", void 0);
__decorate([
    property({ type: String })
], YpStreamingLlmBase.prototype, "serverMemoryId", void 0);
__decorate([
    property({ type: Number })
], YpStreamingLlmBase.prototype, "defaultDevWsPort", void 0);
//# sourceMappingURL=yp-streaming-llm-base.js.map