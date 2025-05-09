var models = require('../../../models/index.cjs');
var async = require('async');
var log = require('../../utils/logger.cjs');
var _ = require('lodash');
var moment = require('moment');
var i18n = require('../../utils/i18n.cjs');
var Backend = require('i18next-fs-backend');
var sendOneEmail = require('./emails_utils.cjs').sendOneEmail;

var sendPostNew = function (delayedNotification, callback) {
  console.log("sendPostNew");
  console.log("User email: "+delayedNotification.User.email);
  async.forEach(delayedNotification.AcNotifications, function (notification, seriesCallback) {
    console.log("Type: "+notification.AcActivities[0].type);
    console.log("Post name: "+notification.AcActivities[0].Post.name);
    console.log("Domain name: "+notification.AcActivities[0].Domain.name);
    console.log("User name: "+notification.AcActivities[0].User.name);
    seriesCallback();
  }, function (error) {
    callback();
  });
};

var sendPostEndorsement = function (delayedNotification, callback) {
  console.log("sendPostEndorsement");
  console.log("User email: "+delayedNotification.User.email);
  async.forEach(delayedNotification.AcNotifications, function (notification, seriesCallback) {
    console.log("Type: "+notification.AcActivities[0].type);
    console.log("Post name: "+notification.AcActivities[0].Post.name);
    console.log("Domain name: "+notification.AcActivities[0].Domain.name);
    console.log("User name: "+notification.AcActivities[0].User.name);
    seriesCallback();
  }, function (error) {
    callback();
  });
};

var sendPointNew = function (delayedNotification, callback) {
  console.log("sendPointNew");
  console.log("User email: "+delayedNotification.User.email);
  async.forEach(delayedNotification.AcNotifications, function (notification, seriesCallback) {
    console.log("Type: "+notification.AcActivities[0].type);
    console.log("Post name: "+notification.AcActivities[0].Post.name);
    console.log("Domain name: "+notification.AcActivities[0].Domain.name);
    console.log("User name: "+notification.AcActivities[0].User.name);
    seriesCallback();
  }, function (error) {
    callback();
  });
};

var formatNameArray = function (arr){
  var outStr = "";
  if (arr.length === 1) {
    outStr = arr[0];
  } else if (arr.length === 2) {
    //joins all with "and" but no commas
    //example: "bob and sam"
    outStr = arr.join(' & ');
  } else if (arr.length > 2) {
    //joins all with commas, but last one gets ", and" (oxford comma!)
    //example: "bob, joe, and sam"
    outStr = arr.slice(0, -1).join(', ') + ', & ' + arr.slice(-1);
  }
  return outStr;
};

var writeHeader = function (emailUser, headerText) {
  return '<h1>'+headerText+'</h1><table style="padding:8px">';
};

var writeDomainHeader = function (email, domain) {
  email += '<div style="display: flex;margin: 8px;padding: 8px;border solid 1px;background-color: #FFF;color: #222;">';
  email += '<div style="max-width:200px;"><img src="'+domain.getImageFormatUrl(1)+'"/></div>';
  email += '<div style="flex-grow:1"><div>'+domain.name+'</div></div>';
  return email;
};

var writeCommunityHeader = function (email, community) {
  email += '<div style="display: flex;margin: 8px;padding: 8px;border solid 1px;background-color: #FFF;color: #222;">';
  email += '<div style="max-width:200px;"><img src="'+community.getImageFormatUrl(1)+'"/></div>';
  email += '<div style="flex-grow:1"><div>'+community.name+'</div></div>';
  return email;
};

var writeGroupHeader = function (email, group) {
  email += '<div style="display: flex;margin: 8px;padding: 8px;border solid 1px;background-color: #FFF;color: #222;">';
  email += '<div style="max-width:200px;"><img src="'+group.getImageFormatUrl(1)+'"/></div>';
  email += '<div style="flex-grow:1"><div>'+group.name+'</div></div>';
  return email;
};

var writePostHeader = function (email, post) {
  email += '<div style="padding:8px">'+post.name+'</div>';
  return email;
};

var writePointHeader = function (email, point) {
  email += '<div style="padding:8px">'+point.content+'</div>';
  return email;
};

var writePointQualities = function (email, helpfulNames, unhelpfulNames) {
  if (helpfulNames && helpfulNames.length>0) {
    email += '<div style="padding:8px">'+i18n.t('notification.email.foundHelpful')+': '+formatNameArray(helpfulNames)+'</div>';
  }
  if (unhelpfulNames && unhelpfulNames.length>0) {
    email += '<div style="padding:8px">'+i18n.t('notification.email.foundNotHelpful')+': '+formatNameArray(unhelpfulNames)+'</div>';
  }
  return email;
};

var writeFooter = function (email, emailUser) {
  email += '</table>'
  return email;
};

var setLanguage = function (user, defaultLocaleObject, item, callback) {
  var locale;

  if (user.default_locale && user.default_locale != "") {
    locale = user.default_locale;
  } else if (defaultLocaleObject && defaultLocaleObject.default_locale && defaultLocaleObject.default_locale != "") {
    locale = defaultLocaleObject.default_locale;
  } else if (item.Community && item.Community.default_locale && item.Community.default_locale != "") {
    locale = item.Community.default_locale;
  } else if (item.Domain && item.Domain.default_locale && item.Domain.default_locale != "") {
    locale = item.Domain.default_locale;
  } else {
    locale = 'en';
  }
  log.info("Process delayed notifications selected locale", {locale: locale});

  i18n.changeLanguage(locale, function (err, t) {
    callback(err);
  });
};

var processNewPosts = function (email, groupItems) {
  var addedHeader = false;
  _.each(groupItems, function (item) {
    if (item.type=='notification.post.new') {
      if (!addedHeader) {
       writeNewPostsHeader(email);
       addedHeader = true;
      }
      writePost(email, item)
    }
   });
};

var processNewPoints = function (email, groupItems) {
  var addedHeader = false;
  var newPointItems = _.filter(groupItems, function (item) {
    return item.type == 'notification.point.new';
  });
  _.each(newPointItems, function (item) {
    if (!addedHeader) {
      writeNewPointsHeader(email);
      addedHeader = true;
    }
    writePoint(email, item);
  });
};

var processPostVotes = function (email, groupItems) {
  var addedHeader = false;
  var newEndorsementItems = _.filter(groupItems, function (item) {
    return item.type == 'notification.post.endorsement';
  });
  newEndorsementItems = _.uniqBy(newEndorsementItems, function (item) {
    return item.post_id
  });
  _.each(newEndorsementItems, function (item) {
    if (!addedHeader) {
      writeNewPostVotesHeader(email);
      addedHeader = true;
    }
    writeVotedPost(email, item);
  });
};


var processPointVotes = function (email, groupItems) {
  var addedHeader = false;
  var newPointVotes = _.filter(groupItems, function (item) {
    return item.type == 'notification.point.quality';
  });
  newPointVotes = _.uniqBy(newPointVotes, function (item) {
    return item.point_id
  });
  _.each(newPointVotes, function (item) {
    if (!addedHeader) {
      writeNewPointVotesHeader(email);
      addedHeader = true;
    }
    writeVotedPoint(email, item);
  });
};

var processNewNewsStories = function (email, groupItems) {
  var addedHeader = false;
  var newNewsStories = _.filter(groupItems, function (item) {
    return item.type == 'notification.point.newsStory';
  });
  _.each(newNewsStories, function (item) {
    if (!addedHeader) {
      writeNewNewsStoryHeader(email);
      addedHeader = true;
    }
    writeNewsStory(email, item);
  });
};

var sendNotificationEmail = function (delayedNotification, callback) {
  console.log("sendNotificationEmail User email: "+delayedNotification.User.email);

  var emailUser = delayedNotification.User;
  var notifications = [];
  var email;

  async.forEach(delayedNotification.AcNotifications, function (notificationWithId, seriesCallback) {
    models.AcNotification.findOne({
      where: {
        id: notificationWithId.id
      },
      order: [
        [ { model: models.AcActivity, as: 'AcActivities' }, models.Post, { model: models.Image, as: 'PostHeaderImages' } ,'updated_at', 'asc' ],
        [ { model: models.AcActivity, as: 'AcActivities' }, models.Domain, { model: models.Image, as: 'DomainLogoImages' } ,'updated_at', 'asc' ],
        [ { model: models.AcActivity, as: 'AcActivities' }, models.Community, { model: models.Image, as: 'CommunityLogoImages' } ,'updated_at', 'asc' ],
        [ { model: models.AcActivity, as: 'AcActivities' }, models.Group, { model: models.Image, as: 'GroupLogoImages' } ,'updated_at', 'asc' ]
      ],
      include: [
        {
          model: models.AcActivity, as: 'AcActivities',
          required: true,
          where: {
            deleted: false
          },
          include: [
            {
              model: models.User,
              required: true
            },
            {
              model: models.Post,
              required: false,
              include: [
                { model: models.Image,
                  as: 'PostHeaderImages',
                  required: false
                }
              ]
            },
            {
              model: models.Domain,
              required: true,
              include: [
                {
                  model: models.Image,
                  as: 'DomainLogoImages',
                  required: false
                }
              ]
            },
            {
              model: models.Community,
              required: true,
              include: [
                {
                  model: models.Image,
                  as: 'CommunityLogoImages',
                  required: false
                }
              ]
            },
            {
              model: models.Group,
              required: true,
              include: [
                {
                  model: models.Image,
                  as: 'GroupLogoImages',
                  required: false
                }
              ]
            },
            {
              model: models.Point,
              required: false,
              include: [
                {
                  model: models.Post,
                  required: false
                }
              ]
            }
          ]
        }
      ]
    }).then(function (notification) {
      if (notification) {
        notifications.push(notification);
        seriesCallback();
      } else {
        console.error("No notification");
        seriesCallback();
      }
    }).catch(function (error) {
      seriesCallback(error);
    });
  }, function (error) {
    var itemsWithIds = [];
    _.each(notifications, function (item) {
      item.domain_id = item.AcActivities[0].domain_id;
      item.community_id = item.AcActivities[0].community_id;
      item.group_id = item.AcActivities[0].group_id;
      item.activity = item.AcActivities[0];
      itemsWithIds.push(item);
    });
    if (itemsWithIds.length>0) {
      var domains = _.groupBy(itemsWithIds, 'domain_id');
      var firstDomain, firstCommunity;

      async.eachSeries(domains, function (domainCommunities, domainSeriesCallback) {
        var domain = domainCommunities[0].Domain;
        setLanguage(emailUser, domain, domainCommunities[0], function () {
          email = "";
          var communities = _.groupBy(domainCommunities, 'community_id');

          _.forEach(communities, function (communityGroups) {
            setLanguage(emailUser, communityGroups[0].Community, domainCommunities[0], function () {
              writeCommunityHeader(email, communityGroups[0].Community);
              var groups = _.groupBy(communityGroups, 'group_id');

              _.forEach(groups, function (groupItems) {
                writeGroupHeader(email,  groupItems[0].Group);
                processNewPosts(email, groupItems);
                processNewPoints(email, groupItems);
                processPostVotes(email, groupItems);
                processPointVotes(email, groupItems);
                processNewNewsStories(email, groupItems);
              });
            });
          });

          const emailLocals = {
            subject: { translateToken: 'notifications.email.newsFrom', contentName: domain.name },
            template: 'delayed_notification',
            user: emailUser,
            domain: domain,
            emailContents: email
          };
          sendOneEmail(emailLocals, domainSeriesCallback);
        });
      }, function (error) {
        callback(error);
      });
    } else {
      console.error("No items");
      callback();
    }
  });
};

var sendPointNewsStory = function (delayedNotification, callback) {
  console.log("sendPointNewsStory");
  console.log("User email: "+delayedNotification.User.email);
  async.forEach(delayedNotification.AcNotifications, function (notification, seriesCallback) {
    console.log("Type: "+notification.AcActivities[0].type);
    console.log("Post name: "+notification.AcActivities[0].Post.name);
    console.log("Domain name: "+notification.AcActivities[0].Domain.name);
    console.log("User name: "+notification.AcActivities[0].User.name);
    seriesCallback();
  }, function (error) {
    callback();
  });
};

var sendPointComment = function (delayedNotification, callback) {
  console.log("sendPointComment");
  console.log("User email: "+delayedNotification.User.email);
  async.forEach(delayedNotification.AcNotifications, function (notification, seriesCallback) {
    console.log("Type: "+notification.AcActivities[0].type);
    console.log("Post name: "+notification.AcActivities[0].Post.name);
    console.log("Domain name: "+notification.AcActivities[0].Domain.name);
    console.log("User name: "+notification.AcActivities[0].User.name);
    seriesCallback();
  }, function (error) {
    callback();
  });
};

var sendNotification = function (notification, callback) {
  switch(notification.type) {
    case "xnotification.post.new":
      sendPostNew(notification, callback);
      break;
    case "xnotification.post.endorsement":
      sendPostEndorsement(notification, callback);
      break;
    case "xnotification.point.new":
      sendPointNew(notification, callback);
      break;
    case "notification.point.quality":
      sendPointQuality(notification, callback);
      break;
    case "xnotification.point.newsStory":
      sendPointNewsStory(notification, callback);
      break;
    case "xnotification.point.comment":
      sendPointComment(notification, callback);
      break;
    default:
//      callback("Unknown notification type");
      callback();
  }
};

var getDelayedNotificationToProcess = function (frequency, callback) {
  var beforeDate;
  if (frequency==1) {
    console.log("Processing hourly");
    beforeDate = {name: "date", after: moment().add(-1, 'hours').toDate()};
  } else if (frequency==2) {
    console.log("Processing daily");
    beforeDate = { name:"date", after: moment().add(-1, 'days').toDate() };
  } else if (frequency==3) {
    console.log("Processing weekly");
    beforeDate = { name:"date", after: moment().add(-7, 'days').toDate() };
  } else if (frequency==4) {
    console.log("Processing monthly");
    beforeDate = { name:"date", after: moment().add(-1, 'months').toDate() };
  }

  if (beforeDate) {
    models.AcDelayedNotification.findAll({
      where: {
        frequency: frequency,
        delivered: false,
        created_at: {
          $lt: beforeDate
        }
      },
      include: [
        {
          model: models.User,
          required: true
        },
        {
          model: models.AcNotification, as: 'AcNotifications',
          attributes: ['id'],
          required: true
        }
      ]
    }).then(function (delayedNotifications) {
      async.forEach(delayedNotifications, function (delayedNotification, seriesCallback) {
        sendNotification(delayedNotification, seriesCallback);
      }, function (error) {
        callback(error);
      });
    }).catch(function (error) {
      callback(error);
    });
  } else {
    callback("Unknown frequency state");
  }
};

var path = require('path');
var localesPath = path.resolve(__dirname, '../../locales');

i18n
  .use(Backend)
  .init({
    preload: ['en', 'fr', 'hr', 'is', 'no', 'pl'],

    fallbackLng:'en',

    // this is the defaults
    backend: {
      // path where resources get loaded from
      loadPath: localesPath+'/{{lng}}/translation.json',

      // path to post missing resources
      addPath: localesPath+'/{{lng}}/translation.missing.json',

      // jsonIndent to use when storing json files
      jsonIndent: 2
    }
  }, function (err, t) {
    log.info("Have Loaded i18n", {err: err});
    var frequencies = [1,2,3,4];
    async.eachSeries(frequencies, function (frequency, seriesCallback) {
      getDelayedNotificationToProcess(frequency, seriesCallback);
    });
  });


