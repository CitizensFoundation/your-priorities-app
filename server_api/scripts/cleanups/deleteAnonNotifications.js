const models = require('../models');
const moment = require('moment');

const maxNumberFromPath = process.argv[2];

const maxNumberOfNotificationsToDelete = maxNumberFromPath ? maxNumberFromPath : 1000;

let numberOfDeletedNotifications = 0;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const chunk = (arr, size) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
    arr.slice(i * size, i * size + size)
  );

(async ()=>{
  let haveNotificationsToDelete = true;
  let userOffset = 0;
  while(haveNotificationsToDelete && numberOfDeletedNotifications<maxNumberOfNotificationsToDelete) {
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
        attributes:['id'],
        offset: userOffset,
        limit: 500
      });

      if (users.length>0) {
        console.log(`Found ${users.length} users offset ${userOffset}`);
        userOffset+=500;
        const userIds = users.map(n=>{ return n.id});

        let haveNotificationsLeftToProcess = true;
        let notificationsOffset = 0;

        while (haveNotificationsLeftToProcess && numberOfDeletedNotifications<maxNumberOfNotificationsToDelete) {
          const notifications = await models.AcNotification.unscoped().findAll({
            where: {
              user_id: {
                [models.Sequelize.Op.in]: userIds
              }
            },
            limit: 500,
            offset: notificationsOffset,
            order: ['user_id'],
            attributes:['id'],
          });

          console.log(`Found ${notifications.length} notifications offset ${notificationsOffset}`);

          if (notifications.length>0) {
            notificationsOffset += 500;
            const notificationIds = notifications.map(n=>{ return n.id});

            const chunkedIds = chunk(notificationIds, 100);

            for (let i=0; i<chunkedIds.length;i++) {
              const destroyInfo =  await models.AcNotification.unscoped().destroy({
                where: {
                  id: {
                    [models.Sequelize.Op.in]: chunkedIds[i]
                  }
                }
              });

              numberOfDeletedNotifications+=destroyInfo;

              console.log(`Destroyed ${destroyInfo} old notifications from chunk ${i} - total ${numberOfDeletedNotifications}`);

              await sleep(100);

              if (numberOfDeletedNotifications>=maxNumberOfNotificationsToDelete) {
                break;
              }
            }
          } else {
            haveNotificationsLeftToProcess = false;
            console.log("No more notifications left to process from user")
          }
        }
      } else {
        haveNotificationsToDelete = false;
      }
    } catch(error) {
      console.error(error);
      haveNotificationsToDelete = false;
    }
  }
  console.log("All old anon notifications deleted");
  process.exit();
})();

/*(async ()=>{
  let haveNotificationsToDelete = true;
  while(haveNotificationsToDelete) {
    try {
      const notifications = await models.AcNotification.unscoped().findAll({
        include: [
          {
            model: models.User,
            where: {
              created_at: {
                [models.Sequelize.Op.lte]: moment().add(-3, 'days').toISOString()
              },
              private_profile_data: {
                isAnonymousUser: true
              }
            },
            attributes:['id','user_id','private_profile_data'],
            required: true
          }
        ],
        attributes: ['id','user_id'],
        limit: 1000
      });

      if (notifications.length>0) {
        const notificationIds = notifications.map(n=>n.id);

        const destroyInfo =  await models.AcNotification.unscoped().destroy({
          where: {
            id: {
              [models.Sequelize.Op.in]: notificationIds
            }
          }
        });

        const b = destroyInfo;
      } else {
        haveNotificationsToDelete = false;
      }
    } catch(error) {
      console.error(error);
      haveNotificationsToDelete = false;
    }
  }
  console.log("All old anon notifications deleted");
  process.exit();
})();*/