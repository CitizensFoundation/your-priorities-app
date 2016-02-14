var models = require('../models');
var async = require('async');
var ip = require('ip');

var filename = process.argv['filename'];

var json = JSON.parse(require('fs').readFileSync(filename, 'utf8'));

var users = json['users'];
var domain = json['domain'];
var groups = json['groups'];
var communities = json['communities'];
var categories = json['categories'];
var posts = json['posts'];
var post_revisions = json['post_revisions'];
var post_status_changes = json['post_status_changes'];
var endorsements = json['endorsements'];
var points = json['points'];
var point_revisions = json['point_revisions'];
var comments = json['comments'];
var promotions = json['promotions'];
var activities = json['activities'];
var pages = json['pages'];

var allUsersByEmail = {};
var allUsersByOldIds = {};

var needsGroupUserPermissions = [];
var needsGroupAdminPermissions = [];

var allGroupsByOldIds = {};
var allCategoriesByOldIds = {};
var allPostsByOldIds = {};
var allPostRevisionsByOldIds = {};
var allPostStatusChangesByOldIds = {};
var allEndorsementsByOldIds = {};
var allPointsByOldIds = {};
var allPointRevisionsByOldIds = {};
var allCommentsByOldIds = {};
var allPromotionsByOldIds = {};
var allActivitiesByOldIds = {};
var allPagesByOldIds = {};

async.series([

  function(seriesCallback){
    async.each(users, function(incoming, callback) {
      console.log('Processing user ' + incoming);
      if (!allUsers[incoming.email]) {
        // TODO: Create legacy password
      } else {
        incoming['ip_address'] = ip.address();
        incoming['user_agent'] = 'yrpri script';

        if (incoming['group_id']) {
          needsGroupUserPermissions.add( {group_id: incoming['group_id'], user_id: incoming['id'] } );
          if (incoming['is_admin']) {
            needsGroupAdminPermissions.add( {group_id: incoming['group_id'], user_id: incoming['id'] } );
          }
          incoming['group_id'] = null;
        }

        var oldId = incoming['id'];
        incoming['id'] = null;

        models.User.build(incoming).save().then(function (user) {
          if (user) {
            allUsersByEmail[incoming.email] = user.id;
            allUsersByOldIds[oldId] = user.id;
            callback()
          } else {
            callback('no user created');
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
    async.each(communities, function(incoming, callback) {
      console.log('Processing community ' + incoming);
      incoming['ip_address'] = ip.address();
      incoming['user_agent'] = 'yrpri script';
      incoming['user_id'] = allUsersByOldIds[incoming['user_id']];

      var oldId = incoming['id'];
      incoming['id'] = null;

      models.Community.build(incoming).save().then(function (community) {
        if (community) {
          allCommunitiesByOldIds[oldId] = community.id;
          callback()
        } else {
          callback('no communitity created');
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
    async.each(groups, function(incoming, callback) {
      console.log('Processing group ' + incoming);
      incoming['ip_address'] = ip.address();
      incoming['user_agent'] = 'yrpri script';
      incoming['user_id'] = allUsersByOldIds[incoming['user_id']];

      var oldId = incoming['id'];
      incoming['id'] = null;
      models.Community.build(incoming).save().then(function (community) {
        if (community) {
          incoming['community_id'] = community.id;
          models.Group.build(incoming).save().then(function (group) {
            if (group) {
              allGroupsByOldIds[oldId] = group.id;
              callback()
            } else {
              callback('no group created');
            }
          }).catch(function (error) {
            console.error(error);
          });
        } else {
          callback('no communitity nor group created');
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
    async.each(categories, function(incoming, callback) {
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
    async.each(posts, function(incoming, callback) {
      console.log('Processing post ' + incoming);
      incoming['ip_address'] = ip.address();
      incoming['user_agent'] = 'yrpri script';
      incoming['user_id'] = allUsersByOldIds[incoming['user_id']];
      incoming['group_id'] = allGroupsByOldIds[incoming['group_id']];

      var oldId = incoming['id'];
      incoming['id'] = null;

      models.Post.build(incoming).save().then(function (post) {
        if (post) {
          allPostsByOldIds[oldId] = post.id;
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
    async.each(post_revisions, function(incoming, callback) {
      console.log('Processing post revision ' + incoming);
      incoming['ip_address'] = ip.address();
      incoming['user_agent'] = 'yrpri script';
      incoming['user_id'] = allUsersByOldIds[incoming['user_id']];
      incoming['group_id'] = allGroupsByOldIds[incoming['group_id']];
      incoming['post_id'] = allPostsByOldIds[incoming['post_id']];

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
    async.each(post_status_changes, function(incoming, callback) {
      console.log('Processing post status change ' + incoming);
      incoming['ip_address'] = ip.address();
      incoming['user_agent'] = 'yrpri script';
      incoming['user_id'] = allUsersByOldIds[incoming['user_id']];
      incoming['group_id'] = allGroupsByOldIds[incoming['group_id']];
      incoming['post_id'] = allPostsByOldIds[incoming['post_id']];

      var oldId = incoming['id'];
      incoming['id'] = null;

      models.PostStatusChange.build(incoming).save().then(function (post_status_change) {
        if (post_status_change) {
          allPostStatusChangesByOldIds[oldId] = post_status_change.id;
          callback()
        } else {
          callback('no post status change created');
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

