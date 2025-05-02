"use strict";
const models = require("../../models/index.cjs");
const log = require('../utils/logger.cjs');
const _ = require("lodash");
const recountGroupFolder = async (workPackage, callback) => {
    try {
        log.info(`recountGroupFolder ${workPackage.groupId}`);
        let stackSize = 0;
        const maxStackSize = 100;
        let haveCompletedSearch = false;
        const groupdIdsToCount = [];
        let nextGroupIdToSearch = workPackage.groupId;
        while (!haveCompletedSearch || stackSize < maxStackSize) {
            stackSize++;
            const group = await models.Group.findOne({
                where: {
                    id: nextGroupIdToSearch,
                },
                attributes: ['in_group_folder_id']
            });
            if (group && group.in_group_folder_id) {
                groupdIdsToCount.push(group.in_group_folder_id);
                nextGroupIdToSearch = group.in_group_folder_id;
            }
            else {
                haveCompletedSearch = true;
            }
        }
        for (let i = 0; i < groupdIdsToCount.length; i++) {
            const groupId = groupdIdsToCount[i];
            const groupToCount = await models.Group.findOne({
                where: {
                    id: groupId,
                },
                attributes: ['id', 'in_group_folder_id'],
            });
            const subGroupsToCount = await models.Group.findAll({
                where: {
                    in_group_folder_id: groupId,
                },
                attributes: ['id', 'in_group_folder_id', 'counter_points', 'counter_posts', 'counter_users'],
                include: [
                    {
                        model: models.User,
                        as: 'GroupUsers',
                        attributes: ['id']
                    }
                ]
            });
            let counter_posts = 0;
            let counter_points = 0;
            let allUsers = [];
            for (let j = 0; j < subGroupsToCount.length; j++) {
                counter_posts += subGroupsToCount[j].counter_posts;
                counter_points += subGroupsToCount[j].counter_points;
                if (subGroupsToCount[j].GroupUsers) {
                    allUsers = _.union(allUsers, subGroupsToCount[j].GroupUsers.map(user => user.id));
                }
            }
            await groupToCount.reload();
            groupToCount.counter_points = counter_points;
            groupToCount.counter_posts = counter_posts;
            groupToCount.counter_users = Math.max(_.uniq(allUsers).length, 1);
            await groupToCount.save();
        }
        callback();
    }
    catch (error) {
        callback(error);
    }
};
module.exports = {
    recountGroupFolder
};
