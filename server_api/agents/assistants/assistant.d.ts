
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
  agentProductId: number;
  subscriptionId: number;
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
  availableAgents: Array<AssistantAgent>;
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
  agentProductId: number;
  subscriptionPlanId: number;
  name: string;
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

