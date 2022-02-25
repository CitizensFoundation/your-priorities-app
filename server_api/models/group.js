"use strict";

const async = require("async");

module.exports = (sequelize, DataTypes) => {
  const Group = sequelize.define("Group", {
    name: { type: DataTypes.STRING, allowNull: false },
    access: { type: DataTypes.INTEGER, allowNull: false },
    deleted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    google_analytics_code: { type: DataTypes.STRING, allowNull: true },
    objectives: DataTypes.TEXT,
    message_for_new_idea: DataTypes.TEXT,
    message_to_users: DataTypes.TEXT,
    is_group_folder: { type: DataTypes.BOOLEAN, defaultValue: false },
    in_group_folder_id: { type: DataTypes.INTEGER, defaultValue: null },
    weight: { type: DataTypes.INTEGER, defaultValue: 0 },
    status: { type: DataTypes.STRING, allowNull: false, defaultValue: 'active' },
    counter_posts: { type: DataTypes.INTEGER, defaultValue: 0 },
    counter_points: { type: DataTypes.INTEGER, defaultValue: 0 },
    counter_users: { type: DataTypes.INTEGER, defaultValue: 0 },
    counter_flags: { type: DataTypes.INTEGER, defaultValue: 0 },
    theme_id: { type: DataTypes.INTEGER, defaultValue: null },
    configuration: DataTypes.JSONB,
    language: { type: DataTypes.STRING, allowNull: true },
    data: DataTypes.JSONB
  }, {

    defaultScope: {
      where: {
        deleted: false
      }
    },

    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',

    underscored: true,

    tableName: 'groups',

    indexes: [
      {
        fields: ['name'],
        where: {
          deleted: false
        }
      },
      {
        fields: ['id', 'deleted']
      },
      {
        name: 'groups_idx_counter_users',
        fields: ['counter_users']
      },
      {
        name: 'groups_idx_counter_users_community_id_access_deleted',
        fields:['counter_users','community_id','access','deleted']
      },
      {
        fields: ['community_id', 'deleted', 'in_group_folder_id']
      },
      {
        fields: ['community_id', 'deleted', 'in_group_folder_id', 'status']
      },
      {
        fields: ['community_id', 'deleted', 'is_group_folder']
      },
      {
        fields: ['community_id', 'deleted', 'is_group_folder','access']
      },
      {
        fields: ['deleted', 'in_group_folder_id','status', 'access']
      },
      {
        name: 'ComDelComAccCountStatInGroup',
        fields: ['deleted', 'community_id', 'access', 'counter_users', 'status', 'in_group_folder_id']
      },
      {
        fields: ['id', 'deleted', 'is_group_folder']
      },
      {
        fields: ['deleted', 'is_group_folder']
      },
      {
        fields: ['id', 'deleted', 'in_group_folder_id']
      },
      {
        fields: ['deleted', 'in_group_folder_id']
      }
    ],

    // Add following indexes manually for high throughput sites
    // CREATE INDEX groupheaderimage_idx_group_id ON "GroupHeaderImage" (group_id);
    // CREATE INDEX grouplogoimage_idx_group_id ON "GroupLogoImage" (group_id);
    // CREATE INDEX grouplogovideo_idx_group_id ON "GroupLogoVideo" (group_id);
  });

  Group.associate = (models) => {
    Group.hasMany(models.Post, { foreignKey: "group_id" });
    Group.hasMany(models.Point, { foreignKey: "group_id" });
    Group.hasMany(models.Endorsement, { foreignKey: "group_id" });
    Group.hasMany(models.Category, { foreignKey: "group_id" });
    Group.belongsTo(models.Community, { foreignKey: 'community_id'});
    Group.belongsTo(models.IsoCountry, { foreignKey: "iso_country_id" });
    Group.belongsTo(models.User, { foreignKey: 'user_id'});
    Group.hasMany(models.Group, { as: 'GroupFolders', foreignKey: "in_group_folder_id" });
    Group.belongsTo(models.Group, { as: 'GroupFolder', foreignKey: "in_group_folder_id"});
    Group.belongsToMany(models.Image, { through: 'GroupImage' });
    Group.belongsToMany(models.Video, { as: 'GroupLogoVideos', through: 'GroupLogoVideo' });
    Group.belongsToMany(models.Image, { as: 'GroupLogoImages', through: 'GroupLogoImage' });
    Group.belongsToMany(models.Image, { as: 'GroupHeaderImages', through: 'GroupHeaderImage' });
    Group.belongsToMany(models.User, { as: 'GroupUsers', through: 'GroupUser' });
    Group.belongsToMany(models.User, { as: 'GroupAdmins', through: 'GroupAdmin' });
  };

  Group.ACCESS_PUBLIC = 0;
  Group.ACCESS_CLOSED = 1;
  Group.ACCESS_SECRET = 2;
  Group.ACCESS_OPEN_TO_COMMUNITY = 3;

  Group.defaultAttributesPublic = ['id','name','access','google_analytics_code','is_group_folder','in_group_folder_id',
    'status', 'weight','theme_id','community_id','created_at','updated_at','configuration','language','objectives','counter_posts',
    'counter_points','counter_users','user_id'];

  Group.addUserToGroupIfNeeded = (groupId, req, done) => {
    sequelize.models.Group.findOne({
      where: { id: groupId },
      attributes: ['id','community_id','counter_users','name']
    }).then((group) => {
      if (group && group.name!=='hidden_public_group_for_domain_level_points') {
        group.hasGroupUser(req.user).then((result) => {
          if (!result) {
            async.parallel([
              (callback) => {
                group.addGroupUser(req.user).then((result) => {
                  group.increment('counter_users');
                  callback();
                })
              },
              (callback) => {
                sequelize.models.Community.findOne({
                  where: {id: group.community_id},
                  attributes: ['id']
                }).then((community) => {
                  if (community) {
                    community.hasCommunityUser(req.user).then((result) => {
                      if (result) {
                        callback();
                      } else {
                        community.addCommunityUser(req.user).then((result) => {
                          community.increment('counter_users');
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
                      req.ypDomain.increment('counter_users');
                      callback();
                    });
                  }
                });
              }
            ], (err) => {
              done(err);
            });
          } else {
            done();
          }
        });
      } else {
        done();
      }
    })
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

  Group.prototype.updateAllExternalCounters = function (req, direction, column, done) {
    async.parallel([
      (callback) => {
        sequelize.models.Community.findOne({
          where: {id: this.community_id}
        }).then((community) => {
          if (direction==='up')
            community.increment(column);
          else if (direction==='down')
            community.decrement(column);
          callback();
        });
      },
      (callback) => {
        if (req.ypDomain) {
          if (direction==='up')
            req.ypDomain.increment(column);
          else if (direction==='down')
            req.ypDomain.decrement(column);
          callback();
        } else {
          callback();
        }
      }
    ], (err) => {
      done(err);
    });
  };

  Group.prototype.setupLogoImage = function (body, done) {
    if (body.uploadedLogoImageId) {
      sequelize.models.Image.findOne({
        where: {id: body.uploadedLogoImageId}
      }).then((image) => {
        if (image)
          this.addGroupLogoImage(image);
        done();
      });
    } else done();
  };

  Group.prototype.setupHeaderImage = function (body, done) {
    if (body.uploadedHeaderImageId) {
      sequelize.models.Image.findOne({
        where: {id: body.uploadedHeaderImageId}
      }).then((image) => {
        if (image)
          this.addGroupHeaderImage(image);
        done();
      });
    } else done();
  };

  Group.prototype.getImageFormatUrl = function (formatId) {
    if (this.GroupLogoImages && this.GroupLogoImages.length>0) {
      const formats = JSON.parse(this.GroupLogoImages[this.GroupLogoImages.length-1].formats);
      if (formats && formats.length>0)
        return formats[formatId];
    } else {
      return "";
    }
  };

  Group.prototype.setupImages = function (body, done) {
    async.parallel([
      (callback) => {
        this.setupLogoImage(body, (err) => {
          if (err) return callback(err);
          callback();
        });
      },
      (callback) => {
        this.setupHeaderImage(body, (err) => {
          if (err) return callback(err);
          callback();
        });
      }
    ], (err) => {
      done(err);
    });
  };

  Group.prototype.setupModerationData = function () {
    if (!this.data) {
      this.set('data', {});
    }
    if (!this.data.moderation) {
      this.set('data.moderation', {});
    }
  };

  Group.prototype.report = function (req, source, callback) {
    this.setupModerationData();
    async.series([
      (seriesCallback) => {
        if (!this.data.moderation.lastReportedBy) {
          this.set('data.moderation.lastReportedBy', []);
          if ((source==='user' || source==='fromUser') && !this.data.moderation.toxicityScore) {
            log.info("process-moderation post toxicity on manual report");
            queue.create('process-moderation', {
              type: 'estimate-collection-toxicity',
              collectionId: this.id,
              collectionType: 'group' }).priority('high').removeOnComplete(true).save();
          }
        }
        this.set('data.moderation.lastReportedBy',
          [{ date: new Date(), source: source, userId: (req && req.user) ? req.user.id : null, userEmail: (req && req.user) ? req.user.email : 'anonymous' }].concat(this.data.moderation.lastReportedBy)
        );
        this.save().then(() => {
          seriesCallback();
        }).catch((error) => {
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
    ], (error) => {
      this.increment('counter_flags');
      callback(error);
    });
  };

  return Group;
};
