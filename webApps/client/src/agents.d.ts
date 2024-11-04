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
  configuration: YpAgentProductConfiguration;
  status?: YpAgentProductStatus;
  User?: YpUserData;
  Group?: YpGroupData;
  BoosterPurchases?: YpAgentProductBoosterPurchaseAttributes[];
  Subscriptions?: YpSubscriptionAttributes[];
  SubscriptionPlans?: YpSubscriptionPlanAttributes[];
  Runs?: YpAgentProductRunAttributes[];
  AgentBundles?: YpAgentProductBundleAttributes[];
}

interface YpAgentProductConfiguration {
  workflow: YpWorkflowConfiguration;
  templateWorkflowCommunityId: number;
  structuredAnswersOverride: YpStructuredAnswer[];
  requiredStructuredQuestions: YpStructuredQuestionData[];
  settings?: Record<string, any>;
  integrations?: Record<string, any>;
  avatar?: {
    systemPrompt: string;
    imageUrl: string;
    voiceName?: string;
  };
}

interface YpAgentProductStatus {
  [key: string]: any;
}

// YpAgentProductBoosterPurchaseAttributes Interface
interface YpAgentProductBoosterPurchaseAttributes
  extends YpBaseModelAttributes {
  user_id: number;
  subscription_plan_id: number;
  agent_product_id: number;
  runs_purchased: number;
  amount: number;
  currency: string;
  purchase_date: Date;
  payment_method?: string;
  status: string;
  transaction_id?: string;
  metadata?: Record<string, any>;
  discount_id?: number;
  User?: YpUserData;
  AgentProduct?: YpAgentProductAttributes;
  SubscriptionPlan?: YpSubscriptionPlanAttributes;
  Discount?: YpDiscountAttributes;
}

type YpSubscriptionPlanType = "free" | "paid" | "coming_soon";
type YpSubscriptionBillingCycle = "monthly" | "yearly" | "weekly";

interface YpSubscriptionBoosterConfiguration {
  name: string;
  description: string;
  runs_available: number;
  price: number;
  currency: string;
  structuredAnswersOverride: YpStructuredAnswer[];
}

interface YpSubscriptionPlanConfiguration {
  amount: number;
  currency: string;
  billing_cycle: YpSubscriptionBillingCycle;
  type: YpSubscriptionPlanType;
  max_runs_per_cycle: number;
  boosters: YpSubscriptionBoosterConfiguration[];
  imageUrl?: string;
}

// YpSubscriptionPlanAttributes Interface
interface YpSubscriptionPlanAttributes extends YpBaseModelAttributes {
  agent_product_id: number;
  name: string;
  description?: string;
  configuration: YpSubscriptionPlanConfiguration;
  AgentProduct?: YpAgentProductAttributes;
  Subscriptions?: YpSubscriptionAttributes[];
  BoosterPurchases?: YpAgentProductBoosterPurchaseAttributes[];
}

interface YpSubscriptionConfiguration {
  cancelledAt?: Date;
  cancelledByUserId?: number;
}

// YpSubscriptionAttributes Interface
interface YpSubscriptionAttributes extends YpBaseModelAttributes {
  user_id: number;
  domain_id: number;
  agent_product_id: number;
  subscription_plan_id: number;
  start_date: Date;
  end_date?: Date;
  next_billing_date: Date;
  status: "active" | "paused" | "cancelled" | "expired";
  payment_method?: string;
  transaction_id?: string;
  metadata?: Record<string, any>;
  configuration?: YpSubscriptionConfiguration;
  User?: YpUserData;
  AgentProduct?: YpAgentProductAttributes;
  Plan?: YpSubscriptionPlanAttributes;
  Runs?: YpAgentProductRunAttributes[];
  Discounts?: YpDiscountAttributes[];
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
  Subscriptions?: YpSubscriptionAttributes[];
  BoosterPurchases?: YpAgentProductBoosterPurchaseAttributes[];
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
  subscription_id: number;
  start_time: Date;
  end_time?: Date;
  duration?: number; // Duration in seconds
  status: "pending" | "running" | "completed" | "failed" | "cancelled";
  workflow: YpWorkflowConfiguration;
  input_data?: YpAgentProductRunInputData;
  output_data?: YpAgentProductRunOutputData;
  error_message?: string;
  run_type?: string; // e.g., 'scheduled', 'manual', 'triggered'
  metadata?: Record<string, any>;
  Subscription?: YpSubscriptionAttributes;
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

interface AssistantModeData<T = unknown> {
  type: string;
  data: T;
  timestamp: number;
  metadata?: Record<string, unknown>;
}

type YpAssistantMode =
  | "agent_subscription_sales"
  | "agent_subscription_and_selection"
  | "user_login"
  | "user_payment"
  | "agent_configuration"
  | "agent_operations"
  | "agent_direct_conversation"
  | "error_recovery";

interface YpBaseAssistantMemoryData extends YpBaseChatBotMemoryData {
  redisKey: string;
  currentMode: YpAssistantMode;
  currentAgentProductId?: number;
  currentAgentProductConfiguration?: YpAgentProductConfiguration;
  modeData?: AssistantModeData;
  modeHistory?: Array<{
    mode: string;
    timestamp: number;
    reason?: string;
  }>;
}

interface YpWorkflowStep {
  id: number;
  name: string;
  description: string;
  agentClassUuid: string;
  agentId?: number;
  groupId?: number;
  type:
    | "agentOps"
    | "engagmentFromOutputConnector"
    | "engagmentFromInputConnector";
  configuration?: Record<string, any>;
  dependencies?: number[];
  timeout?: number;
}

interface YpWorkflowConfiguration {
  steps: YpWorkflowStep[];
  currentStepIndex: number;
  timeoutTotal?: number;
}
