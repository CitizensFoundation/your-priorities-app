import { YpCodeBase } from "./YpCodeBaseclass.js";
export declare class YpServerApiBase extends YpCodeBase {
    protected baseUrlPath: string;
    static transformCollectionTypeToApi(type: string): string;
    protected fetchWrapper(url: string, options?: RequestInit, showUserError?: boolean, errorId?: string | undefined, throwError?: boolean): Promise<any>;
    protected handleResponse(response: Response, showUserError: boolean, errorId?: string | undefined, throwError?: boolean): Promise<any>;
}
//# sourceMappingURL=YpServerApiBase.d.ts.map