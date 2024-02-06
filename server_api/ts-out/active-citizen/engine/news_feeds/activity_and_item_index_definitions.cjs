"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
