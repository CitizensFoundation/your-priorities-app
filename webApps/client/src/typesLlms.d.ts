type YpAssistantMessageType =
  | "hello_message"
  | "moderation_error"
  | "start"
  | "component"
  | "html"
  | "clear_audio_buffer"
  | "audio"
  | "message"
  | "hiddenContextMessage"
  | "end"
  | "stream"
  | "noStreaming"
  | "error"
  | "info"
  | "modeChange"
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
  | "avatar_url_change"
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
  url?: string;
}

type YpSenderType = "assistant" | "user" | "system";

interface PsSimpleChatLog {
  html?: string;
  sender: YpSenderType;
  message: string;
  type: YpAssistantMessageType;
  hiddenContextMessage?: boolean;
}
