"use strict";
var models = require("../models");
var async = require("async");
console.log("Fix group");
const groupId = process.argv[2];
const getSubCodeFromRadio = (radios, answer) => {
    let subCode;
    if (radios) {
        for (let i = 0; i < radios.length; i++) {
            //console.log(answer);
            //console.log(`${radios[i].subCode.trim()} !`)
            if (answer.startsWith(`${radios[i].subCode.trim()} `)) {
                subCode = radios[i].subCode;
                break;
            }
        }
    }
    return subCode;
};
const fixRadioDescriptionIfNeeded = (answers, questionsById, i) => {
    let currentValue = answers[i].value;
    console.log(currentValue);
    const subCode = getSubCodeFromRadio(questionsById[answers[i].uniqueId].radioButtons, answers[i].value);
    if (subCode) {
        currentValue = currentValue.replace(`${subCode} `, '');
        console.log(currentValue);
    }
    return currentValue;
};
const getAnswerType = (answers, questionsById, i) => {
    return questionsById[answers[i].uniqueId].type;
};
const processPost = (group, post, done) => {
    const questionsById = {};
    const questionComponents = group.configuration.structuredQuestionsJson;
    for (let i = 0; i < questionComponents.length; i++) {
        questionsById[questionComponents[i].uniqueId] = questionComponents[i];
    }
    const answers = post.public_data.structuredAnswersJson;
    for (let i = 0; i < answers.length; i += 1) {
        if (answers[i] && answers[i].uniqueId && answers[i].value) {
            const answerType = getAnswerType(answers, questionsById, i);
            if (answers[i].value && answerType === "radios") {
                answers[i].value = fixRadioDescriptionIfNeeded(answers, questionsById, i);
            }
        }
    }
    const clonedAnswers = [...answers];
    post.set('public_data.structuredAnswersJson', clonedAnswers);
    post.changed('public_data', true);
    post.save().then(() => {
        done();
    });
};
models.Group.findOne({ where: { id: groupId } }).then((group) => {
    models.Post.unscoped().findAll({ where: { group_id: groupId } }).then((posts) => {
        async.eachSeries(posts, (post, seriesCallback) => {
            processPost(group, post, seriesCallback);
        }, function (error) {
            console.log("Finished");
            process.exit();
        });
    });
});
