export const MAX_FRAUD_IDS_TO_DELETE: 1000;
export function normalizeIdsToDelete(idsToDelete: any): number[] | never[];
export function validateFraudActionRequest({ type, selectedMethod, collectionType, idsToDelete, }: {
    type: any;
    selectedMethod: any;
    collectionType: any;
    idsToDelete: any;
}): {
    error: string;
    idsToDelete: number[] | never[];
} | {
    idsToDelete: number[] | never[];
    error?: undefined;
};
export function validateIdsToDelete(idsToDelete: any): {
    error: string;
    idsToDelete: never[];
} | {
    idsToDelete: number[];
    error?: undefined;
};
