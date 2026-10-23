export declare class LiveWorkflowServiceError extends Error {
    readonly statusCode: number;
    readonly code: string;
    readonly details?: Record<string, unknown> | undefined;
    constructor(message: string, statusCode: number, code: string, details?: Record<string, unknown> | undefined);
}
export declare class ValidationError extends LiveWorkflowServiceError {
    constructor(message: string, details?: Record<string, unknown>);
}
export declare class NotFoundError extends LiveWorkflowServiceError {
    constructor(resource: string, id: string | number);
}
export declare class ForbiddenError extends LiveWorkflowServiceError {
    constructor(message?: string, details?: Record<string, unknown>);
}
export declare class ConflictError extends LiveWorkflowServiceError {
    constructor(message: string, code?: string, details?: Record<string, unknown>);
}
export declare class NotImplementedError extends LiveWorkflowServiceError {
    constructor(message: string);
}
