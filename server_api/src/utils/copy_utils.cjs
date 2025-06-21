var models = require("../models/index.cjs");
var async = require("async");
const log = require('./logger.cjs');
const {
  cloneTranslationForGroup,
} = require("../services/utils/translation_cloning.cjs");
const {
  cloneTranslationForCommunity,
} = require("../services/utils/translation_cloning.cjs");
const {
  cloneTranslationForPoint,
} = require("../services/utils/translation_cloning.cjs");
const {
  cloneTranslationForPost,
} = require("../services/utils/translation_cloning.cjs");
const { recountCommunity } = require("./recount_utils.cjs");

const clonePagesForCollection = (
  model,
  modelRelField,
  inCollection,
  outCollection,
  done
) => {
  const oldToNewHash = {};
  models.Page.findAll({
    include: [
      {
        model: model,
        where: {
          id: inCollection.id,
        },
      },
    ],
  })
    .then((pages) => {
      async.forEach(
        pages,
        (oldPage, forEachCallback) => {
          const pageJson = JSON.parse(JSON.stringify(oldPage.toJSON()));
          delete pageJson["id"];
          pageJson[modelRelField] = outCollection.id;
          const newPage = models.Page.build(pageJson);
          newPage
            .save()
            .then(() => {
              oldToNewHash[oldPage.id] = newPage.id;
              forEachCallback();
            })
            .catch((error) => {
              forEachCallback(error);
            });
        },
        (error) => {
          if (
            inCollection.configuration &&
            inCollection.configuration.welcomePageId &&
            inCollection.configuration.welcomePageId !== ""
          ) {
            outCollection.set(
              "configuration.welcomePageId",
              oldToNewHash[parseInt(inCollection.configuration.welcomePageId)]
            );
            outCollection
              .save()
              .then(() => {
                done();
              })
              .catch((error) => {
                done(error);
              });
          } else {
            done(error);
          }
        }
      );
    })
    .catch((error) => {
      done(error);
    });
};

const clonePagesForGroup = (inGroup, outGroup, done) => {
  clonePagesForCollection(models.Group, "group_id", inGroup, outGroup, done);
};

const clonePagesForCommunity = (inCommunity, outCommunity, done) => {
  clonePagesForCollection(
    models.Community,
    "community_id",
    inCommunity,
    outCommunity,
    done
  );
};

const copyPost = (fromPostId, toGroupId, options, done) => {
  var toGroup, toDomainId, toCommunityId;
  var toDomain;
  var newPost;
  var oldPost;
  var skipPointActivitiesIdsForPostCopy = [];

  async.series(
    [
      function (callback) {
        models.Group.findOne({
          where: {
            id: toGroupId,
          },
          include: [
            {
              model: models.Community,
              required: true,
              include: [
                {
                  model: models.Domain,
                  required: true,
                },
              ],
            },
          ],
        })
          .then(function (groupIn) {
            toGroup = groupIn;
            toCommunityId = toGroup.Community.id;
            toDomainId = toGroup.Community.Domain.id;
            toDomain = toGroup.Community.Domain;
            callback();
          })
          .catch(function (error) {
            callback(error);
          });
      },
      function (callback) {
        models.Post.findOne({
          where: {
            id: fromPostId,
          },
          include: [
            {
              model: models.Image,
              as: "PostHeaderImages",
              attributes: ["id"],
              required: false,
            },
            {
              model: models.Video,
              as: "PostVideos",
              attributes: ["id"],
              required: false,
            },
            {
              model: models.Audio,
              as: "PostAudios",
              attributes: ["id"],
              required: false,
            },
            {
              model: models.Image,
              as: "PostUserImages",
              attributes: ["id"],
              required: false,
            },
          ],
        }).then(function (postIn) {
          oldPost = postIn;
          if (!postIn) {
            log.error("No post in");
            callback("no post");
          } else {
            var postJson = JSON.parse(JSON.stringify(postIn.toJSON()));
            delete postJson["id"];
            newPost = models.Post.build(postJson);
            newPost.set("group_id", toGroup.id);

            if (options && !options.copyPoints) {
              newPost.set("counter_points", 0);
            }

            if (options && options.toCategoryId) {
              newPost.set("category_id", options.toCategoryId);
            }

            if (options && options.skipUsers) {
              newPost.set("counter_users", 0);
            }

            if (options && options.resetEndorsementCounters) {
              newPost.set("counter_endorsements_up", 0);
              newPost.set("counter_endorsements_down", 0);
            }

            newPost
              .save()
              .then(function () {
                async.series(
                  [
                    (postSeriesCallback) => {
                      cloneTranslationForPost(
                        oldPost,
                        newPost,
                        postSeriesCallback
                      );
                    },
                    (postSeriesCallback) => {
                      if (options && options.createCopyActivities) {
                        models.AcActivity.createActivity(
                          {
                            type: "activity.post.copied",
                            userId: newPost.user_id,
                            domainId: toDomain.id,
                            groupId: newPost.group_id,
                            postId: newPost.id,
                            access: models.AcActivity.ACCESS_PRIVATE,
                          },
                          function (error) {
                            postSeriesCallback(error);
                          }
                        );
                      } else {
                        postSeriesCallback();
                      }
                    },
                    (postSeriesCallback) => {
                      if (oldPost.PostVideos && oldPost.PostVideos.length > 0) {
                        async.eachSeries(
                          oldPost.PostVideos,
                          function (media, mediaCallback) {
                            newPost
                              .addPostVideo(media)
                              .then(function () {
                                mediaCallback();
                              })
                              .catch((error) => {
                                mediaCallback(error);
                              });
                          },
                          function (error) {
                            postSeriesCallback(error);
                          }
                        );
                      } else {
                        postSeriesCallback();
                      }
                    },
                    (postSeriesCallback) => {
                      if (oldPost.PostAudios && oldPost.PostAudios.length > 0) {
                        async.eachSeries(
                          oldPost.PostAudios,
                          function (media, mediaCallback) {
                            newPost
                              .addPostAudio(media)
                              .then(function () {
                                mediaCallback();
                              })
                              .catch((error) => {
                                mediaCallback(error);
                              });
                          },
                          function (error) {
                            postSeriesCallback(error);
                          }
                        );
                      } else {
                        postSeriesCallback();
                      }
                    },
                    (postSeriesCallback) => {
                      if (!options.skipEndorsementQualitiesAndRatings) {
                        models.Endorsement.findAll({
                          where: {
                            post_id: oldPost.id,
                          },
                        }).then(function (endorsements) {
                          async.eachSeries(
                            endorsements,
                            function (endorsement, endorsementCallback) {
                              var endorsementJson = JSON.parse(
                                JSON.stringify(endorsement.toJSON())
                              );
                              delete endorsementJson.id;
                              var endorsementModel =
                                models.Endorsement.build(endorsementJson);
                              endorsementModel.set("post_id", newPost.id);
                              endorsementModel.set("PostId", newPost.id);
                              endorsementModel
                                .save()
                                .then(function () {
                                  if (options && options.createCopyActivities) {
                                    models.AcActivity.createActivity(
                                      {
                                        type:
                                          endorsementModel.value > 0
                                            ? "activity.post.endorsement.copied"
                                            : "activity.post.opposition.copied",
                                        userId: endorsementModel.user_id,
                                        domainId: toDomain.id,
                                        groupId: newPost.group_id,
                                        postId: newPost.id,
                                        access:
                                          models.AcActivity.ACCESS_PRIVATE,
                                      },
                                      function (error) {
                                        endorsementCallback(error);
                                      }
                                    );
                                  } else {
                                    endorsementCallback();
                                  }
                                })
                                .catch((error) => {
                                  endorsementCallback(error);
                                });
                            },
                            function (error) {
                              postSeriesCallback(error);
                            }
                          );
                        });
                      } else {
                        postSeriesCallback();
                      }
                    },
                    (postSeriesCallback) => {
                      if (!options.skipEndorsementQualitiesAndRatings) {
                        models.Rating.findAll({
                          where: {
                            post_id: oldPost.id,
                          },
                        }).then(function (ratings) {
                          async.eachSeries(
                            ratings,
                            function (rating, ratingCallback) {
                              var ratingJson = JSON.parse(
                                JSON.stringify(rating.toJSON())
                              );
                              delete rating.id;
                              var ratingModel =
                                models.Endorsement.build(ratingJson);
                              ratingModel.set("post_id", newPost.id);
                              ratingModel.set("PostId", newPost.id);
                              ratingModel
                                .save()
                                .then(function () {
                                  if (options && options.createCopyActivities) {
                                    models.AcActivity.createActivity(
                                      {
                                        type: "activity.post.rating.copied",
                                        userId: ratingModel.user_id,
                                        domainId: toDomain.id,
                                        groupId: newPost.group_id,
                                        postId: newPost.id,
                                        access:
                                          models.AcActivity.ACCESS_PRIVATE,
                                      },
                                      function (error) {
                                        ratingCallback(error);
                                      }
                                    );
                                  } else {
                                    ratingCallback();
                                  }
                                })
                                .catch((error) => {
                                  ratingCallback(error);
                                });
                            },
                            function (error) {
                              postSeriesCallback(error);
                            }
                          );
                        });
                      } else {
                        postSeriesCallback();
                      }
                    },
                    function (postSeriesCallback) {
                      models.PostRevision.findAll({
                        where: {
                          post_id: oldPost.id,
                        },
                      }).then(function (postRevisions) {
                        async.eachSeries(
                          postRevisions,
                          function (postRevision, postRevisionCallback) {
                            var postRevisionJson = JSON.parse(
                              JSON.stringify(postRevision.toJSON())
                            );
                            delete postRevisionJson.id;
                            var newPostRevision =
                              models.PostRevision.build(postRevisionJson);
                            newPostRevision.set("post_id", newPost.id);
                            newPostRevision.set("PostId", newPost.id);
                            newPostRevision
                              .save()
                              .then(function () {
                                postRevisionCallback();
                              })
                              .catch((error) => {
                                postRevisionCallback(error);
                              });
                          },
                          function (error) {
                            postSeriesCallback(error);
                          }
                        );
                      });
                    },
                    function (postSeriesCallback) {
                      if (
                        oldPost.PostUserImages &&
                        oldPost.PostUserImages.length > 0
                      ) {
                        async.eachSeries(
                          oldPost.PostUserImages,
                          function (userImage, userImageCallback) {
                            newPost
                              .addPostUserImage(userImage)
                              .then(function () {
                                userImageCallback();
                              })
                              .catch((error) => {
                                userImageCallback(error);
                              });
                          },
                          function (error) {
                            postSeriesCallback(error);
                          }
                        );
                      } else {
                        postSeriesCallback();
                      }
                    },
                    function (postSeriesCallback) {
                      if (
                        oldPost.PostHeaderImages &&
                        oldPost.PostHeaderImages.length > 0
                      ) {
                        async.eachSeries(
                          oldPost.PostHeaderImages,
                          function (userImage, imageCallback) {
                            newPost
                              .addPostHeaderImage(userImage)
                              .then(function () {
                                imageCallback();
                              })
                              .catch((error) => {
                                imageCallback(error);
                              });
                          },
                          function (error) {
                            postSeriesCallback(error);
                          }
                        );
                      } else {
                        postSeriesCallback();
                      }
                    },
                  ],
                  function (error) {
                    log.info("Have copied post to group id");
                    callback(error);
                  }
                );
              })
              .catch((error) => {
                callback(error);
              });
          }
        });
      },
      function (callback) {
        if (options && options.copyPoints) {
          models.Point.findAll({
            where: {
              post_id: fromPostId,
            },
            include: [
              {
                model: models.Video,
                as: "PointVideos",
                attributes: ["id"],
                required: false,
              },
              {
                model: models.Audio,
                as: "PointAudios",
                attributes: ["id"],
                required: false,
              },
            ],
          }).then(function (pointsIn) {
            async.eachSeries(
              pointsIn,
              function (point, innerSeriesCallback) {
                var pointJson = JSON.parse(JSON.stringify(point.toJSON()));
                var currentOldPoint = point;
                delete pointJson["id"];
                var newPoint = models.Point.build(pointJson);
                newPoint.set("group_id", toGroup.id);
                newPoint.set("community_id", toCommunityId);
                newPoint.set("domain_id", toDomainId);
                newPoint.set("post_id", newPost.id);
                newPoint.set("PostId", newPost.id);
                newPoint.save().then(function () {
                  async.series(
                    [
                      (pointSeriesCallback) => {
                        //cloneTranslationForPoint(point, newPoint, pointSeriesCallback);
                        pointSeriesCallback();
                      },
                      (pointSeriesCallback) => {
                        if (options && options.createCopyActivities) {
                          models.AcActivity.createActivity(
                            {
                              type: "activity.point.copied",
                              userId: newPost.user_id,
                              domainId: toDomain.id,
                              groupId: newPost.group_id,
                              postId: newPost.id,
                              pointId: newPoint.id,
                              access: models.AcActivity.ACCESS_PRIVATE,
                            },
                            function (error) {
                              pointSeriesCallback(error);
                            }
                          );
                        } else {
                          pointSeriesCallback();
                        }
                      },
                      function (pointSeriesCallback) {
                        if (!options.skipEndorsementQualitiesAndRatings) {
                          models.PointQuality.findAll({
                            where: {
                              point_id: currentOldPoint.id,
                            },
                          }).then(function (pointQualities) {
                            async.eachSeries(
                              pointQualities,
                              function (pointQuality, pointQualityCallback) {
                                var pointQualityJson = JSON.parse(
                                  JSON.stringify(pointQuality.toJSON())
                                );
                                delete pointQualityJson.id;
                                var newPointQuality =
                                  models.PointQuality.build(pointQualityJson);
                                newPointQuality.set("point_id", newPoint.id);
                                newPointQuality
                                  .save()
                                  .then(function () {
                                    if (
                                      options &&
                                      options.createCopyActivities
                                    ) {
                                      models.AcActivity.createActivity(
                                        {
                                          type:
                                            newPointQuality.value > 0
                                              ? "activity.point.helpful.copied"
                                              : "activity.point.unhelpful.copied",
                                          userId: newPointQuality.user_id,
                                          domainId: toDomain.id,
                                          groupId: newPost.group_id,
                                          postId: newPost.id,
                                          pointId: newPoint.id,
                                          access:
                                            models.AcActivity.ACCESS_PRIVATE,
                                        },
                                        function (error) {
                                          pointQualityCallback(error);
                                        }
                                      );
                                    } else {
                                      pointQualityCallback();
                                    }
                                  })
                                  .catch((error) => {
                                    pointQualityCallback(error);
                                  });
                              },
                              function (error) {
                                pointSeriesCallback(error);
                              }
                            );
                          });
                        } else {
                          pointSeriesCallback();
                        }
                      },
                      function (pointSeriesCallback) {
                        models.PointRevision.findAll({
                          where: {
                            point_id: currentOldPoint.id,
                          },
                        }).then(function (pointRevisions) {
                          async.eachSeries(
                            pointRevisions,
                            function (pointRevision, pointRevisionCallback) {
                              var pointRevisionJson = JSON.parse(
                                JSON.stringify(pointRevision.toJSON())
                              );
                              delete pointRevisionJson.id;
                              var newPointRevision =
                                models.PointRevision.build(pointRevisionJson);
                              newPointRevision.set("point_id", newPoint.id);
                              newPointRevision
                                .save()
                                .then(function () {
                                  pointRevisionCallback();
                                })
                                .catch((error) => {
                                  pointRevisionCallback(error);
                                });
                            },
                            function (error) {
                              pointSeriesCallback(error);
                            }
                          );
                        });
                      },
                      function (pointSeriesCallback) {
                        if (!options.skipActivities) {
                          models.AcActivity.findAll({
                            where: {
                              point_id: currentOldPoint.id,
                              post_id: { $not: null },
                            },
                          }).then(function (activities) {
                            async.eachSeries(
                              activities,
                              function (activity, activitesSeriesCallback) {
                                skipPointActivitiesIdsForPostCopy.push(
                                  activity.id
                                );
                                var activityJson = JSON.parse(
                                  JSON.stringify(activity.toJSON())
                                );
                                delete activityJson.id;
                                var newActivity =
                                  models.AcActivity.build(activityJson);
                                newActivity.set("group_id", toGroup.id);
                                newActivity.set("community_id", toCommunityId);
                                newActivity.set("domain_id", toDomainId);
                                newActivity.set("point_id", newPoint.id);
                                newActivity
                                  .save()
                                  .then(function (results) {
                                    log.info(
                                      "Have changed group and all activity: " +
                                        newActivity.id
                                    );
                                    activitesSeriesCallback();
                                  })
                                  .catch((error) => {
                                    activitesSeriesCallback(error);
                                  });
                              },
                              function (error) {
                                pointSeriesCallback(error);
                              }
                            );
                          });
                        } else {
                          pointSeriesCallback();
                        }
                      },
                    ],
                    function (error) {
                      innerSeriesCallback(error);
                    }
                  );
                });
              },
              function (error) {
                log.info("Have changed group and all for point");
                callback();
              }
            );
          });
        } else {
          callback();
        }
      },
      function (callback) {
        if (!options.skipActivities) {
          models.AcActivity.findAll({
            where: {
              post_id: oldPost.id,
              point_id: { $is: null },
            },
          })
            .then(function (activities) {
              async.eachSeries(
                activities,
                function (activity, innerSeriesCallback) {
                  var activityJson = JSON.parse(
                    JSON.stringify(activity.toJSON())
                  );
                  delete activityJson.id;
                  var newActivity = models.AcActivity.build(activityJson);
                  newActivity.set("group_id", toGroup.id);
                  newActivity.set("community_id", toCommunityId);
                  newActivity.set("domain_id", toDomainId);
                  newActivity.set("post_id", newPost.id);
                  newActivity.set("PostId", newPost.id);
                  newActivity
                    .save()
                    .then(function (results) {
                      log.info(
                        "Have changed group and all activity: " + newActivity.id
                      );
                      innerSeriesCallback();
                    })
                    .catch((error) => {
                      innerSeriesCallback(error);
                    });
                },
                function (error) {
                  callback(error);
                }
              );
            })
            .catch((error) => {
              callback(error);
            });
        } else {
          callback();
        }
      },
    ],
    function (error) {
      log.info("Done copying post id " + fromPostId);
      if (error) log.error(error);
      done(error, newPost);
    }
  );
};

const copyGroup = (fromGroupId, toCommunityIn, toDomainId, options, done) => {
  let toCommunity;
  let toDomain;
  let newGroup;
  let oldGroup;

  async.series(
    [
      (callback) => {
        models.Community.findOne({
          where: {
            id: toCommunityIn.id,
          },
          attributes: ["id"],
          include: [
            {
              model: models.Domain,
              attributes: ["id", "theme_id", "name"],
            },
          ],
        }).then((communityIn) => {
          toCommunity = communityIn;
          toDomain = communityIn.Domain.id;
          toDomain = communityIn.Domain;
          callback();
        });
      },
      (callback) => {
        var groupIncludes = [
          {
            model: models.Community,
            attributes: [
              "id",
              "theme_id",
              "name",
              "access",
              "google_analytics_code",
              "configuration",
            ],
            include: [
              {
                model: models.Domain,
                attributes: ["id", "theme_id", "name"],
              },
            ],
          },
          {
            model: models.Category,
            required: false,
            include: [
              {
                model: models.Image,
                required: false,
                as: "CategoryIconImages",
                attributes: ["id"],
              },
            ],
          },
          {
            model: models.User,
            attributes: ["id"],
            as: "GroupAdmins",
            required: false,
          },
          {
            model: models.Image,
            as: "GroupLogoImages",
            attributes: models.Image.defaultAttributesPublic,
            required: false,
          },
          {
            model: models.Video,
            as: "GroupLogoVideos",
            attributes: ["id", "formats", "viewable", "public_meta"],
            required: false,
          },
          {
            model: models.Image,
            as: "GroupHeaderImages",
            attributes: models.Image.defaultAttributesPublic,
            required: false,
          },
        ];

        if (!options.skipUsers) {
          groupIncludes.push({
            model: models.User,
            attributes: ["id"],
            as: "GroupUsers",
            required: false,
          });
        }

        models.Group.findOne({
          where: {
            id: fromGroupId,
          },
          include: groupIncludes,
        })
          .then(function (groupIn) {
            oldGroup = groupIn;
            var groupJson = JSON.parse(JSON.stringify(oldGroup.toJSON()));
            delete groupJson["id"];
            newGroup = models.Group.build(groupJson);
            newGroup.set("community_id", toCommunity.id);

            if (options.setInGroupFolderId) {
              newGroup.set("in_group_folder_id", options.setInGroupFolderId);
            }

            if (options.skipUsers) {
              newGroup.set("counter_users", 0);
            }

            if (!options.copyPoints) {
              newGroup.set("counter_points", 0);
            }

            if (!options.copyPosts) {
              newGroup.set("counter_posts", 0);
            }

            newGroup.save().then(function () {
              async.series(
                [
                  (groupSeriesCallback) => {
                    clonePagesForGroup(oldGroup, newGroup, groupSeriesCallback);
                  },
                  (groupSeriesCallback) => {
                    cloneTranslationForGroup(
                      oldGroup,
                      newGroup,
                      groupSeriesCallback
                    );
                  },
                  (groupSeriesCallback) => {
                    if (oldGroup.is_group_folder) {
                      models.Group.findAll({
                        where: {
                          in_group_folder_id: oldGroup.id,
                        },
                        attributes: ["id", "in_group_folder_id"],
                      })
                        .then((groupsInFolder) => {
                          async.eachSeries(
                            groupsInFolder,
                            function (groupInFolder, groupInFolderCallback) {
                              copyGroup(
                                groupInFolder.id,
                                toCommunity,
                                toDomainId,
                                {
                                  ...JSON.parse(JSON.stringify(options)),
                                  setInGroupFolderId: newGroup.id,
                                },
                                (recursiveError, nestedNewGroup) => {
                                  if (recursiveError) {
                                    return groupInFolderCallback(recursiveError);
                                  }
                                  groupInFolderCallback();
                                }
                              );
                            },
                            (error) => {
                              groupSeriesCallback(error);
                            }
                          );
                        })
                        .catch((error) => {
                          groupSeriesCallback(error);
                        });
                    } else {
                      groupSeriesCallback();
                    }
                  },
                  (groupSeriesCallback) => {
                    if (
                      options.deepCopyLinks &&
                      oldGroup.configuration &&
                      oldGroup.configuration.actAsLinkToCommunityId
                    ) {
                      copyCommunity(
                        oldGroup.configuration.actAsLinkToCommunityId,
                        toDomainId,
                        options,
                        { id: toCommunityIn.id, name: toCommunityIn.name },
                        (error, newCommunity) => {
                          if (error) {
                            groupSeriesCallback(error);
                          } else {
                            newGroup.set(
                              "configuration.actAsLinkToCommunityId",
                              newCommunity.id
                            );
                            newGroup.save().then(function () {
                              groupSeriesCallback();
                            });
                          }
                        }
                      );
                    } else {
                      groupSeriesCallback();
                    }
                  },
                  (groupSeriesCallback) => {
                    if (
                      oldGroup.GroupLogoImages &&
                      oldGroup.GroupLogoImages.length > 0
                    ) {
                      async.eachSeries(
                        oldGroup.GroupLogoImages,
                        function (image, mediaCallback) {
                          newGroup
                            .addGroupLogoImage(image)
                            .then(function () {
                              mediaCallback();
                            })
                            .catch((error) => {
                              mediaCallback(error);
                            });
                        },
                        function (error) {
                          groupSeriesCallback(error);
                        }
                      );
                    } else {
                      groupSeriesCallback();
                    }
                  },
                  (groupSeriesCallback) => {
                    if (
                      oldGroup.GroupHeaderImages &&
                      oldGroup.GroupHeaderImages.length > 0
                    ) {
                      async.eachSeries(
                        oldGroup.GroupHeaderImages,
                        function (image, mediaCallback) {
                          newGroup
                            .addGroupHeaderImage(image)
                            .then(function () {
                              mediaCallback();
                            })
                            .catch((error) => {
                              mediaCallback(error);
                            });
                        },
                        function (error) {
                          groupSeriesCallback(error);
                        }
                      );
                    } else {
                      groupSeriesCallback();
                    }
                  },
                  (groupSeriesCallback) => {
                    if (
                      oldGroup.GroupLogoVideos &&
                      oldGroup.GroupLogoVideos.length > 0
                    ) {
                      async.eachSeries(
                        oldGroup.GroupLogoVideos,
                        function (image, mediaCallback) {
                          newGroup
                            .addGroupLogoVideo(image)
                            .then(function () {
                              mediaCallback();
                            })
                            .catch((error) => {
                              mediaCallback(error);
                            });
                        },
                        function (error) {
                          groupSeriesCallback(error);
                        }
                      );
                    } else {
                      groupSeriesCallback();
                    }
                  },
                  (groupSeriesCallback) => {
                    if (
                      oldGroup.GroupAdmins &&
                      oldGroup.GroupAdmins.length > 0
                    ) {
                      async.eachSeries(
                        oldGroup.GroupAdmins,
                        function (admin, adminCallback) {
                          newGroup
                            .addGroupAdmin(admin)
                            .then(function () {
                              adminCallback();
                            })
                            .catch((error) => {
                              adminCallback(error);
                            });
                        },
                        function (error) {
                          groupSeriesCallback(error);
                        }
                      );
                    } else {
                      groupSeriesCallback();
                    }
                  },
                  (groupSeriesCallback) => {
                    if (oldGroup.GroupUsers && oldGroup.GroupUsers.length > 0) {
                      async.eachSeries(
                        oldGroup.GroupUsers,
                        function (user, userCallback) {
                          newGroup
                            .addGroupUser(user)
                            .then(function () {
                              userCallback();
                            })
                            .catch((error) => {
                              userCallback(error);
                            });
                        },
                        function (error) {
                          groupSeriesCallback(error);
                        }
                      );
                    } else {
                      groupSeriesCallback();
                    }
                  },
                  (groupSeriesCallback) => {
                    if (oldGroup.Categories && oldGroup.Categories.length > 0) {
                      async.eachSeries(
                        oldGroup.Categories,
                        function (category, categoryCallback) {
                          const newCategoryJson = JSON.parse(
                            JSON.stringify(category.toJSON())
                          );
                          delete newCategoryJson.id;
                          const newCategoryModel =
                            models.Category.build(newCategoryJson);
                          newCategoryModel.set("group_id", newGroup.id);
                          newCategoryModel
                            .save()
                            .then(() => {
                              if (
                                category.CategoryIconImages &&
                                category.CategoryIconImages.length > 0
                              ) {
                                async.eachSeries(
                                  category.CategoryIconImages,
                                  (image, categoryImageCallBack) => {
                                    newCategoryModel
                                      .addCategoryIconImage(image)
                                      .then(() => {
                                        categoryImageCallBack();
                                      })
                                      .catch((error) => {
                                        categoryImageCallBack(error);
                                      });
                                  },
                                  (error) => {
                                    categoryCallback(error);
                                  }
                                );
                              } else {
                                categoryCallback();
                              }
                            })
                            .catch((error) => {
                              categoryCallback(error);
                            });
                        },
                        (error) => {
                          groupSeriesCallback(error);
                        }
                      );
                    } else {
                      groupSeriesCallback();
                    }
                  },
                  (groupSeriesCallback) => {
                    if (options && options.copyPosts === true) {
                      models.Post.findAll({
                        where: {
                          group_id: oldGroup.id,
                        },
                        attributes: ["id"],
                      })
                        .then((posts) => {
                          async.eachSeries(
                            posts,
                            function (post, postCallback) {
                              copyPost(
                                post.id,
                                newGroup.id,
                                options,
                                postCallback
                              );
                            },
                            function (error) {
                              groupSeriesCallback(error);
                            }
                          );
                        })
                        .catch((error) => {
                          groupSeriesCallback(error);
                        });
                    } else {
                      groupSeriesCallback();
                    }
                  },
                  (groupSeriesCallback) => {
                    if (options.recountGroupPosts) {
                      models.Post.count({
                        where: {
                          group_id: newGroup.id,
                        },
                      })
                        .then((count) => {
                          newGroup.set("counter_posts", count);
                          newGroup.save().then(function () {
                            groupSeriesCallback();
                          });
                        })
                        .catch((error) => {
                          groupSeriesCallback(error);
                        });
                    } else {
                      groupSeriesCallback();
                    }
                  },
                ],
                function (error) {
                  log.info("Have copied post to group id");
                  callback(error);
                }
              );
            });
          })
          .catch(function (error) {
            callback(error);
          });
      },
    ],
    function (error) {
      log.info("Done copying group");
      if (error) log.error(error);
      done(error, newGroup);
    }
  );
};

const copyCommunity = (
  fromCommunityId,
  toDomainId,
  options,
  linkFromOptions,
  done
) => {
  let toDomain;
  let newCommunity = null;
  let oldCommunity;
  const groupMapping = new Map();

  async.series(
    [
      (callback) => {
        models.Domain.findOne({
          where: {
            id: toDomainId,
          },
          attributes: ["id"],
        })
          .then((domainIn) => {
            toDomain = domainIn;
            callback();
          })
          .catch((error) => {
            callback(error);
          });
      },
      (callback) => {
        var communityIncludes = [
          {
            model: models.Domain,
            attributes: ["id", "theme_id", "name"],
          },
          {
            model: models.User,
            attributes: ["id"],
            as: "CommunityAdmins",
            required: false,
          },
          {
            model: models.Image,
            as: "CommunityLogoImages",
            attributes: models.Image.defaultAttributesPublic,
            required: false,
          },
          {
            model: models.Video,
            as: "CommunityLogoVideos",
            attributes: ["id", "formats", "viewable", "public_meta"],
            required: false,
          },
          {
            model: models.Image,
            as: "CommunityHeaderImages",
            attributes: models.Image.defaultAttributesPublic,
            required: false,
          },
        ];

        if (!options.skipUsers) {
          communityIncludes.push({
            model: models.User,
            attributes: ["id"],
            as: "CommunityUsers",
            required: false,
          });
        }

        models.Community.findOne({
          where: {
            id: fromCommunityId,
          },
          include: communityIncludes,
        })
          .then(function (communityIn) {
            oldCommunity = communityIn;
            var communityJson = JSON.parse(
              JSON.stringify(oldCommunity.toJSON())
            );
            delete communityJson["id"];
            newCommunity = models.Community.build(communityJson);
            newCommunity.set("domain_id", toDomain.id);

            if (options.skipUsers) {
              newCommunity.set("counter_users", 0);
            }

            if (linkFromOptions) {
              newCommunity.set(
                "configuration.customBackURL",
                `/community/${linkFromOptions.id}`
              );
              newCommunity.set(
                "configuration.customBackName",
                linkFromOptions.name
              );
            }

            if (newCommunity.hostname) {
              newCommunity.set("hostname", newCommunity.hostname + "-copy");
            }

            newCommunity.set(
              "configuration.useAsTemplate",
              false
            );

            newCommunity.save().then(function () {
              async.series(
                [
                  (communitySeriesCallback) => {
                    clonePagesForCommunity(
                      oldCommunity,
                      newCommunity,
                      communitySeriesCallback
                    );
                  },
                  (communitySeriesCallback) => {
                    cloneTranslationForCommunity(
                      oldCommunity,
                      newCommunity,
                      communitySeriesCallback
                    );
                  },
                  (communitySeriesCallback) => {
                    if (
                      oldCommunity.CommunityLogoImages &&
                      oldCommunity.CommunityLogoImages.length > 0
                    ) {
                      async.eachSeries(
                        oldCommunity.CommunityLogoImages,
                        function (image, mediaCallback) {
                          newCommunity
                            .addCommunityLogoImage(image)
                            .then(function () {
                              mediaCallback();
                            })
                            .catch((error) => {
                              mediaCallback(error);
                            });
                        },
                        function (error) {
                          communitySeriesCallback(error);
                        }
                      );
                    } else {
                      communitySeriesCallback();
                    }
                  },
                  (communitySeriesCallback) => {
                    if (
                      oldCommunity.CommunityHeaderImages &&
                      oldCommunity.CommunityHeaderImages.length > 0
                    ) {
                      async.eachSeries(
                        oldCommunity.CommunityHeaderImages,
                        function (image, mediaCallback) {
                          newCommunity
                            .addCommunityHeaderImage(image)
                            .then(function () {
                              mediaCallback();
                            })
                            .catch((error) => {
                              mediaCallback(error);
                            });
                        },
                        function (error) {
                          communitySeriesCallback(error);
                        }
                      );
                    } else {
                      communitySeriesCallback();
                    }
                  },
                  (communitySeriesCallback) => {
                    if (
                      oldCommunity.CommunityLogoVideos &&
                      oldCommunity.CommunityLogoVideos.length > 0
                    ) {
                      async.eachSeries(
                        oldCommunity.CommunityLogoVideos,
                        function (image, mediaCallback) {
                          newCommunity
                            .addCommunityLogoVideo(image)
                            .then(function () {
                              mediaCallback();
                            })
                            .catch((error) => {
                              mediaCallback(error);
                            });
                        },
                        function (error) {
                          communitySeriesCallback(error);
                        }
                      );
                    } else {
                      communitySeriesCallback();
                    }
                  },
                  (communitySeriesCallback) => {
                    if (
                      oldCommunity.CommunityAdmins &&
                      oldCommunity.CommunityAdmins.length > 0
                    ) {
                      async.eachSeries(
                        oldCommunity.CommunityAdmins,
                        function (admin, adminCallback) {
                          newCommunity
                            .addCommunityAdmin(admin)
                            .then(function () {
                              adminCallback();
                            })
                            .catch((error) => {
                              adminCallback(error);
                            });
                        },
                        function (error) {
                          communitySeriesCallback(error);
                        }
                      );
                    } else {
                      communitySeriesCallback();
                    }
                  },
                  (communitySeriesCallback) => {
                    if (
                      oldCommunity.CommunityUsers &&
                      oldCommunity.CommunityUsers.length > 0
                    ) {
                      async.eachSeries(
                        oldCommunity.CommunityUsers,
                        function (user, userCallback) {
                          newCommunity
                            .addCommunityUser(user)
                            .then(function () {
                              userCallback();
                            })
                            .catch((error) => {
                              userCallback(error);
                            });
                        },
                        function (error) {
                          communitySeriesCallback(error);
                        }
                      );
                    } else {
                      communitySeriesCallback();
                    }
                  },
                  (communitySeriesCallback) => {
                    if (
                      options &&
                      (options.copyGroups === true || options.copyOneGroupId)
                    ) {
                      let whereOptions = {
                        community_id: oldCommunity.id,
                        in_group_folder_id: {
                          $eq: null,
                        },
                      };

                      if (options.copyOneGroupId) {
                        whereOptions = {
                          ...whereOptions,
                          id: options.copyOneGroupId,
                        };
                      }
                      models.Group.findAll({
                        where: whereOptions,
                        attributes: ["id"],
                      })
                        .then((groups) => {
                          async.eachSeries(
                            groups,
                            function (group, groupCallback) {
                              copyGroup(
                                group.id,
                                newCommunity,
                                toDomainId,
                                options,
                                (error, newGroup) => {
                                  if (!error && newGroup) {
                                    groupMapping.set(group.id, newGroup.id);
                                  }
                                  groupCallback(error);
                                }
                              );
                            },
                            function (error) {
                              communitySeriesCallback(error);
                            }
                          );
                        })
                        .catch((error) => {
                          communitySeriesCallback(error);
                        });
                    } else {
                      communitySeriesCallback();
                    }
                  },
                ],
                function (error) {
                  log.info("Have copied community");
                  callback(error);
                }
              );
            });
          })
          .catch(function (error) {
            callback(error);
          });
      },
    ],
    function (error) {
      log.info("Done copying community", newCommunity);
      if (error) {
        log.error(error);
        done(error);
      } else {
        models.Group.count({
          where: {
            community_id: newCommunity.id,
          },
        })
          .then((count) => {
            newCommunity
              .update({
                counter_groups: count,
              })
              .then(() => {
                newCommunity.groupMapping = groupMapping;

                done(
                  error,
                  typeof newCommunity != "undefined" ? newCommunity : null
                );
              })
              .catch((error) => {
                done(error);
              });
          })
          .catch((error) => {
            done(error);
          });
      }
    }
  );
};

const copyCommunityWithEverything = (
  communityId,
  toDomainId,
  options,
  done
) => {
  copyCommunity(
    communityId,
    toDomainId,
    {
      copyGroups: true,
      copyPosts: true,
      copyPoints: true,
    },
    null,
    (error, newCommunity) => {
      if (newCommunity) log.info(newCommunity.id);
      if (error) {
        log.error(error);
        done(error, newCommunity);
      } else {
        //log.info("Done for new community "+ńewCommunity.id);
        done(null, newCommunity);
      }
    }
  );
};

const deepCopyCommunityOnlyStructureWithAdminsAndPosts = (
  communityId,
  toDomainId,
  done
) => {
  copyCommunity(
    communityId,
    toDomainId,
    {
      copyGroups: true,
      copyPosts: true,
      copyPoints: false,
      recountGroupPosts: true,
      deepCopyLinks: true,
      skipUsers: true,
      skipEndorsementQualitiesAndRatings: true,
      resetEndorsementCounters: true,
      skipActivities: true,
    },
    null,
    (error, newCommunity) => {
      if (newCommunity) log.info(newCommunity.id);
      if (error) {
        log.error(error);
        done(error, newCommunity);
      } else {
        //log.info("Done for new community "+ńewCommunity.id);
        done(null, newCommunity);
      }
    }
  );
};

const copyCommunityNoUsersNoEndorsementsNoPoints = (
  communityId,
  toDomainId,
  done
) => {
  copyCommunity(
    communityId,
    toDomainId,
    {
      copyGroups: true,
      copyPosts: true,
      copyPoints: false,
      skipUsers: true,
      skipEndorsementQualitiesAndRatings: true,
      resetEndorsementCounters: true,
      skipActivities: true,
    },
    null,
    (error, newCommunity) => {
      if (newCommunity) log.info(newCommunity.id);
      if (error) {
        log.error(error);
        done(error, newCommunity);
      } else {
        recountCommunity(newCommunity.id, (recountError) => {
          if (recountError) {
            log.error(error);
            done(recountError, newCommunity);
          } else {
            done(null, newCommunity);
          }
        });
      }
    }
  );
};

const copyCommunityNoUsersNoEndorsements = (communityId, toDomainId, done) => {
  copyCommunity(
    communityId,
    toDomainId,
    {
      copyGroups: true,
      copyPosts: true,
      copyPoints: true,
      skipUsers: true,
      skipEndorsementQualitiesAndRatings: true,
      resetEndorsementCounters: true,
      skipActivities: true,
    },
    null,
    (error, newCommunity) => {
      if (newCommunity) log.info(newCommunity.id);
      if (error) {
        log.error(error);
        done(error, newCommunity);
      } else {
        //log.info("Done for new community "+ńewCommunity.id);
        done(null, newCommunity);
      }
    }
  );
};

const copyCommunityNoUsersNoEndorsementsOneGroup = (
  communityId,
  groupId,
  toDomainId,
  done
) => {
  copyCommunity(
    communityId,
    toDomainId,
    {
      copyOneGroupId: groupId,
      copyPosts: true,
      copyPoints: true,
      skipUsers: true,
      skipEndorsementQualitiesAndRatings: true,
      resetEndorsementCounters: true,
      skipActivities: true,
    },
    null,
    (error, newCommunity) => {
      if (newCommunity) log.info(newCommunity.id);
      if (error) {
        log.error(error);
        done(error, newCommunity);
      } else {
        //log.info("Done for new community "+ńewCommunity.id);
        done(null, newCommunity);
      }
    }
  );
};

const copyCommunityOnlyGroups = (communityId, toDomainId, done) => {
  copyCommunity(
    communityId,
    toDomainId,
    {
      copyGroups: true,
      copyPosts: false,
      copyPoints: false,
      skipUsers: true,
      recountGroupPosts: true,
      skipEndorsementQualitiesAndRatings: true,
      resetEndorsementCounters: true,
      skipActivities: true,
    },
    null,
    (error, newCommunity) => {
      if (newCommunity) log.info(newCommunity.id);
      if (error) {
        log.error(error);
        done(error, newCommunity);
      } else {
        //log.info("Done for new community "+ńewCommunity.id);
        done(null, newCommunity);
      }
    }
  );
};

module.exports = {
  copyCommunityNoUsersNoEndorsementsOneGroup,
  copyCommunityNoUsersNoEndorsements,
  copyCommunityNoUsersNoEndorsementsNoPoints,
  copyCommunityWithEverything,
  clonePagesForGroup,
  deepCopyCommunityOnlyStructureWithAdminsAndPosts,
  clonePagesForCommunity,
  copyCommunity,
  copyCommunityOnlyGroups,
  copyGroup,
  copyPost,
};
