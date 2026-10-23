export class LiveWorkflowServiceError extends Error {
    constructor(message, statusCode, code, details) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.details = details;
        this.name = "LiveWorkflowServiceError";
    }
}
export class ValidationError extends LiveWorkflowServiceError {
    constructor(message, details) {
        super(message, 400, "validation_error", details);
        this.name = "ValidationError";
    }
}
export class NotFoundError extends LiveWorkflowServiceError {
    constructor(resource, id) {
        super(`${resource} not found`, 404, "not_found", { resource, id });
        this.name = "NotFoundError";
    }
}
export class ForbiddenError extends LiveWorkflowServiceError {
    constructor(message = "Forbidden", details) {
        super(message, 403, "forbidden", details);
        this.name = "ForbiddenError";
    }
}
export class ConflictError extends LiveWorkflowServiceError {
    constructor(message, code = "conflict", details) {
        super(message, 409, code, details);
        this.name = "ConflictError";
    }
}
export class NotImplementedError extends LiveWorkflowServiceError {
    constructor(message) {
        super(message, 501, "not_implemented");
        this.name = "NotImplementedError";
    }
}
