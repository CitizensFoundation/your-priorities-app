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

  heartbeatInterval: number | undefined;
  heartbeatTimeout: number | undefined;
  heartbeatAcked = false;
  reconnectDelay = 2000;

  private isConnecting = false;
  reconnectTimer: number | undefined;

  heartBeatRate = 50000;

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

    let endpoint: string;
    if (
      window.location.hostname === "localhost" ||
      window.location.hostname.startsWith("192.168")
    ) {
      endpoint = `ws://${window.location.hostname}:${this.defaultDevWsPort}`;
    } else {
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
          this.ws!.onmessage = this.onMessage.bind(this);
          this.startHeartbeat();
          this.isConnecting = false;
        } else if (data.type === "heartbeat_ack") {
          this.heartbeatAcked = true;
          console.debug("Heartbeat ack received");
        } else {
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
    } catch (error) {
      console.error("Error initializing WebSocket:", error);
      this.scheduleReconnect();
      this.fire("yp-ws-error", { error });
      this.isConnecting = false;
    }
  }

  startHeartbeat() {
    // Clear any previous intervals/timeouts
    console.info("Starting heartbeat");
    if (this.heartbeatInterval) clearInterval(this.heartbeatInterval);
    if (this.heartbeatTimeout) clearTimeout(this.heartbeatTimeout);

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
    } else {
      console.error("Cannot send heartbeat, socket not open");
    }
  }

  scheduleReconnect() {
    console.info("Scheduling reconnect");
    if (this.wsManuallyClosed) return;

    console.info("Clearing heartbeat intervals and reconnect timer");
    // Clear heartbeat intervals and any previous reconnect timer
    if (this.heartbeatInterval) clearInterval(this.heartbeatInterval);
    if (this.heartbeatTimeout) clearTimeout(this.heartbeatTimeout);
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);

    this.heartbeatInterval = undefined;
    this.heartbeatTimeout = undefined;

    this.reconnectTimer = window.setTimeout(() => {
      console.info("Reconnecting WebSocket...");
      this.initWebSockets();
      // Increase delay for subsequent attempts (optional max cap can be added)
      this.reconnectDelay *= 1.5;
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

    console.info("Disconnected callback called, clearing heartbeat intervals and reconnect timer");

    if (this.heartbeatInterval) clearInterval(this.heartbeatInterval);
    if (this.heartbeatTimeout) clearTimeout(this.heartbeatTimeout);
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);

    if (this.ws) {
      this.wsManuallyClosed = true;
      this.ws.close();
    }
    // Reset our connection flag
    this.isConnecting = false;
  }

  async onMessage(event: MessageEvent) {
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
