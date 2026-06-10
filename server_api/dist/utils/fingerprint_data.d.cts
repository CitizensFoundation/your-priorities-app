export function getFingerprintDataFromBody(body: any, prefix: any): {
    browserId: string | undefined;
    browserFingerprint: string | undefined;
    browserFingerprintConfidence: number;
};
export function normalizeFingerprintValue(value: any): string | undefined;
