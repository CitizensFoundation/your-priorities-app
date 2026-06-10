export class FraudScannerNotifier {
    currentCommunity: (import("sequelize").Model<YpCommunityData, Partial<YpCommunityData>> & YpCommunityData) | null;
    uniqueCollectionItemsIds: {};
    collectionsToScan: string[];
    scannerModels: (typeof FraudGetPoints)[];
    resetCounts(): void;
    getCommunityURL(): string;
    setupCounts(items: any, collectionType: any): void;
    capitalizeFirstLetter(string: any): any;
    formatNumber(value: any): any;
    getNumberSign(number: any): "" | "+";
    sendNotificationEmails(fraudAuditResults: any): Promise<void>;
    getContainerOldCount(collectionType: any): any;
    getWithDifference(results: any): any;
    notify(): Promise<void>;
    scan(): Promise<void>;
    scanAndNotify(): Promise<any>;
}
export function runFraudScannerNotifier(): void;
import FraudGetPoints = require("./FraudGetPoints.cjs");
