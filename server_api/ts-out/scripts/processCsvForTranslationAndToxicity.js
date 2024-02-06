const models = require('../models/index.cjs');
const async = require('async');
const ip = require('ip');
const _ = require('lodash');
const fs = require('fs');
const { Translate } = require('@google-cloud/translate').v2;
const inFile = "/home/robert/Scratch/delpoll.csv"; //process.argv[3];
const outFile = "/home/robert/Scratch/outFileDelPollForToxicity.csv"; //process.argv[4];
const fromLang = "is";
const toLang = "en";
let outFileContent = "";
const Perspective = require('perspective-api-client');
const parse = require('csv-parse/lib/sync');
let perspectiveApi;
if (process.env.GOOGLE_PERSPECTIVE_API_KEY) {
    perspectiveApi = new Perspective({ apiKey: process.env.GOOGLE_PERSPECTIVE_API_KEY });
}
const getToxicityScoreForText = (text, doNotStore, callback) => {
    console.log("getToxicityScoreForText starting", { text, doNotStore });
    if (text) {
        perspectiveApi.analyze(text, { doNotStore, attributes: [
                'TOXICITY', 'SEVERE_TOXICITY', 'IDENTITY_ATTACK',
                'THREAT', 'INSULT', 'PROFANITY', 'SEXUALLY_EXPLICIT',
                'FLIRTATION'
            ] }).then(result => {
            console.log("getToxicityScoreForText results");
            callback(null, result);
        }).catch(error => {
            if (error && error.stack && error.stack.indexOf("ResponseError: Attribute") > -1) {
                console.warn("getToxicityScoreForText warning", { error });
                callback(error);
            }
            else {
                console.error("getToxicityScoreForText error", { error });
                callback(error);
            }
        });
    }
    else {
        callback("No text for toxicity score");
    }
};
const clean = (text) => {
    //console.log("Before: "+ text);
    var newText = text.replace('"', "'").replace('\n', '').replace('\r', '').replace(/(\r\n|\n|\r)/gm, "").replace(/"/gm, "'").replace(/,/, ';').trim();
    //console.log("After:" + newText);
    return newText.replace(/´/g, '');
};
const getTranslatedString = (contentToTranslate, callback) => {
    const translateAPI = new Translate({
        credentials: JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON)
    });
    translateAPI.translate(contentToTranslate, toLang)
        .then((results) => {
        const translationResults = results[1];
        if (translationResults && translationResults.data
            && translationResults.data.translations &&
            translationResults.data.translations.length > 0) {
            const translation = translationResults.data.translations[0];
            callback(null, translation);
        }
        else {
            callback("No translations");
        }
    }).catch((error) => {
        callback(error);
    });
};
const addHeader = () => {
    outFileContent += "Original,English,Toxicity,Severe Toxicity,Profanity,Sexually Explicit,Flirtation,Insult\n";
};
const addRow = (original, english, toxicity, severeToxicity, profanity, sexuallyExplicit, flirtation, threat, insult) => {
    outFileContent += '"' + original + '"' + ',"' + english + '","' + toxicity + '",' + '"' + severeToxicity + '",';
    outFileContent += '"' + profanity + '"' + ',"' + sexuallyExplicit + '","' + flirtation + '",' + '"' + insult + '",' + '\n';
};
const file = fs.readFileSync(inFile, 'utf-8');
let records = parse(file, {
    columns: false,
    skip_empty_lines: false
});
addHeader();
async.forEachSeries(records, (line, eachCallback) => {
    getTranslatedString(line[0], (error, translatedString) => {
        if (translatedString && translatedString.translatedText) {
            getToxicityScoreForText(translatedString.translatedText, true, (error, score) => {
                if (error) {
                    console.error(error);
                    addRow(line, translatedString.translatedText, "error");
                }
                else {
                    const toxicityScore = score.attributeScores["TOXICITY"].summaryScore.value;
                    const severeToxicityScore = score.attributeScores["SEVERE_TOXICITY"].summaryScore.value;
                    const profanityScore = score.attributeScores["PROFANITY"].summaryScore.value;
                    const sexuallyExplicitScore = score.attributeScores["SEXUALLY_EXPLICIT"].summaryScore.value;
                    const flirtationScore = score.attributeScores["FLIRTATION"].summaryScore.value;
                    const threatScore = score.attributeScores["THREAT"].summaryScore.value;
                    const insultScore = score.attributeScores["INSULT"].summaryScore.value;
                    addRow(line, translatedString.translatedText, toxicityScore, severeToxicityScore, profanityScore, sexuallyExplicitScore, flirtationScore, threatScore, insultScore);
                }
                eachCallback();
            });
        }
        else {
            addRow(line, "NOT TRANSLATED");
            eachCallback();
        }
    });
}, (error) => {
    if (error) {
        console.error(error);
        process.exit();
    }
    else {
        fs.writeFile(outFile, outFileContent, function (error) {
            if (error) {
                console.error(error);
                process.exit();
            }
            else {
                console.log("The file was saved!");
                process.exit();
            }
        });
    }
});
export {};
