"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = (sequelize, DataTypes) => {
    const AcMute = sequelize.define("AcMute", {
        deleted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }
    }, {
        defaultScope: {
            where: {
                deleted: false
            }
        },
        underscored: true,
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        tableName: 'ac_mutes'
    });
    AcMute.associate = (models) => {
        AcMute.belongsTo(models.Domain, { foreignKey: 'domain_id' });
        AcMute.belongsTo(models.Community, { foreignKey: 'community_id' });
        AcMute.belongsTo(models.Group, { foreignKey: 'group_id' });
        AcMute.belongsTo(models.Post, { foreignKey: 'post_id' });
        AcMute.belongsTo(models.Point, { foreignKey: 'point_id' });
        AcMute.belongsTo(models.User, { foreignKey: 'user_id' });
        AcMute.belongsTo(models.User, { as: 'OtherUser' });
    };
    return AcMute;
};
