export declare const WORKBOOK_SPEC_CONTENT_TYPE = "application/vnd.yrpri.workbook+json";
export declare const XLSX_CONTENT_TYPE = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
/** Excel's 32,767 UTF-16 cell limit must not silently truncate uploaded documents. */
export declare function excelTextParts(value: string): string[];
/** The VM supplies scalar table data only. Credentials, files and formulas are never accepted. */
export declare function renderWorkbook(content: string): Promise<Buffer>;
