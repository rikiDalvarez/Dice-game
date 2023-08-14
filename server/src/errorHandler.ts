import { NextFunction, Response } from "express";

export const errorHandler = (
  error: Error,
  response: Response,
  next: NextFunction
) => {
  if (response.headersSent) {
    return next(error);
  }

  if (
    error.name === "ValidationError" ||
    error.name === "SequelizeValidationError"
  ) {
    return response.status(400).send({ Error: error.message });
  }

  switch (error.message) {
    case "EmailNotExists":
      return response
        .status(401)
        .send({ Error: "Incorrect email or password" });
    case "NameEmailConflictError":
      return response
        .status(409)
        .send({ Error: "name or email already exists" });
    case "NameConflictError":
      return response.status(409).send({ Error: "name already exists" });
    case "NoToken":
    case "jwt expired":
      return response.status(401).json({ Error: "Authentication required" });
    case "NotFoundError":
      return response.status(404).send({ Error: "Resource not exists" });
    default:
      return response
        .status(500)
        .json({ error: error.message, error_code: "PP001" });
  }
};
