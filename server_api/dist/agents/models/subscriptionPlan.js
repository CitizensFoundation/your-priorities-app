import { DataTypes, Model } from 'sequelize';
import { sequelize } from "@policysynth/agents/dbModels/sequelize.js";
export class YpSubscriptionPlan extends Model {
}
YpSubscriptionPlan.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    uuid: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, allowNull: false },
    agent_product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'agent_products',
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    name: { type: DataTypes.STRING(256), allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    configuration: { type: DataTypes.JSONB, allowNull: false },
    created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
}, {
    sequelize,
    tableName: 'subscription_plans',
    indexes: [
        { fields: ['uuid'], unique: true },
        { fields: ['name'] },
    ],
    timestamps: true,
    underscored: true,
});
// Add the associate method
YpSubscriptionPlan.associate = (models) => {
    YpSubscriptionPlan.hasMany(models.YpSubscription, {
        foreignKey: 'subscription_plan_id',
        as: 'Subscriptions',
    });
    YpSubscriptionPlan.hasMany(models.YpAgentProductBoosterPurchase, {
        foreignKey: 'subscription_plan_id',
        as: 'BoosterPurchases',
    });
    YpSubscriptionPlan.belongsTo(models.YpAgentProduct, {
        foreignKey: 'agent_product_id',
        as: 'AgentProduct',
    });
};
