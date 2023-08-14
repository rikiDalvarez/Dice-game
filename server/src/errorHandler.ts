import { NextFunction, Response } from "express";

export const errorHandler = (
  error: Error,
  response: Response,
  next: NextFunction
) => {
  if (response.headersSent) {
    return next(error);
  }

  //email validation
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
        .send({ Error: "Name or email already exists" });
    case "NameConflictError":
      return response.status(409).send({ Error: "Name already exists" });
    case "NoToken":
    case "jwt expired":
      return response.status(401).json({ Error: "Authentication required" });
    case "NotFoundError":
      return response.status(404).send({ Error: "Resource not exists" });
    case "PlayerNotFound":
      return response
        .status(500)
        .send({ Error: "Player(s) not found" });
    case "CreatingPlayerError":
      return response
        .status(500)
        .send({ Error: "Couldn't create the player" });
    case "DeletingError":
      return response
        .status(500)
        .send({ Error: "Error during deletion" });
    default:
      return response
        .status(500)
        .json({ error: error.message });
  }
};
