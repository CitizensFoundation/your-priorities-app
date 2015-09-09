"use strict";

module.exports = function(sequelize, DataTypes) {
  var Endorsement = sequelize.define("Endorsement", {
    value: DataTypes.INTEGER,
    idea_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    status: DataTypes.STRING
  }, {
    underscored: true,
    tableName: 'endorsements',
    classMethods: {
      associate: function(models) {
        Endorsement.belongsTo(models.Idea);
        Endorsement.belongsTo(models.User);
      }
    }
  });

  return Endorsement;
};
