"use strict";
module.exports = function (sequelize, DataTypes) {
    const Endorsement = sequelize.define("Endorsement", {
        value: { type: DataTypes.INTEGER, allowNull: false },
        status: { type: DataTypes.STRING, allowNull: false },
        ip_address: { type: DataTypes.STRING, allowNull: false },
        user_agent: { type: DataTypes.TEXT, allowNull: false },
        deleted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
        data: { type: DataTypes.JSONB, allowNull: true }
    }, {
        underscored: true,
        tableName: 'endorsements',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
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
            },
            {
                fields: ['user_id', 'deleted']
            }
        ],
        classMethods: {}
    });
    Endorsement.associate = (models) => {
        Endorsement.belongsTo(models.Post, { foreignKey: 'post_id' });
        Endorsement.belongsTo(models.User, { foreignKey: 'user_id' });
    };
    return Endorsement;
};
