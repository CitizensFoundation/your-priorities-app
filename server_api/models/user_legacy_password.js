"use strict";

module.exports = function(sequelize, DataTypes) {
  var UserLegacyPassword = sequelize.define("UserLegacyPassword", {
    encrypted_password: { type: DataTypes.STRING, allowNull: false }
  }, {
    underscored: true,
    tableName: 'user_legacy_passwords',
    classMethods: {
      associate: function(models) {
        UserLegacyPassword.belongsTo(models.User);
      }
    }
  });
  return UserLegacyPassword;
};
