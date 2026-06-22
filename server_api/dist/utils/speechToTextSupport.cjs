"use strict";
const getSpeechToTextSupportConfig = () => {
    const googleCredentials = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
    const transcodingFlacBucket = process.env.GOOGLE_TRANSCODING_FLAC_BUCKET;
    return {
        hasGoogleCredentials: typeof googleCredentials === "string" && googleCredentials.trim().length > 0,
        hasTranscodingFlacBucket: typeof transcodingFlacBucket === "string" &&
            transcodingFlacBucket.trim().length > 0,
        googleCredentialsLength: typeof googleCredentials === "string" ? googleCredentials.length : 0,
        transcodingFlacBucket: transcodingFlacBucket || null,
        transcodingFlacBucketLength: typeof transcodingFlacBucket === "string" ? transcodingFlacBucket.length : 0,
    };
};
const hasSpeechToTextSupport = () => {
    const config = getSpeechToTextSupportConfig();
    return config.hasGoogleCredentials && config.hasTranscodingFlacBucket;
};
module.exports = {
    getSpeechToTextSupportConfig,
    hasSpeechToTextSupport,
};
