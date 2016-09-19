"use strict";

module.exports = function(sequelize, DataTypes) {
  var Endorsement = sequelize.define("Endorsement", {
    value: { type: DataTypes.INTEGER, allowNull: false },
    status: { type: DataTypes.STRING, allowNull: false },
    ip_address: { type: DataTypes.STRING, allowNull: false },
    user_agent: { type: DataTypes.TEXT, allowNull: false },
    deleted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }
  }, {

    underscored: true,

    tableName: 'endorsements',

    defaultScope: {
      where: {
        deleted: false
      }
    },

    indexes: [
      {
        fields: ['user_id', 'post_id'],
        where: {
          deleted: false
        }
      }
    ],

    classMethods: {
      associate: function(models) {
        Endorsement.belongsTo(models.Post);
        Endorsement.belongsTo(models.User);
      }
    }
  });

  return Endorsement;
};
