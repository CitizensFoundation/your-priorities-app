
interface UnsubscribeResult {
  success: boolean;
  error?: string;
  subscriptionId?: number;
}

interface SubscribeResult {
  success: boolean;
  error?: string;
  plan?: YpSubscriptionPlanAttributes;
  subscription?: YpSubscriptionAttributes;
}

interface AssistantAgent {
  subscriptionId: number;
  subscriptionPlanId: number;
  name: string;
  description: string;
  imageUrl: string;
  isRunning: boolean;
}

interface AssistantAgentRun {
  runId: number;
  agentProductId: number;
  agentRunId: number;
  status: string;
  agentName: string;
  workflow: any;
  subscriptionId: number;
}

interface AssistantAgentSubscriptionStatus {
  availableSubscriptions: Array<YpSubscriptionAttributes>;
  runningAgents: Array<AssistantAgentRun>;
  systemStatus: {
    healthy: boolean;
    lastUpdated: Date;
    error?: string;
  };
}

interface AssistantAgentBundle {
  agentBundleId: number;
  name: string;
  description: string;
  imageUrl: string;
}

interface AssistantAgentPlan {
  subscriptionPlanId: number;
  name: string;
  type: YpSubscriptionPlanType;
  description: string;
  imageUrl: string;
  price: number;
  currency: string;
  maxRunsPerCycle: number;
}

interface AssistantAgentPlanStatus {
  availablePlans: Array<AssistantAgentPlan>;
  availableBundle: AssistantAgentBundle | string;
  systemStatus: {
    healthy: boolean;
    lastUpdated: Date;
    error?: string;
  };
}

interface ToolClientEvent {
  name: YpAssistantMessageType;
  details: any;
}

interface ToolClientEventUiClick {
  name: "ui_click";
  details: YpAssistantUiClickTypes;
}

interface ToolExecutionResult<T = unknown> {
  success: boolean;
  data?: T;
  html?: string;
  uniqueToken?: string;
  clientEvents?: ToolClientEvent[];
  error?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Enhanced AssistantChatbotTool interface with result type
 */
interface AssistantChatbotTool {
  name: string;
  description: string;
  type?: string;
  parameters: ToolDefinition["parameters"];
  handler: (params: any) => Promise<ToolExecutionResult>;
  resultSchema?: ToolDefinition["parameters"];
}

/**
 * Message format for tool results
 */
interface ToolResponseMessage {
  role: "tool";
  content: string;
  tool_call_id: string;
  name: string;
}

interface ToolCall {
  id: string;
  name: string;
  arguments: string;
  startTime?: number; // For timeout tracking
}

interface AssistantChatbotMode {
  name: YpAssistantMode;
  description: string;
  systemPrompt: string;
  tools: AssistantChatbotTool[];
  routingRules?: string[];
  allowedTransitions?: YpAssistantMode[];
  cleanup?: () => Promise<void>;
}

interface YpBaseAssistantMemoryData extends YpBaseChatBotMemoryData {
  redisKey: string;
  currentMode: YpAssistantMode;
  currentUser?: YpUserData;
  haveShownLoginWidget?: boolean;
  haveShownConfigurationWidget?: boolean;
  currentAgentStatus?: {
    subscriptionPlanId: number;
    activeAgentRunId?: number;
    subscriptionId: number | null;
    subscriptionState: YpAssistantAgentSubscriptionState;
    configurationState: YpAssistantAgentConfigurationState;
  };

  allChatLogs?: YpSimpleChatLog[];

  loginState?: YpAssistantLoginState;

  modeData?: AssistantModeData;
  modeHistory?: Array<{
    mode: YpAssistantMode;
    timestamp: number;
    reason?: string;
  }>;
}

