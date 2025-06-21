const moment = require("moment");
const getMediaTranscripts = require("./common_utils.cjs").getMediaTranscripts;

const getPointMediaUrls = require("./common_utils.cjs").getPointMediaUrls;

const getPointTextWithEverything = (group, post, point) => {
  if (group && post && point && point.PointRevisions && point.PointRevisions.length === 0) {
    let pointContent;
    let outText = "";
    if (post.translatedPoints && post.translatedPoints[point.id]) {
      pointContent = post.translatedPoints[point.id];
    } else {
      pointContent =
        point.PointRevisions[point.PointRevisions.length - 1].content;
    }

    outText = pointContent.trim() + "\n\n";

    if (
      point.public_data &&
      point.public_data.admin_comment &&
      point.public_data.admin_comment.text
    ) {
      outText +=
        (group.translatedCustomAdminCommentsTitle ||
          group.configuration.customAdminCommentsTitle ||
          "Admin comment") + "\n";

      if (point.public_data.admin_comment.createdAt) {
        outText +=
          moment(point.public_data.admin_comment.createdAt).format("DD/MM/YY HH:mm") +
          " - " +
          point.public_data.admin_comment.userName +
          "\n\n";
      }

      let text =
        (post.translatedPoints &&
          post.translatedPoints[point.id + "adminComments"]) ||
        point.public_data.admin_comment.text ||
        "";

      outText += text + "\n\n";
    }

    return outText.trim();
  } else {
    log.error("getPointTextWithEverything: missing data", group, post, point);
  }
};

const getPointValueText = (value) => {
  if (value===0) {
    return "Comment";
  } else if (value>0) {
    return "Point for";
  } else {
    return "Point against";
  }
}

const addPostPointsToSheet = (worksheet, post, group) => {
  if (worksheet && post && post.Points && group) {
    post.Points.forEach(point=>{
      const row = {
        groupId: group.id,
        postId: post.realPost.id,
        postName: post.translatedName ? post.translatedName : post.name,
        status: point.status,
        createdAt: moment(point.created_at).format("DD/MM/YY HH:mm"),
        email: point.User.email,
        userName: point.User.name,
        pointLocale: point.language,
        helpfulCount: point.counter_quality_up,
        unhelpfulCount: point.counter_quality_down,
        value: getPointValueText(point.value),
        pointContentLatest: getPointTextWithEverything(group, post, point),
        pointTranscript: getMediaTranscripts(point),
        mediaUrls: getPointMediaUrls(point)
      };

      worksheet.addRow(row);
    })
  } else {
    log.error("addPostPointsToSheet: missing data", worksheet, post, group);
    return;
  }
};

module.exports = {
  addPostPointsToSheet
};
