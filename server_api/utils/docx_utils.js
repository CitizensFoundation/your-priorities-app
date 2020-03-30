var models = require('../models/index');
var async = require('async');
var ip = require('ip');
var _ = require('lodash');
const moment = require('moment');

const getGroupPosts = require('./export_utils').getGroupPosts;
const getRatingHeaders = require('./export_utils').getRatingHeaders;

const getContactData = require('./export_utils').getContactData;
const getAttachmentData = require('./export_utils').getAttachmentData;
const getMediaTranscripts = require('./export_utils').getMediaTranscripts;
const getPostRatings = require('./export_utils').getPostRatings;
const getPostUrl =  require('./export_utils').getPostUrl;
const getLocation =  require('./export_utils').getLocation;
const getCategory =  require('./export_utils').getCategory;
const getUserEmail = require('./export_utils').getUserEmail;
const clean = require('./export_utils').clean;

const getMediaFormatUrl = function (media, formatId) {
  var formats = media.formats;
  if (formats && formats.length>0)
    return formats[formatId];
  else
    return ""
};

const getMediaURLs = function (post) {
  var mediaURLs = "";

  if (post.Points && post.Points.length>0) {
    _.forEach(post.Points, function (point) {
      if (point.PointVideos && point.PointVideos.length>0) {
        mediaURLs += _.map(point.PointVideos, function (media) {
          return ""+getMediaFormatUrl(media, 0)+"\n";
        });
      }

      if (point.PointAudios && point.PointAudios.length>0) {
        mediaURLs += _.map(point.PointAudios, function (media) {
          return ""+getMediaFormatUrl(media, 0)+"\n";
        });
      }
    });
  }

  if (post.PostVideos && post.PostVideos.length>0) {
    mediaURLs += _.map(post.PostVideos, function (media) {
      return ""+getMediaFormatUrl(media, 0)+"\n";
    });
  }

  if (post.PostAudios && post.PostAudios.length>0) {
    mediaURLs += _.map(post.PostAudios, function (media) {
      return ""+getMediaFormatUrl(media, 0)+"\n";
    });
  }

  return ''+mediaURLs+'';
};

const getPointsUpOrDown = function (post, value) {
  var points = _.filter(post.Points, function (point) {
    if (value>0) {
      return point.value > 0;
    } else {
      return point.value < 0;
    }
  });
  return points.map((point) => point.content);
};

var getPointsUp = function (post) {
  return getPointsUpOrDown(post, 1);
};

var getPointsDown = function (post) {
  return getPointsUpOrDown(post, -1);
};

const docx = require('docx');

const { Document, Packer, Paragraph, Table, TableCell, UnderlineType, HeadingLevel, AlignmentType, TableRow } = docx;

const createDocWithStyles = (title) => {
  return new Document({
    creator: "Your Priorities Export",
    title: title,
    description: "Group export from Your Priorities",
    styles: {
      paragraphStyles: [
        {
          id: "Heading1",
          name: "Heading 1",
          basedOn: "Normal",
          next: "Normal",
          quickFormat: true,
          run: {
            size: 35,
            bold: true,
            italics: false,
            color: "black",
          },
          paragraph: {
            spacing: {
              after: 250,
              before: 100,
            },
          },
        },
        {
          id: "Heading2",
          name: "Heading 2",
          basedOn: "Normal",
          next: "Normal",
          quickFormat: true,
          run: {
            size: 26,
            bold: true,
            italics: false,
            color: "black",
          },
          paragraph: {
            spacing: {
              after: 140,
            },
          },
        },
        {
          id: "Heading3",
          name: "Heading 3",
          basedOn: "Normal",
          next: "Normal",
          quickFormat: true,
          run: {
            size: 65,
            bold: true
          },
          paragraph: {
            spacing: {
              before: 600,
              after: 120,
            },

          },
        },
        {
          id: "aside",
          name: "Aside",
          basedOn: "Normal",
          next: "Normal",
          run: {
            color: "999999",
            italics: true,
          },
          paragraph: {
            indent: {
              left: 720,
            },
            spacing: {
              line: 276,
            },
          },
        },
        {
          id: "wellSpaced",
          name: "Well Spaced",
          basedOn: "Normal",
          quickFormat: true,
          paragraph: {
            spacing: { line: 276, before: 20 * 72 * 0.1, after: 20 * 72 * 0.05 },
          },
        },
        {
          id: "ListParagraph",
          name: "List Paragraph",
          basedOn: "Normal",
          quickFormat: true,
        },
      ],
    }
  });
};

const setDescriptions = (group, post, children) => {
  if (group && group.configuration && group.configuration.structuredQuestions && group.configuration.structuredQuestions!=="") {
    var structuredAnswers = [];

    var questionComponents = group.configuration.structuredQuestions.split(",");
    for (var i=0 ; i<questionComponents.length; i+=2) {
      var question = questionComponents[i];
      var maxLength = questionComponents[i+1];
      structuredAnswers.push({
        translatedQuestion: question.trim(),
        question: question,
        maxLength: maxLength, value: ""
      });
    }

    if (post.public_data && post.public_data.structuredAnswers && post.public_data.structuredAnswers!=="") {
      var answers = post.public_data.structuredAnswers.split("%!#x");
      for (i=0 ; i<answers.length; i+=1) {
        if (structuredAnswers[i])
          structuredAnswers[i].value = answers[i].trim();
      }
    } else {
      structuredAnswers[0].value = post.description;
    }

    structuredAnswers.forEach((questionAnswer) => {
      children.push(
        new Paragraph({
          text: questionAnswer.translatedQuestion,
          heading: HeadingLevel.HEADING_2,
        }),
        new Paragraph(questionAnswer.value),
      )
    });
  } else {
    children.push(
      new Paragraph(post.description)
    );
  }
};

const getImageFormatUrl = function(image, formatId) {
  var formats = JSON.parse(image.formats);
  if (formats && formats.length>0)
    return formats[formatId];
  else
    return ""
};

const getImages = function (post) {
  var imagesText = "";

  if (post.PostHeaderImages && post.PostHeaderImages.length>0) {
    imagesText += _.map(post.PostHeaderImages, function (image) {
      return getImageFormatUrl(image, 0)+"\n";
    });
  }

  if (post.PostUserImages && post.PostUserImages.length>0) {
    imagesText += _.map(post.PostUserImages, function (image) {
      return getImageFormatUrl(image, 0)+"\n";
    });
  }

  return ''+imagesText.replace(/,/g,"")+'';
};

const addPostToDoc = (doc, post, group) => {
  const children = [
    new Paragraph({
      text: post.name,
      heading: HeadingLevel.HEADING_1,
    })
  ];

  setDescriptions(group, post.realPost, children);

  children.push(
    new Paragraph(""),

    new Paragraph("URL: "+ post.url),
    new Paragraph(""),
    new Paragraph("User email: "+ post.userEmail),
    new Paragraph("User name: "+ post.userName),
    new Paragraph(""),
    new Paragraph("Endorsements up: "+ post.endorsementsUp),
    new Paragraph("Endorsements down: "+ post.endorsementsDown),
    new Paragraph("Counter points: "+ post.counterPoints),
    new Paragraph("")
  );

  if (post.images && post.images.length>5) {
    children.push(
      new Paragraph("Image URLs: "+ post.images)
    );
    children.push(
      new Paragraph("")
    );
  }

  if (post.postRatings) {
    children.push(
      new Paragraph("Ratings: "+ post.postRatings)
    )
  }

  debugger;

  if (post.mediaURLs && post.mediaURLs.length>4) {
    children.push(
      new Paragraph("Media URLs: "+ post.mediaURLs)
    )
  }

  if (post.category) {
    children.push(
      new Paragraph("Category: "+ post.category)
    )
  }

  if (post.location && post.location.length>6) {
    children.push(
      new Paragraph("Location: "+ post.location)
    )
  }

  if (post.mediaTranscripts && post.mediaTranscripts.length>4) {
    children.push(
      new Paragraph("")
    );
    children.push(
      new Paragraph("Media transcripts: \n"+ post.mediaTranscripts)
    )
  }

  if (post.contactData && post.contactData.length>4) {
    children.push(
      new Paragraph("ContactData: "+ post.contactData)
    )
  }

  if (post.attachmentData && post.attachmentData.length>4) {
    children.push(
      new Paragraph("Attachment data: "+ post.attachmentData)
    )
  }

  const pointsUp = getPointsUp(post);

  children.push(
    new Paragraph({
      text: pointsUp.length>0 ? (pointsUp.length===1 ? "Point for" : "Points for") : "No points for",
      heading: HeadingLevel.HEADING_2,
    }));

  pointsUp.forEach((pointContent) => {
    children.push(
      new Paragraph(pointContent)
    );
    children.push(
      new Paragraph("")
    );
  });

  const pointsDown = getPointsDown(post);
  children.push(
    new Paragraph({
      text: pointsDown.length>0 ? (pointsDown.length===1 ? "Point against" : "Points against") : "No points against",
      heading: HeadingLevel.HEADING_2,
    }),
  );

  pointsDown.forEach((pointContent) => {
    children.push(
      new Paragraph(pointContent)
    );
    children.push(
      new Paragraph("")
    );
  });

  doc.addSection({
    children: children
  });
};

const setupGroup = (doc, group, ratingsHeaders, title) => {
  const children = [
    new Paragraph({
      text: title,
      heading: HeadingLevel.HEADING_1,
    }),

    new Paragraph({
      text: group.name,
      heading: HeadingLevel.HEADING_1,
    }),

    new Paragraph(group.objectives)
  ];

  if (ratingsHeaders && ratingsHeaders.length>5) {
    children.push(
      new Paragraph({
        text: "Ratings options",
        heading: HeadingLevel.HEADING_1,
      }),

      new Paragraph(ratingsHeaders)
    );
  }

  doc.addSection({
    children: children
  });
};

const getOrderedPosts = (posts) => {
  return _.orderBy(posts,[post=> { return post.endorsementsUp-post.endorsementsDown }], ['desc']);
}

const exportToDocx = (group, posts, customRatings, categories, callback) => {
  const title = "Export for Group Id: "+group.id+" - "+group.name;

  const ratingsHeaders = getRatingHeaders(customRatings);

  const doc = createDocWithStyles(title);

  setupGroup(doc, group, ratingsHeaders, title);

  if (categories.length===0) {
    getOrderedPosts(posts).forEach((post) =>{
      addPostToDoc(doc, post, group);
    });
  } else {
    categories = _.orderBy(categories, [category=>category]);
    categories.forEach((category) => {
      const children = [
        new Paragraph({
          text: category,
          heading: HeadingLevel.HEADING_3,
          alignment: AlignmentType.CENTER
        })
      ];

      doc.addSection({
        children: children
      });

      getOrderedPosts(posts).forEach((post) =>{
        if (post.category===category) {
          addPostToDoc(doc, post, group);
        }
      });
    });

    const postsWithoutCategories = [];
    posts.forEach((post) =>{
      if (!post.category) {
        postsWithoutCategories.push(post);
      }
    });

    if (postsWithoutCategories.length>0) {

      doc.addSection({
        children: [
          new Paragraph({
            text: "Posts without a category",
            heading: HeadingLevel.HEADING_1,
          })
        ]
      });

      getOrderedPosts(postsWithoutCategories).forEach((post) =>{
        addPostToDoc(doc, post, group);
      });
    }
  }

  Packer.toBase64String(doc).then(b64string=>{
    callback(null, Buffer.from(b64string, 'base64'));
  })
};

const exportGroupToDocx = (group, hostName, callback) => {
  let customRatings;
  if (group.configuration && group.configuration.customRatings) {
    customRatings = group.configuration.customRatings;
  }

  getGroupPosts(group, hostName, (postsIn, error, categories) => {
    if (error) {
      callback(error);
    } else {
      if (error) {
        callback(error);
      } else {
        var outFileContent = "";
        const posts = [];
        async.eachSeries(postsIn, function (post, seriesCallback) {
          if (!post.deleted) {
            const postRatings = (post.public_data && post.public_data.ratings) ? post.public_data.ratings : null;
            posts.push({
              id: post.id,
              name: clean(post.name),
              realPost: post,
              url: getPostUrl(post, hostName),
              category: getCategory(post),
              userEmail: getUserEmail(post),
              userName: post.User.name,
              location: getLocation(post),
              endorsementsUp: post.counter_endorsements_up,
              endorsementsDown: post.counter_endorsements_down,
              counterPoints: post.counter_points,
              pointsUp: getPointsUp(post),
              Points: post.Points,
              images: getImages(post),
              pointsDown: getPointsDown(post),
              contactData: getContactData(post),
              attachmentData: getAttachmentData(post),
              mediaURLs: getMediaURLs(post),
              mediaTranscripts: getMediaTranscripts(post),
              postRatings: getPostRatings(customRatings, postRatings)
            });
          }
          seriesCallback();
        }, function (error) {
          if(error) {
            callback(error)
          } else {
            exportToDocx(group, posts, customRatings, categories, callback);
          }
        });
      }

    }
  });
};

module.exports = {
  exportGroupToDocx
};
