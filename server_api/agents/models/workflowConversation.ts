import { Model, DataTypes } from "sequelize";
import { sequelize } from "@policysynth/agents/dbModels/sequelize.js";

export class YpWorkflowConversation extends Model {
  public id!: number;
  public agentProductId!: number;
  public userId!: number | null;
  public configuration!: YpWorkflowConversationConfiguration;
  public created_at!: Date;
  public updated_at!: Date;

  static initModel(sequelizeInstance = sequelize): typeof YpWorkflowConversation {
    YpWorkflowConversation.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        agentProductId: {
          type: DataTypes.INTEGER,
          allowNull: true,
          field: "agent_product_id",
        },
        userId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          field: "user_id",
        },
        configuration: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: {},
        },
        created_at: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
        updated_at: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
      },
      {
        sequelize: sequelizeInstance,
        tableName: "workflow_conversations",
        timestamps: true,
      }
    );
    return YpWorkflowConversation;
  }

  static associate(models: Record<string, any>): void {
    YpWorkflowConversation.belongsTo(models.YpAgentProduct, {
      foreignKey: "agentProductId",
      as: "agentProduct",
    });

    YpWorkflowConversation.hasMany(models.YpAgentProductRun, {
      foreignKey: "workflowId",
      as: "agentProductRuns",
    });
  }
}