"use strict";
module.exports = (sequelize, DataTypes) => {
    const UserLegacyPassword = sequelize.define("UserLegacyPassword", {
        encrypted_password: { type: DataTypes.STRING, allowNull: false }
    }, {
        underscored: true,
        tableName: 'user_legacy_passwords'
    });
    UserLegacyPassword.associate = (models) => {
        UserLegacyPassword.belongsTo(models.User, { foreignKey: 'user_id' });
    };
    return UserLegacyPassword;
};
