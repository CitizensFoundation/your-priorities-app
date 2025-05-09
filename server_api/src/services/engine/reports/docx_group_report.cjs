const models = require("../../../models/index.cjs");
const async = require("async");
const moment = require("moment");
const log = require("../../utils/logger.cjs");
const _ = require("lodash");
const docx = require("docx");
const fs = require("fs");

const {
  Document,
  Packer,
  Paragraph,
  Table,
  TableCell,
  UnderlineType,
  HeadingLevel,
  AlignmentType,
  ImageRun,
  TableRow,
} = docx;

const getGroupPosts = require("./common_utils.cjs").getGroupPosts;
const getRatingHeaders = require("./common_utils.cjs").getRatingHeaders;
const getContactData = require("./common_utils.cjs").getContactData;
const getAttachmentData = require("./common_utils.cjs").getAttachmentData;
const getMediaTranscripts = require("./common_utils.cjs").getMediaTranscripts;
const getPostRatings = require("./common_utils.cjs").getPostRatings;
const getPostUrl = require("./common_utils.cjs").getPostUrl;
const getLocation = require("./common_utils.cjs").getLocation;
const getCategory = require("./common_utils.cjs").getCategory;
const getUserEmail = require("./common_utils.cjs").getUserEmail;

const getMediaFormatUrl = require("./common_utils.cjs").getMediaFormatUrl;
const getMediaURLs = require("./common_utils.cjs").getMediaURLs;
const getPointsUpOrDown = require("./common_utils.cjs").getPointsUpOrDown;
const getPointsUp = require("./common_utils.cjs").getPointsUp;
const getPointsDown = require("./common_utils.cjs").getPointsDown;

const getTranslatedPoints = require("./common_utils.cjs").getTranslatedPoints;
const getTranslation = require("./common_utils.cjs").getTranslation;

const getOrderedPosts = require("./common_utils.cjs").getOrderedPosts;
const updateJobStatusIfNeeded =
  require("./common_utils.cjs").updateJobStatusIfNeeded;
const setJobError = require("./common_utils.cjs").setJobError;

const preparePosts = require("./common_utils.cjs").preparePosts;

const uploadToS3 = require("./common_utils.cjs").uploadToS3;
const sanitizeFilename = require("sanitize-filename");
const getImageFromUrl = require("./common_utils.cjs").getImageFromUrl;

const createDocWithStyles = (title) => {
  return new Document({
    creator: "Your Priorities Export",
    title: title,
    description: "Group export from Your Priorities",
    sections: [],
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
            color: "000000",
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
            color: "000000",
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
            bold: true,
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
            spacing: {
              line: 276,
              before: 20 * 72 * 0.1,
              after: 20 * 72 * 0.05,
            },
          },
        },
        {
          id: "ListParagraph",
          name: "List Paragraph",
          basedOn: "Normal",
          quickFormat: true,
        },
      ],
    },
  });
};

const setDescriptions = (group, post, builtPost, children) => {
  if (
    group &&
    group.configuration &&
    group.configuration.structuredQuestionsJson
  ) {
    const questionsById = {};
    const questionComponents = group.configuration.structuredQuestionsJson;

    for (let i = 0; i < questionComponents.length; i++) {
      questionsById[questionComponents[i].uniqueId] = questionComponents[i];
    }

    const answers = post.public_data.structuredAnswersJson;

    if (answers) {
      for (let i = 0; i < answers.length; i += 1) {
        if (answers[i] && answers[i].uniqueId) {
          if (questionsById[answers[i].uniqueId]) {
            if (answers[i].value) {
              children.push(
                new Paragraph({
                  text: cleanText(questionsById[answers[i].uniqueId].text),
                  heading: HeadingLevel.HEADING_2,
                }),
                new Paragraph(cleanText(answers[i].value))
              );
            }
          } else {
            log.error("Can't find question for answer by id");
          }
        }
      }
    } else {
      log.error("No answers in post");
    }
  } else if (
    group &&
    group.configuration &&
    group.configuration.structuredQuestions &&
    group.configuration.structuredQuestions !== ""
  ) {
    var structuredAnswers = [];

    var questionComponents = group.configuration.structuredQuestions.split(",");
    for (var i = 0; i < questionComponents.length; i += 2) {
      var question = questionComponents[i];
      var maxLength = questionComponents[i + 1];
      structuredAnswers.push({
        translatedContent: question.trim(),
        question: question,
        maxLength: maxLength,
        value: "",
      });
    }

    if (
      post.public_data &&
      post.public_data.structuredAnswers &&
      post.public_data.structuredAnswers !== ""
    ) {
      var answers = post.public_data.structuredAnswers.split("%!#x");
      for (i = 0; i < answers.length; i += 1) {
        if (structuredAnswers[i])
          structuredAnswers[i].value = answers[i].trim();
      }
    } else {
      structuredAnswers[0].value = post.description;
    }

    structuredAnswers.forEach((questionAnswer) => {
      children.push(
        new Paragraph({
          text: cleanText(questionAnswer.translatedContent),
          heading: HeadingLevel.HEADING_2,
        }),
        new Paragraph(cleanText(questionAnswer.value))
      );
    });
  } else {
    children.push(
      new Paragraph(
        cleanText(
          builtPost.translatedDescription
            ? builtPost.translatedDescription
            : post.description
        )
      )
    );
  }
};

const cleanText = (text) => {
  if (text) {
    return text.replace(/[\x0b]/gm, "");
    //    return text.replace(/[^\x09\x0A-\xFF\x85\xA0-\uD7FF\uE000-\uFDCF\uFDE0-\uFFFD]/gm, '');
  } else {
    return "";
  }
};

const addPointTranslationIfNeeded = (group, post, point, children) => {
  if (post.translatedPoints && post.translatedPoints[point.id]) {
    children.push(new Paragraph(cleanText(post.translatedPoints[point.id])));
  } else {
    children.push(new Paragraph(cleanText(point.content)));
  }

  if (
    point.public_data &&
    point.public_data.admin_comment &&
    point.public_data.admin_comment.text
  ) {
    children.push(new Paragraph(""));

    children.push(
      new Paragraph(
        group.translatedCustomAdminCommentsTitle ||
          group.configuration.customAdminCommentsTitle ||
          "Admin comment"
      )
    );

    let text =
      (post.translatedPoints &&
        post.translatedPoints[point.id + "adminComments"]) ||
      point.public_data.admin_comment.text ||
      "";

    children.push(new Paragraph(cleanText(text)));
  }

  children.push(new Paragraph(""));
};

const addPostToDoc = (doc, post, group) => {
  const children = [
    new Paragraph({
      text: cleanText(post.translatedName ? post.translatedName : post.name),
      heading: HeadingLevel.HEADING_1,
    }),
  ];

  setDescriptions(group, post.realPost, post, children);

  children.push(
    new Paragraph(""),
    new Paragraph("Original locale: " + post.realPost.language),
    new Paragraph("URL: " + post.url),
    new Paragraph(""),
    new Paragraph("User email: " + post.userEmail),
    new Paragraph("User name: " + post.userName),
    new Paragraph(""),
    new Paragraph("Endorsements up: " + post.endorsementsUp),
    new Paragraph("Endorsements down: " + post.endorsementsDown),
    new Paragraph("Counter points: " + post.counterPoints),
    new Paragraph("")
  );

  if (post.images && post.images.length > 5) {
    children.push(new Paragraph("Image URLs: " + post.images));
    children.push(new Paragraph(""));
  }

  if (post.postRatings) {
    children.push(new Paragraph("Ratings: " + post.postRatings));
  }

  if (post.mediaURLs && post.mediaURLs.length > 4) {
    children.push(new Paragraph("Media URLs: " + post.mediaURLs));
  }

  if (post.category) {
    children.push(new Paragraph("Category: " + post.category));
  }

  if (post.location && post.location.length > 6) {
    children.push(new Paragraph("Location: " + post.location));
  }

  if (post.mediaTranscripts && post.mediaTranscripts.length > 4) {
    children.push(new Paragraph(""));
    children.push(
      new Paragraph("Media transcripts: \n" + post.mediaTranscripts)
    );
  }

  if (post.contactData && post.contactData.length > 4) {
    children.push(new Paragraph("ContactData: " + post.contactData));
  }

  if (post.attachmentData && post.attachmentData.length > 4) {
    children.push(new Paragraph("Attachment data: " + post.attachmentData));
  }

  const pointsUp = getPointsUp(post);

  let pointForText =
    group.translatedAlternativePointForHeader ||
    group.configuration.alternativePointForHeader ||
    "Points for";
  let pointAgainstHeader =
    group.translatedAlternativePointAgainstHeader ||
    group.configuration.alternativePointAgainstHeader ||
    "Points against";

  children.push(
    new Paragraph({
      text: pointsUp.length > 0 ? pointForText : "No points for",
      heading: HeadingLevel.HEADING_2,
    })
  );

  pointsUp.forEach((point) => {
    addPointTranslationIfNeeded(group, post, point, children);
  });

  const pointsDown = getPointsDown(post);
  children.push(
    new Paragraph({
      text: pointsDown.length > 0 ? pointAgainstHeader : "No points against",
      heading: HeadingLevel.HEADING_2,
    })
  );

  pointsDown.forEach((point) => {
    addPointTranslationIfNeeded(group, post, point, children);
  });

  doc.addSection({
    children: children,
  });
};

const setupGroup = (doc, group, ratingsHeaders, title, done) => {
  let imageUrl, imageFilename;
  if (group.GroupLogoImages && group.GroupLogoImages.length > 0) {
    const firstImageFormats = JSON.parse(group.GroupLogoImages[0].formats);
    imageUrl = firstImageFormats[1];
  }

  async.series(
    [
      (seriesCallback) => {
        if (imageUrl) {
          getImageFromUrl(imageUrl, (error, imageFile) => {
            if (error) {
              seriesCallback(error);
            } else {
              imageFilename = imageFile;
              seriesCallback();
            }
          });
        } else {
          seriesCallback();
        }
      },

      (seriesCallback) => {
        const children = [];

        if (imageFilename) {
          const image1 = new ImageRun({
            data: fs.readFileSync(imageFilename),
            transformation: { width: 432, height: 243 },
          });
          children.push(new Paragraph({ children: [image1] }));
        }

        children.push(
          new Paragraph({
            text: title,
            heading: HeadingLevel.HEADING_1,
          }),

          new Paragraph({
            text: group.translatedName ? group.translatedName : group.name,
            heading: HeadingLevel.HEADING_1,
          }),

          new Paragraph(
            group.translatedObjectives
              ? group.translatedObjectives
              : group.objectives
          )
        );

        if (ratingsHeaders && ratingsHeaders.length > 5) {
          children.push(
            new Paragraph({
              text: "Ratings options",
              heading: HeadingLevel.HEADING_1,
            }),

            new Paragraph(ratingsHeaders)
          );
        }

        if (group.targetTranslationLanguage) {
          children.push(
            new Paragraph(""),
            new Paragraph({
              text:
                "Automatically machine translated to locale: " +
                group.targetTranslationLanguage.toUpperCase(),
              heading: HeadingLevel.HEADING_2,
            }),
            new Paragraph("")
          );
        }

        doc.addSection({
          children: children,
        });

        seriesCallback();
      },
    ],
    (error) => {
      done(error);
    }
  );
};

const exportToDocx = (options, callback) => {
  const jobId = options.jobId;
  const groupId = options.groupId;
  const group = options.group;
  const posts = options.posts;
  let categories = options.categories;
  const customRatings = options.customRatings;

  const title = "Export for Group Id: " + group.id;

  const ratingsHeaders = getRatingHeaders(customRatings);

  const doc = createDocWithStyles(title);

  let processedCount = 0;
  let lastReportedCount = 0;
  const totalPostCount = posts.length;

  setupGroup(doc, group, ratingsHeaders, title, (error) => {
    if (error) {
      callback(error);
    } else {
      if (categories.length === 0) {
        async.eachSeries(
          getOrderedPosts(posts),
          (post, eachCallback) => {
            addPostToDoc(doc, post, group);
            processedCount += 1;
            updateJobStatusIfNeeded(
              jobId,
              totalPostCount,
              processedCount,
              lastReportedCount,
              (error, haveSent) => {
                if (haveSent) lastReportedCount = processedCount;
                eachCallback(error);
              }
            );
          },
          (error) => {
            if (error) {
              callback(error);
            } else {
              Packer.toBase64String(doc).then((b64string) => {
                callback(null, Buffer.from(b64string, "base64"));
              });
            }
          }
        );
      } else {
        async.series(
          [
            (seriesCallback) => {
              categories = _.orderBy(categories, [(category) => category]);
              async.eachSeries(
                categories,
                (category, categoryCallback) => {
                  const children = [
                    new Paragraph({
                      text: category,
                      heading: HeadingLevel.HEADING_3,
                      alignment: AlignmentType.CENTER,
                    }),
                  ];

                  doc.addSection({
                    children: children,
                  });

                  async.eachSeries(
                    getOrderedPosts(posts),
                    (post, eachCallback) => {
                      if (post.category === category) {
                        addPostToDoc(doc, post, group);
                        processedCount += 1;
                        updateJobStatusIfNeeded(
                          jobId,
                          totalPostCount,
                          processedCount,
                          lastReportedCount,
                          (error, haveSent) => {
                            if (haveSent) {
                              lastReportedCount = processedCount;
                            }
                            eachCallback(error);
                          }
                        );
                      } else {
                        eachCallback();
                      }
                    },
                    (error) => {
                      categoryCallback(error);
                    }
                  );
                },
                (error) => {
                  seriesCallback(error);
                }
              );
            },
            (seriesCallback) => {
              const postsWithoutCategories = [];
              posts.forEach((post) => {
                if (!post.category) {
                  postsWithoutCategories.push(post);
                }
              });

              if (postsWithoutCategories.length > 0) {
                doc.addSection({
                  children: [
                    new Paragraph({
                      text: "Posts without a category",
                      heading: HeadingLevel.HEADING_1,
                    }),
                  ],
                });

                async.eachSeries(
                  getOrderedPosts(postsWithoutCategories),
                  (post, eachCallback) => {
                    addPostToDoc(doc, post, group);
                    processedCount += 1;
                    updateJobStatusIfNeeded(
                      jobId,
                      totalPostCount,
                      processedCount,
                      lastReportedCount,
                      (error, haveSent) => {
                        if (haveSent) {
                          lastReportedCount = processedCount;
                        }
                        eachCallback(error);
                      }
                    );
                  },
                  (error) => {
                    seriesCallback(error);
                  }
                );
              } else {
                seriesCallback();
              }
            },
          ],
          (error) => {
            if (error) {
              callback(error);
            } else {
              Packer.toBase64String(doc).then((b64string) => {
                callback(null, Buffer.from(b64string, "base64"));
              });
            }
          }
        );
      }
    }
  });
};

const createDocxReport = (workPackage, callback) => {
  let exportOptions, exportedData, filename;

  async.series(
    [
      (seriesCallback) => {
        models.Group.findOne({
          where: {
            id: workPackage.groupId,
          },
          attributes: [
            "id",
            "name",
            "objectives",
            "configuration",
            "community_id",
          ],
          include: [
            {
              model: models.Image,
              as: "GroupLogoImages",
              attributes: models.Image.defaultAttributesPublic,
              required: false,
            },
          ],
          order: [
            [
              { model: models.Image, as: "GroupLogoImages" },
              "created_at",
              "desc",
            ],
          ],
        })
          .then((group) => {
            workPackage.group = group;
            const dateString = moment(new Date()).format("DD_MM_YY_HH_mm");
            const groupName = sanitizeFilename(group.name).replace(/ /g, "");
            workPackage.filename =
              "Ideas_and_Points_Group_Export_" +
              group.community_id +
              "_" +
              group.id +
              "_" +
              groupName +
              "_" +
              dateString +
              "." +
              workPackage.exportType;
            seriesCallback();
          })
          .catch((error) => {
            seriesCallback(error);
          });
      },
      (seriesCallback) => {
        preparePosts(workPackage, (error, options) => {
          exportOptions = options;
          seriesCallback(error);
        });
      },
      (seriesCallback) => {
        models.AcBackgroundJob.update(
          {
            progress: 5,
          },
          {
            where: { id: workPackage.jobId },
          }
        )
          .then(() => {
            seriesCallback();
          })
          .catch((error) => {
            seriesCallback(error);
          });
      },
      (seriesCallback) => {
        exportToDocx(exportOptions, (error, data) => {
          exportedData = data;
          seriesCallback(error);
        });
      },
      (seriesCallback) => {
        uploadToS3(
          workPackage.jobId,
          workPackage.userId,
          workPackage.filename,
          workPackage.exportType,
          exportedData,
          (error, reportUrl) => {
            if (error) {
              seriesCallback(error);
            } else {
              models.AcBackgroundJob.update(
                {
                  progress: 100,
                  data: { reportUrl },
                },
                {
                  where: { id: workPackage.jobId },
                }
              )
                .then(() => {
                  seriesCallback();
                })
                .catch((error) => {
                  seriesCallback(error);
                });
            }
          }
        );
      },
    ],
    (error) => {
      if (error) {
        setJobError(
          workPackage.jobId,
          "errorDocxReportGeneration",
          error,
          (dbError) => {
            callback(dbError || error);
          }
        );
      } else {
        callback();
      }
    }
  );
};

module.exports = {
  createDocxReport,
};
