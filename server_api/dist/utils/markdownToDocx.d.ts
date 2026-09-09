export declare const MAX_MARKDOWN_REPORT_LENGTH = 1000000;
export interface MarkdownToDocxOptions {
    title?: string;
    creator?: string;
}
export declare const markdownToDocx: (markdown: string, options?: MarkdownToDocxOptions) => Promise<Buffer>;
