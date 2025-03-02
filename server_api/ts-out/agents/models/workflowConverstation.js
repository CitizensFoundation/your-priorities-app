import { Model, DataTypes } from "sequelize";
import { sequelize } from "@policysynth/agents/dbModels/sequelize.js";
export class YpWorkflowConversation extends Model {
    static initModel(sequelizeInstance = sequelize) {
        YpWorkflowConversation.init({
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
        }, {
            sequelize: sequelizeInstance,
            tableName: "workflow_conversations",
            timestamps: false,
        });
        return YpWorkflowConversation;
    }
    static associate(models) {
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
