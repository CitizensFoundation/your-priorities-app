export = Perspective;
declare class Perspective {
    constructor(options: any);
    options: any;
    analyze(text: any, options: any): Promise<any>;
    getAnalyzeCommentPayload(text: any, options: any): {
        comment: {
            text: any;
        };
    } & {
        requestedAttributes: any;
        doNotStore: any;
    };
}
declare namespace Perspective {
    export { PerspectiveAPIClientError };
    export { TextEmptyError };
    export { TextTooLongError };
    export { ResponseError };
}
declare class PerspectiveAPIClientError extends Error {
    constructor(message: any);
}
declare class TextEmptyError extends PerspectiveAPIClientError {
    constructor();
}
declare class TextTooLongError extends PerspectiveAPIClientError {
    constructor();
}
declare class ResponseError extends PerspectiveAPIClientError {
    constructor(message: any, response: any);
    response: any;
}
