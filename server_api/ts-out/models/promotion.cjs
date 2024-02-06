"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = (sequelize, DataTypes) => {
    const Promotion = sequelize.define("Promotion", {
        content: { type: DataTypes.TEXT, allowNull: false },
        status: { type: DataTypes.STRING, allowNull: false },
        cost: { type: DataTypes.INTEGER, allowNull: false },
        per_viewer_cost: DataTypes.FLOAT,
        spent: DataTypes.FLOAT,
        position: { type: DataTypes.INTEGER, defaultValue: 0 },
        finished_at: { type: DataTypes.DATE },
        counter_up_endorsements: { type: DataTypes.INTEGER, defaultValue: 0 },
        counter_down_endorsements: { type: DataTypes.INTEGER, defaultValue: 0 },
        counter_skips: { type: DataTypes.INTEGER, defaultValue: 0 },
        counter_views: { type: DataTypes.INTEGER, defaultValue: 0 },
        deleted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }
    }, {
        defaultScope: {
            where: {
                deleted: false
            }
        },
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        underscored: true,
        tableName: 'promotions'
    });
    Promotion.associate = (models) => {
        Promotion.belongsTo(models.Group, { foreignKey: 'group_id' });
        Promotion.belongsTo(models.Post, { foreignKey: 'post_id' });
        Promotion.belongsTo(models.User, { foreignKey: 'user_id' });
    };
    return Promotion;
};
