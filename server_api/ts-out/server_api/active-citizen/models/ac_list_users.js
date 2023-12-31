"use strict";
module.exports = (sequelize, DataTypes) => {
    const AcListUser = sequelize.define("AcListUser", {
        data: DataTypes.JSONB,
        user_id: { type: DataTypes.INTEGER, allowNull: true },
        ac_list_id: { type: DataTypes.INTEGER, allowNull: false }
    }, {
        underscored: true,
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        tableName: 'ac_list_users'
    });
    AcListUser.associate = (models) => {
        AcListUser.belongsTo(models.AcList, { foreignKey: 'ac_list_id' });
        AcListUser.belongsTo(models.User, { foreignKey: 'user_id' });
    };
    return AcListUser;
};
