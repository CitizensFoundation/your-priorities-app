var reallyUploadImages = true;

var bcrypt = require('bcrypt');
var models = require('../models');
var async = require('async');
var ip = require('ip');
var http = require('http');
var url = require('url');
var fs = require('fs');
var https = require('https');
var temp = require('temp');
temp.track();
var _ = require('lodash');
YAML = require('yamljs');
var wordwrap = require('wordwrap')(100);

var randomstring = require("randomstring");
var filename = process.argv[2];

var exec = require('child_process').exec;
var spawn = require('child_process').spawn;

console.log(filename);

var json = JSON.parse(require('fs').readFileSync(filename, 'utf8'));

var domain = json['domain'];

var users = json['users'];
var groups = json['groups'];
var categories = json['categories'];
var posts = json['posts'];
var post_revisions = json['post_revisions'];
var post_status_changes = json['post_status_changes'];
var endorsements = json['endorsements'];
var points = json['points'];
var point_revisions = json['point_revisions'];
var point_qualities = json['point_qualities'];
var comments = json['comments'];
var promotions = json['promotions'];
var pages = json['pages'];
var activities = json['activities'];
var followings = json['followings'];

var allUsersIdsByEmail = {};
var allUsersModelByEmail = {};
var allUsersByOldIds = {};
var allUserModelsByOldIds = {};
var allUsersModelByNewIds = {};

var needsGroupUserPermissions = [];
var needsGroupAdminPermissions = [];

var allGroupsByOldIds = {};
var allGroupsModelByOldIds = {};
var allCommunitiesByOldGroupIds = {};
var allCategoriesByOldIds = {};
var allPostsByOldIds = {};
var allPostRevisionsByOldIds = {};
var allPostStatusChangesByOldIds = {};
var allEndorsementsByOldIds = {};
var allPointsByOldIds = {};
var allPointRevisionsByOldIds = {};
var allCommentsByOldIds = {};
var allPromotionsByOldIds = {};
var allPagesByOldIds = {};
var allActivitiesByOldIds = {};

var currentDomain;

var communityBH1;
var communityBH2;
var communityBH3;
var communityBH4;
var communityBR;

var communityWC;
var communityNHS;
var communityZH;

var fakeReq;

var masterImageDownloadUrl;

var activitiesTransform = {
  ActivityIdeaStatusUpdate: 'activity.post.status.change',
  ActivityPointHelpfulDelete: 'activity.point.helpful.delete',
  ActivityIdeaOfficialStatusSuccessful: 'activity.post.officialStatus.successful',
  ActivityIdeaRevisionName: 'activity.post.revision.name',
  ActivityCapitalAdNew: 'activity.socialPoints.adNew',
  ActivityCapitalAdRefunded: 'activity.socialPoints.adRefunded',
  ActivityPointRevisionNeutral: 'activity.point.revision.neutral',
  ActivityIdeaRevisionCategory: 'activity.post.revision.category',
  ActivityFollowingDelete: 'activity.following.delete',
  ActivityPointRevisionContent: 'activity.point.revision.content',
  ActivityEndorsementNew: 'activity.post.endorsement.new',
  ActivityBulletinNew: 'activity.comment.new',
  ActivityCapitalPointHelpfulUndeclareds: 'activity.socialPoint.pointHelpful',
  ActivityCapitalPointHelpfulEveryone: 'activity.socialPoint.pointHelpful',
  ActivityCapitalPointHelpfulDeleted: 'activity.socialPoint.pointHelpful',
  ActivityPointUnhelpful: 'activity.point.unhelpful',
  ActivityUserRecruited: 'activity.user.recruited',
  ActivityFollowingNew: 'activity.following.new',
  ActivityPointUnhelpfulDelete: 'activity.point.unHelpful.delete',
  ActivityUserNew: 'activity.user.new',
  ActivityIdeaRevisionDescription: 'activity.post.revision.description',
  ActivityEndorsementDelete: 'activity.post.endorsement.delete',
  ActivityIdeaDebut: 'activity.post.debut',
  ActivityPointRevisionWebsite: 'activity.point.revision.website',
  ActivityUserRankingDebut: 'activity.user.rankingDebut',
  ActivityPointHelpful: 'activity.point.helpful',
  ActivityPointDeleted: 'activity.point.deleted',
  ActivityUserPictureNew: 'activity.user.pictureNew',
  ActivityBulletinProfileNew: 'activity.bulletin.profileNew',
  ActivityIdeaOfficialStatusInTheWorks: 'activity.post.officialStatus.inProgress',
  ActivityPointNew: 'activity.point.new',
  ActivityContentRemoval: 'activity.content.removal',
  ActivityCapitalPointHelpfulEndorsers: 'activity.socialPoint.pointHelpfulEndorsers',
  ActivityIssueIdeaRising1: 'activity.issue.postRising1',
  ActivityIdeaNew: 'activity.post.new',
  ActivityOppositionNew: 'activity.post.opposition.new',
  ActivityCommentParticipant: 'activity.comment.participant',
  ActivityDiscussionFollowingDelete: 'activity.discussion.following.delete',
  ActivityCapitalPointHelpfulOpposers: 'activity.socialPoint.pointHelpfulOpposers',
  ActivityDiscussionFollowingNew: 'activity.DiscussionFollowingNew',
  ActivityIdeaRenamed: 'activity.post.renamed',
  ActivityIdeaRising1: 'activity.post.Rising1',
  ActivityPointRevisionName: 'activity.point.revision.name',
  ActivityPointRevisionOpposition: 'activity.point.revisionOpposition',
  ActivityIssueIdeaControversial1: 'activity.issue.postControversial1',
  ActivityUserProbation: 'activity.user.probation',
  ActivityCapitalUserRecruited: 'activity.capital.userRecruited',
  ActivityCapitalFollowers: 'activity.capital.followers',
  ActivityIssueIdea1: 'activity.issueIdea1',
  ActivityIdeaOfficialStatusFailed: 'activity.post.officialStatus.failed',
  ActivityOppositionDelete: 'activity.post.opposition.delete',
  ActivityInvitationAccepted: 'activity.invitation.accepted',
  ActivityPointRevisionSupportive: 'activity.point.revision.supportive',
  ActivityIdea1Opposed: 'activity.post.1Opposed',
  ActivityBulletinProfileAuthor: 'activity.bulletin.profileAuthor'
};

var defaultNotificationsSettings = function(email) {
  var settings;

  if (email == 'robert@citizens.is' || email == 'gunnar@citizens.is') {
    settings = {
      my_posts: {
        method: models.AcNotification.METHOD_EMAIL,
        frequency: models.AcNotification.FREQUENCY_AS_IT_HAPPENS
      },
      my_posts_endorsements: {
        method: models.AcNotification.METHOD_EMAIL,
        frequency: models.AcNotification.FREQUENCY_AS_IT_HAPPENS
      },
      my_points: {
        method: models.AcNotification.METHOD_EMAIL,
        frequency: models.AcNotification.FREQUENCY_AS_IT_HAPPENS
      },
      my_points_endorsements: {
        method: models.AcNotification.METHOD_EMAIL,
        frequency: models.AcNotification.FREQUENCY_AS_IT_HAPPENS
      },
      all_community: {
        method: models.AcNotification.METHOD_EMAIL,
        frequency: models.AcNotification.FREQUENCY_AS_IT_HAPPENS
      },
      all_group: {
        method: models.AcNotification.METHOD_EMAIL,
        frequency: models.AcNotification.FREQUENCY_AS_IT_HAPPENS
      },
      newsletter: {
        method: models.AcNotification.METHOD_EMAIL,
        frequency: models.AcNotification.FREQUENCY_AS_IT_HAPPENS
      }
    }
  } else {
    settings = models.AcNotification.defaultNotificationSettings;
  }
  return settings;
};

var errorUrls = {};
var errorUrlsFilename = "/media/Data/yrpriCache/errorUrlsFromOldImport";

var cacheUrls = {};
var cacheUrlsFilename = "/media/Data/yrpriCache/cacheUrlsFromOldImport";

var saveErrorUrls = function (callback) {
  fs.writeFile(errorUrlsFilename, JSON.stringify( errorUrls ), "utf8", callback );
};

var loadErrorUrls = function (callback) {
  fs.readFile(errorUrlsFilename, 'utf8', function (err, data) {
    if (err) {
      errorUrls = {};
      callback();
    } else {
      errorUrls = JSON.parse(data);
      callback();
    }
  });
};

var getDeletedStatus = function (status) {
  return (status!='published' && status!='active' && status!='inactive')
};

var saveCacheUrls = function (callback) {
  fs.writeFile(cacheUrlsFilename, JSON.stringify( cacheUrls ), "utf8", callback );
};

var loadCacheUrls = function (callback) {
  fs.readFile(cacheUrlsFilename, 'utf8', function (err, data) {
    if (err) {
      cacheUrls = {};
      callback();
    } else {
      cacheUrls = JSON.parse(data);
      callback();
    }
  });
};

var changePointCounter = function (pointId, column, upDown, next) {
  models.Point.find({
    where: { id: pointId }
  }).then(function(point) {
    if (point && upDown===1) {
      point.increment(column).then(function(){
        next();
      });
    } else if (point && upDown===-1) {
      point.decrement(column).then(function(){
        next();
      });
    } else {
      next();
    }
  });
};

var changePostCounter = function (req, postId, column, upDown, next) {
  models.Post.find({
    where: { id: postId }
  }).then(function(post) {
    if (post && upDown === 1) {
      post.increment(column);
    } else if (post && upDown === -1) {
      post.decrement(column);
    }
    if (post) {
      models.Group.addUserToGroupIfNeeded(post.group_id, req, function () {
        next();
      });
    } else {
      console.warn("POST NOT FOUND FOR ENDORSEMENT");
      next();
    }
  });
};

var s3Upload = function(filePath, itemType, userId, callback) {
  var s3UploadClient = models.Image.getUploadClient(process.env.S3_BUCKET, itemType);
  s3UploadClient.upload(filePath, {}, function(error, versions, meta) {
    console.log("Uploading tried: "+error+" "+versions);
    if (error) {
      console.log(error);
      callback(error);
    } else {
      console.log('Uploading Image Complete');
      var image = models.Image.build({
        user_id: userId,
        s3_bucket_name: process.env.S3_BUCKET,
        original_filename: 'image.png',
        formats: JSON.stringify(models.Image.createFormatsFromVersions(versions)),
        user_agent: 'Script',
        ip_address: '127.0.0.1'
      });
      image.save().then(function() {
        console.log('Uploading Image Saved');
        callback(null, image);
      }).catch(function(error) {
        console.log(error);
      });
    }
  });
};

var uploadImage = function(fileUrl, itemType, userId, callback) {
  if (reallyUploadImages &&
    !(fileUrl.indexOf('Header_Default') > -1) &&
    !(fileUrl.indexOf('missing.png') > -1))
  {
    fileUrl = fileUrl.replace('/system/','/');
    fileUrl = masterImageDownloadUrl+fileUrl;

    var timeout;

    if (errorUrls[fileUrl]==null) {
      console.log("Uploading: "+fileUrl+" - "+itemType);

      if (cacheUrls[fileUrl]) {
        console.log('Uploading FROM CACHE FROM CACHE FROM CACHE FROM CACHE FROM CACHE FROM CACHE FROM CACHE FROM CACHE');
        s3Upload(cacheUrls[fileUrl], itemType, userId, callback);
      } else {
        var filePath = '/media/Data/yrpriCache/uploadTest_'+ randomstring.generate(10) + '.png';

        // compose the wget command
        var wget = 'wget -O ' + filePath + ' ' + '"'+fileUrl+'"';
        console.log('Uploading Starting '+wget);

        timeout = setTimeout(function() {
          console.log("Uploading timeout triggered");
          clearTimeout(timeout);
          timeout = null;
          callback();
        }, 65000);

        var child = exec(wget, function(err, stdout, stderr) {
          if (timeout) {
            clearTimeout(timeout);
            timeout = null;
            if (err) {
              console.log('Uploading Failed: '+err);
              errorUrls[fileUrl] = true;
              saveErrorUrls(function () {
                callback("Upload failed");
              });
            } else {
              console.log('Uploading File Saved');
              cacheUrls[fileUrl] = filePath;
              saveCacheUrls(function () {
                s3Upload(filePath, itemType, userId, callback);
              });
            }
          }
        });
      }
    } else {
      console.log('Uploading ON ERROR LIST  ON ERROR LIST  ON ERROR LIST  ON ERROR LISTON ERROR LIST  ON ERROR LIST  ON ERROR LIST  ON ERROR LIST');
      callback('Uploading Not really uploading images');
    }
  } else {
    console.log('Uploading Not Uploading');
    callback('Uploading Not really uploading images');
  }
};

async.series([
  function(seriesCallback){
    console.log('Processing domain '+domain);
    domain['ip_address'] = ip.address();
    domain['user_agent'] = 'yrpri script';
    if (!domain.default_locate) {
      domain['default_locale'] = 'en';
    }
    domain.public_api_keys = { google: { analytics_tracking_id: domain['google_analytics_code'] } };

    models.Domain.build(domain).save().then(function (domain) {
      if (domain) {
        currentDomain = domain;
        fakeReq = { ypDomain: domain };
        if (currentDomain.domain_name.indexOf("betrireykjavik") > -1) {
          masterImageDownloadUrl = 'http://s3.amazonaws.com/better-reykjavik-paperclip-production';
        } else if (currentDomain.domain_name.indexOf("yrpri") > -1) {
          masterImageDownloadUrl = 'http://s3.amazonaws.com/yrpri-paperclip-production';
        } else if (currentDomain.domain_name.indexOf("betraisland") > -1) {
          masterImageDownloadUrl = 'http://s3.amazonaws.com/bettericeland-pro';
        }
        seriesCallback();
      } else {
        seriesCallback('no domain created');
      }
    }).catch(function (error) {
      console.error(error);
    });
  },

  function(seriesCallback){
    console.log('Loading error urls');
    loadErrorUrls(function() {
      loadCacheUrls(seriesCallback);
    });
  },

  function(seriesCallback){
    console.log('Setting up old users');
    models.User.findAll().then(function(users) {
      async.eachSeries(users, function iteratee(user, callback) {
        allUsersIdsByEmail[user.email] = user.id;
        allUsersModelByNewIds[user.id] = user;
        allUsersModelByEmail[user.email] = user;
        console.log("Adding user: "+user.email);
        callback();
      }, function done() {
        seriesCallback();
      });
    }).catch(function(error) {
      console.log(error);
      seriesCallback(error);
    });
  },

  function(seriesCallback){
    console.log('Setting up better reykjavik if needed');
    if (currentDomain.domain_name.indexOf("betrireykjavik") > -1) {
      async.series([
          function(callback){
            models.Community.build({
              name: "Betri Hverfi 2012",
              description: "Betri Hverfi 2012",
              domain_id: currentDomain.id,
              ip_address: ip.address(),
              user_agent: 'yrpri script',
              hostname: "betri-hverfi-2012",
              access: 0
            }).save().then(function (community) {
              if (community) {
                community.updateAllExternalCounters(fakeReq, 'up', 'counter_communities', function () {
                  communityBH1 = community;
                  callback();
                });
              } else {
                callback('no communitity created');
              }
            }).catch(function (error) {
              console.log(error);
              callback(error);
            });
          },
          function(callback){
            models.Community.build({
              name: "Betri Hverfi 2013",
              description: "Betri Hverfi 2013",
              domain_id: currentDomain.id,
              ip_address: ip.address(),
              user_agent: 'yrpri script',
              hostname: "betri-hverfi-2013",
              access: 0
            }).save().then(function (community) {
              if (community) {
                community.updateAllExternalCounters(fakeReq, 'up', 'counter_communities', function () {
                  communityBH2 = community;
                  callback();
                });
              } else {
                callback('no communitity created');
              }
            }).catch(function (error) {
              console.log(error);
              callback(error);
            });
          },
          function(callback){
            models.Community.build({
              name: "Betri Hverfi 2014",
              description: "Betri Hverfi 2014",
              domain_id: currentDomain.id,
              ip_address: ip.address(),
              user_agent: 'yrpri script',
              hostname: "betri-hverfi-2014",
              access: 0
            }).save().then(function (community) {
              if (community) {
                community.updateAllExternalCounters(fakeReq, 'up', 'counter_communities', function () {
                  communityBH3 = community;
                  callback();
                });
              } else {
                callback('no communitity created');
              }
            }).catch(function (error) {
              console.log(error);
              callback(error);
            });
          },
          function(callback){
            models.Community.build({
              name: "Betri Hverfi 2015",
              description: "Betri Hverfi 2015",
              domain_id: currentDomain.id,
              ip_address: ip.address(),
              user_agent: 'yrpri script',
              hostname: "betri-hverfi-2015",
              access: 0
            }).save().then(function (community) {
              if (community) {
                community.updateAllExternalCounters(fakeReq, 'up', 'counter_communities', function () {
                  communityBH4 = community;
                  callback();
                });
              } else {
                callback('no communitity created');
              }
            }).catch(function (error) {
              console.log(error);
              callback(error);
            });
          },
          function(callback){
            models.Community.build({
              name: "Þín rödd í ráðum borgarinnar",
              description: "Þín rödd í ráðum borgarinnar",
              domain_id: currentDomain.id,
              ip_address: ip.address(),
              user_agent: 'yrpri script',
              hostname: "thin-rodd",
              access: 0
            }).save().then(function (community) {
              if (community) {
                community.updateAllExternalCounters(fakeReq, 'up', 'counter_communities', function () {
                  communityBR = community;
                  callback();
                });
              } else {
                callback('no communitity created');
              }
            }).catch(function (error) {
              console.log(error);
              callback(error);
            });
          }
        ],
        function(err, results){
          seriesCallback(err);
        });
    } else {
      seriesCallback();
    }
  },

  function(seriesCallback){
    console.log('Setting up Your Priorities if needed');
    if (currentDomain.domain_name.indexOf("yrpri.org") > -1) {
      async.series([
          function(callback){
            models.Community.build({
              name: "World Countries",
              description: "World Countries",
              domain_id: currentDomain.id,
              ip_address: ip.address(),
              user_agent: 'yrpri script',
              hostname: "world-countries",
              access: 0
            }).save().then(function (community) {
              if (community) {
                community.updateAllExternalCounters(fakeReq, 'up', 'counter_communities', function () {
                  communityWC = community;
                  callback();
                });
              } else {
                callback('no communitity created');
              }
            }).catch(function (error) {
              console.log(error);
              callback(error);
            });
          },

          function(callback){
            models.Community.build({
              name: "NHS Citizen",
              description: "NHS Citizen",
              domain_id: currentDomain.id,
              ip_address: ip.address(),
              user_agent: 'yrpri script',
              hostname: "world-countries",
              access: 0
            }).save().then(function (community) {
              if (community) {
                community.updateAllExternalCounters(fakeReq, 'up', 'counter_communities', function () {
                  communityNHS = community;
                  callback();
                });
              } else {
                callback('no communitity created');
              }
            }).catch(function (error) {
              console.log(error);
              callback(error);
            });
          },

          function(callback){
            models.Community.build({
              name: "Zero Heroes",
              description: "Zero Heroes",
              domain_id: currentDomain.id,
              ip_address: ip.address(),
              user_agent: 'yrpri script',
              hostname: "world-countries",
              access: 0
            }).save().then(function (community) {
              if (community) {
                community.updateAllExternalCounters(fakeReq, 'up', 'counter_communities', function () {
                  communityZH = community;
                  callback();
                });
              } else {
                callback('no communitity created');
              }
            }).catch(function (error) {
              console.log(error);
              callback(error);
            });
          }
        ],
        function(err, results){
          seriesCallback(err);
        });
    } else {
      seriesCallback();
    }
  },

  function(seriesCallback){
    async.eachSeries(users, function(incoming, callback) {
      console.log('Processing user ' + incoming.email);
      var oldId = incoming['id'];
      incoming['id'] = null;

      incoming['legacy_user_id'] = oldId;
      incoming['legacy_new_domain_id'] = currentDomain.id;

      incoming['notifications_settings'] = defaultNotificationsSettings(incoming.email);

      var buddyIconUrl = incoming['buddy_icon'];
      console.log("Uploading Buddy Icon "+buddyIconUrl);
      incoming['buddy_icon'] = null;

      if (incoming['group_id']) {
        needsGroupUserPermissions.push( {group_id: incoming['group_id'], user_id: oldId } );
        if (incoming['is_admin']) {
          needsGroupAdminPermissions.push( {group_id: incoming['group_id'], user_id: oldId } );
        }
        incoming['group_id'] = null;
      }

      if (incoming['first_name'] && incoming['last_name']) {
        var newName = incoming['first_name'].trim() + ' ' + incoming['last_name'].trim();
        if (newName.length>incoming['name'].length) {
          incoming['name'] = newName;
        }
      }

      if (allUsersIdsByEmail[incoming.email]) {
        console.log("Duplicate email: " + incoming.email);
        var masterUser = allUsersModelByEmail[incoming.email];
        allUsersByOldIds[oldId] = masterUser.id;
        allUserModelsByOldIds[oldId] = masterUser;
        async.series([
            function(innerSeriesCallback){
              if (incoming.encrypted_password &&
                incoming.encrypted_password != masterUser.encrypted_password) {
                models.UserLegacyPassword.find({
                  where: { encrypted_password: incoming.encrypted_password }
                }).then(function(legacyPassword) {
                  if (legacyPassword) {
                    innerSeriesCallback();
                  } else {
                    models.UserLegacyPassword.build({
                      encrypted_password: incoming.encrypted_password,
                      user_id: masterUser.id
                    }).save().then(function () {
                      innerSeriesCallback();
                    }).catch(function (error) {
                      console.log(error);
                      innerSeriesCallback(error);
                    });
                  }
                }).catch(function (error) {
                  console.log(error);
                  innerSeriesCallback(error);
                });

              } else {
                innerSeriesCallback();
              }
            },
            function(innerSeriesCallback){
              if (incoming.facebook_uid && incoming.facebook_uid != masterUser.facebook_id && incoming.created_at>masterUser.created_at) {
                masterUser.facebook_id = incoming.facebook_uid;
                masterUser.save().then(function (newUser) {
                  allUsersModelByEmail[incoming.email] = newUser;
                  innerSeriesCallback();
                }).catch(function (error) {
                  console.log(error);
                  innerSeriesCallback(error);
                });
              } else {
                innerSeriesCallback();
              }
            },
            function(innerSeriesCallback){
              if (buddyIconUrl && buddyIconUrl!='') {
                uploadImage(buddyIconUrl, 'user-profile', masterUser.id, function(error, image) {
                  console.log("Uploading buddy icon has been completed innerSeries");
                  if (error) {
                    console.log(error);
                    innerSeriesCallback();
                  } else {
                    masterUser.addUserProfileImage(image).then(function () {
                      console.log("Uploading buddy header Image has been added innerSeries");
                      innerSeriesCallback()
                    });
                  }
                });
              } else {
                innerSeriesCallback();
              }
            }
          ],
          function(err){
            callback(err);
          });
      } else {
        incoming['ip_address'] = ip.address();
        incoming['user_agent'] = 'yrpri script';
        incoming['domain_id'] = currentDomain.id;

        if(incoming['name']==null) {
          incoming['name']=incoming['email'];
        }

        models.User.build(incoming).save().then(function (user) {
          if (user) {
            allUsersIdsByEmail[incoming.email] = user.id;
            allUsersByOldIds[oldId] = user.id;
            allUserModelsByOldIds[oldId] = user;
            allUsersModelByNewIds[user.id] = user;
            allUsersModelByEmail[incoming.email] = user;
            if (buddyIconUrl && buddyIconUrl!='') {
              uploadImage(buddyIconUrl, 'user-profile', user.id, function(error, image) {
                console.log("Uploading buddy icon has been completed");
                if (error) {
                  console.log(error);
                  callback();
                } else {
                  user.addUserProfileImage(image).then(function () {
                    console.log("Uploading buddy header Image has been added");
                    callback()
                  });
                }
              });
            } else {
              callback();
            }
          } else {
            callback('no user created');
          }
        }).catch(function (error) {
          console.log("6");
          console.error(error);
        });
      }
    }, function(err){
      console.log("User done");
      if (err) {
        console.error(err);
      } else {
        seriesCallback();
      }
    });
  },

  function(seriesCallback){
    async.eachSeries(groups, function(incoming, callback) {
      console.log('Processing group ' + JSON.stringify(incoming));
      incoming['ip_address'] = ip.address();
      incoming['user_agent'] = 'yrpri script';
      incoming['user_id'] = allUsersByOldIds[incoming['user_id']];

      var oldId = incoming['id'];
      incoming['id'] = null;

      var logoUrl = incoming['logo_url'];
      var headerUrl = incoming['header_url'];
      console.log("Uploading Header "+headerUrl);

      incoming['logo_url'] = null;
      incoming['header_url'] = null;

      if (currentDomain.domain_name.indexOf("betrireykjavik") > -1) {
        if (incoming['name'].indexOf("2012") > -1) {
          allCommunitiesByOldGroupIds[oldId] = incoming['community_id'] = communityBH1.id;
        } else if (!(incoming['name'].indexOf("Betri") > -1) && incoming['name'].indexOf("2013") > -1) {
          allCommunitiesByOldGroupIds[oldId] = incoming['community_id'] = communityBH2.id;
        } else if (incoming['name'].indexOf("2014") > -1) {
          allCommunitiesByOldGroupIds[oldId] = incoming['community_id'] = communityBH3.id;
        } else if (!(incoming['name'].indexOf("Betri Reykjavík") > -1)
          && (incoming['description'] && incoming['description'].indexOf("2015") > -1)) {
          allCommunitiesByOldGroupIds[oldId] = incoming['community_id'] = communityBH4.id;
        } else {
          allCommunitiesByOldGroupIds[oldId] = incoming['community_id'] = communityBR.id;
        }

        incoming['domain_id'] = null;
        incoming['host_name'] = null;
        incoming['default_locale'] = null;
        incoming['message_for_new_idea'] = null;
        incoming['message_to_users'] = null;
        incoming['google_analytics_code'] = null;
        incoming['objectives'] = incoming['description'];
        incoming['description'] = null;
        models.Group.build(incoming).save().then(function (group) {
          if (group) {
            group.updateAllExternalCounters(fakeReq, 'up', 'counter_groups', function () {
              allGroupsByOldIds[oldId] = group.id;
              allGroupsModelByOldIds[oldId] = group;
              callback()
            });
          } else {
            callback('no group created');
          }
        }).catch(function (error) {
          console.error(error);
        });
      } else if (currentDomain.domain_name.indexOf("yrpri.org") > -1 &&
        (incoming['iso_country_id'] ||
        (incoming['name'] && incoming['name'].indexOf("NHS") > -1) ||
        (incoming['name'] && incoming['name'].indexOf("Barcombe and Hamsey") > -1) ||
        (incoming['description'] && incoming['description'].indexOf("community do") > -1))) {

        if (incoming['name'] && incoming['name'].indexOf("NHS") > -1) {
          allCommunitiesByOldGroupIds[oldId] = incoming['community_id'] = communityNHS.id;
        } else if ((incoming['description'] && incoming['description'].indexOf("community do") > -1) ||
          (incoming['name'] && incoming['name'].indexOf("Barcombe and Hamsey") > -1)) {
          allCommunitiesByOldGroupIds[oldId] = incoming['community_id'] = communityZH.id;
        } else {
          allCommunitiesByOldGroupIds[oldId] = incoming['community_id'] = communityWC.id;
        }

        incoming['domain_id'] = null;
        incoming['host_name'] = null;
        incoming['default_locale'] = null;
        incoming['message_for_new_idea'] = null;
        incoming['message_to_users'] = null;
        incoming['google_analytics_code'] = null;
        incoming['iso_country_id'] = null;
        incoming['objectives'] = incoming['description'];
        incoming['description'] = null;
        models.Group.build(incoming).save().then(function (group) {
          if (group) {
            group.updateAllExternalCounters(fakeReq, 'up', 'counter_groups', function () {
              allGroupsByOldIds[oldId] = group.id;
              allGroupsModelByOldIds[oldId] = group;
              if (headerUrl && headerUrl!='') {
                uploadImage(headerUrl, 'group-logo', group.user_id, function(error, image) {
                  console.log("Uploading header has been completed");
                  if (error) {
                    console.log(error);
                    callback();
                  } else {
                    group.addGroupLogoImage(image).then(function () {
                      console.log("Uploading Group header Image has been added");
                      callback()
                    });
                  }
                });
              } else {
                callback();
              }
            });
          } else {
            callback('no group created');
          }
        }).catch(function (error) {
          console.log(error);
        });
      } else {
        incoming['domain_id'] = currentDomain.id;

        if (incoming['private_instance'] && incoming['private_instance']==true) {
          incoming['access'] = 2;
        }

        models.Community.build(incoming).save().then(function (community) {
          if (community) {
            allCommunitiesByOldGroupIds[oldId] = community.id;
            console.log("ACTV DEBUG: oldId: "+oldId+" newCommunityId: "+ community.id);
            community.updateAllExternalCounters(fakeReq, 'up', 'counter_communities', function () {
              incoming['community_id'] = community.id;
              incoming['domain_id'] = null;
              incoming['host_name'] = null;
              incoming['default_locale'] = null;
              incoming['message_for_new_idea'] = null;
              incoming['message_to_users'] = null;
              incoming['google_analytics_code'] = null;
              incoming['description'] = null;
              incoming['objectives'] = community.description;
              models.Group.build(incoming).save().then(function (group) {
                if (group) {
                  group.updateAllExternalCounters(fakeReq, 'up', 'counter_groups', function () {
                    allGroupsByOldIds[oldId] = group.id;
                    console.log("ACTV DEBUG: oldId: "+oldId+" newCommunityId: "+ community.id+ " newGroupId: " + group.id);
                    allGroupsModelByOldIds[oldId] = group;
                    if (headerUrl && headerUrl!='') {
                      uploadImage(headerUrl, 'group-logo', group.user_id, function(error, image) {
                        console.log("Uploading header has been completed");
                        if (error) {
                          console.log(error);
                          callback();
                        } else {
                          group.addGroupLogoImage(image).then(function () {
                            console.log("Uploading Group header Image has been added");
                            community.addCommunityLogoImage(image).then(function () {
                              console.log("Uploading Community header Image has been added");
                              callback()
                            });
                          });
                        }
                      });
                    } else {
                      callback();
                    }
                  });
                } else {
                  callback('no group created');
                }
              }).catch(function (error) {
                console.error(error);
              });
            });
          } else {
            callback('no communitity nor group created');
          }
        }).catch(function (error) {
          console.error(error);
        });
      }
    }, function(err){
      if (err) {
        console.error(err);
      } else {
        seriesCallback();
      }
    });
  },

  function(seriesCallback){
    async.eachSeries(categories, function(incoming, callback) {
      console.log('Uploading Processing category ' + incoming);
      incoming['ip_address'] = ip.address();
      incoming['user_agent'] = 'yrpri script';
      incoming['user_id'] = allUsersByOldIds[incoming['user_id']];
      incoming['group_id'] = allGroupsByOldIds[incoming['group_id']];

      var oldId = incoming['id'];
      incoming['id'] = null;

      var iconUrl = incoming['icon_url'];
      incoming['icon_url'] = null;

      models.Category.build(incoming).save().then(function (category) {
        if (category) {
          allCategoriesByOldIds[oldId] = category.id;
          console.log("Uploading "+iconUrl);
          if (iconUrl && iconUrl!='') {
            uploadImage(iconUrl, 'category-icon', category.user_id, function(error, image) {
              console.log("Uploading has been completed");
              if (error) {
                console.log(error);
                callback();
              } else {
                category.addCategoryIconImage(image).then(function () {
                  console.log("Uploading Category Image has been added");
                  callback()
                });
              }
            });
          } else {
            callback();
          }
        } else {
          callback('no category created');
        }
      }).catch(function (error) {
        console.error(error);
      });
    }, function(err){
      if (err) {
        console.error(err);
      } else {
        seriesCallback();
      }
    });
  },

  function(seriesCallback){
    async.eachSeries(posts, function(incoming, callback) {
      console.log('Processing post ' + incoming);
      incoming['ip_address'] = ip.address();
      incoming['user_agent'] = 'yrpri script';
      incoming['user_id'] = allUsersByOldIds[incoming['user_id']];
      incoming['group_id'] = allGroupsByOldIds[incoming['group_id']];
      incoming['category_id'] = allCategoriesByOldIds[incoming['category_id']];

      if (incoming['description']==null) {
        incoming['description']="";
      }

      var oldId = incoming['id'];
      incoming['id'] = null;

      incoming['legacy_post_id'] = oldId;

      incoming['deleted'] = getDeletedStatus(incoming['status']);

      models.Post.build(incoming).save().then(function (post) {
        if (post) {
          post.updateAllExternalCounters(fakeReq, 'up', 'counter_posts', function () {
            allPostsByOldIds[oldId] = post.id;
            callback()
          });
        } else {
          callback('no post created');
        }
      }).catch(function (error) {
        console.error(error);
      });
    }, function(err){
      if (err) {
        console.error(err);
      } else {
        seriesCallback();
      }
    });
  },

  function(seriesCallback){
    async.eachSeries(post_revisions, function(incoming, callback) {
      console.log('Processing post revision ' + incoming);

      incoming['ip_address'] = ip.address();
      incoming['user_agent'] = 'yrpri script';
      incoming['user_id'] = allUsersByOldIds[incoming['user_id']];
      incoming['post_id'] = allPostsByOldIds[incoming['post_id']];

      if (incoming['name']==null) {
        incoming['name']="";
      }

      if (incoming['description']==null) {
        incoming['description']="";
      }

      var oldId = incoming['id'];
      incoming['id'] = null;

      incoming['deleted'] = getDeletedStatus(incoming['status']);

      models.PostRevision.build(incoming).save().then(function (post_revision) {
        if (post_revision) {
          allPostRevisionsByOldIds[oldId] = post_revision.id;
          callback()
        } else {
          callback('no post created');
        }
      }).catch(function (error) {
        console.error(error);
      });
    }, function(err){
      if (err) {
        console.error(err);
      } else {
        seriesCallback();
      }
    });
  },

  function(seriesCallback){
    async.eachSeries(post_status_changes, function(incoming, callback) {
      console.log('Processing post status change ' + incoming);
      incoming['ip_address'] = ip.address();
      incoming['user_agent'] = 'yrpri script';
      incoming['user_id'] = allUsersByOldIds[incoming['user_id']];
      incoming['post_id'] = allPostsByOldIds[incoming['post_id']];

      var oldId = incoming['id'];
      incoming['id'] = null;

      if (incoming['content']==null) {
        incoming['content']="";
      }

      if (incoming['status']==null) {
        incoming['status']="active";
      }

      incoming['deleted'] = getDeletedStatus(incoming['status']);

      models.PostStatusChange.build(incoming).save().then(function (post_status_change) {
        if (post_status_change) {
          allPostStatusChangesByOldIds[oldId] = post_status_change.id;
          callback()
        } else {
          callback('no post status change created');
        }
      }).catch(function (error) {
        console.log("5 "+error);
        console.error(error);
      });
    }, function(err){
      if (err) {
        console.error(err);
      } else {
        seriesCallback();
      }
    });
  },

  function(seriesCallback){
    async.eachSeries(endorsements, function(incoming, callback) {
      console.log('Processing endorsement' + incoming);
      incoming['user_id'] = allUsersByOldIds[incoming['user_id']];
      incoming['post_id'] = allPostsByOldIds[incoming['post_id']];

      var oldId = incoming['id'];
      incoming['id'] = null;

      incoming['user_agent'] = "Script import";

      incoming['deleted'] = getDeletedStatus(incoming['status']);

      models.Endorsement.build(incoming).save().then(function (endorsement) {
        if (endorsement) {
          allEndorsementsByOldIds[oldId] = endorsement.id;
          req = {
            user: allUsersModelByNewIds[endorsement.user_id],
            ypDomain: currentDomain
          };
          if (endorsement.value>0) {
            changePostCounter (req, endorsement.post_id, 'counter_endorsements_up', 1, function () {
              callback()
            });
          } else {
            changePostCounter (req, endorsement.post_id, 'counter_endorsements_down', 1, function () {
              callback()
            });
          }
        } else {
          callback('no post status change created');
        }
      }).catch(function (error) {
        console.log(error);
      });
    }, function(err){
      if (err) {
        console.log(err);
      } else {
        seriesCallback();
      }
    });
  },

  function(seriesCallback){
    async.eachSeries(points, function(incoming, callback) {
      console.log('Processing point ' + JSON.stringify(incoming));
      incoming['ip_address'] = ip.address();
      incoming['user_agent'] = 'yrpri script';
      incoming['user_id'] = allUsersByOldIds[incoming['user_id']];
      incoming['post_id'] = allPostsByOldIds[incoming['post_id']];

      var oldId = incoming['id'];
      incoming['id'] = null;

      if (incoming['status']==null) {
        incoming['status']="active";
      }

      incoming['deleted'] = getDeletedStatus(incoming['status']);

      models.Point.build(incoming).save().then(function (point) {
        if (point) {
          allPointsByOldIds[oldId] = point.id;
          models.Post.find({
            where: { id: point.post_id }
          }).then(function(post) {
            if (post) {
              post.updateAllExternalCounters({ ypDomain: currentDomain }, 'up', 'counter_points', function () {
                post.increment('counter_points');
                callback()
              });
            } else {
              point.deleted = true;
              point.save().then(function (point) {
                callback();
              });
            }
          });
        } else {
          callback('no point created');
        }
      }).catch(function (error) {
        console.log(error);
      });
    }, function(err){
      if (err) {
        console.log(err);
      } else {
        seriesCallback();
      }
    });
  },

  function(seriesCallback){
    async.eachSeries(point_revisions, function(incoming, callback) {
      console.log('Processing point revision ' + incoming);
      incoming['ip_address'] = ip.address();
      incoming['user_agent'] = 'yrpri script';
      incoming['user_id'] = allUsersByOldIds[incoming['user_id']];
      incoming['point_id'] = allPointsByOldIds[incoming['point_id']];

      var oldId = incoming['id'];
      incoming['id'] = null;

      if (incoming['status']==null) {
        incoming['status']="active";
      }

      incoming['deleted'] = getDeletedStatus(incoming['status']);

      models.PointRevision.build(incoming).save().then(function (point_revision) {
        if (point_revisions) {
          allPointRevisionsByOldIds[oldId] = point_revision.id;
          callback()
        } else {
          callback('no point revision created');
        }
      }).catch(function (error) {
        console.log(error);
      });
    }, function(err){
      if (err) {
        console.log(err);
      } else {
        seriesCallback();
      }
    });
  },

  function(seriesCallback){
    async.eachSeries(point_qualities, function(incoming, callback) {
      console.log('Processing point quality ' + incoming);
      incoming['ip_address'] = ip.address();
      incoming['user_agent'] = 'yrpri script';
      incoming['user_id'] = allUsersByOldIds[incoming['user_id']];
      incoming['point_id'] = allPointsByOldIds[incoming['point_id']];

      var oldId = incoming['id'];
      incoming['id'] = null;

      if (incoming['status']==null) {
        incoming['status']="active";
      }

      incoming['deleted'] = getDeletedStatus(incoming['status']);

      if (incoming['value']==true) {
        incoming['value'] = 1
      } else {
        incoming['value'] = -1
      }

      models.PointQuality.build(incoming).save().then(function (pointQuality) {
        if (pointQuality) {
          if (pointQuality.value>0) {
            changePointCounter(incoming['point_id'], 'counter_quality_up', 1, function () {
              callback()
            })
          } else if (pointQuality.value<0) {
            changePointCounter(incoming['point_id'], 'counter_quality_down', 1, function () {
              callback()
            })
          } else {
            console.log('PointQuality Error');
            callback("PointQuality Error")
          }
        } else {
          callback('no point quality created');
        }
      }).catch(function (error) {
        console.log(error);
      });
    }, function(err){
      if (err) {
        console.log(err);
      } else {
        seriesCallback();
      }
    });
  },

  function(seriesCallback){
    async.eachSeries(comments, function(incoming, callback) {
      console.log('Processing comments ' + incoming);
      incoming['user_id'] = allUsersByOldIds[incoming['user_id']];
      incoming['post_id'] = allPostsByOldIds[incoming['post_id']];
      incoming['ip_address'] = ip.address();
      incoming['user_agent'] = 'yrpri script';
      incoming['value'] = 0;

      incoming['deleted'] = getDeletedStatus(incoming['status']);

      var oldId = incoming['id'];
      incoming['id'] = null;

      models.Point.build(incoming).save().then(function (point) {
        if (point) {
          allCommentsByOldIds[oldId] = point.id;
          allPointsByOldIds[oldId] = point.id;
          incoming['point_id'] = point.id;
          incoming['post_id'] = null;
          models.PointRevision.build(incoming).save().then(function (point_revision) {
            if (point_revision) {
              models.Post.find({
                where: { id: point.post_id }
              }).then(function(post) {
                if (post) {
                  post.updateAllExternalCounters({ ypDomain: currentDomain }, 'up', 'counter_points', function () {
                    post.increment('counter_points');
                    callback()
                  });
                } else {
                  console.log("Error Can't find post for comment: "+point.content);
                  callback();
                }
              });
            } else {
              callback('no point revision created');
            }
          }).catch(function (error) {
            console.log(error);
          });
        } else {
          callback('no point from comment created');
        }
      }).catch(function (error) {
        console.log(error);
      });
    }, function(err){
      if (err) {
        console.log(err);
      } else {
        seriesCallback();
      }
    });
  },

  function(seriesCallback){
    async.eachSeries(promotions, function(incoming, callback) {
      console.log('Processing promotion ' + incoming);
      incoming['user_id'] = allUsersByOldIds[incoming['user_id']];
      incoming['post_id'] = allPostsByOldIds[incoming['post_id']];

      var oldId = incoming['id'];
      incoming['id'] = null;

      incoming['deleted'] = getDeletedStatus(incoming['status']);

      models.Promotion.build(incoming).save().then(function (promotion) {
        if (promotion) {
          allPromotionsByOldIds[oldId] = promotion.id;
          callback()
        } else {
          callback('no promotions created');
        }
      }).catch(function (error) {
        console.log(error);
      });
    }, function(err){
      if (err) {
        console.log(err);
      } else {
        seriesCallback();
      }
    });
  },

  function(seriesCallback){
    async.eachSeries(pages, function(incoming, callback) {
      console.log('Processing page ' + incoming);
      incoming['user_id'] = allUsersByOldIds[incoming['user_id']];
      if (incoming['group_id']=='45' && parseInt(currentDomain.id) ==1) {
        incoming['group_id'] = allGroupsByOldIds[incoming['group_id']];
      } else {
        incoming['community_id'] = allCommunitiesByOldGroupIds[incoming['group_id']];
        incoming['group_id'] = null;
      }
      //incoming['domain_id'] = currentDomain.id;
      incoming['content'] = YAML.parse(incoming['content']);
      incoming['title'] = YAML.parse(incoming['title']);
      incoming['published'] = true;

      var oldId = incoming['id'];
      incoming['id'] = null;

      incoming['legacy_page_id'] = oldId;
      incoming['legacy_new_domain_id'] = currentDomain.id;

      models.Page.build(incoming).save().then(function (page) {
        if (page) {
          allPagesByOldIds[oldId] = page.id;
          callback()
        } else {
          callback('no page created');
        }
      }).catch(function (error) {
        console.log(error);
      });
    }, function(err){
      if (err) {
        console.log(err);
      } else {
        seriesCallback();
      }
    });
  },

  function(seriesCallback){
    async.eachSeries(followings, function(incoming, callback) {
      console.log('Processing following ' + incoming);
      incoming['user_id'] = allUsersByOldIds[incoming['user_id']];
      incoming['other_user_id'] = allUsersByOldIds[incoming['other_user_id']];
      var oldId = incoming['id'];
      incoming['id'] = null;

      models.AcFollowing.build(incoming).save().then(function (following) {
        if (following) {
          callback()
        } else {
          callback('no following created');
        }
      }).catch(function (error) {
        console.log(error);
      });
    }, function(err){
      if (err) {
        console.log(err);
      } else {
        seriesCallback();
      }
    });
  },

  function(seriesCallback){
    async.eachSeries(activities, function(incoming, callback) {
      console.log('Processing activity ' + incoming);

      incoming['user_id'] = allUsersByOldIds[incoming['user_id']];
      incoming['domain_id'] = currentDomain.id;

      if (incoming['post_id']) {
        incoming['post_id'] = allPostsByOldIds[incoming['post_id']];
      }

      if (incoming['group_id']) {
        incoming['community_id'] = allCommunitiesByOldGroupIds[incoming['group_id']];
        incoming['group_id'] = allGroupsByOldIds[incoming['group_id']];
        console.log("ACTV DEBUG: newCommunityId: "+incoming['community_id']+" newGroupId: "+ incoming['group_id']);
      } else {
        console.log("ACTV DEBUG: NO GROUP ID");
      }

      if (incoming['point_id']) {
        incoming['point_id'] = allPointsByOldIds[incoming['point_id']];
      }

      if (incoming['comment_id']) {
        incoming['point_id'] = allCommentsByOldIds[incoming['comment_id']];
      }

      if (incoming['post_status_change_id']) {
        incoming['post_status_change_id'] = allPostStatusChangesByOldIds[incoming['post_status_change_id']];
      }

      var oldId = incoming['id'];
      incoming['id'] = null;

      incoming['access'] = 0;

      incoming['created_at'] = incoming['created_at'];

      if (activitiesTransform[incoming['type']]) {
        incoming['type'] = activitiesTransform[incoming['type']];
      }

      incoming['deleted'] = getDeletedStatus(incoming['status']);

      models.AcActivity.build(incoming).save().then(function (activity) {
        if (activity) {
          allActivitiesByOldIds[oldId] = activity.id;
          callback()
        } else {
          callback('no activity created');
        }
      }).catch(function (error) {
        console.log(error);
      });
    }, function(err){
      if (err) {
        console.log(err);
      } else {
        seriesCallback();
      }
    });
  },

  // Add missing user_id to ac_activities for status updates
  function(seriesCallback){
    async.eachSeries(needsGroupAdminPermissions, function(incoming, outerCallback) {
      var user = allUserModelsByOldIds[incoming.user_id];
      var group = allGroupsModelByOldIds[incoming.group_id];
      console.log('Adding admin user starting ' + user.email + ' for group ' + group.name);
      if ((currentDomain.id == 1 && _.includes(_.lowerCase(user.name), 'unnur')) ||
        (!_.includes(_.lowerCase(user.email), 'deleted') && !_.includes(_.lowerCase(user.name), 'robert') && !_.includes(_.lowerCase(user.name), 'gunnar'))) {
        models.AcActivity.findAll({
          where: {
            group_id: group.id,
            user_id: null
          }
        }).then(function (activities) {
          async.eachSeries(activities, function (activity, innerCallback) {
            activity.user_id = user.id;
            activity.save().then(function (results) {
              console.log('Adding admin user to missing status updates for activities ' + user.email + ' for group ' + group.name);
              innerCallback();
            });
          }, function (error) {
            outerCallback();
          });
        })
      } else {
        outerCallback();
      }
    }, function (error) {
      seriesCallback(error);
    });
  },

  function(seriesCallback){
    async.eachSeries(needsGroupUserPermissions, function(incoming, callback) {
      var user = allUserModelsByOldIds[incoming['user_id']];
      var group = allGroupsModelByOldIds[incoming['group_id']];
      console.log(incoming['user_id']);
      console.log(incoming['group_id']);
      console.log('Processing user in group user ' + user.email+' for group '+group.name);
      models.Group.addUserToGroupIfNeeded(group.id, { user: user, ypDomain: currentDomain }, function() {
        callback();
      });
    }, function(err){
      if (err) {
        console.log(err);
      } else {
        seriesCallback();
      }
    });
  },

  function(seriesCallback){
    async.eachSeries(needsGroupAdminPermissions, function(incoming, callback) {
      var user = allUserModelsByOldIds[incoming.user_id];
      var group = allGroupsModelByOldIds[incoming.group_id];
      console.log('Processing admin user in group user ' + user.email+' for group '+group.name);
      group.hasGroupAdmins(user).then(function(results) {
        console.log('Has user results: '+results);
        if (!results) {
          console.log('Adding user to group');
          group.addGroupAdmins(user).then(function () {
            callback();
          });
        } else {
          console.log('User already in group');
          callback();
        }
      })
    }, function(err){
      if (err) {
        console.log(err);
      } else {
        seriesCallback();
      }
    });
  },

  function(seriesCallback){
    async.eachSeries(needsGroupAdminPermissions, function(incoming, callback) {
      var user = allUserModelsByOldIds[incoming.user_id];
      var group = allGroupsModelByOldIds[incoming.group_id];
      console.log('Processing admin user in community user ' + user.email+' for community '+group.name);
      models.Community.find({
        where: {id: group.community_id}
      }).then(function (community) {
        community.hasCommunityAdmins(user).then(function(results) {
          if (!results) {
            console.log('Adding user to community');
            community.addCommunityAdmins(user).then(function () {
              callback();
            });
          } else {
            console.log('User already in community');
            callback();
          }
        })
      });
    }, function(err){
      if (err) {
        console.log(err);
      } else {
        seriesCallback();
      }
    });
  },

  // Delete activities from deleted objects
  function(seriesCallback) {
    models.AcActivity.findAll({
      where: {
        type: 'activity.post.new'
      },
      include: [
        {
          model: models.Post,
          required: true,
          where: {
            deleted: true
          }
        }
      ]
    }).then(function (activities) {
      async.eachSeries(activities, function (activity, innerCallback) {
        if (activity.Post.deleted!=true) {
          console.log("POST DELETED NOT TRUE");
        } else {
          console.log("DELETING: "+activity.Post.name);
        }
        activity.deleted = true;
        activity.save().then(function () {
          innerCallback();
        });
      }, function done() {
        seriesCallback();
      });
    })
  },

  function(seriesCallback) {
    models.AcActivity.findAll({
      where: {
        type: 'activity.post.status.change'
      },
      include: [
        {
          model: models.PostStatusChange,
          required: true,
          where: {
            deleted: true
          }
        }
      ]
    }).then(function (activities) {
      async.eachSeries(activities, function (activity, innerCallback) {
        activity.deleted = true;
        console.log("DELETING: "+activity.PostStatusChange.content);
        activity.save().then(function () {
          innerCallback();
        });
      }, function done() {
        seriesCallback();
      });
    })
  },

  function(seriesCallback) {
    models.AcActivity.findAll({
      where: {
        type: 'activity.point.new'
      },
      include: [
        {
          model: models.Point,
          required: true,
          where: {
            deleted: true
          }
        }
      ]
    }).then(function (activities) {
      async.eachSeries(activities, function (activity, innerCallback) {
        activity.deleted = true;
        console.log("DELETING: "+activity.Point.name);
        activity.save().then(function () {
          innerCallback();
        });
      }, function done() {
        seriesCallback();
      });
    })
  }
]);

