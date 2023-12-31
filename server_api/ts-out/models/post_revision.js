"use strict";
module.exports = (sequelize, DataTypes) => {
    const PostRevision = sequelize.define("PostRevision", {
        name: { type: DataTypes.STRING, allowNull: false },
        description: { type: DataTypes.TEXT, allowNull: false },
        data: DataTypes.JSONB,
        deleted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }
    }, {
        defaultScope: {
            where: {
                deleted: false
            }
        },
        indexes: [
            {
                fields: ['user_id', 'deleted']
            },
            {
                name: 'post_revisions_idx_deleted',
                fields: ['deleted']
            },
            {
                name: 'post_revisions_idx_post_id_deleted',
                fields: ['deleted', 'post_id']
            }
        ],
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        underscored: true,
        tableName: 'post_revisions'
    });
    PostRevision.associate = (models) => {
        PostRevision.belongsTo(models.Post, { foreignKey: 'post_id' });
        PostRevision.belongsTo(models.User, { foreignKey: 'user_id' });
    };
    return PostRevision;
};
