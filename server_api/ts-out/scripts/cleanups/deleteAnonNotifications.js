const models = require('../../models/index.cjs');
const moment = require('moment');
const maxNumberFromPath = process.argv[2];
const maxNumberOfNotificationsToDelete = maxNumberFromPath ? maxNumberFromPath : 1000;
let numberOfDeletedNotifications = 0;
let startTime = moment();
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
const chunk = (arr, size) => Array.from({ length: Math.ceil(arr.length / size) }, (v, i) => arr.slice(i * size, i * size + size));
(async () => {
    let haveNotificationsToDelete = true;
    let userOffset = 0;
    while (haveNotificationsToDelete && numberOfDeletedNotifications < maxNumberOfNotificationsToDelete) {
        try {
            const users = await models.User.unscoped().findAll({
                where: {
                    created_at: {
                        [models.Sequelize.Op.lte]: moment().add(-3, 'days').toISOString()
                    },
                    profile_data: {
                        isAnonymousUser: {
                            [models.Sequelize.Op.is]: true
                        }
                    }
                },
                attributes: ['id'],
                order: ['id'],
                offset: userOffset,
                limit: 500
            });
            if (users.length > 0) {
                console.log(`${users.length} users offset ${userOffset}`);
                userOffset += 500;
                const userIds = users.map(n => { return n.id; });
                let haveNotificationsLeftToProcess = true;
                let notificationsOffset = 0;
                while (haveNotificationsLeftToProcess && numberOfDeletedNotifications < maxNumberOfNotificationsToDelete) {
                    const notifications = await models.AcNotification.unscoped().findAll({
                        where: {
                            user_id: {
                                [models.Sequelize.Op.in]: userIds
                            }
                        },
                        limit: 1000,
                        offset: notificationsOffset,
                        order: ['user_id'],
                        attributes: ['id'],
                    });
                    console.log(`${notifications.length} notifications offset ${notificationsOffset}`);
                    if (notifications.length > 0) {
                        notificationsOffset += 1000;
                        const notificationIds = notifications.map(n => { return n.id; });
                        const chunkedIds = chunk(notificationIds, 100);
                        for (let i = 0; i < chunkedIds.length; i++) {
                            const destroyInfo = await models.AcNotification.unscoped().destroy({
                                where: {
                                    id: {
                                        [models.Sequelize.Op.in]: chunkedIds[i]
                                    }
                                }
                            });
                            numberOfDeletedNotifications += destroyInfo;
                            console.log(`${numberOfDeletedNotifications}`);
                            await sleep(50);
                            if (numberOfDeletedNotifications >= maxNumberOfNotificationsToDelete) {
                                break;
                            }
                        }
                    }
                    else {
                        haveNotificationsLeftToProcess = false;
                        console.log("No more notifications left to process from user");
                    }
                    await sleep(100);
                }
            }
            else {
                haveNotificationsToDelete = false;
            }
        }
        catch (error) {
            console.error(error);
            haveNotificationsToDelete = false;
        }
    }
    console.log(`${numberOfDeletedNotifications} old anon notifications deleted`);
    console.log(`Duration ${moment(moment() - startTime).format("HH:mm:ss.SSS")}`);
    process.exit();
})();
export {};
