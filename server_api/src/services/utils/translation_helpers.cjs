const models = require("../../models/index.cjs");
const async = require("async");
const _ = require("lodash");
const fs = require("fs");
const request = require("request");
const farmhash = require("farmhash");

const fixTargetLocale = (itemTargetLocale) => {
  let targetLocale = itemTargetLocale.replace("_", "-");

  if (
    targetLocale !== "sr-latin" &&
    targetLocale !== "zh-CN" &&
    targetLocale !== "zh-TW"
  ) {
    targetLocale = targetLocale.split("-")[0];
  }

  if (targetLocale === "sr-latin") {
    targetLocale = "sr-Latn";
  }

  return targetLocale;
};

const addItem = (targetLocale, items, textType, id, content, done) => {
  if (!content) {
    console.log(`No content for ${textType} ${id}`);
    done();
  } else {
    const indexKey = `${textType}-${id}-${fixTargetLocale(
      targetLocale
    )}-${farmhash.hash32(content).toString()}`;

    models.AcTranslationCache.findOne({
      where: {
        index_key: indexKey,
      },
    })
      .then((result) => {
        const item = {};
        item.textType = textType;
        item.contentId = id;
        item.originalText = content;
        item.indexKey = indexKey;
        if (result) {
          item.translatedText = result.content;
        }
        items.push(item);
        done();
      })
      .catch((error) => {
        console.error(error);
        done(error);
      });
  }
};

const addTranslationsForPosts = (targetLocale, items, posts, done) => {
  async.forEachSeries(
    posts,
    (post, forEachCallback) => {
      async.series(
        [
          (innerSeriesCallback) => {
            addItem(
              targetLocale,
              items,
              "postName",
              post.id,
              post.name,
              innerSeriesCallback
            );
          },
          (innerSeriesCallback) => {
            addItem(
              targetLocale,
              items,
              "postContent",
              post.id,
              post.description,
              innerSeriesCallback
            );
          },
          (innerSeriesCallback) => {
            let tagsContent = null;
            if (post.public_data && post.public_data.tags) {
              tagsContent = post.public_data.tags;
            }
            addItem(
              targetLocale,
              items,
              "postTags",
              post.id,
              tagsContent,
              innerSeriesCallback
            );
          },
          (innerSeriesCallback) => {
            let answerContent = "";
            if (post.public_data && post.public_data.structuredAnswersJson) {
              for (const answer of post.public_data.structuredAnswersJson) {
                if (answer.value) {
                  answerContent += answer.value;
                }
              }
            }
            addItem(
              targetLocale,
              items,
              "PostAnswer",
              post.id,
              answerContent ? answerContent : null,
              innerSeriesCallback
            );
          },
        ],
        (error) => {
          forEachCallback(error);
        }
      );
    },
    (error) => {
      done(error);
    }
  );
};

const addTranslationsForGroups = (targetLocale, items, groups, done) => {
  async.forEachSeries(
    groups,
    (group, forEachCallback) => {
      async.series(
        [
          (innerSeriesCallback) => {
            addItem(
              targetLocale,
              items,
              "groupName",
              group.id,
              group.name,
              innerSeriesCallback
            );
          },
          (innerSeriesCallback) => {
            addItem(
              targetLocale,
              items,
              "groupContent",
              group.id,
              group.objectives,
              innerSeriesCallback
            );
          },
          (innerSeriesCallback) => {
            addItem(
              targetLocale,
              items,
              "alternativeTextForNewIdeaButton",
              group.id,
              group.configuration.alternativeTextForNewIdeaButton,
              innerSeriesCallback
            );
          },
          (innerSeriesCallback) => {
            addItem(
              targetLocale,
              items,
              "alternativeTextForNewIdeaButtonClosed",
              group.id,
              group.configuration.alternativeTextForNewIdeaButtonClosed,
              innerSeriesCallback
            );
          },
          (innerSeriesCallback) => {
            addItem(
              targetLocale,
              items,
              "alternativeTextForNewIdeaButtonHeader",
              group.id,
              group.configuration.alternativeTextForNewIdeaButtonHeader,
              innerSeriesCallback
            );
          },
          (innerSeriesCallback) => {
            if (group.configuration.allOurIdeas) {
              addItem(
                targetLocale,
                items,
                "aoiWelcomeMessage",
                group.id,
                group.configuration.allOurIdeas.earl.configuration.welcome_message,
                innerSeriesCallback
              );
            } else {
              innerSeriesCallback();
            }
          },
          (innerSeriesCallback) => {
            if (group.configuration.allOurIdeas) {
              addItem(
                targetLocale,
                items,
                "aoiWelcomeHtml",
                group.id,
                group.configuration.allOurIdeas.earl.configuration.welcome_html,
                innerSeriesCallback
              );
            } else {
              innerSeriesCallback();
            }
          },
          (innerSeriesCallback) => {
            addItem(
              targetLocale,
              items,
              "alternativeTextForNewIdeaSaveButton",
              group.id,
              group.configuration.alternativeTextForNewIdeaSaveButton,
              innerSeriesCallback
            );
          },
          (innerSeriesCallback) => {
            addItem(
              targetLocale,
              items,
              "customCategoryQuestionText",
              group.id,
              group.configuration.customCategoryQuestionText,
              innerSeriesCallback
            );
          },
          (innerSeriesCallback) => {
            addItem(
              targetLocale,
              items,
              "customThankYouTextNewPosts",
              group.id,
              group.configuration.customThankYouTextNewPosts,
              innerSeriesCallback
            );
          },
          (innerSeriesCallback) => {
            addItem(
              targetLocale,
              items,
              "customTitleQuestionText",
              group.id,
              group.configuration.customTitleQuestionText,
              innerSeriesCallback
            );
          },
          (innerSeriesCallback) => {
            addItem(
              targetLocale,
              items,
              "customFilterText",
              group.id,
              group.configuration.customFilterText,
              innerSeriesCallback
            );
          },
          (innerSeriesCallback) => {
            addItem(
              targetLocale,
              items,
              "customAdminCommentsTitle",
              group.id,
              group.configuration.customAdminCommentsTitle,
              innerSeriesCallback
            );
          },
          (innerSeriesCallback) => {
            addItem(
              targetLocale,
              items,
              "alternativePointForHeader",
              group.id,
              group.configuration.alternativePointForHeader,
              innerSeriesCallback
            );
          },
          (innerSeriesCallback) => {
            addItem(
              targetLocale,
              items,
              "alternativePointAgainstHeader",
              group.id,
              group.configuration.alternativePointAgainstHeader,
              innerSeriesCallback
            );
          },
          (innerSeriesCallback) => {
            addItem(
              targetLocale,
              items,
              "customTabTitleNewLocation",
              group.id,
              group.configuration.customTabTitleNewLocation,
              innerSeriesCallback
            );
          },
          (innerSeriesCallback) => {
            addItem(
              targetLocale,
              items,
              "alternativePointForLabel",
              group.id,
              group.configuration.alternativePointForLabel,
              innerSeriesCallback
            );
          },
          (innerSeriesCallback) => {
            addItem(
              targetLocale,
              items,
              "alternativePointAgainstLabel",
              group.id,
              group.configuration.alternativePointAgainstLabel,
              innerSeriesCallback
            );
          },
        ],
        (error) => {
          done(error);
        }
      );
    },
    (error) => {
      done(error);
    }
  );
};

const addTranslationsForCommunity = (targetLocale, items, community, done) => {
  addItem(
    targetLocale,
    items,
    "communityName",
    community.id,
    community.name,
    (error) => {
      if (error) {
        done(error);
      } else {
        addItem(
          targetLocale,
          items,
          "communityContent",
          community.id,
          community.description,
          (error) => {
            done(error);
          }
        );
      }
    }
  );
};

const getTranslatedTextsForCommunity = (targetLocale, communityId, done) => {
  const communityItems = [];
  const groupItems = [];
  const postItems = [];

  async.parallel(
    [
      (seriesCallback) => {
        async.series(
          [
            (innerSeriesCallback) => {
              models.Post.findAll({
                attributes: ["id", "name", "description", "public_data"],
                include: [
                  {
                    model: models.Group,
                    attributes: ["id", "configuration"],
                    include: [
                      {
                        model: models.Community,
                        attributes: ["id"],
                        where: {
                          id: communityId,
                        },
                      },
                    ],
                  },
                ],
              })
                .then((posts) => {
                  addTranslationsForPosts(
                    targetLocale,
                    postItems,
                    posts,
                    innerSeriesCallback
                  );
                })
                .catch((error) => {
                  innerSeriesCallback(error);
                });
            },
            (innerSeriesCallback) => {
              models.Group.findAll({
                attributes: ["id", "name", "objectives", "configuration"],
                where: {
                  community_id: communityId,
                },
              })
                .then((groups) => {
                  addTranslationsForGroups(
                    targetLocale,
                    groupItems,
                    groups,
                    innerSeriesCallback
                  );
                })
                .catch((error) => {
                  innerSeriesCallback(error);
                });
            },
            (innerSeriesCallback) => {
              models.Community.findOne({
                attributes: ["id", "name", "description"],
                where: {
                  id: communityId,
                },
              })
                .then((community) => {
                  addTranslationsForCommunity(
                    targetLocale,
                    communityItems,
                    community,
                    innerSeriesCallback
                  );
                })
                .catch((error) => {
                  innerSeriesCallback(error);
                });
            },
          ],
          (error) => {
            seriesCallback(error);
          }
        );
      },
    ],
    (error) => {
      if (error) {
        done(null, error);
      } else {
        done({ items: communityItems.concat(groupItems.concat(postItems)) });
      }
    }
  );
};

const getTranslatedTextsForGroup = (targetLocale, groupId, done) => {
  const groupItems = [];
  const postItems = [];

  let group, surveyQuestionTranslations, registrationQuestionTranslations;

  async.parallel(
    [
      (seriesCallback) => {
        async.series(
          [
            (innerSeriesCallback) => {
              models.Post.findAll({
                attributes: ["id", "name", "description", "public_data"],
                include: [
                  {
                    model: models.Group,
                    attributes: ["id", "configuration"],
                    where: {
                      id: groupId,
                    },
                  },
                ],
              })
                .then((posts) => {
                  addTranslationsForPosts(
                    targetLocale,
                    postItems,
                    posts,
                    innerSeriesCallback
                  );
                })
                .catch((error) => {
                  innerSeriesCallback(error);
                });
            },
            (innerSeriesCallback) => {
              models.Group.findAll({
                attributes: ["id", "name", "objectives", "configuration"],
                where: {
                  id: groupId,
                },
              })
                .then((groups) => {
                  group = groups[0];
                  addTranslationsForGroups(
                    targetLocale,
                    groupItems,
                    groups,
                    innerSeriesCallback
                  );
                })
                .catch((error) => {
                  innerSeriesCallback(error);
                });
            },
            (innerSeriesCallback) => {
              if (
                group &&
                group.configuration.structuredQuestionsJson &&
                group.configuration.structuredQuestionsJson.length > 0
              ) {
                models.AcTranslationCache.getSurveyQuestionTranslations(
                  group.id,
                  targetLocale,
                  (error, translations) => {
                    if (error) {
                      innerSeriesCallback(error);
                    } else {
                      surveyQuestionTranslations = translations;
                      innerSeriesCallback();
                    }
                  }
                );
              } else {
                innerSeriesCallback();
              }
            },
            (innerSeriesCallback) => {
              if (
                group &&
                group.configuration.registrationQuestionsJson &&
                group.configuration.registrationQuestionsJson.length > 0
              ) {
                models.AcTranslationCache.getRegistrationQuestionTranslations(
                  group.id,
                  targetLocale,
                  (error, translations) => {
                    if (error) {
                      innerSeriesCallback(error);
                    } else {
                      registrationQuestionTranslations = translations;
                      innerSeriesCallback();
                    }
                  }
                );
              } else {
                innerSeriesCallback();
              }
            },
          ],
          (error) => {
            seriesCallback(error);
          }
        );
      },
    ],
    (error) => {
      if (error) {
        done(null, error);
      } else {
        done({
          items: groupItems.concat(postItems),
          surveyQuestionTranslations,
          registrationQuestionTranslations,
        });
      }
    }
  );
};

const updateTranslation = (item, done) => {
  let targetLocale = fixTargetLocale(item.targetLocale);

  const indexKey = `${item.textType}-${
    item.contentId
  }-${targetLocale}-${farmhash.hash32(item.content).toString()}`;
  models.AcTranslationCache.findOrCreate({
    where: {
      index_key: indexKey,
    },
    defaults: {
      index_key: indexKey,
      content: item.translatedText,
    },
  })
    .then((result) => {
      if (result && result.length > 0) {
        result[0].content = item.translatedText;
        result[0]
          .save()
          .then(() => {
            done();
          })
          .catch((error) => seriesCallback(error));
      } else {
        seriesCallback("Cant find or create translation");
      }
    })
    .catch((error) => done(error));
};

const updateSurveyTranslation = (
  groupId,
  textType,
  targetLocale,
  translations,
  questions,
  done
) => {
  const combinedText = questions.join("");

  const item = {
    textType,
    contentId: groupId,
    targetLocale,
    content: combinedText,
    translatedText: JSON.stringify(translations),
  };

  updateTranslation(item, done);
};

const updateAnswerTranslation = (
  postId,
  textType,
  targetLocale,
  translations,
  contentHash,
  done
) => {
  const item = {
    textType,
    contentId: postId,
    targetLocale,
    translatedText: JSON.stringify(translations),
  };

  targetLocale = fixTargetLocale(item.targetLocale);

  const indexKey = `${item.textType}-${item.contentId}-${targetLocale}-${contentHash}`;
  models.AcTranslationCache.findOrCreate({
    where: {
      index_key: indexKey,
    },
    defaults: {
      index_key: indexKey,
      content: item.translatedText,
    },
  })
    .then((result) => {
      if (result && result.length > 0) {
        result[0].content = item.translatedText;
        result[0]
          .save()
          .then(() => {
            done();
          })
          .catch((error) => seriesCallback(error));
      } else {
        seriesCallback("Cant find or create translation");
      }
    })
    .catch((error) => done(error));
};

const updateTranslationForGroup = (groupId, item, done) => {
  async.series(
    [
      (seriesCallback) => {
        if (["groupName", "groupContent"].indexOf(item.textType) > -1) {
          seriesCallback(groupId == item.contentId ? null : "Access denied");
        } else {
          seriesCallback();
        }
      },
      (seriesCallback) => {
        if (["postName", "postContent"].indexOf(item.textType) > -1) {
          models.Post.findOne({
            where: {
              id: item.contentId,
            },
            attributes: ["id", "public_data"],
            include: [
              {
                model: models.Group,
                required: true,
                where: { id: groupId },
              },
            ],
          })
            .then((post) => {
              seriesCallback(post ? null : "Access denied");
            })
            .catch((error) => seriesCallback(error));
        } else {
          seriesCallback();
        }
      },
      (seriesCallback) => {
        updateTranslation(item, seriesCallback);
      },
    ],
    (error) => {
      done(error);
    }
  );
};

const updateTranslationForCommunity = (communityId, item, done) => {
  async.series(
    [
      (seriesCallback) => {
        if (["communityName", "communityContent"].indexOf(item.textType) > -1) {
          seriesCallback(
            communityId == item.contentId ? null : "Access denied"
          );
        } else {
          seriesCallback();
        }
      },
      (seriesCallback) => {
        if (["groupName", "groupContent"].indexOf(item.textType) > -1) {
          models.Group.findOne({
            where: {
              id: item.contentId,
            },
            attributes: ["id", "configuration"],
            include: [
              {
                model: models.Community,
                where: { id: communityId },
                required: true,
              },
            ],
          })
            .then((group) => {
              seriesCallback(group ? null : "Access denied");
            })
            .catch((error) => seriesCallback(error));
        } else {
          seriesCallback();
        }
      },
      (seriesCallback) => {
        if (["postName", "postContent"].indexOf(item.textType) > -1) {
          models.Post.findOne({
            where: {
              id: item.contentId,
            },
            attributes: ["id", "public_data"],
            include: [
              {
                model: models.Group,
                required: true,
                include: [
                  {
                    model: models.Community,
                    where: { id: communityId },
                    required: true,
                  },
                ],
              },
            ],
          })
            .then((post) => {
              seriesCallback(post ? null : "Access denied");
            })
            .catch((error) => seriesCallback(error));
        } else {
          seriesCallback();
        }
      },
      (seriesCallback) => {
        updateTranslation(item, seriesCallback);
      },
    ],
    (error) => {
      done(error);
    }
  );
};


//TODO: Add translations for domain with domainWelcomeHtml
module.exports = {
  getTranslatedTextsForCommunity,
  getTranslatedTextsForGroup,
  updateTranslationForCommunity,
  updateTranslationForGroup,
  updateAnswerTranslation,
  fixTargetLocale,
  updateTranslation,
  updateSurveyTranslation,
};
