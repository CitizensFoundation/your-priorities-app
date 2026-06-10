export function createFraudAuditReport(workPackage: any, done: any): Promise<any>;
export class FraudAuditReport {
    constructor(workPackage: any);
    workPackage: any;
    exportedData: Excel.Buffer | null;
    items: any;
    workBook: Excel.Workbook | null;
    worksheet: Excel.Worksheet | null;
    getPointQualityItems(ids: any): Promise<(import("sequelize").Model<YpPointQuality, Partial<YpPointQuality>> & YpPointQuality)[]>;
    getPostDependedItems(model: any, ids: any): Promise<any>;
    getPostItems(ids: any): Promise<(import("sequelize").Model<YpPostData, Partial<YpPostData>> & YpPostData)[]>;
    setupXls(): Promise<void>;
    setupFilename(): void;
    getCommunity(): Promise<void>;
    uploadToS3(): Promise<any>;
    setupItems(): Promise<void>;
    populateXls(): Promise<void>;
    createReport(): Promise<any>;
    validateAuditReportCommunity(auditReport: any): void;
}
export function sanitizeWorksheetName(name: any): string;
import Excel = require("exceljs");
