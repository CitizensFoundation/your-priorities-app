"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = (sequelize, DataTypes) => {
    var Relationship = sequelize.define("Relationship", {
        relationship_type: { type: DataTypes.INTEGER, allowNull: false }
    }, {
        underscored: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        timestamps: true,
        tableName: 'relationships'
    });
    Relationship.RELATIONSHIP_FRIEND = 0;
    Relationship.RELATIONSHIP_FOLLOW = 1;
    Relationship.associate = (models) => {
        Relationship.belongsTo(models.User, { as: 'User', foreignKey: 'user_id' });
        Relationship.belongsTo(models.User, { as: 'OtherUser', foreignKey: 'other_user_id' });
    };
    return Relationship;
};
