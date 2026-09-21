import { ApiError } from "../utils/api-error.js";

function parseWithSchema(schema, value, targetKey) {
  const parsed = schema.safeParse(value);

  if (!parsed.success) {
    const details = parsed.error.issues.map((issue) => ({
      path: issue.path.join("."),
      message: issue.message,
    }));
    throw new ApiError(400, "Request validation failed", "VALIDATION_ERROR", details);
  }

  return { [targetKey]: parsed.data };
}

export function validateBody(schema) {
  return function validateRequestBody(req, _res, next) {
    try {
      Object.assign(req, parseWithSchema(schema, req.body, "validatedBody"));
      next();
    } catch (error) {
      next(error);
    }
  };
}

export function validateQuery(schema) {
  return function validateRequestQuery(req, _res, next) {
    try {
      Object.assign(req, parseWithSchema(schema, req.query, "validatedQuery"));
      next();
    } catch (error) {
      next(error);
    }
  };
}

export function validateParams(schema) {
  return function validateRequestParams(req, _res, next) {
    try {
      Object.assign(req, parseWithSchema(schema, req.params, "validatedParams"));
      next();
    } catch (error) {
      next(error);
    }
  };
}
