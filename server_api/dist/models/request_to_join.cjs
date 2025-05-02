"use strict";
module.exports = (sequelize, DataTypes) => {
    const RequestToJoin = sequelize.define("RequestToJoin", {
        type: { type: DataTypes.INTEGER, allowNull: false }
    }, {
        underscored: true,
        tableName: 'requests_to_join',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });
    RequestToJoin.associate = (models) => {
        RequestToJoin.belongsTo(models.Community, { foreignKey: 'community_id' });
        RequestToJoin.belongsTo(models.Group, { foreignKey: 'group_id' });
        RequestToJoin.belongsTo(models.User, { foreignKey: 'user_id' });
    };
    RequestToJoin.JOIN_GROUP = 0;
    RequestToJoin.JOIN_COMMUNITY = 1;
    return RequestToJoin;
};
