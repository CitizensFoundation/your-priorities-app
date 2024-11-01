//TODO: Get this from @policysynth/agents
interface YpAssistantMessage {
  sender: string;
  type:
    | "hello_message"
    | "moderation_error"
    | "start"
    | "component"
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
  html?: string;
  refinedCausesSuggestions?: string[];
  hidden?: boolean;
}

interface PsSimpleChatLog {
  base64Audio?: string;
  sender: string;
  message: string;
  hiddenContextMessage?: boolean;
}
