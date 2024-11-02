type YpAssistantMessageType =
  | "hello_message"
  | "moderation_error"
  | "start"
  | "component"
  | "html"
  | "audio"
  | "message"
  | "hiddenContextMessage"
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
  | "current_mode"
  | "listening_start"
  | "listening_stop"
  | "input_audio_buffer.append"
  | "input_audio_buffer.commit"
  | "ai_speaking_start"
  | "ai_speaking_stop"
  | "stream_followup";

interface YpAssistantMessage {
  sender: YpSenderType;
  type: YpAssistantMessageType;
  message?: string;
  mode?: string;
  data?: string | number | object;
  rawMessage?: string;
  html?: string;
  refinedCausesSuggestions?: string[];
  base64Audio?: string;
  hidden?: boolean;
}

type YpSenderType = "assistant" | "user" | "system";

interface PsSimpleChatLog {
  html?: string;
  sender: YpSenderType;
  message: string;
  type: YpAssistantMessageType;
  hiddenContextMessage?: boolean;
}
