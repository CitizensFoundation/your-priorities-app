import { Model, DataTypes } from "sequelize";
import { sequelize } from "@policysynth/agents/dbModels/sequelize.js";

export class YpWorkflow extends Model {
  public id!: number;
  public agentProductId!: number;
  public userId!: number | null;
  public configuration!: YpWorkflowConfiguration;
  public created_at!: Date;
  public updated_at!: Date;

  static initModel(sequelizeInstance = sequelize): typeof YpWorkflow {
    YpWorkflow.init(
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
        tableName: "workflows",
        timestamps: false,
      }
    );
    return YpWorkflow;
  }

  static associate(models: Record<string, any>): void {
    YpWorkflow.belongsTo(models.YpAgentProduct, {
      foreignKey: "agentProductId",
      as: "agentProduct",
    });

    YpWorkflow.hasMany(models.YpAgentProductRun, {
      foreignKey: "workflowId",
      as: "agentProductRuns",
    });
  }
}