"use strict";

const async = require("async");
const queue = require("../services/workers/queue.cjs");
const _ = require("lodash");
const log = require("../utils/logger.cjs");

module.exports = (sequelize, DataTypes) => {
  const Group = sequelize.define(
    "Group",
    {
      name: { type: DataTypes.STRING, allowNull: false },
      access: { type: DataTypes.INTEGER, allowNull: false },
      deleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      google_analytics_code: { type: DataTypes.STRING, allowNull: true },
      objectives: DataTypes.TEXT,
      message_for_new_idea: DataTypes.TEXT,
      message_to_users: DataTypes.TEXT,
      is_group_folder: { type: DataTypes.BOOLEAN, defaultValue: false },
      in_group_folder_id: { type: DataTypes.INTEGER, defaultValue: null },
      weight: { type: DataTypes.INTEGER, defaultValue: 0 },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "active",
      },
      counter_posts: { type: DataTypes.INTEGER, defaultValue: 0 },
      counter_points: { type: DataTypes.INTEGER, defaultValue: 0 },
      counter_users: { type: DataTypes.INTEGER, defaultValue: 0 },
      counter_flags: { type: DataTypes.INTEGER, defaultValue: 0 },
      theme_id: { type: DataTypes.INTEGER, defaultValue: null },
      configuration: DataTypes.JSONB,
      private_access_configuration: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      language: { type: DataTypes.STRING, allowNull: true },
      data: DataTypes.JSONB,
    },
    {
      defaultScope: {
        where: {
          deleted: false,
        },
      },

      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",

      underscored: true,

      tableName: "groups",

      indexes: [
        {
          fields: ["name"],
          where: {
            deleted: false,
          },
        },
        {
          fields: ["id", "deleted"],
        },
        {
          fields: ['private_access_configuration'],
          using: 'gin',
          operator: 'jsonb_path_ops'
        },
        {
          fields: ['configuration'],
          using: 'gin',
          operator: 'jsonb_path_ops'
        },
        {
          name: "groups_idx_counter_users",
          fields: ["counter_users"],
        },
        {
          name: "groups_idx_counter_users_community_id_access_deleted",
          fields: ["counter_users", "community_id", "access", "deleted"],
        },
        {
          fields: ["community_id", "deleted", "in_group_folder_id"],
        },
        {
          fields: ["community_id", "deleted", "in_group_folder_id", "status"],
        },
        {
          fields: ["community_id", "deleted", "is_group_folder"],
        },
        {
          fields: ["community_id", "deleted", "is_group_folder", "access"],
        },
        {
          fields: ["deleted", "in_group_folder_id", "status", "access"],
        },
        {
          fields: [
            "community_id",
            "deleted",
            "in_group_folder_id",
            "status",
            "access",
          ],
        },
        {
          name: "ComDelComAccCountStatInGroup",
          fields: [
            "deleted",
            "community_id",
            "access",
            "counter_users",
            "status",
            "in_group_folder_id",
          ],
        },
        {
          fields: ["id", "deleted", "is_group_folder"],
        },
        {
          fields: ["deleted", "is_group_folder"],
        },
        {
          fields: ["id", "deleted", "in_group_folder_id"],
        },
        {
          fields: ["deleted", "in_group_folder_id"],
        },
      ],
    }
  );

  Group.associate = (models) => {
    Group.hasMany(models.Post, { foreignKey: "group_id" });
    Group.hasMany(models.Point, { foreignKey: "group_id" });
    Group.hasMany(models.Endorsement, { foreignKey: "group_id" });
    Group.hasMany(models.Category, { foreignKey: "group_id" });
    Group.belongsTo(models.Community, { foreignKey: "community_id" });
    Group.belongsTo(models.IsoCountry, { foreignKey: "iso_country_id" });
    Group.belongsTo(models.User, { foreignKey: "user_id" });
    Group.hasMany(models.Group, {
      as: "GroupFolders",
      foreignKey: "in_group_folder_id",
    });
    Group.belongsTo(models.Group, {
      as: "GroupFolder",
      foreignKey: "in_group_folder_id",
    });
    Group.belongsToMany(models.Image, { through: "GroupImage" });
    Group.belongsToMany(models.Video, {
      as: "GroupLogoVideos",
      through: "GroupLogoVideo",
    });
    Group.belongsToMany(models.Image, {
      as: "GroupLogoImages",
      through: "GroupLogoImage",
    });
    Group.belongsToMany(models.Video, {
      as: "GroupHtmlVideos",
      through: "GroupHtmlVideo",
    });
    Group.belongsToMany(models.Image, {
      as: "GroupHtmlImages",
      through: "GroupHtmlImage",
    });
    Group.belongsToMany(models.Image, {
      as: "GroupHeaderImages",
      through: "GroupHeaderImage",
    });
    Group.belongsToMany(models.User, {
      as: "GroupUsers",
      through: "GroupUser",
    });
    Group.belongsToMany(models.User, {
      as: "GroupAdmins",
      through: "GroupAdmin",
    });
    Group.belongsToMany(models.User, {
      as: "GroupPromoters",
      through: "GroupPromoter",
    });
    Group.hasMany(models.Campaign);
  };

  Group.ACCESS_PUBLIC = 0;
  Group.ACCESS_CLOSED = 1;
  Group.ACCESS_SECRET = 2;
  Group.ACCESS_OPEN_TO_COMMUNITY = 3;

  Group.defaultAttributesPublic = [
    "id",
    "name",
    "access",
    "google_analytics_code",
    "is_group_folder",
    "in_group_folder_id",
    "status",
    "weight",
    "theme_id",
    "community_id",
    "created_at",
    "updated_at",
    "configuration",
    "language",
    "objectives",
    "counter_posts",
    "counter_points",
    "counter_users",
    "user_id",
  ];

  Group.masterGroupIncludes = (models) => {
    return [
      {
        model: models.Community,
        required: false,
        attributes: [
          "id",
          "theme_id",
          "name",
          "access",
          "google_analytics_code",
          "configuration",
          "only_admins_can_create_groups",
        ],
        include: [
          {
            model: models.Domain,
            attributes: ["id", "theme_id", "name"],
          },
        ],
      },
      {
        model: models.Group,
        required: false,
        as: "GroupFolder",
        attributes: ["id", "name"],
      },
      {
        model: models.Category,
        required: false,
        attributes: ["id", "name"],
        include: [
          {
            model: models.Image,
            required: false,
            as: "CategoryIconImages",
            attributes: models.Image.defaultAttributesPublic,
            order: [
              [
                { model: models.Image, as: "CategoryIconImages" },
                "updated_at",
                "asc",
              ],
            ],
          },
        ],
      },
      {
        model: models.Image,
        as: "GroupLogoImages",
        attributes: models.Image.defaultAttributesPublic,
        required: false,
      },
      {
        model: models.Image,
        as: "GroupHeaderImages",
        attributes: models.Image.defaultAttributesPublic,
        required: false,
      },
    ];
  };

  Group.addVideosAndCommunityLinksToGroups = (groups, done) => {
    const linkedCommunityIds = [];
    const linkedCommunityIdToGroupIndex = {};
    const groupsHash = {};
    const collectedGroupIds = [];

    for (let g = 0; g < groups.length; g++) {
      if (
        groups[g].configuration &&
        groups[g].configuration.actAsLinkToCommunityId
      ) {
        linkedCommunityIds.push(groups[g].configuration.actAsLinkToCommunityId);
        linkedCommunityIdToGroupIndex[
          groups[g].configuration.actAsLinkToCommunityId
        ] = g;
      }
      groupsHash[groups[g].id] = groups[g];
      collectedGroupIds.push(groups[g].id);
    }

    async.series(
      [
        (seriesCallback) => {
          //TODO: Limit then number of VideoImages to 1 - there is one very 10 sec
          sequelize.models.Video.findAll({
            attributes: [
              "id",
              "formats",
              "viewable",
              "public_meta",
              "created_at",
            ],
            include: [
              {
                model: sequelize.models.Image,
                as: "VideoImages",
                attributes: ["formats", "created_at"],
                required: false,
              },
              {
                model: sequelize.models.Group,
                where: {
                  id: {
                    $in: collectedGroupIds,
                  },
                },
                as: "GroupLogoVideos",
                required: true,
                attributes: ["id"],
              },
            ],
            order: [
              [
                { model: sequelize.models.Image, as: "VideoImages" },
                "created_at",
                "asc",
              ],
            ],
          })
            .then((videos) => {
              if (videos) {
                videos = _.orderBy(videos, ["created_at"], ["asc"]);

                for (let v = 0; v < videos.length; v++) {
                  const groupId = videos[v].GroupLogoVideos[0].id;
                  if (groupId) {
                    groupsHash[groupId].dataValues.GroupLogoVideos = [
                      videos[v],
                    ];
                    groupsHash[groupId].GroupLogoVideos = [videos[v]];
                  } else {
                    log.warn("Not finding group id in hash");
                  }
                }
                seriesCallback();
              } else {
                seriesCallback();
              }
            })
            .catch((error) => {
              seriesCallback(error);
            });
        },

        (seriesCallback) => {
          if (linkedCommunityIds.length > 0) {
            sequelize.models.Community.findAll({
              where: {
                id: { $in: linkedCommunityIds },
              },
              attributes: [
                "id",
                "name",
                "description",
                "counter_posts",
                "counter_points",
                "counter_users",
                "language",
              ],
              order: [
                [
                  { model: sequelize.models.Image, as: "CommunityLogoImages" },
                  "created_at",
                  "asc",
                ],
              ],
              include: [
                {
                  model: sequelize.models.Image,
                  as: "CommunityLogoImages",
                  attributes: sequelize.models.Image.defaultAttributesPublic,
                  required: false,
                },
              ],
            })
              .then((communities) => {
                async.eachOfLimit(
                  communities,
                  20,
                  (community, eachIndex, forEachVideoCallback) => {
                    const index = linkedCommunityIdToGroupIndex[community.id];
                    if (groups[index].dataValues) {
                      groups[index].dataValues.CommunityLink = community;
                    } else {
                      groups[index].CommunityLink = community;
                    }
                    sequelize.models.Community.addVideosToCommunity(
                      community,
                      forEachVideoCallback
                    );
                  },
                  (error) => {
                    seriesCallback(error);
                  }
                );
              })
              .catch((error) => {
                seriesCallback(error);
              });
          } else {
            seriesCallback();
          }
        },
      ],
      (error) => {
        done(error);
      }
    );
  };

  Group.addUserToGroupIfNeeded = (groupId, req, done) => {
    sequelize.models.Group.findOne({
      where: { id: groupId },
      attributes: [
        "id",
        "community_id",
        "counter_users",
        "name",
        "in_group_folder_id",
      ],
    }).then((group) => {
      if (
        group &&
        group.name !== "hidden_public_group_for_domain_level_points"
      ) {
        group.hasGroupUser(req.user).then((result) => {
          if (!result) {
            async.parallel(
              [
                (callback) => {
                  group.addGroupUser(req.user).then((result) => {
                    group.increment("counter_users");
                    callback();
                  });
                },
                (callback) => {
                  sequelize.models.Community.findOne({
                    where: { id: group.community_id },
                    attributes: ["id"],
                  }).then((community) => {
                    if (community) {
                      community.hasCommunityUser(req.user).then((result) => {
                        if (result) {
                          callback();
                        } else {
                          community
                            .addCommunityUser(req.user)
                            .then((result) => {
                              community.increment("counter_users");
                              callback();
                            });
                        }
                      });
                    } else {
                      callback();
                    }
                  });
                },
                (callback) => {
                  req.ypDomain.hasDomainUser(req.user).then((result) => {
                    if (result) {
                      callback();
                    } else {
                      req.ypDomain.addDomainUser(req.user).then((result) => {
                        req.ypDomain.increment("counter_users");
                        callback();
                      });
                    }
                  });
                },
              ],
              (err) => {
                if (group && group.in_group_folder_id) {
                  queue.add(
                    "delayed-job",
                    {
                      type: "recount-group-folder",
                      groupId: groupId,
                    },
                    "low"
                  );
                }
                done(err);
              }
            );
          } else {
            done();
          }
        });
      } else {
        done();
      }
    });
  };

  Group.convertAccessFromRadioButtons = (body) => {
    let access = 0;
    if (body.public) {
      access = 0;
    } else if (body.closed) {
      access = 1;
    } else if (body.secret) {
      access = 2;
    } else if (body.open_to_community) {
      access = 3;
    }
    return access;
  };

  Group.prototype.simple = function () {
    return { id: this.id, name: this.name };
  };

  Group.prototype.updateAllExternalCounters = function (
    req,
    direction,
    column,
    done
  ) {
    async.parallel(
      [
        (callback) => {
          sequelize.models.Community.findOne({
            where: { id: this.community_id },
          }).then((community) => {
            if (direction === "up") community.increment(column);
            else if (direction === "down") community.decrement(column);
            callback();
          });
        },
        (callback) => {
          if (req.ypDomain) {
            if (direction === "up") req.ypDomain.increment(column);
            else if (direction === "down") req.ypDomain.decrement(column);
            callback();
          } else {
            callback();
          }
        },
        (callback) => {
          if (this.in_group_folder_id) {
            queue.add(
              "delayed-job",
              {
                type: "recount-group-folder",
                groupId: this.id,
              },
              "low"
            );
          }
          callback();
        },
      ],
      (err) => {
        done(err);
      }
    );
  };

  Group.prototype.setupLogoImage = function (req, done) {
    if (req.body.uploadedLogoImageId) {
      sequelize.models.Image.findOne({
        where: { id: req.body.uploadedLogoImageId, user_id: req.user.id },
      }).then((image) => {
        if (image) this.addGroupLogoImage(image);
        else log.error("Image not found for group logo image");
        done();
      });
    } else done();
  };

  Group.prototype.setupHeaderImage = function (req, done) {
    if (req.body.uploadedHeaderImageId) {
      sequelize.models.Image.findOne({
        where: { id: req.body.uploadedHeaderImageId, user_id: req.user.id },
      }).then((image) => {
        if (image) this.addGroupHeaderImage(image);
        else log.error("Image not found for group header image");
        done();
      });
    } else done();
  };

  Group.prototype.setupHtmlMedia = async (req, groupId, done) => {
    log.info("--------------------------> setupHtmlMedia")
    const group = await sequelize.models.Group.findOne({
      where: { id: groupId },
      attributes: ["id"]
    });
    if (req.body.staticHtml) {
      try {
        const staticHtml = JSON.parse(req.body.staticHtml);
        if (staticHtml.media && staticHtml.media.length > 0) {
          for (let i = 0; i < staticHtml.media.length; i++) {
            const media = staticHtml.media[i];
            log.info("--------------------------> group", group)
            log.info("--------------------------------------------------------> media", media);
            if (media.type === "image") {
              const image = await sequelize.models.Image.findOne({
                where: { id: media.id, user_id: req.user.id },
              });
              if (image) {
                if (!(await group.hasGroupHtmlImage(image))) {
                  await group.addGroupHtmlImage(image);
                } else {
                  log.info("Image already associated with group.");
                }
              } else {
                log.error("Image not found for group html image");
              }
            } else if (media.type === "video") {
              const video = await sequelize.models.Video.findOne({
                where: { id: media.id, user_id: req.user.id },
              });
              if (video) {
                if (!(await group.hasGroupHtmlVideo(video))) {
                  await group.addGroupHtmlVideo(video);
                } else {
                  log.info("Video already associated with group.");
                }
              } else {
                log.error("Video not found for group html video");
              }
            }
          }
        } else {
          log.info("--------------------------> No media in staticHtml");
        }
        done();
      } catch (error) {
        log.error("--------------------------> Error parsing staticHtml", error);
        done();
      }
    } else {
      log.info("--------------------------> No staticHtml");
      done();
    }
  };

  Group.prototype.getImageFormatUrl = function (formatId) {
    if (this.GroupLogoImages && this.GroupLogoImages.length > 0) {
      const formats = JSON.parse(
        this.GroupLogoImages[this.GroupLogoImages.length - 1].formats
      );
      if (formats && formats.length > 0) return formats[formatId];
    } else {
      return "";
    }
  };

  Group.prototype.setupImages = function (req, groupId, done) {
    async.parallel(
      [
        (callback) => {
          this.setupLogoImage(req, (err) => {
            if (err) return callback(err);
            callback();
          });
        },
        (callback) => {
          this.setupHeaderImage(req, (err) => {
            if (err) return callback(err);
            callback();
          });
        },
        (callback) => {
          this.setupHtmlMedia(req, groupId, (err) => {
            if (err) return callback(err);
            callback();
          });
        }
      ],
      (err) => {
        done(err);
      }
    );
  };

  Group.prototype.setupModerationData = function () {
    if (!this.data) {
      this.set("data", {});
    }
    if (!this.data.moderation) {
      this.set("data.moderation", {});
    }
  };

  Group.prototype.report = function (req, source, callback) {
    this.setupModerationData();
    async.series(
      [
        (seriesCallback) => {
          if (!this.data.moderation.lastReportedBy) {
            this.set("data.moderation.lastReportedBy", []);
            if (
              (source === "user" || source === "fromUser") &&
              !this.data.moderation.toxicityScore
            ) {
              log.info("process-moderation post toxicity on manual report");
              queue.add(
                "process-moderation",
                {
                  type: "estimate-collection-toxicity",
                  collectionId: this.id,
                  collectionType: "group",
                },
                "high"
              );
            }
          }
          this.set(
            "data.moderation.lastReportedBy",
            [
              {
                date: new Date(),
                source: source,
                userId: req && req.user ? req.user.id : null,
                userEmail: req && req.user ? req.user.email : "anonymous",
              },
            ].concat(this.data.moderation.lastReportedBy)
          );
          this.save()
            .then(() => {
              seriesCallback();
            })
            .catch((error) => {
              seriesCallback(error);
            });
        },
        /* TODO: Finish sending emails to domain admins if needed
        (seriesCallback) => {
             if (req && req.disableNotification===true) {
               seriesCallback();
             } else {
               sequelize.models.AcActivity.createActivity({
                 type: 'activity.report.content',
                 userId: (req && req.user) ? req.user.id : null,
                 postId: null,
                 groupId: this.id,
                 communityId:  this.Community ? this.Community.id : null,
                 domainId:  this.Community ? this.Community.domain_id : null
               }, (error) => {
                 seriesCallback(error);
               });
             }
           }*/
      ],
      (error) => {
        this.increment("counter_flags");
        callback(error);
      }
    );
  };

  return Group;
};
