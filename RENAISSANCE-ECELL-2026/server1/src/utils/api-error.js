export class ApiError extends Error {
  constructor(statusCode, message, code = "REQUEST_FAILED", details = undefined) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}
