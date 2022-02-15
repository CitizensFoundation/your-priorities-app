const models = require('../../models');
const async = require('async');
const ip = require('ip');
const _ = require('lodash');
const fs = require('fs');
const request = require('request');

const recountCommunity = require('../../utils/recount_utils').recountCommunity;
const recountPost = require('../../utils/recount_utils').recountPost;

const communityId = 1067; //process.argv[2];
//const urlToConfig = "https://yrpri-eu-direct-assets.s3.eu-west-1.amazonaws.com/fireworks150222-V7+-+Delete+1.csv"; // process.argv[3];
const urlToConfig = "https://yrpri-eu-direct-assets.s3.eu-west-1.amazonaws.com/fireworks150222-V7+-+Delete+2+(1).csv"; // process.argv[3];
const allowDeletingSingles = "true"; //process.argv[4];

const allItems = [];
const parse = require('csv-parse/lib/sync');
let deletedEndorsments = 0;

const postsRecounted = {};

const processItemsToDestroy = (itemsToDestroy, callback) => {
  async.forEachSeries(itemsToDestroy, (item, forEachItemCallback) => {
    models.Endorsement.findOne({
      where: {
        id: item.endorsementId
      },
      attributes: ['id']
    }).then( endorsement => {
      if (endorsement) {
        endorsement.deleted = true;
        endorsement.save().then(()=>{
          deletedEndorsments++;
          forEachItemCallback();
        }).catch( error => {
          forEachItemCallback(error);
        })
      } else {
        console.warn("Endorsement not found: "+item.endorsementId);
        forEachItemCallback();
      }
    }).catch( error => {
      forEachItemCallback(error);
    })
  }, error => {
    if (error) {
      callback(error)
    } else {
      if (true || !postsRecounted[itemsToDestroy[0].postId]) {
        recountPost(itemsToDestroy[0].postId, callback);
        postsRecounted[itemsToDestroy[0].postId] = true;
      } else {
        callback();
      }
    }
  });
}

const getAllItemsExceptOne = (items) => {
  if (items.length===1 && allowDeletingSingles) {
    return items;
  } else {
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

    if (items.length===finalItems.length) {
      finalItems.pop();
    }

    return finalItems;
  }
}

let config;
let parsedConfig;
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
        parsedConfig = parse(config);
        seriesCallback();
      }
    });
  },
  (seriesCallback) => {
    for (let i=0;i<parsedConfig.length;i++) {
      const splitLine = parsedConfig[i];
      if (splitLine[0]==="" && splitLine[1]!=="") {
        allItems.push({
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
        console.log(`Will delete vote for ${splitLine[10]} from ${splitLine[8]}`)
      }
    }
    seriesCallback();
  },
  (seriesCallback) => {
    const chunks = _.groupBy(allItems, function (endorsement) {
      return endorsement.ipAddress+":"+endorsement.postId+":"+endorsement.userAgent;
    });
    async.forEachSeries(chunks, (items, forEachChunkCallback) => {
      const itemsToDestroy = getAllItemsExceptOne(items);
      if (itemsToDestroy.length>0) {
        processItemsToDestroy(itemsToDestroy, forEachChunkCallback);
      } else {
        console.warn("Items length == 0 and no allowDeletingSingles, skipping");
        forEachChunkCallback();
      }
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
  else
    console.log(`Deleted ${deletedEndorsments} endorsements`)
  process.exit();
});
