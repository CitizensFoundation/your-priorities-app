import { Model } from 'sequelize';
import { YpSubscription } from './subscription.js';
export declare class YpAgentProductRun extends Model {
    id: number;
    uuid: string;
    subscription_id: number;
    start_time: Date;
    end_time?: Date;
    duration?: number;
    status: YpAgentProductRunStatus;
    input_data?: any;
    output_data?: any;
    error_message?: string;
    run_type?: string;
    metadata?: any;
    workflow: YpAgentRunWorkflowConfiguration;
    parent_agent_product_run_id?: number;
    created_at: Date;
    updated_at: Date;
    Subscription?: YpSubscription;
    ParentAgentProductRun?: YpAgentProductRun;
    ChildAgentProductRuns?: YpAgentProductRun[];
}
