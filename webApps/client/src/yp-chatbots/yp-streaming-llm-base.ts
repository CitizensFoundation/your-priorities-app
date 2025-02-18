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
  currentFollowUpQuestions: string = "";

  @property({ type: Boolean })
  programmaticScroll = false;

  @property({ type: Boolean })
  disableAutoScroll = false;

  @property({ type: Number })
  scrollStart: number = 0;

  @property({ type: String })
  serverMemoryId: string | undefined;

  // Keeping an instance property for interface compatibility.
  // (This value will be used from the first subscriber when creating the connection.)
  @property({ type: Number })
  defaultDevWsPort = 4242;

  // An instance flag so that an element can opt out of receiving socket events.
  disableWebsockets = false;

  // ----------------- Static Shared WebSocket & State -------------------
  private static ws: WebSocket | null = null;
  private static subscribers: Set<YpStreamingLlmBase> = new Set();

  private static reconnectDelay: number = 1000;
  private static reconnectionAttempts: number = 1;
  private static reconnectTimer: number | undefined;
  private static wsManuallyClosed: boolean = false;

  protected get ws(): WebSocket | null {
    // This returns the static WebSocket from the class constructor
    return (this.constructor as typeof YpStreamingLlmBase).ws;
  }
  protected set ws(value: WebSocket | null) {
    (this.constructor as typeof YpStreamingLlmBase).ws = value;
  }

  constructor() {
    super();
  }

  override connectedCallback() {
    super.connectedCallback();
    if (!this.disableWebsockets) {
      // Add this instance to the list of subscribers
      YpStreamingLlmBase.subscribers.add(this);
      // If no shared connection exists or if it’s closed, create a new one.
      if (
        !YpStreamingLlmBase.ws ||
        YpStreamingLlmBase.ws.readyState === WebSocket.CLOSED
      ) {
        YpStreamingLlmBase.initWebSocketsStatic(this);
      }
    }
  }

  /**
   * Initializes the shared WebSocket connection.
   * Uses the defaultDevWsPort from the provided instance (or first subscriber) for the URL.
   */
  private static initWebSocketsStatic(instance?: YpStreamingLlmBase) {
    let defaultPort = 4242;
    if (instance) {
      defaultPort = instance.defaultDevWsPort;
    } else if (YpStreamingLlmBase.subscribers.size > 0) {
      const firstSub = YpStreamingLlmBase.subscribers.values().next().value;
      if (firstSub) {
        defaultPort = firstSub.defaultDevWsPort;
      }
    }

    const storedClientId = localStorage.getItem("ypWsClientId") || "";
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    // Use port 443 for wss, or the defaultPort for ws.
    const port = protocol === "wss:" ? 443 : defaultPort;
    const endpoint = `${protocol}//${window.location.hostname}${
      port ? ":" + port : ""
    }/${storedClientId ? "?clientId=" + storedClientId : ""}`;

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

  private static scheduleReconnect() {
    // Do not attempt to reconnect if the socket was manually closed.
    if (YpStreamingLlmBase.wsManuallyClosed) return;

    if (YpStreamingLlmBase.reconnectTimer) {
      window.clearTimeout(YpStreamingLlmBase.reconnectTimer);
    }
    YpStreamingLlmBase.reconnectTimer = window.setTimeout(() => {
      console.log("Reconnecting...");
      YpStreamingLlmBase.initWebSocketsStatic();
      YpStreamingLlmBase.reconnectDelay = Math.min(
        YpStreamingLlmBase.reconnectDelay *
          YpStreamingLlmBase.reconnectionAttempts,
        30000
      );
      YpStreamingLlmBase.reconnectionAttempts++;
    }, YpStreamingLlmBase.reconnectDelay);
  }

  public sendClientMessage(payload: string) {
    console.info("Sending client message");
    if (
      YpStreamingLlmBase.ws &&
      YpStreamingLlmBase.ws.readyState === WebSocket.OPEN
    ) {
      YpStreamingLlmBase.ws.send(payload);
    } else {
      console.error("WebSocket not open; cannot send message");
      if (YpStreamingLlmBase.ws?.readyState !== WebSocket.CONNECTING) {
        YpStreamingLlmBase.scheduleReconnect();
      }
    }
  }

  public sendMessage(action: string, payload: any) {
    console.info("Sending message");
    if (
      YpStreamingLlmBase.ws &&
      YpStreamingLlmBase.ws.readyState === WebSocket.OPEN
    ) {
      YpStreamingLlmBase.ws.send(
        JSON.stringify({
          clientId: this.wsClientId,
          action,
          payload,
        })
      );
    } else {
      console.error("WebSocket not open; cannot send message");
      if (YpStreamingLlmBase.ws?.readyState !== WebSocket.CONNECTING) {
        YpStreamingLlmBase.scheduleReconnect();
      }
    }
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();

    console.info(
      "Disconnected callback called, clearing heartbeat intervals and reconnect timer"
    );

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

  async onMessage(event: MessageEvent) {
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

    if (
      data.type !== "stream_followup" &&
      data.type !== "voice_input" &&
      data.type !== "updated_workflow" &&
      data.type !== "heartbeat_ack" && // already handled
      data.type !== "hiddenContextMessage"
    ) {
      this.scrollDown();
    }
  }

  abstract scrollDown(): void;

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
        chatMessage.type !== "thinking" &&
        chatMessage.type !== "noStreaming" &&
        chatMessage.sender !== "system"
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
