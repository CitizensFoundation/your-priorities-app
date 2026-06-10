"use strict";
const _ = require("lodash");
const moment = require("moment");
const models = require("../../../../models/index.cjs");
const FraudBase = require('./FraudBase.cjs');
const log = require("../../../../utils/logger.cjs");
const recountCommunity = require('../../../../utils/recount_utils.cjs').recountCommunity;
const recountPosts = require('../../../../utils/recount_utils.cjs').recountPosts;
const recountPoints = require('../../../../utils/recount_utils.cjs').recountPoints;
class FraudDeleteBase extends FraudBase {
    constructor(workPackage) {
        super(workPackage);
        this.postsToRecount = [];
        this.pointsToRecount = [];
        this.deletedItemIds = [];
        this.job = null;
    }
    sliceIntoChunks(arr, chunkSize) {
        const res = [];
        for (let i = 0; i < arr.length; i += chunkSize) {
            const chunk = arr.slice(i, i + chunkSize);
            res.push(chunk);
        }
        return res;
    }
    async getItemsById() {
        // this.job.internal_data.idsToDelete
        log.error("Should be implemented in a sub class");
        return null;
    }
    async destroyChunkItems(chunks) {
        log.error("Should be implemented in a sub class");
    }
    getUserEmail(item) {
        return item.User && item.User.email ? item.User.email : "";
    }
    getAllItemsExceptOne(items) {
        if (items.length === 1 && this.getAllowedSingleDelete()) {
            return items;
        }
        else {
            const sortedItems = _.sortBy(items, function (item) {
                return moment(item.created_at || item.date).valueOf();
            });
            const finalItems = [];
            let foundEmail = false;
            for (let i = 0; i < sortedItems.length; i++) {
                const userEmail = this.getUserEmail(sortedItems[i]);
                if (!foundEmail && userEmail && userEmail.indexOf("_anonymous@citizens.i") === -1) {
                    foundEmail = true;
                }
                else {
                    finalItems.push(sortedItems[i]);
                }
            }
            if (items.length === finalItems.length) {
                finalItems.pop();
            }
            return finalItems;
        }
    }
    async createAuditLog(transaction) {
        return await new Promise(async (resolve, reject) => {
            try {
                const user = await models.User.findOne({
                    where: {
                        id: this.workPackage.userId,
                    },
                    attributes: ['name'],
                    transaction
                });
                const userName = user && user.name ? user.name : "Unknown";
                const deleteData = {
                    ...this.job.internal_data,
                    requestedIdsToDelete: this.job.internal_data.idsToDelete,
                    idsToDelete: this.deletedItemIds,
                };
                const fraudAuditLog = await models.GeneralDataStore.create({ data: {
                        date: new Date(),
                        userName,
                        workPackage: this.workPackage,
                        deleteData
                    } }, { transaction });
                const community = await models.Community.findOne({
                    where: {
                        id: this.workPackage.communityId
                    },
                    attributes: ['data', 'id'],
                    transaction
                });
                if (!community) {
                    throw new Error("Community not found for fraud audit log");
                }
                if (!community.data) {
                    community.data = {};
                }
                if (!community.data.fraudDeletionsAuditLogs) {
                    community.set('data.fraudDeletionsAuditLogs', []);
                }
                community.data.fraudDeletionsAuditLogs.push({
                    logId: fraudAuditLog.id,
                    date: fraudAuditLog.data.date,
                    userName
                });
                community.changed('data', true);
                await community.save({ transaction });
                resolve();
            }
            catch (error) {
                reject(error);
            }
        });
    }
    getAllowedSingleDelete() {
        return this.workPackage.type === "delete-one-item";
    }
    getMomentInYourPriorities() {
        if (this.workPackage.collectionType === "endorsements") {
            return moment("16/02/2022", "DD/MM/YYYY").valueOf();
        }
        else {
            return moment("21/02/2022", "DD/MM/YYYY").valueOf();
        }
    }
    getTopItems(items, type) {
        return this.setupTopItems(items);
    }
    async destroyAllItems(chunks, transaction) {
        return await new Promise(async (resolve, reject) => {
            try {
                const progressAdvanceForChunk = 75 / 10;
                let progress = 25;
                for (let c = 0; c < chunks.length; c++) {
                    await this.destroyChunkItems(chunks[c], transaction);
                    progress = Math.round(Math.min(80, progress += progressAdvanceForChunk));
                    await models.AcBackgroundJob.updateProgressAsync(this.workPackage.jobId, progress);
                }
                resolve();
            }
            catch (error) {
                reject(error);
            }
        });
    }
    async deleteData(transaction) {
        return await new Promise(async (resolve, reject) => {
            try {
                const keys = Object.keys(this.dataToProcess);
                let itemsToDelete = [];
                for (let c = 0; c < keys.length; c++) {
                    itemsToDelete = itemsToDelete.concat(this.getAllItemsExceptOne(this.dataToProcess[keys[c]].items));
                }
                this.deletedItemIds = itemsToDelete.map(item => item.id);
                await this.destroyAllItems(this.sliceIntoChunks(itemsToDelete, 100), transaction);
                resolve();
            }
            catch (error) {
                reject(error);
            }
        });
    }
    async recountPosts(transaction) {
        return await new Promise(async (resolve, reject) => {
            recountPosts(this.postsToRecount, error => {
                if (error) {
                    reject(error);
                }
                else {
                    resolve();
                }
            }, transaction);
        });
    }
    async recountPoints(transaction) {
        return await new Promise(async (resolve, reject) => {
            recountPoints(this.pointsToRecount, error => {
                if (error) {
                    reject(error);
                }
                else {
                    resolve();
                }
            }, transaction);
        });
    }
    async recountCommunity(transaction) {
        return await new Promise(async (resolve, reject) => {
            recountCommunity(this.workPackage.communityId, error => {
                if (error) {
                    reject(error);
                }
                else {
                    resolve();
                }
            }, transaction);
        });
    }
    async deleteItems() {
        return await new Promise(async (resolve, reject) => {
            log.info(`Delete data ${JSON.stringify(this.workPackage)}`);
            try {
                this.job = await models.AcBackgroundJob.findOne({
                    where: {
                        id: this.workPackage.jobId
                    }
                });
                this.items = await this.getItemsById();
                this.setupDataToProcess();
                await models.sequelize.transaction(async (transaction) => {
                    await this.deleteData(transaction);
                    await this.createAuditLog(transaction);
                    if (this.postsToRecount.length > 0) {
                        await this.recountPosts(transaction);
                    }
                    if (this.pointsToRecount.length > 0) {
                        await this.recountPoints(transaction);
                    }
                    await this.recountCommunity(transaction);
                });
                await models.AcBackgroundJob.updateProgressAsync(this.workPackage.jobId, 100);
                resolve();
            }
            catch (error) {
                await models.AcBackgroundJob.updateErrorAsync(this.workPackage.jobId, error.toString());
                log.error(error);
                reject(error);
            }
        });
    }
}
module.exports = FraudDeleteBase;
