var models = require("../../../models/index.cjs");
var _ = require('lodash');

var getCommonWhereDateOptions = function(options) {
  var where = {};
  var dateBefore, dateAfter, afterDate, beforeData;

  var dateAtBase = {};

  if (options.beforeFilter && options.afterFilter) {
    dateAtBase[options.dateColumn] = {
      $or: {
        $lt: options.beforeFilter,
        $gt: options.afterFilter
      }
    };
  } else if (options.beforeFilter) {
    dateAtBase[options.dateColumn] = {
      $lt: options.beforeFilter
    };
  } else if (options.afterFilter) {
    dateAtBase[options.dateColumn] = {
      $gt: options.afterFilter
    };
  } else if (options.beforeOrEqualFilter && options.afterOrEqualFilter) {
    dateAtBase[options.dateColumn] = {
      $and: {
        $lte: options.beforeOrEqualFilter,
        $gte: options.afterOrEqualFilter
      }
    };
  } else if (options.beforeOrEqualFilter) {
    dateAtBase[options.dateColumn] = {
      $lte: options.beforeOrEqualFilter
    };
  } else if (options.afterOrEqualFilter) {
    dateAtBase[options.dateColumn] = {
      $gte: options.afterOrEqualFilter
    };
  }

  if (!options.afterDate && !options.beforeDate) {
    _.merge(where, dateAtBase)
  } else if (JSON.stringify(dateAtBase) == JSON.stringify({})) {
    if (options.beforeDate) {
      const beforeDate = {};

      beforeDate[options.dateColumn] = {
        $lt: options.beforeDate
      };

      _.merge(where, beforeDate);
    } else if (options.afterDate) {
      afterDate = {};

      afterDate[options.dateColumn] = {
        $gt: options.afterDate
      };

      _.merge(where, afterDate);
    }
  } else {
    if (options.beforeDate) {
      const beforeDate = {};

      beforeDate[options.dateColumn] = {
        $lt: options.beforeDate
      };

      _.merge(where, {
        $and: [
          beforeDate,
          dateAtBase
        ]
      });
    } else if (options.afterDate) {
      afterDate = {};

      afterDate[options.dateColumn] = {
        $gt: options.afterDate
      };

      _.merge(where, {
        $and: [
          afterDate,
          dateAtBase
        ]
      });
    }
  }

  return where;
};

var getCommonWhereOptions = function(options) {
  var where = {
    status: 'active',
    deleted: false
  };

  if (options.user_id) {
    where = _.merge(where, {
      user_id: options.user_id
    })
  }

  if (options.type) {
    where = _.merge(where, {
      type: options.type
    })
  }

  if (options.domain_id) {
    where = _.merge(where, {
      domain_id: options.domain_id
    })
  }

  if (options.community_id) {
    where = _.merge(where, {
      community_id: options.community_id
    })
  }

  if (options.group_id) {
    where = _.merge(where, {
      group_id: options.group_id
    })
  }

  if (options.post_id) {
    where = _.merge(where, {
      post_id: options.post_id
    })
  }

  return _.merge(where, getCommonWhereDateOptions(options));
};

var getModelDate = function(model, options, callback) {
  var where = getCommonWhereOptions(options);
  var dateColumn = options.dateColumn;
  if (model == models.AcActivity) {
    delete where.user_id;
    where = _.merge(where, {
      type: {
        $in: defaultKeyActivities
      }
    });
  }

  model.findOne({
    where: where,
    attributes: [dateColumn],
    order: [
      [ dateColumn, options.oldest ? 'asc' : 'desc' ]
    ]
  }).then(function (item) {
    if (item) {
      var date = item.getDataValue(dateColumn);
      callback(null, date);
    } else {
      callback();
    }
  }).catch(function (error) {
    callback(error);
  });
};

var getNewsFeedDate = function(options, type, callback) {
  getModelDate(models.AcNewsFeedItem, _.merge(options, {
    dateColumn: 'latest_activity_at',
    type: type
  }), callback)
};

var getActivityDate = function(options, callback) {
  getModelDate(models.AcActivity, _.merge(options, {
    dateColumn: 'created_at'
  }), callback)
};

var getProcessedRange = function(options, callback) {
  var where = getCommonWhereOptions(_.merge(options, {dateColumn: 'latest_activity_at'}));

  var order;
  if (options.oldest) {
    order = [['latest_activity_at', 'ASC']]
  } else {
    order = [['latest_activity_at', 'DESC']]
  }

  models.AcNewsFeedProcessedRange.findOne({
    where: where,
    attributes: ['id','latest_activity_at', 'oldest_activity_at', 'deleted'],
    order: [
      [ 'latest_activity_at', options.oldest ? 'asc' : 'desc' ]
    ]
  }).then(function (item) {
    if (item) {
      callback(null, item);
    } else {
      callback(null, null);
    }
  }).catch(function (error) {
    callback(error);
  });
};

var activitiesDefaultIncludes = function (options) {
  var community;
  var group;

  if (options.domain_id) {
    community = {
      model: models.Community,
      required: true,
      attributes: models.Community.defaultAttributesPublic,
      where: { access: models.Community.ACCESS_PUBLIC }
    };

    group = {
      model: models.Group,
      required: true,
      attributes: models.Group.defaultAttributesPublic,
      where: {
        $or: [
          { access: models.Group.ACCESS_PUBLIC },
          { access: models.Group.ACCESS_OPEN_TO_COMMUNITY },
        ],
      },
      include: [
        {
          model: models.Image, as: 'GroupLogoImages',
          attributes: models.Image.defaultAttributesPublic,
          required: false
        }
      ]
    }
  } else if (options.community_id) {
    community = {
      model: models.Community,
      attributes: models.Community.defaultAttributesPublic,
      required: false
    };

    group = {
      model: models.Group,
      required: true,
      attributes: models.Group.defaultAttributesPublic,
      where: {
        $or: [
          {
            access: models.Group.ACCESS_PUBLIC
          },
          {
            access: models.Group.ACCESS_OPEN_TO_COMMUNITY
          }
        ],
      },
      include: [
        {
          model: models.Image, as: 'GroupLogoImages',
          attributes: models.Image.defaultAttributesPublic,
          required: false
        }
      ]
    }
  } else {
    community = {
      model: models.Community,
      attributes: models.Community.defaultAttributesPublic,
      required: false
    };

    group = {
      model: models.Group,
      required: false,
      attributes: models.Group.defaultAttributesPublic,
      include: [
        {
          model: models.Image, as: 'GroupLogoImages',
          attributes: models.Image.defaultAttributesPublic,
          required: false
        }
      ]
    }
  }

  return [
    {
      model: models.User,
      required: true,
      attributes: models.User.defaultAttributesWithSocialMediaPublic,
      include: [
        {
          model: models.Image, as: 'UserProfileImages',
          attributes: models.Image.defaultAttributesPublic,
          required: false
        }
      ]
    },
    {
      model: models.Domain,
      required: true,
      attributes: models.Domain.defaultAttributesPublic
    },
    community,
    group,
    {
      model: models.Post,
      required: false,
      attributes: models.Post.defaultAttributesPublic,
      include: [
        {
          model: models.Group,
          required: false,
          attributes: ['id', 'configuration', 'theme_id', 'access']
        },
        {
          model: models.User,
          attributes: ['id'],
          required: false
        },
        {
          model: models.Image,
          as: 'PostHeaderImages',
          attributes: models.Image.defaultAttributesPublic,
          required: false
        },
        {
          model: models.Audio,
          required: false,
          attributes: ['id','formats','updated_at','listenable'],
          as: 'PostAudios',
        },
        {
          // Category
          model: models.Category,
          required: false,
          include: [
            {
              model: models.Image,
              attributes: models.Image.defaultAttributesPublic,
              required: false,
              as: 'CategoryIconImages'
            }
          ]
        }
      ]
    },
    {
      model: models.Point,
      required: false,
      attributes: [...models.Point.defaultAttributesPublic, ...['user_id']],
      include: [
        {
          model: models.PointRevision,
          attributes: models.PointRevision.defaultAttributesPublic,
          include: [
            {
              model: models.User,
              attributes: models.User.defaultAttributesWithSocialMediaPublic,
              required: false
            }
          ],
          required: false
        },
        {
          model: models.Audio,
          required: false,
          attributes: ['id','formats','updated_at','listenable'],
          as: 'PointAudios'
        },
        {
          model: models.Post,
          attributes: ['id', 'group_id'],
          required: false
        },
        {
          model: models.User,
          attributes: ['id'],
          required: false
        }
      ]
    },
    {
      model: models.PostStatusChange,
      attributes: models.PostStatusChange.defaultAttributesPublic,
      required: false
    }
  ]
};

  // Example query 1
  //  Get latest
    // If newer activities than latest_processed_range
      // Load latest notification news feed items with created_at $gt oldest_activity being processed
      // Generate items from activities newer than latest_processed_range_start or Max 30
      // Create processed_range


  // Get more
    // If activities older than last viewed and newer than last_processed_at (older than last viewed also)
      // Generate Items
      // Load latest notification news feed items with created_at $gt oldest_activity being processed
      // Create processed_range
    // Else load all items in the time range next processed range (older than last viewed)
  //  Get new updated
    // If newer activities than latest_processed_range and newer than last viewed
      // Generate items from activities newer than latest_processed_range_start and newer than the last viewed or Max 30
      // Load latest notification news feed items with created_at $gt oldest_activity being processed
      // Create processed_range
  // Else if processed_range newer than last viewed
    // load all items in the time range
  // Else if notification generated items newer than the last viewed
    // Deliver items


  // If I request older items by scrolling down

  //  AcNewsFeed Options
  //    Limit 30
  //  AcActivities
  //    modified_at $gt latest_dynamically_generated_processed_news_feed_ac_activity_modified_at
  //    modified_at $lt oldest_dynamically_generated_processed_news_feed_ac_activity_modified_at

  // Example query 2
  //  Get latest since last
  //  AcNewsFeed Options
  //    modified_at $gt latest_news_feed_item_at
  //  AcActivities
  //    $and
  //      A
  //        modified_at $gt latest_news_feed_item_at
  //      B
  //        modified_at $gt last_dynamically_generated_processed_news_feed_ac_activity_modified_at
  //        modified_at $lt first_dynamically_generated_processed_news_feed_ac_activity_modified_at

  // Example query 3
  // Get older since last shown item
  //  AcNewsFeed Options
  //    modified_at $lt last_shown_news_feed_item_at
  //  AcActivities
  //   $and
  //    A
  //      modified_at $lt last_shown_news_feed_item_at
  //    B
  //      modified_at $gt last_dynamically_generated_processed_news_feed_ac_activity_modified_at
  //      modified_at $lt first_dynamically_generated_processed_news_feed_ac_activity_modified_at

//defaultKeyActivities = ['activity.post.status.change','activity.post.officialStatus.successful',
//  'activity.point.new','activity.post.new','activity.post.officialStatus.failed',
//  'activity.post.officialStatus.inProgress'];

var defaultKeyActivities = ['activity.post.status.change','activity.point.new','activity.post.new',
                        'activity.point.newsStory.new' ]; // TODO: Add back user images

var excludeActivitiesFromFilter = ['activity.point.newsStory.new','activity.post.status.change'];

module.exports = {
  activitiesDefaultIncludes: activitiesDefaultIncludes,
  getCommonWhereOptions: getCommonWhereOptions,
  getCommonWhereDateOptions: getCommonWhereDateOptions,
  defaultKeyActivities: defaultKeyActivities,
  excludeActivitiesFromFilter: excludeActivitiesFromFilter,
  getActivityDate: getActivityDate,
  getProcessedRange: getProcessedRange,
  getNewsFeedDate: getNewsFeedDate
};
