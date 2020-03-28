var models = require('../models/index');
var async = require('async');
var ip = require('ip');
var _ = require('lodash');
const moment = require('moment');

const getGroupPosts = require('./export_utils').getGroupPosts;
const getDescriptionHeaders = require('./export_utils').getDescriptionHeaders;
const getRatingHeaders = require('./export_utils').getRatingHeaders;

const getContactData = require('./export_utils').getContactData;
const getAttachmentData = require('./export_utils').getAttachmentData;
const getMediaURLs = require('./export_utils').getMediaURLs;
const getMediaTranscripts = require('./export_utils').getMediaTranscripts;
const getPostRatings = require('./export_utils').getPostRatings;
const getDescriptionColumns = require('./export_utils').getDescriptionColumns;
const getPostUrl =  require('./export_utils').getPostUrl;
const getLocation =  require('./export_utils').getLocation;
const getCategory =  require('./export_utils').getCategory;
const getUserEmail = require('./export_utils').getUserEmail;
const clean = require('./export_utils').clean;

const getPointsDown = require('./export_utils').getPointsDown;
const getPointsUp = require('./export_utils').getPointsUp;

const docx = require('docx');

const { Document, Packer, Paragraph, Table, TableCell, UnderlineType, HeadingLevel, TableRow } = docx;

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
            size: 28,
            bold: true,
            italics: true,
            color: "red",
          },
          paragraph: {
            spacing: {
              after: 120,
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
            underline: {
              type: UnderlineType.DOUBLE,
              color: "FF0000",
            },
          },
          paragraph: {
            spacing: {
              before: 240,
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
}

const exportToDocx = (group, posts, customRatings, callback) => {
  const title = "Export for Group Id: "+group.id+" - "+group.name;

  const descriptionHeaders = getDescriptionHeaders(group);
  const ratingsHeaders = getRatingHeaders(customRatings);

  const doc = createDocWithStyles(title);

  doc.addSection({
    children: [
      new Paragraph({
        text: title,
        heading: HeadingLevel.HEADING_1,
      }),

      new Paragraph({
        text: group.name,
        heading: HeadingLevel.HEADING_1,
      }),

      new Paragraph(group.objectives)
    ]
  });

  doc.addSection({
    children: [
      new Paragraph({
        text: "Headers",
        heading: HeadingLevel.HEADING_1,
      }),

      new Paragraph(descriptionHeaders)
    ]
  });

  if (ratingsHeaders) {
    doc.addSection({
      children: [
        new Paragraph({
          text: "Ratings options",
          heading: HeadingLevel.HEADING_1,
        }),

        new Paragraph(ratingsHeaders)
      ]
    });
  }

  posts.forEach((post) =>{
    const children = [
      new Paragraph({
        text: "Name",
        heading: HeadingLevel.HEADING_1,
      }),

      new Paragraph(post.name),

      new Paragraph({
        text: "Descriptions",
        heading: HeadingLevel.HEADING_1,
      }),

      new Paragraph(post.description),

      new Paragraph("URL: "+ post.url),
      new Paragraph("User email: "+ post.userEmail),
      new Paragraph("User name: "+ post.userName),
      new Paragraph("Endorsements up: "+ post.endorsementsUp),
      new Paragraph("Endorsements down: "+ post.endorsementsDown),
      new Paragraph("Counter points: "+ post.counterPoints),
    ];

    if (post.postRatings) {
      children.push(
        new Paragraph("Ratings: "+ post.postRatings)
      )
    }

    if (post.mediaURLs) {
      children.push(
        new Paragraph("Media URLs: "+ post.mediaURLs)
      )
    }

    if (post.category) {
      children.push(
        new Paragraph("Category: "+ post.category)
      )
    }

    if (post.location) {
      children.push(
        new Paragraph("Location: "+ post.location)
      )
    }

    if (post.mediaTranscripts) {
      children.push(
        new Paragraph("Media transcripts: "+ post.mediaTranscripts)
      )
    }

    if (post.contactData) {
      children.push(
        new Paragraph("ContactData: "+ post.contactData)
      )
    }

    if (post.attachmentData) {
      children.push(
        new Paragraph("Attachment data: "+ post.attachmentData)
      )
    }

   children.push(
      new Paragraph({
        text: "Points for",
        heading: HeadingLevel.HEADING_1,
    }));

    children.push(
      new Paragraph(getPointsUp(post))
    );

    children.push(
      new Paragraph({
        text: "Points against",
        heading: HeadingLevel.HEADING_1,
      }),
    );

    children.push(
      new Paragraph(getPointsDown(post))
    );

    doc.addSection({
      children: children
    });
  });

  Packer.toBase64String(doc).then(b64string=>{
    callback(null, Buffer.from(b64string, 'base64'));
  })
};

const exportGroupToDocx = (group, hostName, callback) => {
  let customRatings;
  if (group.configuration && group.configuration.customRatings) {
    customRatings = group.configuration.customRatings;
  }

  getGroupPosts(group, hostName, (postsIn, error) => {
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
              description: getDescriptionColumns(group, post),
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
            exportToDocx(group, posts, customRatings, callback);
          }
        });
      }

    }
  });
};

module.exports = {
  exportGroupToDocx
};
