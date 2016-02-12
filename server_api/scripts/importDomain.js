var models = require('../models');
var async = require('async');
var ip = require('ip');

var filename = process.argv['filename'];

var json = JSON.parse(require('fs').readFileSync(filename, 'utf8'));

var users = json['users'];
var domain = json['domain'];
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
var activities = json['activities'];
var pages = json['pages'];

var allUsersByEmail = {};
var allUsersByOldIds = {};

var needsGroupUserPermissions = [];
var needsGroupAdminPermissions = [];

var allGroupsByOldIds = {};

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
    async.each(groups, function(incoming, callback) {
      console.log('Processing group ' + incoming);
      incoming['ip_address'] = ip.address();
      incoming['user_agent'] = 'yrpri script';
      incoming['user_id'] = allUsersByOldIds[incoming['user_id']];

      var oldId = incoming['id'];
      incoming['id'] = null;

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
          allGroupsByOldIds[oldId] = category.id;
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

