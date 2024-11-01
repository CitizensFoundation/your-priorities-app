import { DataTypes, Model } from 'sequelize';
import { sequelize } from "@policysynth/agents/dbModels/sequelize.js";
export class YpAgentProductRun extends Model {
}
YpAgentProductRun.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    uuid: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, allowNull: false },
    subscription_id: { type: DataTypes.INTEGER, allowNull: false },
    workflow: { type: DataTypes.JSONB, allowNull: false },
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
}, {
    sequelize,
    tableName: 'agent_product_runs',
    indexes: [
        { fields: ['uuid'], unique: true },
        { fields: ['subscription_id'] },
        { fields: ['status'] },
    ],
    timestamps: true,
    underscored: true,
});
// Associations
YpAgentProductRun.associate = (models) => {
    // Define associations
    YpAgentProductRun.belongsTo(models.YpSubscription, {
        foreignKey: 'subscription_id',
        as: 'Subscription',
    });
};
