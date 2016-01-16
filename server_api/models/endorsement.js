"use strict";

module.exports = function(sequelize, DataTypes) {
  var Endorsement = sequelize.define("Endorsement", {
    value: DataTypes.INTEGER,
    status: DataTypes.STRING,
    deleted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }
  }, {

    underscored: true,

    tableName: 'endorsements',

    defaultScope: {
      where: {
        deleted: false
      }
    },

    classMethods: {
      associate: function(models) {
        Endorsement.belongsTo(models.Post);
        Endorsement.belongsTo(models.User);
      }
    }
  });

  return Endorsement;
};
