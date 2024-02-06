"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { Translate } = require("@google-cloud/translate").v2;
const farmhash = require("farmhash");
const log = require("../utils/logger.cjs");
const PAIRWISE_API_HOST = process.env.PAIRWISE_API_HOST;
const PAIRWISE_USERNAME = process.env.PAIRWISE_USERNAME;
const PAIRWISE_PASSWORD = process.env.PAIRWISE_PASSWORD;
const defaultAuthHeader = {
    "Content-Type": "application/json",
    Authorization: `Basic ${Buffer.from(`${PAIRWISE_USERNAME}:${PAIRWISE_PASSWORD}`).toString("base64")}`,
};
const defaultHeader = {
    ...{ "Content-Type": "application/json" },
    ...defaultAuthHeader,
};
module.exports = (sequelize, DataTypes) => {
    let AcTranslationCache = sequelize.define("AcTranslationCache", {
        index_key: { type: DataTypes.STRING, allowNull: false },
        content: { type: DataTypes.TEXT, allowNull: false },
    }, {
        indexes: [
            {
                name: "main_index",
                fields: ["index_key"],
            },
        ],
        underscored: true,
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at",
        tableName: "translation_cache",
    });
    AcTranslationCache.translationModelName = "gpt-4-0125-preview";
    AcTranslationCache.translationMaxTokens = 2048;
    AcTranslationCache.translationTemperature = 0.7;
    AcTranslationCache.allowedTextTypesForSettingLanguage = [
        "pointContent",
        "postName",
        "postContent",
        "groupName",
        "groupContent",
        "communityName",
        "communityContent",
        "domainName",
        "domainContent",
        "statusChangeContent",
        "aoiChoiceContent",
        "aoiQuestionName",
    ];
    AcTranslationCache.getContentToTranslate = async (req, modelInstance) => {
        if (req.query.textType == "aoiChoiceContent") {
            console.log(`>>>>>>>>>>>>>>>>>>>> CHOICES req.params.extraId ${req.query.textType} ${req.params.questionId}`, req.params.extraId);
            const choiceResponse = await fetch(`${PAIRWISE_API_HOST}/choices/${req.params.extraId}.json?question_id=${req.params.questionId}`, {
                method: "GET",
                headers: defaultHeader,
            });
            if (!choiceResponse.ok) {
                console.error("Failed to fetch answers");
                return null;
            }
            const choice = await choiceResponse.json();
            console.log(`>>>>>>>>>>>>>>>>>>>> CHOICES ${JSON.stringify(choice)}`);
            if (choice) {
                try {
                    const data = JSON.parse(choice.data);
                    console.log(`MMMMMMMM CHOICES ${JSON.stringify(data)}`);
                    return data["content"];
                }
                catch (error) {
                    console.error("Failed to parse choice data", error);
                    return null;
                }
            }
            else {
                return "No translation";
            }
        }
        else if (req.query.textType == "aoiQuestionName") {
            console.log(`=========================>   QUESTIONS req.params.extraId ${req.query.textType}`, req.params.extraId);
            const questionResponse = await fetch(`${PAIRWISE_API_HOST}/questions/${req.params.extraId}.json`, {
                method: "GET",
                headers: defaultHeader,
            });
            if (!questionResponse.ok) {
                console.error("Failed to fetch question");
                return null;
            }
            const question = await questionResponse.json();
            console.log(`FFFFFFFFFFFFFFFFFFFFFFFF>   QUESTIONS ${JSON.stringify(question)}`);
            if (question) {
                console.log(`XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX>   QUESTIONS ${question.name}`);
                return question.name;
            }
            else {
                return null;
            }
        }
        else {
            switch (req.query.textType) {
                case "postName":
                case "domainName":
                case "communityName":
                case "groupName":
                    return modelInstance.name;
                case "postContent":
                case "domainContent":
                case "communityContent":
                    return modelInstance.description;
                case "pointContent":
                    return modelInstance.PointRevisions[modelInstance.PointRevisions.length - 1].content;
                case "statusChangeContent":
                    return modelInstance.content;
                case "groupContent":
                    return modelInstance.objectives;
                case "pointAdminCommentContent":
                    if (modelInstance.public_data &&
                        modelInstance.public_data.admin_comment &&
                        modelInstance.public_data.admin_comment.text) {
                        return modelInstance.public_data.admin_comment.text;
                    }
                    else {
                        return "No translation";
                    }
                case "postTags":
                    if (modelInstance.public_data && modelInstance.public_data.tags) {
                        return modelInstance.public_data.tags;
                    }
                    else {
                        return "No translation";
                    }
                case "customRatingName":
                    if (modelInstance.Group.configuration.customRatings &&
                        modelInstance.Group.configuration.customRatings[modelInstance.custom_rating_index]) {
                        return modelInstance.Group.configuration.customRatings[modelInstance.custom_rating_index].name;
                    }
                    else {
                        return "No translation";
                    }
                case "alternativeTextForNewIdeaButton":
                    return modelInstance.configuration.alternativeTextForNewIdeaButton;
                case "alternativeTextForNewIdeaButtonClosed":
                    return modelInstance.configuration
                        .alternativeTextForNewIdeaButtonClosed;
                case "alternativeTextForNewIdeaButtonHeader":
                    return modelInstance.configuration
                        .alternativeTextForNewIdeaButtonHeader;
                case "alternativeTextForNewIdeaSaveButton":
                    return modelInstance.configuration
                        .alternativeTextForNewIdeaSaveButton;
                case "customCategoryQuestionText":
                    return modelInstance.configuration.customCategoryQuestionText;
                case "urlToReviewActionText":
                    return modelInstance.configuration.urlToReviewActionText;
                case "customThankYouTextNewPosts":
                    return modelInstance.configuration.customThankYouTextNewPosts;
                case "customTitleQuestionText":
                    return modelInstance.configuration.customTitleQuestionText;
                case "customFilterText":
                    return modelInstance.configuration.customFilterText;
                case "customAdminCommentsTitle":
                    return modelInstance.configuration.customAdminCommentsTitle;
                case "alternativePointForHeader":
                    return modelInstance.configuration.alternativePointForHeader;
                case "customTabTitleNewLocation":
                    return modelInstance.configuration.customTabTitleNewLocation;
                case "alternativePointAgainstHeader":
                    return modelInstance.configuration.alternativePointAgainstHeader;
                case "alternativePointForLabel":
                    return modelInstance.configuration.alternativePointForLabel;
                case "alternativePointAgainstLabel":
                    return modelInstance.configuration.alternativePointAgainstLabel;
                case "categoryName":
                    return modelInstance.name;
                case "postTranscriptContent":
                    return modelInstance.public_data &&
                        modelInstance.public_data.transcript
                        ? modelInstance.public_data.transcript.text
                        : null;
                default:
                    console.error("No valid textType for translation");
                    return null;
            }
        }
    };
    // Post Edit
    // When AutoTranslate event ask for all the strings from the StructuredQuestions
    // Replace the StructuredQuestions with translates, store original value and redraw
    // When AutoTranslate stops reinstate the original structured questions
    // In Post
    // When AutoTranslate ask for all the strings for StructuredAnswers & Questions
    // Recreate structure and redraw
    // When AutoTranslate stops
    // Same in XLS and DOCX exports
    AcTranslationCache.getSurveyAnswerTranslations = async (postId, targetLanguage, done) => {
        targetLanguage = AcTranslationCache.fixUpLanguage(targetLanguage);
        sequelize.models.Post.unscoped()
            .findOne({
            where: {
                id: postId,
            },
            attributes: ["id", "public_data", "language"],
        })
            .then(async (post) => {
            if (post.public_data &&
                post.public_data.structuredAnswersJson &&
                post.public_data.structuredAnswersJson.length > 0) {
                const textStrings = [];
                let combinedText = "";
                for (const answer of post.public_data.structuredAnswersJson) {
                    if (answer.value) {
                        textStrings.push(answer.value);
                        combinedText += answer.value;
                    }
                    else {
                        textStrings.push("");
                    }
                }
                const contentHash = farmhash.hash32(combinedText).toString();
                let indexKey = `PostAnswer-${post.id}-${targetLanguage}-${contentHash}`;
                AcTranslationCache.getSurveyTranslations(indexKey, textStrings, targetLanguage, post, done);
            }
            else {
                done(null, []);
            }
        })
            .catch((error) => {
            done(error);
        });
    };
    AcTranslationCache.addSubOptionsElements = (textStrings, combinedText, subOptions) => {
        for (let i = 0; i < subOptions.length; i++) {
            const text = subOptions[i].text;
            if (text) {
                textStrings.push(text);
                combinedText += text;
            }
            else {
                textStrings.push("");
            }
        }
        return combinedText;
    };
    AcTranslationCache.addSubOptionsToTranslationStrings = (textStrings, combinedText, question) => {
        if (question.radioButtons && question.radioButtons.length > 0) {
            return AcTranslationCache.addSubOptionsElements(textStrings, combinedText, question.radioButtons);
        }
        else if (question.checkboxes && question.checkboxes.length > 0) {
            return AcTranslationCache.addSubOptionsElements(textStrings, combinedText, question.checkboxes);
        }
        else if (question.dropdownOptions &&
            question.dropdownOptions.length > 0) {
            return AcTranslationCache.addSubOptionsElements(textStrings, combinedText, question.dropdownOptions);
        }
    };
    //TODO: Reduce amount of duplicate code
    AcTranslationCache.getRegistrationQuestionTranslations = async (groupId, targetLanguage, done) => {
        targetLanguage = AcTranslationCache.fixUpLanguage(targetLanguage);
        sequelize.models.Group.findOne({
            where: {
                id: groupId,
            },
            attributes: ["id", "configuration"],
        })
            .then(async (group) => {
            if (group.configuration &&
                group.configuration.registrationQuestionsJson &&
                group.configuration.registrationQuestionsJson.length > 0) {
                const textStrings = [];
                let combinedText = "";
                for (const question of group.configuration
                    .registrationQuestionsJson) {
                    if (question.text) {
                        textStrings.push(question.text);
                        combinedText += question.text;
                    }
                    else {
                        textStrings.push("");
                    }
                    if (question.type === "radios" ||
                        question.type === "checkboxes" ||
                        question.type === "dropdown") {
                        combinedText =
                            AcTranslationCache.addSubOptionsToTranslationStrings(textStrings, combinedText, question);
                    }
                }
                const contentHash = farmhash.hash32(combinedText).toString();
                let indexKey = `GroupRegQuestions-${group.id}-${targetLanguage}-${contentHash}`;
                AcTranslationCache.getSurveyTranslations(indexKey, textStrings, targetLanguage, null, done);
            }
            else {
                done(null, []);
            }
        })
            .catch((error) => {
            done(error);
        });
    };
    AcTranslationCache.getSurveyQuestionTranslations = async (groupId, targetLanguage, done) => {
        targetLanguage = AcTranslationCache.fixUpLanguage(targetLanguage);
        sequelize.models.Group.findOne({
            where: {
                id: groupId,
            },
            attributes: ["id", "configuration"],
        })
            .then(async (group) => {
            if (group.configuration &&
                group.configuration.structuredQuestionsJson &&
                group.configuration.structuredQuestionsJson.length > 0) {
                const textStrings = [];
                let combinedText = "";
                for (const question of group.configuration.structuredQuestionsJson) {
                    if (question.text) {
                        textStrings.push(question.text);
                        combinedText += question.text;
                    }
                    else {
                        textStrings.push("");
                    }
                    if (question.type === "radios" ||
                        question.type === "checkboxes" ||
                        question.type === "dropdown") {
                        combinedText =
                            AcTranslationCache.addSubOptionsToTranslationStrings(textStrings, combinedText, question);
                    }
                }
                const contentHash = farmhash.hash32(combinedText).toString();
                let indexKey = `GroupQuestions-${group.id}-${targetLanguage}-${contentHash}`;
                AcTranslationCache.getSurveyTranslations(indexKey, textStrings, targetLanguage, null, done);
            }
            else {
                done(null, []);
            }
        })
            .catch((error) => {
            done(error);
        });
    };
    AcTranslationCache.getSurveyTranslations = (indexKey, textStrings, targetLanguage, saveLanguageToModel, done) => {
        sequelize.models.AcTranslationCache.findOne({
            where: {
                index_key: indexKey,
            },
        })
            .then(async (translationModel) => {
            if (translationModel) {
                done(null, JSON.parse(translationModel.content));
            }
            else {
                try {
                    const results = await AcTranslationCache.getSurveyTranslationsFromGoogle(textStrings, targetLanguage);
                    const translatedStrings = results[0];
                    const languageInfo = results[1];
                    if (translatedStrings && translatedStrings.length > 0) {
                        const content = JSON.stringify(translatedStrings);
                        sequelize.models.AcTranslationCache.create({
                            index_key: indexKey,
                            content: content,
                        })
                            .then((model) => {
                            if (saveLanguageToModel &&
                                languageInfo.data &&
                                languageInfo.data.translations &&
                                languageInfo.data.translations.length > 0) {
                                saveLanguageToModel
                                    .update({
                                    language: languageInfo.data.translations[0]
                                        .detectedSourceLanguage,
                                })
                                    .then(() => {
                                    done(null, translatedStrings);
                                })
                                    .catch((error) => {
                                    done(error);
                                });
                            }
                            else {
                                done(null, translatedStrings);
                            }
                        })
                            .catch((error) => {
                            done(error);
                        });
                    }
                    else {
                        done(null, []);
                    }
                }
                catch (error) {
                    done(error);
                }
            }
        })
            .catch((error) => {
            done(error);
        });
    };
    AcTranslationCache.getSurveyTranslationsFromGoogle = async (textsToTranslate, targetLanguage) => {
        return new Promise(async (resolve, reject) => {
            if (!process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
                reject("No google credentials found");
            }
            else {
                const translateAPI = new Translate({
                    credentials: JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON),
                    projectId: process.env.GOOGLE_TRANSLATE_PROJECT_ID
                        ? process.env.GOOGLE_TRANSLATE_PROJECT_ID
                        : undefined,
                });
                try {
                    // Split the texts into chunks of 128 or fewer
                    const chunkSize = 128;
                    const translatedStrings = [];
                    let languageInfo = {};
                    for (let i = 0; i < textsToTranslate.length; i += chunkSize) {
                        const chunk = textsToTranslate.slice(i, i + chunkSize);
                        const [translatedChunk, info] = await translateAPI.translate(chunk, targetLanguage);
                        translatedStrings.push(...translatedChunk);
                        if (i === 0) {
                            // Keep the language info from the first chunk
                            languageInfo = info;
                        }
                    }
                    resolve([translatedStrings, languageInfo]);
                }
                catch (error) {
                    reject(error);
                }
            }
        });
    };
    AcTranslationCache.getTranslationFromGoogle = (textType, indexKey, contentToTranslate, targetLanguage, modelInstance, callback) => {
        let translateAPI;
        try {
            translateAPI = new Translate({
                credentials: JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON),
                projectId: process.env.GOOGLE_TRANSLATE_PROJECT_ID
                    ? process.env.GOOGLE_TRANSLATE_PROJECT_ID
                    : undefined,
            });
        }
        catch (error) {
            console.error("Failed to get translation from Google", error);
        }
        if (!translateAPI) {
            callback("No translation API");
            return;
        }
        translateAPI
            .translate(contentToTranslate, targetLanguage)
            .then((results) => {
            const translationResults = results[1];
            if (translationResults &&
                translationResults.data &&
                translationResults.data.translations &&
                translationResults.data.translations.length > 0) {
                const translation = translationResults.data.translations[0];
                sequelize.models.AcTranslationCache.create({
                    index_key: indexKey,
                    content: translation.translatedText,
                })
                    .then(() => {
                    if (textType === "postTranscriptContent" ||
                        textType === "pointAdminCommentContent") {
                        if (textType === "postTranscriptContent") {
                            modelInstance.set("public_data.transcript.language", translation.detectedSourceLanguage);
                        }
                        else {
                            modelInstance.set("public_data.admin_comment.language", translation.detectedSourceLanguage);
                        }
                        modelInstance
                            .save()
                            .then(() => {
                            callback(null, { content: translation.translatedText });
                        })
                            .catch((error) => {
                            callback(error);
                        });
                    }
                    else {
                        if (AcTranslationCache.allowedTextTypesForSettingLanguage.indexOf(textType) > -1) {
                            modelInstance
                                .update({
                                language: translation.detectedSourceLanguage,
                            })
                                .then(() => {
                                callback(null, { content: translation.translatedText });
                            })
                                .catch((error) => {
                                callback(error);
                            });
                        }
                        else {
                            callback(null, { content: translation.translatedText });
                        }
                    }
                })
                    .catch((error) => {
                    callback(error);
                });
            }
            else {
                callback("No translations");
            }
        })
            .catch((error) => {
            callback(error);
        });
    };
    AcTranslationCache.getTranslationFromLlm = async (textType, indexKey, contentToTranslate, targetLanguage, modelInstance, callback) => {
        console.log(`contentToTranslate contentToTranslate contentToTranslate ${contentToTranslate}`);
        const { YpLlmTranslation } = await import("../llms/llmTranslation.js");
        const translation = new YpLlmTranslation();
        if (textType === "aoiChoiceContent") {
            const translatedTextData = await translation.getChoiceTranslation(contentToTranslate, targetLanguage);
            sequelize.models.AcTranslationCache.create({
                index_key: indexKey,
                content: translatedTextData,
            })
                .then(() => {
                callback(null, { content: translatedTextData });
            })
                .catch((error) => {
                callback(error);
            });
        }
        else if (textType === "aoiQuestionName") {
            const translatedTextData = await translation.getQuestionTranslation(contentToTranslate, targetLanguage);
            sequelize.models.AcTranslationCache.create({
                index_key: indexKey,
                content: translatedTextData,
            })
                .then(() => {
                callback(null, { content: translatedTextData });
            })
                .catch((error) => {
                callback(error);
            });
        }
        else {
            callback("No translations");
        }
    };
    AcTranslationCache.fixUpLanguage = (targetLanguage) => {
        targetLanguage = targetLanguage.replace("_", "-");
        if (targetLanguage !== "sr-latin" &&
            targetLanguage !== "zh-CN" &&
            targetLanguage !== "zh-TW") {
            targetLanguage = targetLanguage.split("-")[0];
        }
        if (targetLanguage === "sr-latin") {
            targetLanguage = "sr-Latn";
        }
        return targetLanguage;
    };
    AcTranslationCache.getTranslation = async (req, modelInstance, callback) => {
        const contentToTranslate = await sequelize.models.AcTranslationCache.getContentToTranslate(req, modelInstance);
        console.log(`lllllllllllllllllll ${contentToTranslate}`);
        if (contentToTranslate &&
            contentToTranslate !== "" &&
            contentToTranslate.length > 1 &&
            isNaN(contentToTranslate)) {
            const contentHash = farmhash.hash32(contentToTranslate).toString();
            const textType = req.query.textType;
            let targetLanguage = req.query.targetLanguage;
            targetLanguage = AcTranslationCache.fixUpLanguage(targetLanguage);
            let indexKey = `${textType}-${modelInstance.id}-${targetLanguage}-${contentHash}`;
            sequelize.models.AcTranslationCache.findOne({
                where: {
                    index_key: indexKey,
                },
            })
                .then((translationModel) => {
                if (translationModel) {
                    callback(null, { content: translationModel.content });
                }
                else {
                    if (["aoiChoiceContent", "aoiQuestionName"].includes(textType)) {
                        sequelize.models.AcTranslationCache.getTranslationFromLlm(textType, indexKey, contentToTranslate, targetLanguage, modelInstance, callback);
                    }
                    else {
                        sequelize.models.AcTranslationCache.getTranslationFromGoogle(textType, indexKey, contentToTranslate, targetLanguage, modelInstance, callback);
                    }
                }
            })
                .catch((error) => {
                callback(error);
            });
        }
        else {
            log.warn("Empty or short string for translation", {
                textType: req.query.textType,
                targetLanguage: req.query.targetLanguage,
            });
            if (!modelInstance.language &&
                !["aoiChoiceContent", "aoiQuestionName"].includes(req.query.textType)) {
                modelInstance
                    .update({
                    language: "??",
                })
                    .then(() => {
                    callback(null, { content: contentToTranslate });
                })
                    .catch((error) => {
                    callback(error);
                });
            }
            else {
                callback();
            }
        }
    };
    return AcTranslationCache;
};
