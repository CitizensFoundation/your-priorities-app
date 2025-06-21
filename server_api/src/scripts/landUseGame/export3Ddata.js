const { post } = require("request");
const queue = require("../../services/workers/queue.cjs");
const models = require("../../models/index.cjs");
const fs = require("fs");
const axios = require("axios");

async function axiosWrapper(url, options = {}) {
  // Set default headers if not provided
  const headers = options.headers || {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  // Perform the HTTP request using axios and return the response directly
  try {
    const response = await axios({
      method: options.method || "get", // Default to 'get' if method is not specified
      url: url,
      headers: headers,
      data: options.body, // In axios, 'data' is used instead of 'body'
      ...options, // Spread the remaining options in case there are other axios-specific options provided
    });

    // Returning the data property of the response which is the actual body of the HTTP response
    return response.data;
  } catch (error) {
    // For simplicity, the error is logged and then rethrown
    log.error("Error", error.message);
    throw error;
  }
}

async function getPoints(groupId, parentPointId) {
  const url = `https://betraisland.is/api/groups/${groupId}/${parentPointId}/get_parent_point`;
  log.info(`Fetching point ${parentPointId} ${url}`);
  try {
    const outPoints = [];
    const point = await axiosWrapper(url);
    log.info(
      `Fetched point ${parentPointId}`
    );
    if (point && point.PointRevisions && point.PointRevisions.length > 0) {
      point.latestContent =
        point.PointRevisions[point.PointRevisions.length - 1].content;
      point.content = point.latestContent;

      outPoints.push(point);
      const commentsUrl = `https://betraisland.is/api/points/${parentPointId}/comments`;
      log.info(`Fetching comments ${commentsUrl}`);
      const comments = await axiosWrapper(commentsUrl);

      log.error(`Fetched comments ${JSON.stringify(comments, null, 2)}`)

      for (const comment of comments) {
        comment.latestContent =
          comment.PointRevisions[comment.PointRevisions.length - 1].content;
        comment.content = comment.latestContent;
        outPoints.push(comment);
      }

      return outPoints;
    } else {
      throw new Error(`No point revisions for point ${parentPointId}`);
    }
  } catch (error) {
    // Handle errors specific to getPoints if necessary
    log.error(`Failed to get points for post ${parentPointId}:`, error);
    // Re-throw the error or handle it as per your application's error handling policy
    throw error;
  }
}

function convertToCsv(dataArray) {
  let csvString = "rectangle,groupId,postId,userId,landUseType,comment\n"; // Headers
  dataArray.forEach((tile) => {
    const row = `${tile.rectangle},${tile.groupId},${tile.postId},${tile.userId},${tile.landUseType},"${tile.comment}"\n`;
    csvString += row;
  });
  return csvString;
}

let newTilesData = [];
let tilesData = [];

(async () => {
  log.info("Start export");
  let offset = 0;
  let count = 0;
  let continueFetching = true;
  const chunkSize = 5000;
  const communityId = process.argv[2];
  const postsProcessed = {};
  let outCsvText = "rectangle,groupId,userId,landUseType,comment";

  log.info(`Fetching posts ${offset} to ${offset + chunkSize - 1}...`);
  const posts = await models.Post.findAll({
    attributes: ["id", "name", "user_id", "group_id", "data"],
    include: [
      {
        model: models.Group,
        attributes: ["id"],
        where: {
          id: process.argv[2],
        },
      },
    ],
    limit: chunkSize,
    offset: offset,
  });

  log.info(`Post length ${posts.length}`);

  // Process the posts
  for (let p = 0; p < posts.length; p++) {
    const post = posts[p];
    log.info(`${post.id} ${post.name}`);

    if (
      post.data &&
      post.data.publicPrivateData &&
      post.data.publicPrivateData.length
    ) {
      // Loop through each item in the publicPrivateData array
      post.data.publicPrivateData.forEach((item) => {
        // Extract the landUseType, rectangleIndex, and pointId
        const { landUseType, rectangleIndex, pointId } = item;

        // Construct a tile data object
        const tileData = { landUseType, rectangleIndex, pointId, post };

        // Add the tile data object to an array or however you choose to store it
        // For example, pushing it into an array:
        tilesData.push(tileData);
      });
    } else {
      log.warn(`Post ${post.id} has no publicPrivateData`);
    }
  }

  for (const tile of tilesData) {
    if (tile.pointId) {
      try {
        const pointsWithComments = await getPoints(
          tile.post.group_id,
          tile.pointId
        );
        log.info(
          `Fetched ${pointsWithComments.length} points for post ${
            tile.pointId
          } ${JSON.stringify(pointsWithComments, null, 2)}`
        );

        for (const point of pointsWithComments) {
          let newTileData = {
            rectangle: tile.rectangleIndex,
            groupId: tile.post.group_id,
            userId: tile.post.user_id,
            landUseType: tile.landUseType,
            postId: tile.post.id,
            comment: point.content,
          };

          log.info(`New tile data ${JSON.stringify(newTileData, null, 2)}`)

          newTilesData.push(newTileData);
        }

        count += pointsWithComments.length;
      } catch (error) {
        log.error(`Error fetching points for post ${tile.pointId}:`, error);
        process.exit(1);
      }
    } else {
      newTilesData.push({
        rectangle: tile.rectangleIndex,
        groupId: tile.post.group_id,
        userId: tile.post.user_id,
        postId: tile.post.id,
        landUseType: tile.landUseType,
        comment: "",
      });
    }
  }

  const csvData = convertToCsv(newTilesData);

  fs.writeFileSync(`/tmp/landUseGameGroup${process.argv[2]}.csv`, csvData);

  log.info(`Done. Processed ${count} posts.`);
  process.exit(0);
})();
