const models = require('../../models');
const async = require('async');
const ip = require('ip');
const _ = require('lodash');
const fs = require('fs');
const request = require('request');

const urlToConfig = process.argv[2];

let chunks = [];
let groupIdsToDeleteCountsFrom = [];

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
        forEachItemCallback();
      })
    }).catch( error => {
      forEachItemCallback(error);
    })
  }, error => {
    callback(error)
  });
}

const processGroupCounters = (callback) => {
  async.forEachSeries(groups, (groupIdsToDeleteCountsFrom, forEachGroupCallback) => {
    // DO STUFF
    forEachGroupCallback();
  }, error => {
    callback(error)
  });
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

      if (splitLine[0]!=null && splitLine[0]!=="") {
        currentChunk = {};
        currentChunk.name = splitLine[0];
        currentChunk.items = [];
        chunks.push(currentChunk);
      } else {
        currentChunk.items.push({
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
    async.forEachSeries(chunks, (chunk, forEachChunkCallback) => {
      if (allSamePostIds(chunk.items)) {
        const itemsToDestroy = getAllItemsExceptOne(chunk.items);
        groupIdsToDeleteCountsFrom = getAllGroupIdsWithUsersDeleteCounts(chunk.items);
        processItemsToDestroy(itemsToDestroy, forEachChunkCallback);
      } else {
        forEachChunkCallback("Not all posts are the same")
      }
    }, error => {
      seriesCallback(error)
    });
  },
  (seriesCallback) => {
    async.forEachSeries(chunks, (chunk, forEachChunkCallback) => {
      const postId = chunk.items[0].post_id;
      recountPost(postId, forEachChunkCallback);
    }, error => {
      seriesCallback(error)
    });
  },
  (seriesCallback) => {
    processGroupCounters(seriesCallback);
  }
], error => {
  if (error)
    console.error(error);
  process.exit();
});
