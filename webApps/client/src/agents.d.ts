interface YpBaseModelClass {
  id: number;
  uuid: string;
  created_at: Date;
  updated_at: Date;
}
// YpAgentProductAttributes Interface
interface YpAgentProductAttributes extends YpBaseModelAttributes {
  user_id: number;
  group_id: number;
  domain_id: number;
  name: string;
  description?: string;
  configuration?: YpAgentProductConfiguration;
  status?: YpAgentProductStatus;
  Bundles?: YpAgentProductBundleAttributes[];
}

interface YpAgentProductConfiguration {
  workflow?: YpWorkflowConfiguration;
  settings?: Record<string, any>;
  integrations?: Record<string, any>;
}

interface YpAgentProductStatus {
  [key: string]: any;
}

// YpAgentProductBoosterPurchaseAttributes Interface
interface YpAgentProductBoosterPurchaseAttributes
  extends YpBaseModelAttributes {
  user_id: number;
  subscription_plan_id: number;
  runs_purchased: number;
  amount: number;
  currency: string;
  purchase_date: Date;
  payment_method?: string;
  status: string;
  transaction_id?: string;
  metadata?: Record<string, any>;
  discount_id?: number;
}

interface YpSubscriptionPlanConfiguration {
  amount: number;
  currency: string;
  billing_cycle: "monthly" | "yearly" | "weekly";
  type: "free" | "paid" | "coming_soon";
  max_runs_per_cycle: number;
  booster_runs_available: number;
  booster_price: number;
  booster_currency: string;
  structuredAnswersOverride: YpStructuredAnswer[];
  requiredStructuredQuestions: YpStructuredQuestionData[];
}

// YpSubscriptionPlanAttributes Interface
interface YpSubscriptionPlanAttributes extends YpBaseModelAttributes {
  agent_product_id: number;
  name: string;
  description?: string;
  configuration: YpSubscriptionPlanConfiguration;
}

// YpSubscriptionAttributes Interface
interface YpSubscriptionAttributes extends YpBaseModelAttributes {
  user_id: number;
  agent_product_id: number;
  subscription_plan_id: number;
  start_date: Date;
  end_date?: Date;
  next_billing_date: Date;
  status: "active" | "paused" | "cancelled" | "expired";
  payment_method?: string;
  transaction_id?: string;
  metadata?: Record<string, any>;
}

// YpDiscountAttributes Interface
interface YpDiscountAttributes extends YpBaseModelAttributes {
  code: string;
  description?: string;
  discount_type: "percentage" | "fixed";
  discount_value: number;
  max_uses?: number;
  uses: number;
  start_date?: Date;
  end_date?: Date;
  applicable_to: "agent_product" | "booster" | "subscription" | "both";
}

//TODO: Add fixed values
interface YpAgentProductRunInputData {
  [key: string]: any;
}

//TODO: Add fixed values
interface YpAgentProductRunOutputData {
  [key: string]: any;
}

// YpAgentProductRunAttributes Interface
interface YpAgentProductRunAttributes extends YpBaseModelAttributes {
  agent_product_id: number;
  start_time: Date;
  end_time?: Date;
  duration?: number; // Duration in seconds
  status: "pending" | "running" | "completed" | "failed" | "cancelled";
  input_data?: YpAgentProductRunInputData;
  output_data?: YpAgentProductRunOutputData;
  error_message?: string;
  run_type?: string; // e.g., 'scheduled', 'manual', 'triggered'
  metadata?: Record<string, any>;
}

// Interface for base model attributes
interface YpBaseModelAttributes {
  id: number;
  uuid: string;
  created_at: Date;
  updated_at: Date;
}

// Interface for YpAgentProductBundle attributes

interface YpAgentProductBundleConfiguration {
  imageUrl?: string;
}

interface YpAgentProductBundleAttributes extends YpBaseModelAttributes {
  name: string;
  description?: string;
  configuration?: YpAgentProductBundleConfiguration;
}

interface YpBaseChatBotMemoryData extends PsAgentBaseMemoryData {
  chatLog?: PsSimpleChatLog[];
}

interface YpWorkflowStep {
  id: number;
  name: string;
  groupId?: number;
  description: string;
  agentClassUuid: string;
  type: "agentOps" | "engagmentFromOutputConnector";
  engagementGroupId?: number;
  order?: number;
  configuration?: Record<string, any>;
  dependencies?: string[];
  timeout?: number;
  retryConfig?: {
    maxAttempts: number;
    backoffMultiplier: number;
  };
}

interface YpWorkflowConfiguration {
  steps: YpWorkflowStep[];
  parallel?: boolean;
  maxConcurrent?: number;
  timeoutTotal?: number;
}

// Enhanced Agent interfaces
interface YpAgentAssistantAgent {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  capabilities?: string[];    // List of capabilities this agent has
  requiredPermissions?: string[];
  version?: string;
}

interface YpAgentAssistantRunningAgent extends YpAgentAssistantAgent {
  status: "running" | "paused" | "completed" | "failed" | "cancelled" | "error";
  currentStep: number;
  progress?: number;
  startTime?: Date;
  estimatedCompletion?: Date;
  currentStepId?: number;
  errors?: Array<{
    step: string;
    message: string;
    timestamp: Date;
  }>;
}

interface YpAgentAssistantAgentStatus {
  availableAgents: YpAgentAssistantAgent[];
  runningAgents: YpAgentAssistantRunningAgent[];
  systemStatus: {
    healthy: boolean;
    message?: string;
    lastUpdated: Date;
  };
}