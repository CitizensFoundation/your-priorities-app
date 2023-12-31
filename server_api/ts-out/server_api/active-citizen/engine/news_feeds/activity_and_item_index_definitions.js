"use strict";
var commonIndexForActivitiesAndNewsFeeds = function (createdAtField) {
    return [
        {
            fields: ['post_id', 'user_id', createdAtField, 'id'],
            where: {
                status: 'active',
                deleted: false
            }
        }
    ];
};
module.exports = {
    commonIndexForActivitiesAndNewsFeeds: commonIndexForActivitiesAndNewsFeeds
};
