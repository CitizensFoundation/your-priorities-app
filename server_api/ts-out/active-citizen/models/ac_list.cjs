"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = (sequelize, DataTypes) => {
    const AcList = sequelize.define("AcList", {
        data: DataTypes.JSONB,
        user_id: { type: DataTypes.INTEGER, allowNull: false },
        group_id: { type: DataTypes.INTEGER, allowNull: true },
        community_id: { type: DataTypes.INTEGER, allowNull: true },
        post_id: { type: DataTypes.INTEGER, allowNull: true }
    }, {
        underscored: true,
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        tableName: 'ac_lists'
    });
    AcList.associate = (models) => {
        AcList.belongsTo(models.Post, { foreignKey: 'post_id' });
        AcList.belongsTo(models.Community, { foreignKey: 'community_id' });
        AcList.belongsTo(models.Group, { foreignKey: 'group_id' });
        AcList.belongsTo(models.User, { foreignKey: 'user_id' });
    };
    AcList.getList = (groupId, done) => {
        models.AcList.findOrCreate({
            where: {
                group_id: groupId
            },
            defaults: {
                group_id: groupId
            }
        }).then(list => {
            done(null, list);
        }).catch(error => {
            done(error);
        });
    };
    AcList.addListUsers = async (listId, body, done) => {
        const t = await sequelize.transaction();
        try {
            async.eachSeries(body.listUsersEntries, (listUserEntry, seriesCallback) => {
                models.AcListUser.findOrCreate({
                    where: {
                        sms: listUserEntry.sms
                    },
                    defaults: {
                        ac_list_id: listId,
                        data: {
                            openCount: 0,
                            sentCount: 0,
                            completeCount: 0
                        }
                    },
                    transaction: t
                }).then(() => {
                    seriesCallback();
                }).catch(error => {
                    seriesCallback(error);
                });
            }, (error) => {
                done(error);
            });
        }
        catch (error) {
            await t.rollback();
            done(error);
        }
    };
    return AcList;
};
