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

  ws!: WebSocket;

  disableWebsockets = false;
  wsManuallyClosed = false;

  reconnectDelay = 1000;
  reconnectionAttempts = 1;

  reconnectTimer: number | undefined;

  constructor() {
    super();
  }

  override connectedCallback() {
    super.connectedCallback();
    if (!this.disableWebsockets) {
      this.initWebSockets();
    }
  }

  private initWebSockets() {
    let storedClientId = localStorage.getItem("ypWsClientId") || "";

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const port = protocol === "wss:" ? 443 : this.defaultDevWsPort;
    const endpoint = `${protocol}//${window.location.hostname}${
      port ? ":" + port : ""
    }/${!storedClientId ? "" : "?clientId=" + storedClientId}`;

    this.ws = new WebSocket(endpoint);
    console.log("Attempting to connect to", endpoint);

    this.ws.onopen = () => {
      console.log("WebSocket open");
    };

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      // If the server reaffirms/overrides our clientId, store it
      if (data.clientId) {
        console.log("Received clientId from server:", data.clientId);
        localStorage.setItem("ypWsClientId", data.clientId);
        storedClientId = data.clientId;
      }

      this.wsClientId = storedClientId;

      this.onMessage(event);
    };

    this.ws.onclose = (ev) => {
      console.warn("WebSocket closed:", ev.reason);
      this.scheduleReconnect();
    };

    this.ws.onerror = (err) => {
      console.error("WebSocket error:", err);
      // Still close or schedule reconnect
      this.scheduleReconnect();
    };
  }

  private scheduleReconnect() {
    if (this.reconnectTimer) window.clearTimeout(this.reconnectTimer);
    this.reconnectTimer = window.setTimeout(() => {
      console.log("Reconnecting...");
      this.initWebSockets();
      // Possibly apply exponential backoff if you like:
      this.reconnectDelay = Math.min(
        this.reconnectDelay * this.reconnectionAttempts,
        30000
      );
      this.reconnectionAttempts++;
    }, this.reconnectDelay);
  }

  public sendMessage(action: string, payload: any) {
    console.info("Sending message");
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(
        JSON.stringify({
          clientId: this.wsClientId,
          action,
          payload,
        })
      );
    } else {
      console.error("WebSocket not open; cannot send message");
    }
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();

    console.info(
      "Disconnected callback called, clearing heartbeat intervals and reconnect timer"
    );

    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);

    if (this.ws) {
      this.wsManuallyClosed = true;
      this.ws.close();
    }
  }

  async onMessage(event: MessageEvent) {
    const data = JSON.parse(event.data);

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
    if (
      data.type !== "stream_followup" &&
      data.type !== "voice_input" &&
      data.type !== "updated_workflow" &&
      data.type !== "heartbeat_ack" && // you already handled that
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

  handleScroll() {
    if (this.disableAutoScroll) {
      return;
    }

    if (
      this.programmaticScroll ||
      (!this.$$(this.scrollElementSelector) && !this.useMainWindowScroll)
    ) {
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
