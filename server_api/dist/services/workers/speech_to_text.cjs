"use strict";
const async = require("async");
const models = require("../../models/index.cjs");
const log = require('../utils/logger.cjs');
const queue = require('./queue.cjs');
const i18n = require('../utils/i18n.cjs');
const toJson = require('../utils/to_json.cjs');
const _ = require('lodash');
const getAnonymousUser = require('../utils/get_anonymous_system_user.cjs');
var downloadFile = require('download-file');
const fs = require('fs');
let speech, Storage;
let GOOGLE_APPLICATION_CREDENTIALS;
if (process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON && process.env.GOOGLE_TRANSCODING_FLAC_BUCKET) {
    const config = {
        projectId: process.env.GOOGLE_TRANSLATE_PROJECT_ID ? process.env.GOOGLE_TRANSLATE_PROJECT_ID : "neon-particle-735",
        credentials: JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON)
    };
    GOOGLE_APPLICATION_CREDENTIALS = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);
    speech = require('@google-cloud/speech');
    Storage = require('@google-cloud/storage').Storage;
}
let airbrake = null;
if (process.env.AIRBRAKE_PROJECT_ID) {
    airbrake = require('../utils/airbrake.cjs');
}
/**
 * @class VoiceToTextWorker
 * @constructor
 */
function VoiceToTextWorker() { }
const supportedGoogleLanguges = [
    ['af-ZA', true, false],
    ['am-ET', true, false],
    ['hy-AM', true, false],
    ['az-AZ', true, false],
    ['id-ID', true, false],
    ['ms-MY', true, false],
    ['bn-BD', false, true],
    ['bn-IN', true, false],
    ['ca-ES', true, false],
    ['cs-CZ', true, false],
    ['da-DK', true, false],
    ['de-DE', true, false],
    ['en-AU', false, false],
    ['en-CA', false, false],
    ['en-GH', false, false],
    ['en-GB', false, true],
    ['en-IN', false, false],
    ['en-IE', false, false],
    ['en-KE', false, false],
    ['en-NZ', false, false],
    ['en-NG', false, false],
    ['en-PH', false, false],
    ['en-ZA', false, false],
    ['en-TZ', false, false],
    ['en-US', true, false],
    ['es-AR', false, false],
    ['es-BO', false, false],
    ['es-CL', false, false],
    ['es-CO', false, false],
    ['es-CR', false, false],
    ['es-EC', false, false],
    ['es-SV', false, false],
    ['es-ES', true, false],
    ['es-US', true, false],
    ['es-GT', false, false],
    ['es-HN', false, false],
    ['es-MX', false, true],
    ['es-NI', false, false],
    ['es-PA', false, false],
    ['es-PY', false, false],
    ['es-PE', false, false],
    ['es-PR', false, false],
    ['es-DO', false, false],
    ['es-UY', false, false],
    ['es-VE', false, false],
    ['eu-ES', true, false],
    ['fil-PH', true, false],
    ['fr-CA', false, true],
    ['fr-FR', true, false],
    ['gl-ES', true, false],
    ['ka-GE', true, false],
    ['gu-IN', true, false],
    ['hr-HR', true, false],
    ['zu-ZA', true, false],
    ['is-IS', true, false],
    ['it-IT', true, false],
    ['jv-ID', true, false],
    ['kn-IN', true, false],
    ['km-KH', true, false],
    ['lo-LA', true, false],
    ['lv-LV', true, false],
    ['lt-LT', true, false],
    ['hu-HU', true, false],
    ['ml-IN', true, false],
    ['mr-IN', true, false],
    ['nl-NL', true, false],
    ['ne-NP', true, false],
    ['nb-NO', true, false],
    ['pl-PL', true, false],
    ['pt-BR', false, true],
    ['pt-PT', true, false],
    ['ro-RO', true, false],
    ['si-LK', true, false],
    ['sk-SK', true, false],
    ['sl-SI', true, false],
    ['su-ID', true, false],
    ['sw-TZ', true, false],
    ['sw-KE', true, false],
    ['fi-FI', true, false],
    ['sv-SE', true, false],
    ['ta-IN', true, false],
    ['ta-SG', false, false],
    ['ta-LK', false, false],
    ['ta-MY', false, true],
    ['te-IN', true, false],
    ['vi-VN', true, false],
    ['tr-TR', true, false],
    ['ur-PK', true, false],
    ['ur-IN', true, false],
    ['el-GR', true, false],
    ['bg-BG', true, false],
    ['ru-RU', true, false],
    ['sr-RS', true, false],
    ['uk-UA', true, false],
    ['he-IL', true, false],
    ['ar-IL', false, true],
    ['ar-JO', false, false],
    ['ar-AE', false, false],
    ['ar-BH', false, false],
    ['ar-DZ', false, false],
    ['ar-SA', false, false],
    ['ar-IQ', false, false],
    ['ar-KW', false, false],
    ['ar-MA', false, false],
    ['ar-TN', false, false],
    ['ar-OM', false, false],
    ['ar-PS', false, false],
    ['ar-QA', false, false],
    ['ar-LB', false, false],
    ['ar-EG', true, false],
    ['fa-IR', true, false],
    ['hi-IN', true, false],
    ['th-TH', true, false],
    ['ko-KR', true, false],
    ['cmn-Hant-TW', false, true],
    ['yue-Hant-HK', true, false],
    ['ja-JP', true, false],
    ['cmn-Hans-HK', false, false],
    ['cmn-Hans-CN', true, false]
];
const transformYrpriCode = (code) => {
    return code.replace('_', '-').replace('zh_tw', 'cmn-Hant-TW').replace('no', 'nb-NO').replace('ro-md', 'ro-RO').replace('ro_md', 'ro-RO');
};
const exactLanguageMatch = (code) => {
    code = transformYrpriCode(code);
    let match = null;
    _.forEach(supportedGoogleLanguges, (language) => {
        if (language[0] === code)
            match = language[0];
    });
    return match;
};
const firstTwoLanguagePrimaryMatch = (code) => {
    code = transformYrpriCode(code);
    let match = null;
    _.forEach(supportedGoogleLanguges, (language) => {
        const enCode = language[0].substring(0, 3);
        const chineseCode = language[0].substring(0, 4);
        if (enCode === code + '-' && language[1] === true)
            match = language[0];
        if (chineseCode === code + '-' && language[1] === true)
            match = language[0];
    });
    return match;
};
const firstTwoLanguageSecondaryMatch = (code) => {
    code = transformYrpriCode(code);
    let match = null;
    _.forEach(supportedGoogleLanguges, (language) => {
        if (language[0].substring(0, 3) === code + '-' && language[2] === true)
            match = language[0];
        if (language[0].substring(0, 4) === code + '-' && language[2] === true)
            match = language[0];
    });
    return match;
};
const getLanguageArray = (workPackage) => {
    let alternativeLanguageCodes = [];
    let languageCode = null;
    const appLanguage = workPackage.appLanguage;
    const browserLanguage = workPackage.browserLanguage;
    if (appLanguage && appLanguage) {
        let exactAppMatch = exactLanguageMatch(appLanguage);
        let primaryAppMatch = firstTwoLanguagePrimaryMatch(appLanguage);
        let secondaryAppMatch = firstTwoLanguageSecondaryMatch(appLanguage);
        let exactBrowserMatch = exactLanguageMatch(browserLanguage);
        let primaryBrowserMatch = firstTwoLanguagePrimaryMatch(browserLanguage);
        let secondaryBrowserMatch = firstTwoLanguageSecondaryMatch(browserLanguage);
        if (exactAppMatch)
            languageCode = exactAppMatch;
        else if (primaryAppMatch)
            languageCode = primaryAppMatch;
        else if (secondaryAppMatch)
            languageCode = secondaryAppMatch;
        else if (exactBrowserMatch)
            languageCode = exactBrowserMatch;
        else if (primaryBrowserMatch)
            languageCode = primaryBrowserMatch;
        if (!languageCode) {
            return null;
        }
        else {
            if (exactAppMatch && exactAppMatch !== languageCode)
                alternativeLanguageCodes.push(exactAppMatch);
            if (primaryAppMatch && primaryAppMatch !== languageCode)
                alternativeLanguageCodes.push(primaryAppMatch);
            if (secondaryAppMatch && secondaryAppMatch !== languageCode)
                alternativeLanguageCodes.push(secondaryAppMatch);
            if (exactBrowserMatch && exactBrowserMatch !== languageCode)
                alternativeLanguageCodes.push(exactBrowserMatch);
            if (primaryBrowserMatch && primaryBrowserMatch !== languageCode)
                alternativeLanguageCodes.push(primaryBrowserMatch);
            if (secondaryBrowserMatch)
                alternativeLanguageCodes.push(primaryBrowserMatch);
        }
        alternativeLanguageCodes = _.uniq(alternativeLanguageCodes);
        if (alternativeLanguageCodes.length < 3)
            alternativeLanguageCodes.push("en-US");
        // if (alternativeLanguageCodes.length<3)
        //   alternativeLanguageCodes.push("is-IS");
        if (alternativeLanguageCodes.length > 3)
            alternativeLanguageCodes = alternativeLanguageCodes.slice(0, 3);
        const languageSelection = { languageCode, alternativeLanguageCodes };
        log.info("Selected languages for transcript", languageSelection, workPackage);
        return languageSelection;
    }
    else {
        return null;
    }
};
const createTranscriptForFlac = (flackUrl, workPackage, callback) => {
    const languageSelection = getLanguageArray(workPackage);
    if (languageSelection && speech) {
        const client = new speech.SpeechClient({
            credentials: JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON),
            projectId: process.env.GOOGLE_TRANSLATE_PROJECT_ID ? process.env.GOOGLE_TRANSLATE_PROJECT_ID : undefined,
        });
        const encoding = 'FLAC';
        const sampleRateHertz = 44100;
        const config = {
            encoding: encoding,
            sampleRateHertz: sampleRateHertz,
            languageCode: languageSelection.languageCode,
            // Disabled for now as it does not work well enough for long form content
            //alternativeLanguageCodes: languageSelection.alternativeLanguageCodes,
            enableWordTimeOffsets: true,
            enableAutomaticPunctuation: true,
            enableWordConfidence: true
        };
        const audio = {
            uri: flackUrl,
        };
        const request = {
            config: config,
            audio: audio
        };
        log.info("createTranscriptForFlac: Starting speech to text", { request });
        client
            .longRunningRecognize(request)
            .then(data => {
            log.info("createTranscriptForFlac: Got data from google cloud - step 1", { data });
            let operation = data[0];
            operation.backoffSettings.totalTimeoutMillis = 120000;
            log.info(operation.backoffSettings);
            return operation.promise();
        })
            .then(data => {
            log.info("createTranscriptForFlac: Got data from google cloud - step 2", { data });
            callback(null, data[0]);
        })
            .catch(error => {
            log.error("createTranscriptForFlac: error", { error });
            callback(error);
        });
    }
    else {
        log.warn("Can't find any languages to translate or speech not here", { workPackage, speechNull: speech == null });
        callback("Can't find languages");
    }
};
const uploadFlacToGoogleCloud = (flacUrl, callback) => {
    const splitUrl = flacUrl.split('/');
    const fileName = splitUrl[splitUrl.length - 1];
    const fileNameWithPath = '/tmp/' + fileName;
    const fileUri = 'gs://' + process.env.GOOGLE_TRANSCODING_FLAC_BUCKET + '/' + fileName;
    downloadFile(flacUrl, { filename: fileName, directory: '/tmp/' }, error => {
        if (error) {
            fs.unlink(fileNameWithPath, unlinkError => {
                callback('Could not download file');
            });
        }
        else {
            const storage = new Storage({
                credentials: JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON),
                projectId: process.env.GOOGLE_TRANSLATE_PROJECT_ID ? process.env.GOOGLE_TRANSLATE_PROJECT_ID : undefined,
            });
            const bucket = storage.bucket(process.env.GOOGLE_TRANSCODING_FLAC_BUCKET);
            if (bucket) {
                bucket.upload(fileNameWithPath, (error, file, apiResponse) => {
                    if (error) {
                        log.error("Couldnt upload to s3 bucket", { error, apiResponse });
                        fs.unlink(fileNameWithPath, unlinkError => {
                            callback(error);
                        });
                    }
                    else {
                        fs.unlink(fileNameWithPath, error => {
                            if (error) {
                                callback(error);
                            }
                            else {
                                log.info("uploadFlacToGoogleCloud done", { flacUrl });
                                callback(null, fileUri);
                            }
                        });
                    }
                });
            }
            else {
                fs.unlink(fileNameWithPath, unlinkError => {
                    callback('Could not find GCloud bucket');
                });
            }
        }
    });
};
const createTranscriptForVideo = (workPackage, callback) => {
    log.info("In createTranscriptForVideo");
    models.Video.findOne({
        where: workPackage.videoId
    }).then((video) => {
        if (video) {
            if (!video.meta.transcript)
                video.set('meta.transcript', {});
            video.set('meta.transcript.inProgressDate', new Date());
            video.save().then(() => {
                const videoUrl = video.formats[0];
                const flacUrl = videoUrl.slice(0, videoUrl.length - 4) + '.flac';
                uploadFlacToGoogleCloud(flacUrl, (error, gsUri) => {
                    if (error) {
                        log.warn('createTranscriptForVideo', { warn: 'Found no audio file' });
                        video.set('meta.transcript.error', 'Found no audio file');
                        video.save().then(() => {
                            log.info("createTranscriptForVideo: Video with transcript saved with error", { videoId: workPackage.videoId, error });
                            callback();
                        }).catch((error) => {
                            callback(error);
                        });
                    }
                    else {
                        log.info("createTranscriptForVideo: have uploaded to Google Cloud");
                        createTranscriptForFlac(gsUri, workPackage, (error, response) => {
                            log.info("createTranscriptForVideo: got transcript", { response });
                            video.set('meta.transcript.googleSpeechResponse', response);
                            if (error) {
                                video.set('meta.transcript.error', error);
                                log.error('createTranscriptForVideo', { error });
                            }
                            else {
                                if (response.results && response.results && response.results.length > 0 &&
                                    response.results[0].alternatives && response.results[0].alternatives.length > 0) {
                                    const transcription = response.results
                                        .map(result => result.alternatives[0].transcript)
                                        .join('\n');
                                    video.set('meta.transcript.text', transcription);
                                }
                                else {
                                    video.set('meta.transcript.error', 'Found no text');
                                    log.error('createTranscriptForVideo', { error: 'Found no text' });
                                }
                            }
                            video.save().then(() => {
                                log.info("createTranscriptForVideo: Video with transcript saved", { videoId: workPackage.videoId, error });
                                callback();
                            }).catch((error) => {
                                callback(error);
                            });
                        });
                    }
                });
            }).catch(error => {
                callback(error);
            });
        }
        else {
            callback("Couldn't find video for createTranscriptForVideo", { workPackage });
        }
    }).catch((error) => {
        callback(error);
    });
};
const createTranscriptForAudio = (workPackage, callback) => {
    log.info("In createTranscriptForAudio");
    models.Audio.findOne({
        where: workPackage.audioId,
        include: [
            {
                model: models.Point,
                as: 'PointAudios',
                required: false
            },
            {
                model: models.Post,
                as: 'PostAudios',
                required: false
            }
        ]
    }).then((audio) => {
        if (audio) {
            if (!audio.meta.transcript)
                audio.set('meta.transcript', {});
            audio.set('meta.transcript.inProgressDate', new Date());
            audio.save().then(() => {
                const audioUrl = audio.formats[0];
                const flacUrl = audioUrl.slice(0, audioUrl.length - 4) + '.flac';
                uploadFlacToGoogleCloud(flacUrl, (error, gsUri) => {
                    if (error) {
                        callback(error);
                    }
                    else {
                        log.info("createTranscriptForAudio: have uploaded to Google Cloud");
                        createTranscriptForFlac(gsUri, workPackage, (error, response) => {
                            log.info("createTranscriptForAudio: got transcript", { response });
                            audio.set('meta.transcript.googleSpeechResponse', response);
                            if (error) {
                                audio.set('meta.transcript.error', error);
                                log.error("createTranscriptForAudio", { error });
                            }
                            else {
                                if (response.results && response.results && response.results.length > 0 &&
                                    response.results[0].alternatives && response.results[0].alternatives.length > 0) {
                                    const transcription = response.results
                                        .map(result => result.alternatives[0].transcript)
                                        .join('\n');
                                    audio.set('meta.transcript.text', transcription);
                                }
                                else {
                                    audio.set('meta.transcript.error', 'Found no text');
                                    log.error("createTranscriptForAudio", { error: 'Found no text' });
                                }
                            }
                            audio.save().then(() => {
                                log.info("createTranscriptForAudio: Audio with transcript saved", { audioId: workPackage.audioId, error });
                                callback();
                            }).catch((error) => {
                                callback(error);
                            });
                        });
                    }
                });
            }).catch(error => {
                callback(error);
            });
        }
        else {
            callback("Couldn't find audio for createTranscriptForAudio", { workPackage });
        }
    }).catch((error) => {
        callback(error);
    });
};
/**
 * Processes a speech-to-text work package.
 * @param {object} workPackage - The work package for speech-to-text.
 * @param {(error?: any) => void} callback - The callback function.
 * @memberof VoiceToTextWorker
 */
VoiceToTextWorker.prototype.process = function (workPackage, callback) {
    switch (workPackage.type) {
        case 'create-video-transcript':
            createTranscriptForVideo(workPackage, callback);
            break;
        case 'create-audio-transcript':
            createTranscriptForAudio(workPackage, callback);
            break;
        default:
            callback("Unknown type for workPackage: " + workPackage.type);
    }
};
/** @type {VoiceToTextWorker} */
module.exports = new VoiceToTextWorker();
