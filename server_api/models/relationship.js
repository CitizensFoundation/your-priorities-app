"use strict";

module.exports = function(sequelize, DataTypes) {
  var Relationship = sequelize.define("Relationship", {

    relationship_type: { type: DataTypes.INTEGER, allowNull: false }

  }, {

    underscored: true,

    tableName: 'relationships',

    classMethods: {

      RELATIONSHIP_FRIEND: 0,
      RELATIONSHIP_FOLLOW: 1,

      associate: function(models) {
        Relationship.belongsTo(models.User, { as: 'User' });
        Relationship.belongsTo(models.User, { as: 'OtherUser' });
      }
    }
  });

  return Relationship;
};
