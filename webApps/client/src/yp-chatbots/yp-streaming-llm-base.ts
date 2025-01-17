import { property } from "lit/decorators.js";
import { YpBaseElement } from "../common/yp-base-element.js";

export abstract class YpStreamingLlmBase extends YpBaseElement {
  @property({ type: Array })
  chatLog: YpAssistantMessage[] = [];

  @property({ type: String })
  wsClientId!: string;

  @property({ type: Number })
  webSocketsErrorCount = 0;

  @property({ type: String })
  wsEndpoint!: string;

  @property({ type: Object })
  ws!: WebSocket;

  @property({ type: String })
  scrollElementSelector = "#chat-messages";

  @property({ type: Boolean })
  useMainWindowScroll = false;

  @property({ type: Boolean })
  userScrolled = false;

  @property({ type: String })
  currentFollowUpQuestions: string = "";

  @property({ type: Boolean })
  programmaticScroll = false;

  @property({ type: Boolean })
  disableAutoScroll = false;

  @property({ type: Number })
  scrollStart: number = 0;

  @property({ type: String })
  serverMemoryId: string | undefined;

  @property({ type: Number })
  defaultDevWsPort = 4242;

  heartbeatInterval: number | undefined;

  disableWebsockets = false;
  wsManuallyClosed = false;

  heartBeatRate = 55000;

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
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = undefined;
    }

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
        this.fire("yp-ws-error", { error: error });
      };
      this.ws.onclose = (error) => {
        console.error("WebSocket Close " + error);
        this.webSocketsErrorCount++;
        if (!this.wsManuallyClosed) {
          setTimeout(
            () => this.initWebSockets(),
            this.webSocketsErrorCount > 1
              ? this.webSocketsErrorCount * 1000
              : 2000
          );
        }
        this.fire("yp-ws-closed");
      };
    } catch (error) {
      console.error("WebSocket Error " + error);
      this.webSocketsErrorCount++;
      setTimeout(
        () => this.initWebSockets(),
        this.webSocketsErrorCount > 1 ? this.webSocketsErrorCount * 1000 : 1500
      );
      this.fire("yp-ws-error", { error: error });
    }
  }

  sendHeartbeat() {
    if (this.ws.readyState === WebSocket.OPEN) {
      console.error("Sending heartbeath");
      this.ws.send(JSON.stringify({ type: "heartbeat" }));
    } else {
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
    this.heartbeatInterval = setInterval(
      () => this.sendHeartbeat(),
      this.heartBeatRate
    );
    this.ws.onmessage = (messageEvent) => {
      const data = JSON.parse(messageEvent.data);
      if (data.clientId) {
        this.wsClientId = data.clientId;
        this.ws.onmessage = this.onMessage.bind(this);
        console.error(`WebSocket clientId: ${this.wsClientId}`);
        this.fire("yp-ws-opened", { clientId: this.wsClientId });
      } else {
        console.error("Error: No clientId received from server!");
      }
    };
  }

  handleScroll() {
    if (this.disableAutoScroll) {
      return;
    }

    if (
      this.programmaticScroll ||
      (!this.$$(this.scrollElementSelector) && !this.useMainWindowScroll)
    ) {
      console.error(
        `handleScroll: programmaticScroll: ${this.programmaticScroll} or scrollElementSelector: ${this.scrollElementSelector} not found`
      );
      return;
    }

    let currentScrollTop = 0;
    if (this.$$(this.scrollElementSelector)) {
      currentScrollTop = this.$$(this.scrollElementSelector)!.scrollTop;
    } else if (this.useMainWindowScroll) {
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
        this.$$(this.scrollElementSelector)!.scrollHeight -
          currentScrollTop -
          this.$$(this.scrollElementSelector)!.clientHeight <=
        threshold;
    } else if (this.$$(this.scrollElementSelector)) {
      atBottom =
        document.documentElement.scrollHeight -
          currentScrollTop -
          window.innerHeight <=
        threshold;
    }

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
      this.heartbeatInterval = undefined;
    }

    if (this.ws) {
      this.wsManuallyClosed = true;
      this.ws.close();
    }
  }

  async onMessage(event: MessageEvent) {
    const data: YpAssistantMessage = JSON.parse(event.data);

    switch (data.sender) {
      case "assistant":
        this.addChatBotElement(data);
        break;
      case "user":
        this.addChatUserElement(data);
        break;
    }

    if (data.type !== "stream_followup" &&
      data.type !== "voice_input" &&
      data.type !== "updated_workflow" &&
      data.type !== "heartbeat_ack" &&
      data.type !== "hiddenContextMessage"
    ) {
      this.scrollDown();
    }
  }

  scrollDown() {
    if (this.disableAutoScroll) {
      return;
    }

    if (
      !this.userScrolled &&
      (this.$$(this.scrollElementSelector) || this.useMainWindowScroll)
    ) {
      this.programmaticScroll = true;
      let element;
      if (this.useMainWindowScroll) {
        element = window.document.documentElement;
      } else if (this.$$(this.scrollElementSelector)) {
        element = this.$$(this.scrollElementSelector)!;
      }

      if (
        element?.tagName === "INPUT" ||
        element?.tagName === "TEXTAREA" ||
        element?.tagName === "MD-OUTLINED-TEXT-FIELD"
      ) {
        // Move the cursor to the end of the text
        (element as HTMLInputElement).selectionStart = (
          element as HTMLInputElement
        ).selectionEnd = (element as HTMLInputElement).value.length;
        element.scrollTop = element.scrollHeight - 100;
      } else {
        // For non-text field elements, use scrollTop and scrollHeight to scroll
        element!.scrollTop = element!.scrollHeight;
      }

      setTimeout(() => {
        this.programmaticScroll = false;
      }, 100);
    } else {
      console.error("User scrolled, not scrolling down");
    }
  }

  addUserChatBotMessage(userMessage: string) {
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

  abstract addChatBotElement(wsMessage: YpAssistantMessage): Promise<void>;

  addChatUserElement(data: YpAssistantMessage) {
    this.chatLog = [...this.chatLog, data];
  }

  get simplifiedChatLog() {
    let chatLog = this.chatLog.filter(
      (chatMessage) =>
        chatMessage.type != "thinking" &&
        chatMessage.type != "noStreaming" &&
        chatMessage.sender != "system"
    );
    return chatLog.map((chatMessage) => {
      return {
        ...chatMessage,
        message: chatMessage.rawMessage
          ? chatMessage.rawMessage
          : chatMessage.message,
      };
    }) as PsSimpleChatLog[];
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
