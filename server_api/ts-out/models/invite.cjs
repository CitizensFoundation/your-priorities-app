"use strict";
module.exports = function (sequelize, DataTypes) {
    const Invite = sequelize.define("Invite", {
        type: { type: DataTypes.INTEGER, allowNull: false },
        expires_at: DataTypes.DATE,
        token: DataTypes.STRING,
        joined_at: DataTypes.DATE,
        metadata: DataTypes.JSONB,
        deleted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }
    }, {
        defaultScope: {
            where: {
                deleted: false
            }
        },
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        indexes: [
            {
                fields: ['token'],
                where: {
                    deleted: false
                }
            }
        ],
        underscored: true,
        tableName: 'invites'
    });
    Invite.associate = (models) => {
        Invite.belongsTo(models.Community, { foreignKey: 'community_id' });
        Invite.belongsTo(models.Group, { foreignKey: 'group_id' });
        Invite.belongsTo(models.Post, { foreignKey: 'post_id' });
        Invite.belongsTo(models.User, { as: 'FromUser', foreignKey: "from_user_id" });
        Invite.belongsTo(models.User, { as: 'ToUser', foreignKey: "to_user_id" });
    };
    Invite.INVITE_TO_GROUP = 0;
    Invite.INVITE_TO_COMMUNITY = 1;
    Invite.INVITE_TO_IDEA = 2;
    Invite.INVITE_TO_FRIEND = 3;
    Invite.INVITE_TO_COMMUNITY_AND_GROUP_AS_ANON = 4;
    Invite.checkIfColumnExists = function (columnName) {
        const a = this.rawAttributes;
        const b = this.rawAttributes[columnName];
        return this.rawAttributes[columnName] != null;
    };
    return Invite;
};
