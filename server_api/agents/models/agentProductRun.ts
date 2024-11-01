import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from "@policysynth/agents/dbModels/sequelize.js";
import { YpAgentProduct } from './agentProduct.js';
import { YpSubscription } from './subscription.js';

export class YpAgentProductRun extends Model {
  declare id: number;
  declare uuid: string;
  declare subscription_id: number;
  declare start_time: Date;
  declare end_time?: Date;
  declare duration?: number;
  declare status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  declare input_data?: any;
  declare output_data?: any;
  declare error_message?: string;
  declare run_type?: string;
  declare metadata?: any;
  declare workflow: YpWorkflowConfiguration;
  declare created_at: Date;
  declare updated_at: Date;

  // Associations
  declare Subscription?: YpSubscription;
}

YpAgentProductRun.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    uuid: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, allowNull: false },
    subscription_id: { type: DataTypes.INTEGER, allowNull: false },
    workflow: { type: DataTypes.JSONB, allowNull: true },
    start_time: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    end_time: { type: DataTypes.DATE, allowNull: true },
    duration: { type: DataTypes.INTEGER, allowNull: true },
    status: {
      type: DataTypes.ENUM('pending', 'running', 'completed', 'failed', 'cancelled'),
      allowNull: false,
      defaultValue: 'pending',
    },
    input_data: { type: DataTypes.JSONB, allowNull: true, defaultValue: {} },
    output_data: { type: DataTypes.JSONB, allowNull: true, defaultValue: {} },
    error_message: { type: DataTypes.TEXT, allowNull: true },
    run_type: { type: DataTypes.STRING(50), allowNull: true },
    metadata: { type: DataTypes.JSONB, allowNull: true, defaultValue: {} },
    created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  },
  {
    sequelize,
    tableName: 'agent_product_runs',
    indexes: [
      { fields: ['uuid'], unique: true },
      { fields: ['subscription_id'] },
      { fields: ['status'] },
    ],
    timestamps: true,
    underscored: true,
  }
);

// Associations
YpAgentProductRun.belongsTo(YpSubscription, {
  foreignKey: 'subscription_id',
  as: 'Subscription',
});
