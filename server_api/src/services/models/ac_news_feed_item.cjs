"use strict";

const commonIndexForActivitiesAndNewsFeeds = require('../engine/news_feeds/activity_and_item_index_definitions.cjs').commonIndexForActivitiesAndNewsFeeds;
const _ = require('lodash');

module.exports = (sequelize, DataTypes) => {

  const AcNewsFeedItem = sequelize.define("AcNewsFeedItem", {
    type: { type: DataTypes.STRING, allowNull: false },
    latest_activity_at: { type: DataTypes.DATE, allowNull: false },
    status: { type: DataTypes.STRING, allowNull: false, defaultValue: 'active' },
    deleted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }
  }, {

    defaultScope: {
      where: {
        status: 'active',
        deleted: false
      }
    },

    indexes: _.concat(commonIndexForActivitiesAndNewsFeeds('latest_activity_at'), [
      {
        fields: ['id'],
        where: {
          deleted: false
        }
      },
      {
        fields: ['ac_notification_id'],
        where: {
          status: 'active',
          deleted: false
        }
      },
      {
        fields: ['ac_activity_id'],
        where: {
          status: 'active',
          deleted: false
        }
      }
    ]),

    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',

    underscored: true,

    tableName: 'ac_news_feed_items'
  });

  AcNewsFeedItem.associate = (models) => {
    AcNewsFeedItem.belongsTo(models.Domain,{ foreignKey: 'domain_id' });
    AcNewsFeedItem.belongsTo(models.Community,{ foreignKey: 'community_id' });
    AcNewsFeedItem.belongsTo(models.Group,{ foreignKey: 'group_id' });
    AcNewsFeedItem.belongsTo(models.Post,{ foreignKey: 'post_id' });
    AcNewsFeedItem.belongsTo(models.Point,{ foreignKey: 'point_id' });
    AcNewsFeedItem.belongsTo(models.User,{ foreignKey: 'user_id' });

    AcNewsFeedItem.belongsTo(models.Promotion,{ foreignKey: 'promotion_id' });
    AcNewsFeedItem.belongsTo(models.AcNotification,{ foreignKey: 'ac_notification_id' });
    AcNewsFeedItem.belongsTo(models.AcActivity,{ foreignKey: 'ac_activity_id' });
  };

  return AcNewsFeedItem;
};
