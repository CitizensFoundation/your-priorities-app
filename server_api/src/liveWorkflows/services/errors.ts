export class LiveWorkflowServiceError extends Error {
  constructor(
    message: string,
    readonly statusCode: number,
    readonly code: string,
    readonly details?: Record<string, unknown>
  ) {
    super(message);
    this.name = "LiveWorkflowServiceError";
  }
}

export class ValidationError extends LiveWorkflowServiceError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, 400, "validation_error", details);
    this.name = "ValidationError";
  }
}

export class NotFoundError extends LiveWorkflowServiceError {
  constructor(resource: string, id: string | number) {
    super(`${resource} not found`, 404, "not_found", { resource, id });
    this.name = "NotFoundError";
  }
}

export class ForbiddenError extends LiveWorkflowServiceError {
  constructor(message = "Forbidden", details?: Record<string, unknown>) {
    super(message, 403, "forbidden", details);
    this.name = "ForbiddenError";
  }
}

export class ConflictError extends LiveWorkflowServiceError {
  constructor(
    message: string,
    code = "conflict",
    details?: Record<string, unknown>
  ) {
    super(message, 409, code, details);
    this.name = "ConflictError";
  }
}

export class NotImplementedError extends LiveWorkflowServiceError {
  constructor(message: string) {
    super(message, 501, "not_implemented");
    this.name = "NotImplementedError";
  }
}
