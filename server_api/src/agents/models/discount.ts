import { DataTypes, Model } from 'sequelize';
import { sequelize } from '@policysynth/agents/dbModels/sequelize.js';
import { YpAgentProduct } from './agentProduct.js';
import { YpSubscription } from './subscription.js';
import { YpAgentProductBoosterPurchase } from './agentProductBoosterPurchase.js';

export class YpDiscount extends Model {
  declare id: number;
  declare uuid: string;
  declare code: string;
  declare description?: string;
  declare discount_type: 'percentage' | 'fixed';
  declare discount_value: number;
  declare max_uses?: number;
  declare uses: number;
  declare start_date?: Date;
  declare end_date?: Date;
  declare applicable_to: 'agent_product' | 'booster' | 'subscription' | 'both';
  declare created_at: Date;
  declare updated_at: Date;

  // Associations
  declare Subscriptions?: YpSubscription[];
  declare BoosterPurchases?: YpAgentProductBoosterPurchase[];

  static associate(models: any) {
    // Many-to-Many with Subscriptions through 'subscription_discounts'
    YpDiscount.belongsToMany(models.YpSubscription, {
      through: 'subscription_discounts',
      foreignKey: 'discount_id',
      otherKey: 'subscription_id',
      as: 'Subscriptions',
    });

    // One-to-Many with BoosterPurchases
    YpDiscount.hasMany(models.YpAgentProductBoosterPurchase, {
      foreignKey: 'discount_id',
      as: 'BoosterPurchases',
    });
  }
}

YpDiscount.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    discount_type: {
      type: DataTypes.ENUM('percentage', 'fixed'),
      allowNull: false,
    },
    discount_value: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    max_uses: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    uses: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    applicable_to: {
      type: DataTypes.ENUM('agent_product', 'booster', 'subscription', 'both'),
      allowNull: false,
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
    sequelize,
    tableName: 'discounts',
    indexes: [
      { fields: ['uuid'], unique: true },
      { fields: ['code'], unique: true },
    ],
    timestamps: true,
    underscored: true,
  }
);

// Associations will be set up in the associate method
