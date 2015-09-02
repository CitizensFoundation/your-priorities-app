"use strict";

module.exports = function(sequelize, DataTypes) {
  var UserLegacyPassword = sequelize.define("UserLegacyPassword", {
    user_id: DataTypes.INTEGER,
    encrypted_password: DataTypes.STRING
  }, {
    underscored: true,

    tableName: 'user_legacy_passwords'

  });

  return UserLegacyPassword;
};
