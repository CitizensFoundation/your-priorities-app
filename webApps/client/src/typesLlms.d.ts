//TODO: Get this from @policysynth/agents
interface PsAiChatWsMessage {
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
  refinedCausesSuggestions?: string[];
  hidden?: boolean;
}

interface PsSimpleChatLog {
  sender: string;
  message: string;
}
