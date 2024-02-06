const models = require("../../../models/index.cjs");
const async = require("async");
const moment = require("moment");
const log = require("../../utils/logger.cjs");
const _ = require("lodash");
const Excel = require("exceljs");
const getGroupPosts = require("./common_utils").getGroupPosts;
const getContactData = require("./common_utils").getContactData;
const getAttachmentData = require("./common_utils").getAttachmentData;
const getMediaTranscripts = require("./common_utils").getMediaTranscripts;
const getPostRatings = require("./common_utils").getPostRatings;
const getPostUrl = require("./common_utils").getPostUrl;
const getLocation = require("./common_utils").getLocation;
const getCategory = require("./common_utils").getCategory;
const getUserEmail = require("./common_utils").getUserEmail;
const getMediaFormatUrl = require("./common_utils").getMediaFormatUrl;
const getMediaURLs = require("./common_utils").getMediaURLs;
const getPointsUpOrDown = require("./common_utils").getPointsUpOrDown;
const getPointsUp = require("./common_utils").getPointsUp;
const getPointsDown = require("./common_utils").getPointsDown;
const getTranslatedPoints = require("./common_utils").getTranslatedPoints;
const getTranslation = require("./common_utils").getTranslation;
const getOrderedPosts = require("./common_utils").getOrderedPosts;
const updateJobStatusIfNeeded = require("./common_utils")
    .updateJobStatusIfNeeded;
const setJobError = require("./common_utils").setJobError;
const uploadToS3 = require("./common_utils").uploadToS3;
const sanitizeFilename = require("sanitize-filename");
const cleanText = (text) => {
    let outText = text;
    outText = outText.replace(/\*/g, '');
    outText = outText.replace(/\?/g, '');
    outText = outText.replace(/:/g, '');
    outText = outText.replace(/\//g, '');
    outText = outText.replace(/\\/g, '');
    outText = outText.replace(/\[/g, '');
    outText = outText.replace(/\]/g, '');
    return outText;
};
const formatWorksheet = (worksheet) => {
    worksheet.getRow(1).font = { bold: true };
    //  worksheet.properties.defaultRowHeight = 20;
};
const getAnswerFor = (text, answers) => {
    for (let i = 0; i < answers.length; i++) {
        if (Object.keys(answers[i])[0] === text)
            return Object.values(answers[i])[0];
    }
    return '';
};
async function addUsers(worksheet, model, modelId, asUsersCode, registrationQuestions) {
    let foundAll = false;
    let offset = 0;
    while (!foundAll) {
        const modelResults = await model.findOne({
            attributes: ['id'],
            where: {
                id: modelId,
            },
            include: [
                {
                    model: models.User,
                    as: asUsersCode,
                    attributes: ['id', 'email', 'ssn', 'name', 'private_profile_data', 'created_at'],
                }
            ],
        });
        foundAll = true;
        if (modelResults) {
            const users = modelResults[asUsersCode];
            if (users.length === 0) {
                foundAll = true;
            }
            else {
                for (let i = 0; i < users.length; i++) {
                    let row = {
                        email: users[i].email,
                        name: users[i].name,
                        ssn: users[i].ssn,
                        id: users[i].id,
                        createdAt: users[i].created_at
                    };
                    if (registrationQuestions && users[i].private_profile_data && users[i].private_profile_data.registration_answers) {
                        const answers = users[i].private_profile_data.registration_answers;
                        for (let i = 0; i < registrationQuestions.length; i++) {
                            if (registrationQuestions[i].type !== "segment" && registrationQuestions[i].type !== "textDescription") {
                                const key = registrationQuestions[i].text;
                                const value = getAnswerFor(registrationQuestions[i].text, answers);
                                row = _.merge(row, { [key]: value });
                            }
                        }
                    }
                    worksheet.addRow(row);
                    offset += users.length;
                }
            }
        }
    }
}
async function addCommunity(workbook, community) {
    let name = community.translatedName ? community.translatedName : community.name;
    name = cleanText(name);
    const worksheet = workbook.addWorksheet(`Community Users ${community.id} ${name}`);
    const columns = [
        { header: "User Id", key: "id", width: 10 },
        { header: "Created at", key: "createdAt", width: 15 },
        { header: "Name", key: "name", width: 30 },
        { header: "National Id", key: "ssn", width: 15 },
        { header: "Email", key: "email", width: 40 },
    ];
    const registrationQuestions = community.configuration.registrationQuestionsJson;
    if (registrationQuestions) {
        for (let i = 0; i < registrationQuestions.length; i++) {
            if (registrationQuestions[i].type !== "segment" && registrationQuestions[i].type !== "textDescription") {
                try {
                    columns.push({
                        header: registrationQuestions[i].text,
                        key: registrationQuestions[i].text,
                        style: { numFmt: '@' },
                        alignment: { wrapText: true },
                        width: 30
                    });
                }
                catch (ex) {
                    log.error(ex);
                }
            }
        }
    }
    worksheet.columns = columns;
    await addUsers(worksheet, models.Community, community.id, "CommunityUsers", registrationQuestions);
    formatWorksheet(worksheet);
}
async function addGroup(workbook, group) {
    let name = group.translatedName ? group.translatedName : group.name;
    name = cleanText(name);
    const worksheet = workbook.addWorksheet(`Group Users ${group.id} ${name}`);
    let columns = [
        { header: "User Id", key: "id", width: 10 },
        { header: "Created at", key: "createdAt", width: 15 },
        { header: "Name", key: "name", width: 35 },
        { header: "National Id", key: "ssn", width: 15 },
        { header: "Email", key: "email", width: 40 },
    ];
    const registrationQuestions = group.configuration.registrationQuestionsJson;
    if (registrationQuestions) {
        for (let i = 0; i < registrationQuestions.length; i++) {
            if (registrationQuestions[i].type !== "segment" && registrationQuestions[i].type !== "textDescription") {
                try {
                    columns.push({
                        header: registrationQuestions[i].text,
                        key: registrationQuestions[i].text,
                        width: 30
                    });
                }
                catch (ex) {
                    log.error(ex);
                }
            }
        }
    }
    worksheet.columns = columns;
    await addUsers(worksheet, models.Group, group.id, "GroupUsers", registrationQuestions);
    formatWorksheet(worksheet);
}
async function exportToXls(options, callback) {
    const community = options.community;
    const groupsLength = community.Groups.length;
    const workbook = new Excel.Workbook();
    workbook.creator = "Your Priorities Report - Automated";
    workbook.created = new Date();
    try {
        await addCommunity(workbook, community);
        for (let i = 0; i < groupsLength; i++) {
            await addGroup(workbook, community.Groups[i]);
            const jobProgress = Math.min(15 + (Math.round(85 / (groupsLength))) * i, 95);
            await models.AcBackgroundJob.update({
                progress: jobProgress,
            }, {
                where: { id: options.jobId },
            });
        }
        const buffer = await workbook.xlsx.writeBuffer();
        callback(null, buffer);
    }
    catch (error) {
        callback(error);
    }
}
const createXlsCommunityUsersReport = (workPackage, callback) => {
    let exportedData, filename;
    async.series([
        (seriesCallback) => {
            models.Community.findOne({
                where: {
                    id: workPackage.communityId,
                },
                include: [
                    {
                        model: models.Group,
                        attributes: ['id', 'name', 'configuration']
                    }
                ],
                attributes: [
                    "id",
                    "name",
                    "description",
                    "configuration"
                ]
            })
                .then(community => {
                workPackage.community = community;
                const dateString = moment(new Date()).format("DD_MM_YY_HH_mm");
                const communityName = sanitizeFilename(community.name).replace(/ /g, "");
                workPackage.filename =
                    "Community_Users_Export_" +
                        community.id +
                        "_" +
                        communityName +
                        "_" +
                        dateString +
                        "." +
                        workPackage.fileEnding;
                seriesCallback();
            })
                .catch((error) => {
                seriesCallback(error);
            });
        },
        (seriesCallback) => {
            models.AcBackgroundJob.updateProgress(workPackage.jobId, 5, seriesCallback);
        },
        (seriesCallback) => {
            exportToXls({ jobId: workPackage.jobId, community: workPackage.community }, (error, data) => {
                exportedData = data;
                seriesCallback(error);
            });
        },
        (seriesCallback) => {
            uploadToS3(workPackage.jobId, workPackage.userId, workPackage.filename, workPackage.fileEnding, exportedData, (error, reportUrl) => {
                if (error) {
                    seriesCallback(error);
                }
                else {
                    console.log(`Updating job 100 with DATA`);
                    models.AcBackgroundJob.update({
                        progress: 100,
                        data: { reportUrl },
                    }, {
                        where: { id: workPackage.jobId },
                    })
                        .then(() => {
                        seriesCallback();
                    })
                        .catch((error) => {
                        seriesCallback(error);
                    });
                }
            });
        },
    ], (error) => {
        if (error) {
            setJobError(workPackage.jobId, "errorXlsCommunityUsersReportGeneration", error, (dbError) => {
                callback(dbError || error);
            });
        }
        else {
            log.info("Done generating report");
            callback();
        }
    });
};
module.exports = {
    createXlsCommunityUsersReport,
    getAnswerFor
};
export {};
