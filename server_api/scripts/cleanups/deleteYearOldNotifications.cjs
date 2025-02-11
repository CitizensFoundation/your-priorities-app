const models = require('../../models/index.cjs');
const moment = require('moment');

const maxNumberFromPath = process.argv[2];
// Default to 1,000,000 if no command line arg given, adjust as you see fit
const maxNumberOfNotificationsToDelete = maxNumberFromPath ? parseInt(maxNumberFromPath) : 1000000;

let numberOfDeletedNotifications = 0;
const startTime = moment();

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function chunk(arr, size) {
  return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size)
  );
}

(async ()=>{
  let haveNotificationsToDelete = true;
  let offset = 0;
  // Calculate the cutoff date for "older than 1 year"
  const cutoffDate = moment().subtract(1, 'year').toISOString();

  while (haveNotificationsToDelete && numberOfDeletedNotifications < maxNumberOfNotificationsToDelete) {
    try {
      // Fetch a batch of notifications older than 1 year
      const notifications = await models.AcNotification.unscoped().findAll({
        where: {
          created_at: {
            [models.Sequelize.Op.lte]: cutoffDate,
          },
        },
        limit: 1000,
        offset: offset,
        order: ['id'],
        attributes: ['id'],
      });

      if (notifications.length > 0) {
        console.log(`${notifications.length} notifications found at offset ${offset}`);
        offset += 1000;

        // Extract IDs and chunk them to avoid huge deletions in one query
        const notificationIds = notifications.map(n => n.id);
        const chunkedIds = chunk(notificationIds, 100);

        // Delete chunk by chunk
        for (const chunkIds of chunkedIds) {
          const destroyInfo = await models.AcNotification.unscoped().destroy({
            where: {
              id: {
                [models.Sequelize.Op.in]: chunkIds,
              },
            },
          });

          numberOfDeletedNotifications += destroyInfo;
          console.log(`Total deleted so far: ${numberOfDeletedNotifications}`);

          await sleep(10); // short pause

          // Stop if we’ve hit our daily (or run) limit
          if (numberOfDeletedNotifications >= maxNumberOfNotificationsToDelete) {
            break;
          }
        }
      } else {
        // No more notifications to delete
        haveNotificationsToDelete = false;
      }

      await sleep(25); // short pause between big fetches
    } catch (error) {
      console.error(error);
      haveNotificationsToDelete = false;
    }
  }

  console.log(`${numberOfDeletedNotifications} old notifications deleted`);
  console.log(`Duration: ${moment(moment() - startTime).format('HH:mm:ss.SSS')}`);
  process.exit();
})();
