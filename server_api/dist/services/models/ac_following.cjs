"use strict";
module.exports = (sequelize, DataTypes) => {
    const AcFollowing = sequelize.define("AcFollowing", {
        value: { type: DataTypes.INTEGER },
        deleted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }
    }, {
        defaultScope: {
            where: {
                deleted: false
            }
        },
        indexes: [
            {
                fields: ['user_id'],
                where: {
                    deleted: false
                }
            },
            {
                fields: ['other_user_id'],
                where: {
                    deleted: false
                }
            },
            {
                fields: ['user_id', 'other_user_id'],
                where: {
                    deleted: false
                }
            }
        ],
        underscored: true,
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        tableName: 'ac_followings'
    });
    AcFollowing.associate = (models) => {
        AcFollowing.belongsTo(models.User, { foreignKey: 'user_id' });
        AcFollowing.belongsTo(models.User, { as: 'OtherUser' });
    };
    return AcFollowing;
};
