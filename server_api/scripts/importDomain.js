var models = require('../models');
var async = require('async');
var ip = require('ip');

var filename = process.argv[2];

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
var comments = json['comments'];
var promotions = json['promotions'];
var pages = json['pages'];
var activities = json['activities'];

var allUsersIdsByEmail = {};
var allUsersModelByEmail = {};
var allUsersByOldIds = {};
var allUsersModelByNewIds = {};

var needsGroupUserPermissions = [];
var needsGroupAdminPermissions = [];

var allGroupsByOldIds = {};
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

var fakeReq;

var activitiesTransform = {
  ActivityIdeaStatusUpdate: 'activity.IdeaStatusUpdate',
  ActivityPointHelpfulDelete: 'activity.PointHelpfulDelete',
  ActivityIdeaOfficialStatusSuccessful: 'activity.IdeaOfficialStatusSuccessful',
  ActivityIdeaRevisionName: 'activity.IdeaRevisionName',
  ActivityCapitalAdNew: 'activity.CapitalAdNew',
  ActivityCapitalAdRefunded: 'activity.CapitalAdRefunded',
  ActivityPointRevisionNeutral: 'activity.PointRevisionNeutral',
  ActivityIdeaRevisionCategory: 'activity.IdeaRevisionCategory',
  ActivityFollowingDelete: 'activity.FollowingDelete',
  ActivityIdea1: 'activity.Idea1',
  ActivityPointRevisionContent: 'activity.PointRevisionContent',
  ActivityEndorsementNew: 'activity.EndorsementNew',
  ActivityCapitalPointHelpfulUndeclareds: 'activity.CapitalPointHelpfulUndeclareds',
  ActivityCapitalPointHelpfulEveryone: 'activity.CapitalPointHelpfulEveryone',
  ActivityCapitalPointHelpfulDeleted: 'activity.CapitalPointHelpfulDeleted',
  ActivityPointUnhelpful: 'activity.PointUnhelpful',
  ActivityUserRecruited: 'activity.UserRecruited',
  ActivityFollowingNew: 'activity.FollowingNew',
  ActivityPointUnhelpfulDelete: 'activity.PointUnhelpfulDelete',
  ActivityUserNew: 'activity.UserNew',
  ActivityIdeaRevisionDescription: 'activity.IdeaRevisionDescription',
  ActivityEndorsementDelete: 'activity.EndorsementDelete',
  ActivityIdeaDebut: 'activity.IdeaDebut',
  ActivityPointRevisionWebsite: 'activity.PointRevisionWebsite',
  ActivityUserRankingDebut: 'activity.UserRankingDebut',
  ActivityPointHelpful: 'activity.PointHelpful',
  ActivityPointDeleted: 'activity.PointDeleted',
  ActivityUserPictureNew: 'activity.UserPictureNew',
  ActivityBulletinProfileNew: 'activity.BulletinProfileNew',
  ActivityIdeaOfficialStatusInTheWorks: 'activity.IdeaOfficialStatusInTheWorks',
  ActivityPointNew: 'activity.PointNew',
  ActivityContentRemoval: 'activity.ContentRemoval',
  ActivityCapitalPointHelpfulEndorsers: 'activity.CapitalPointHelpfulEndorsers',
  ActivityIssueIdeaRising1: 'activity.IssueIdeaRising1',
  ActivityIdeaNew: 'activity.IdeaNew',
  ActivityOppositionNew: 'activity.OppositionNew',
  ActivityCommentParticipant: 'activity.CommentParticipant',
  ActivityDiscussionFollowingDelete: 'activity.DiscussionFollowingDelete',
  ActivityCapitalPointHelpfulOpposers: 'activity.CapitalPointHelpfulOpposers',
  ActivityDiscussionFollowingNew: 'activity.DiscussionFollowingNew',
  ActivityIdeaRenamed: 'activity.IdeaRenamed',
  ActivityIdeaRising1: 'activity.IdeaRising1',
  ActivityPointRevisionName: 'activity.PointRevisionName',
  ActivityPointRevisionOpposition: 'activity.PointRevisionOpposition',
  ActivityIssueIdeaControversial1: 'activity.IssueIdeaControversial1',
  ActivityUserProbation: 'activity.UserProbation',
  ActivityCapitalUserRecruited: 'activity.CapitalUserRecruited',
  ActivityCapitalFollowers: 'activity.CapitalFollowers',
  ActivityIssueIdea1: 'activity.IssueIdea1',
  ActivityIdeaOfficialStatusFailed: 'activity.IdeaOfficialStatusFailed',
  ActivityOppositionDelete: 'activity.OppositionDelete',
  ActivityInvitationAccepted: 'activity.InvitationAccepted',
  ActivityPointRevisionSupportive: 'activity.PointRevisionSupportive',
  ActivityIdea1Opposed: 'activity.Idea1Opposed',
  ActivityBulletinProfileAuthor: 'activity.BulletinProfileAuthor'
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

async.series([

  function(seriesCallback){
    console.log('Processing domain '+domain);
    domain['ip_address'] = ip.address();
    domain['user_agent'] = 'yrpri script';
    domain['default_locale'] = 'is';

    models.Domain.build(domain).save().then(function (domain) {
      if (domain) {
        currentDomain = domain;
        fakeReq = { ypDomain: domain };
        seriesCallback();
      } else {
        seriesCallback('no domain created');
      }
    }).catch(function (error) {
      console.error(error);
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

      if (allUsersIdsByEmail[incoming.email]) {
        console.log("Duplicate email: " + incoming.email);
        var masterUser = allUsersModelByEmail[incoming.email];
        allUsersByOldIds[oldId] = masterUser.id;
        async.series([
          function(innerSeriesCallback){
            if (incoming.encrypted_password &&
                incoming.encrypted_password != masterUser.encrypted_password) {
              models.UserLegacyPassword.build({
                encrypted_password: incoming.encrypted_password,
                user_id: masterUser.id
              }).save().then(function () {
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

        if (incoming['group_id']) {
          needsGroupUserPermissions.push( {group_id: incoming['group_id'], user_id: incoming['id'] } );
          if (incoming['is_admin']) {
            needsGroupAdminPermissions.push( {group_id: incoming['group_id'], user_id: incoming['id'] } );
          }
          incoming['group_id'] = null;
        }

        models.User.build(incoming).save().then(function (user) {
          if (user) {
            allUsersIdsByEmail[incoming.email] = user.id;
            allUsersByOldIds[oldId] = user.id;
            allUsersModelByNewIds[user.id] = user;
            allUsersModelByEmail[incoming.email] = user;
            callback()
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
              callback()
            });
          } else {
            callback('no group created');
          }
        }).catch(function (error) {
          console.error(error);
        });
      } else if (currentDomain.domain_name.indexOf("yrpri.org") > -1 &&
                 incoming['iso_country_id']) {
        allCommunitiesByOldGroupIds[oldId] = incoming['community_id'] = communityWC.id;

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
              callback()
            });
          } else {
            callback('no group created');
          }
        }).catch(function (error) {
          console.error(error);
        });
      } else {
        incoming['domain_id'] = currentDomain.id;

        models.Community.build(incoming).save().then(function (community) {
          if (community) {
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
              allCommunitiesByOldGroupIds[oldId] = community.id;
              models.Group.build(incoming).save().then(function (group) {
                if (group) {
                  group.updateAllExternalCounters(fakeReq, 'up', 'counter_groups', function () {
                    allGroupsByOldIds[oldId] = group.id;
                    callback()
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
      console.log('Processing category ' + incoming);
      incoming['ip_address'] = ip.address();
      incoming['user_agent'] = 'yrpri script';
      incoming['user_id'] = allUsersByOldIds[incoming['user_id']];
      incoming['group_id'] = allGroupsByOldIds[incoming['group_id']];

      var oldId = incoming['id'];
      incoming['id'] = null;

      models.Category.build(incoming).save().then(function (category) {
        if (category) {
          allCategoriesByOldIds[oldId] = category.id;
          callback()
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

      incoming['status']="active";

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

      models.Point.build(incoming).save().then(function (point) {
        if (point) {
          allPointsByOldIds[oldId] = point.id;
          callback()
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
    async.eachSeries(comments, function(incoming, callback) {
      console.log('Processing comments ' + incoming);
      incoming['user_id'] = allUsersByOldIds[incoming['user_id']];
      incoming['post_id'] = allPostsByOldIds[incoming['post_id']];
      incoming['ip_address'] = ip.address();
      incoming['user_agent'] = 'yrpri script';
      incoming['value'] = 0;
      incoming['status'] = 'active';

      var oldId = incoming['id'];
      incoming['id'] = null;

      models.Point.build(incoming).save().then(function (point) {
        if (point) {
          allCommentsByOldIds[oldId] = point.id;
          incoming['point_id'] = point.id;
          incoming['post_id'] = null;
          models.PointRevision.build(incoming).save().then(function (point_revision) {
            if (point_revision) {
              callback()
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
      incoming['group_id'] = allGroupsByOldIds[incoming['group_id']];
      incoming['domain_id'] = currentDomain.id;

      var oldId = incoming['id'];
      incoming['id'] = null;

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
    async.eachSeries(activities, function(incoming, callback) {
      console.log('Processing activity ' + incoming);

      incoming['user_id'] = allUsersByOldIds[incoming['user_id']];

      incoming['domain_id'] = currentDomain.id;

      if (incoming['post_id']) {
        incoming['post_id'] = allPostsByOldIds[incoming['post_id']];
      }

      if (incoming['group_id']) {
        incoming['group_id'] = allGroupsByOldIds[incoming['group_id']];
        incoming['community_id'] = allCommunitiesByOldGroupIds[incoming['group_id']];
      }

      if (incoming['point_id']) {
        incoming['point_id'] = allPostsByOldIds[incoming['point_id']];
      }

      if (incoming['comment_id']) {
        incoming['point_id'] = allCommentsByOldIds[incoming['comment_id']];
      }

      var oldId = incoming['id'];
      incoming['id'] = null;

      incoming['access'] = 0;

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

  function(seriesCallback){
    // TODO: Process GroupUser GroupAdmin
    seriesCallback();
  }
]);



// Load instance
// Create domain

// Load all users
// Create all users and store a reference to the old user id

// Load all subinstances
// Create communities and groups from sub instances

// Load ideas and create posts
// Load points and create points
// Load comments and create points
// Load activities and create activities

// Load all

