import { Model } from 'sequelize';
import { sequelize } from "@policysynth/agents/dbModels/sequelize.js";
export class YpSubscriptionUser extends Model {
}
YpSubscriptionUser.init({
// Define user fields
}, {
    sequelize,
    tableName: 'users',
    timestamps: true,
    underscored: true,
});
// Associations
YpSubscriptionUser.associate = (models) => {
    YpSubscriptionUser.hasMany(models.YpAgentProduct, {
        foreignKey: 'user_id',
        as: 'AgentProducts'
    });
    YpSubscriptionUser.hasMany(models.YpAgentProductBoosterPurchase, {
        foreignKey: 'user_id',
        as: 'AgentProductBoosterPurchases',
    });
    YpSubscriptionUser.hasMany(models.YpSubscription, {
        foreignKey: 'user_id',
        as: 'Subscriptions'
    });
};
