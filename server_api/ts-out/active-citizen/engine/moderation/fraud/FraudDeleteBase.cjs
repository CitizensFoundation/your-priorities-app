"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const moment = require("moment");
const models = require("../../../../models/index.cjs");
const FraudBase = require('./FraudBase.cjs');
const recountCommunity = require('../../../../utils/recount_utils.cjs').recountCommunity;
const recountPosts = require('../../../../utils/recount_utils.cjs').recountPosts;
const recountPoints = require('../../../../utils/recount_utils.cjs').recountPoints;
class FraudDeleteBase extends FraudBase {
    constructor(workPackage) {
        super(workPackage);
        this.postsToRecount = [];
        this.pointsToRecount = [];
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
        console.error("Should be implemented in a sub class");
        return null;
    }
    async destroyChunkItems(chunks) {
        console.error("Should be implemented in a sub class");
    }
    getAllItemsExceptOne(items) {
        if (items.length === 1 && this.getAllowedSingleDelete()) {
            return items;
        }
        else {
            const sortedItems = _.sortBy(items, function (item) {
                return item.date;
            });
            const finalItems = [];
            let foundEmail = false;
            for (let i = 0; i < sortedItems.length; i++) {
                if (!foundEmail && sortedItems[i].User.email && sortedItems[i].User.email.indexOf("_anonymous@citizens.i") === -1) {
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
    async createAuditLog() {
        return await new Promise(async (resolve, reject) => {
            try {
                const user = await models.User.findOne({
                    where: {
                        id: this.workPackage.userId,
                    },
                    attributes: ['name']
                });
                const fraudAuditLog = await models.GeneralDataStore.create({ data: {
                        date: new Date(),
                        userName: user.name,
                        workPackage: this.workPackage,
                        deleteData: this.job.internal_data
                    } });
                const community = await models.Community.findOne({
                    where: {
                        id: this.workPackage.communityId
                    },
                    attributes: ['data', 'id']
                });
                if (!community.data) {
                    community.data = {};
                }
                if (!community.data.fraudDeletionsAuditLogs) {
                    community.set('data.fraudDeletionsAuditLogs', []);
                }
                community.data.fraudDeletionsAuditLogs.push({
                    logId: fraudAuditLog.id,
                    date: fraudAuditLog.data.date,
                    userName: user.name
                });
                community.changed('data', true);
                await community.save();
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
    async destroyAllItems(chunks) {
        return await new Promise(async (resolve, reject) => {
            try {
                const progressAdvanceForChunk = 75 / 10;
                let progress = 25;
                for (let c = 0; c < chunks.length; c++) {
                    await this.destroyChunkItems(chunks[c]);
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
    async deleteData() {
        return await new Promise(async (resolve, reject) => {
            try {
                const keys = Object.keys(this.dataToProcess);
                let itemsToDelete = [];
                for (let c = 0; c < keys.length; c++) {
                    itemsToDelete = itemsToDelete.concat(this.getAllItemsExceptOne(this.dataToProcess[keys[c]].items));
                }
                await this.destroyAllItems(this.sliceIntoChunks(itemsToDelete, 100));
                resolve();
            }
            catch (error) {
                reject(error);
            }
        });
    }
    async recountPosts() {
        return await new Promise(async (resolve, reject) => {
            recountPosts(this.postsToRecount, error => {
                if (error) {
                    reject(error);
                }
                else {
                    resolve();
                }
            });
        });
    }
    async recountPoints() {
        return await new Promise(async (resolve, reject) => {
            recountPoints(this.pointsToRecount, error => {
                if (error) {
                    reject(error);
                }
                else {
                    resolve();
                }
            });
        });
    }
    async recountCommunity() {
        return await new Promise(async (resolve, reject) => {
            recountCommunity(this.workPackage.communityId, error => {
                if (error) {
                    reject(error);
                }
                else {
                    resolve();
                }
            });
        });
    }
    async deleteItems() {
        return await new Promise(async (resolve, reject) => {
            console.log(`Delete data ${JSON.stringify(this.workPackage)}`);
            try {
                this.job = await models.AcBackgroundJob.findOne({
                    where: {
                        id: this.workPackage.jobId
                    }
                });
                this.items = await this.getItemsById();
                this.setupDataToProcess();
                await this.deleteData();
                await this.createAuditLog();
                if (this.postsToRecount.length > 0) {
                    await this.recountPosts();
                }
                if (this.pointsToRecount.length > 0) {
                    await this.recountPoints();
                }
                await this.recountCommunity();
                await models.AcBackgroundJob.updateProgressAsync(this.workPackage.jobId, 100);
                resolve();
            }
            catch (error) {
                await models.AcBackgroundJob.updateErrorAsync(this.workPackage.jobId, error.toString());
                console.error(error);
                reject(error);
            }
        });
    }
}
module.exports = FraudDeleteBase;
