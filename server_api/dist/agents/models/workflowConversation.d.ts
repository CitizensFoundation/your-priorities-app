import { Model } from "sequelize";
export declare class YpWorkflowConversation extends Model {
    id: number;
    agentProductId: number;
    userId: number | null;
    configuration: YpWorkflowConversationConfiguration;
    created_at: Date;
    updated_at: Date;
    static initModel(sequelizeInstance?: import("sequelize").Sequelize): typeof YpWorkflowConversation;
    static associate(models: Record<string, any>): void;
}
