interface YpAiChatWsMessage {
  sender: string;
  type:
    | "hello_message"
    | "moderation_error"
    | "start"
    | "message"
    | "end"
    | "stream"
    | "noStreaming"
    | "error"
    | "info"
    | "agentStart"
    | "agentCompleted"
    | "agentUpdated"
    | "agentError"
    | "liveLlmCosts"
    | "memoryIdCreated"
    | "thinking"
    | "start_followup"
    | "end_followup"
    | "stream_followup";
  message: string;
  data?: string | number | object;
  rawMessage?: string;
  hidden?: boolean;
}

interface YpSimpleLlmChatLog {
  sender: string;
  message: string;
}
