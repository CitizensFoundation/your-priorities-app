import { property } from "lit/decorators.js";
import { YpBaseElement } from "../common/yp-base-element.js";

export abstract class YpStreamingLlmBase extends YpBaseElement {
  @property({ type: Array })
  chatLog: YpAiChatWsMessage[] = [];

  @property({ type: String })
  wsClientId!: string;

  @property({ type: Number })
  webSocketsErrorCount = 0;

  @property({ type: String })
  wsEndpoint!: string;

  @property({ type: Object })
  ws!: WebSocket;

  @property({ type: Boolean })
  userScrolled = false;

  @property({ type: String })
  currentFollowUpQuestions: string = "";

  @property({ type: Boolean })
  programmaticScroll = false;

  @property({ type: Number })
  scrollStart: number = 0;

  @property({ type: String })
  serverMemoryId: string | undefined;

  @property({ type: Number })
  defaultDevWsPort = 4242;

  heartbeatInterval: number | undefined;

  disableWebsockets = false;

  constructor() {
    super();
  }

  override connectedCallback() {
    super.connectedCallback();
    if (!this.disableWebsockets) {
      this.initWebSockets();
    }
  }

  initWebSockets() {
    let wsEndpoint;

    if (
      window.location.hostname === "localhost" ||
      window.location.hostname === "192.1.168"
    ) {
      wsEndpoint = `ws://${window.location.hostname}:${this.defaultDevWsPort}`;
    } else {
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
        setTimeout(
          () => this.initWebSockets(),
          this.webSocketsErrorCount > 1
            ? this.webSocketsErrorCount * 1000
            : 2000
        );
        this.fire('yp-ws-error', { error: error })
      };
      this.ws.onclose = (error) => {
        console.error("WebSocket Close " + error);
        this.webSocketsErrorCount++;
        setTimeout(
          () => this.initWebSockets(),
          this.webSocketsErrorCount > 1
            ? this.webSocketsErrorCount * 1000
            : 2000
        );
        this.fire('yp-ws-closed')
      };
    } catch (error) {
      console.error("WebSocket Error " + error);
      this.webSocketsErrorCount++;
      setTimeout(
        () => this.initWebSockets(),
        this.webSocketsErrorCount > 1 ? this.webSocketsErrorCount * 1000 : 1500
      );
      this.fire('yp-ws-error', { error: error })
    }
  }

  sendHeartbeat() {
    if (this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: "heartbeat" }));
    } else {
      console.error("WebSocket not open");
    }
  }

  onWsOpen() {
    console.error("WebSocket onWsOpen");
    this.sendHeartbeat();

    //@ts-ignore
    this.heartbeatInterval = setInterval(() => this.sendHeartbeat(), 55000);
    this.ws.onmessage = (messageEvent) => {
      const data = JSON.parse(messageEvent.data);
      if (data.clientId) {
        this.wsClientId = data.clientId;
        this.ws.onmessage = this.onMessage.bind(this);
        console.error(`WebSocket clientId: ${this.wsClientId}`);
      } else {
        console.error("Error: No clientId received from server!");
      }
    };
  }

  handleScroll() {
    if (this.programmaticScroll || !this.$$("#chat-messages")) {
      return;
    }

    const currentScrollTop = this.$$("#chat-messages")!.scrollTop;
    if (this.scrollStart === 0) {
      // Initial scroll
      this.scrollStart = currentScrollTop;
    }

    const threshold = 10;
    const atBottom =
      this.$$("#chat-messages")!.scrollHeight -
        currentScrollTop -
        this.$$("#chat-messages")!.clientHeight <=
      threshold;

    if (atBottom) {
      this.userScrolled = false;
      this.scrollStart = 0; // Reset scroll start
    } else if (Math.abs(this.scrollStart - currentScrollTop) > threshold) {
      this.userScrolled = true;
      // Optionally reset scrollStart here if you want to continuously check for threshold scroll
      // this.scrollStart = currentScrollTop;
    }
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();

    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }

    if (this.ws) {
      this.ws.close();
    }
  }

  async onMessage(event: MessageEvent) {
    const data: YpAiChatWsMessage = JSON.parse(event.data);
    //console.error(event.data);

    switch (data.sender) {
      case "bot":
        this.addChatBotElement(data);
        break;
      case "you":
        this.addChatUserElement(data);
        break;
    }

    if (data.type !== "stream_followup") {
      this.scrollDown();
    }
  }

  scrollDown() {
    if (!this.userScrolled && this.$$("#chat-messages")) {
      this.programmaticScroll = true;
      this.$$("#chat-messages")!.scrollTop =
        this.$$("#chat-messages")!.scrollHeight;
      setTimeout(() => {
        this.programmaticScroll = false;
      }, 100);
    }
  }

  addUserChatBotMessage(userMessage: string) {
    this.addChatBotElement({
      sender: "you",
      type: "start",
      message: userMessage,
    });
  }

  addThinkingChatBotMessage() {
    this.addChatBotElement({
      sender: "bot",
      type: "thinking",
      message: "",
    });
  }

  abstract addChatBotElement(wsMessage: YpAiChatWsMessage): Promise<void>;

  addChatUserElement(data: YpAiChatWsMessage) {
    this.chatLog = [...this.chatLog, data];
  }

  get simplifiedChatLog() {
    let chatLog = this.chatLog.filter(
      (chatMessage) =>
        chatMessage.type != "thinking" &&
        chatMessage.type != "noStreaming" &&
        chatMessage.message
    );
    return chatLog.map((chatMessage) => {
      return {
        sender: chatMessage.sender == "bot" ? "assistant" : "user",
        message: chatMessage.rawMessage
          ? chatMessage.rawMessage
          : chatMessage.message,
      };
    }) as YpSimpleLlmChatLog[];
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
