const models = require('../../models');
const async = require('async');
const ip = require('ip');
const _ = require('lodash');
const fs = require('fs');
const request = require('request');

const recountCommunity = require('../../utils/recount_utils').recountCommunity;
const recountPost = require('../../utils/recount_utils').recountPost;

const communityId = process.argv[2];
const urlToConfig = process.argv[3];

let allItems = [];
let chunks = [];
let communityId;

const processItemsToDestroy = (itemsToDestroy, callback) => {
  async.forEachSeries(itemsToDestroy, (item, forEachItemCallback) => {
    models.Endorsement.findOne({
      where: {
        id: item.eId
      },
      attributes: ['id']
    }).then( endorsement=> {
      endorsement.deleted = true;
      endorsement.save().then(()=>{
        forEachItemCallback();
      }).catch( error => {
        forEachItemCallback(error);
      })
    }).catch( error => {
      forEachItemCallback(error);
    })
  }, error => {
    if (error) {
      callback(error)
    } else {
      recountPost(itemsToDestroy[0].post_id, callback);
    }
  });
}

const getAllItemsExceptOne = (items) => {
  const sortedItems = _.sortBy(items, function (item) {
    return item.date;
  });

  const finalItems = [];
  let foundEmail = false;

  for (let i=0; i<sortedItems.length;i++) {
    if (!foundEmail && sortedItems[i].userEmail.indexOf("_anonymous@citizens.i") === -1) {
      foundEmail = true;
    } else {
      finalItems.push(sortedItems[i]);
    }
  }

  if (items.length==finalItems.length) {
    finalItems.pop();
  }

  return finalItems;
}

async.series([
  (seriesCallback) => {
    const options = {
      url: urlToConfig,
    };

    request.get(options, (error, content) => {
      if (content && content.statusCode!=200) {
        seriesCallback(content.statusCode);
      } else {
        config = content.body;
        seriesCallback();
      }
    });
  },
  (seriesCallback) => {
    let index = 0;
    let currentChunk;
    async.forEachSeries(config.split('\r\n'), (configLine, forEachCallback) => {
      const splitLine = configLine.split(",");

      if (splitLine[0]==null && splitLine[0]==="") {
        items.push({
          endorsementId: splitLine[1],
          endorsementValue: splitLine[2],
          date: splitLine[3],
          browserId: splitLine[4],
          browserFingerprint: splitLine[5],
          ipAddress: splitLine[6],
          userId: splitLine[7],
          userEmail: splitLine[8],
          postId: splitLine[9],
          postName: splitLine[10],
          userAgent: splitLine[11]
        });
      }
      forEachCallback();
    }, error => {
      seriesCallback(error)
    });
  },
  (seriesCallback) => {
    const chunks = _.groupBy(items, function (endorsement) {
      return endorsement.post_id;
    });
    async.forEachSeries(chunks, (items, forEachChunkCallback) => {
      const itemsToDestroy = getAllItemsExceptOne(items);
      processItemsToDestroy(itemsToDestroy, forEachChunkCallback);
    }, error => {
      seriesCallback(error)
    });
  },
  (seriesCallback) => {
    recountCommunity(communityId, seriesCallback);
  }
], error => {
  if (error)
    console.error(error);
  process.exit();
});
