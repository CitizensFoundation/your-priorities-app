export function getSpeechToTextSupportConfig(): {
    hasGoogleCredentials: boolean;
    hasTranscodingFlacBucket: boolean;
    googleCredentialsLength: number;
    transcodingFlacBucket: string | null;
    transcodingFlacBucketLength: number;
};
export function hasSpeechToTextSupport(): boolean;
