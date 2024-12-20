interface YpBaseModelClass {
    id: number;
    uuid: string;
    created_at: Date;
    updated_at: Date;
}
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
    [key: string]: any;
}
interface YpAgentProductStatus {
    [key: string]: any;
}
interface YpAgentProductBoosterPurchaseAttributes extends YpBaseModelAttributes {
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
interface YpSubscriptionPlanAttributes extends YpBaseModelAttributes {
    agent_product_id: number;
    name: string;
    description?: string;
    configuration: YpSubscriptionPlanConfiguration;
}
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
interface YpAgentProductRunInputData {
    [key: string]: any;
}
interface YpAgentProductRunOutputData {
    [key: string]: any;
}
interface YpAgentProductRunAttributes extends YpBaseModelAttributes {
    agent_product_id: number;
    start_time: Date;
    end_time?: Date;
    duration?: number;
    status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
    input_data?: YpAgentProductRunInputData;
    output_data?: YpAgentProductRunOutputData;
    error_message?: string;
    run_type?: string;
    metadata?: Record<string, any>;
}
interface YpBaseModelAttributes {
    id: number;
    uuid: string;
    created_at: Date;
    updated_at: Date;
}
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
//# sourceMappingURL=agents.d.ts.map