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
    case "NameConflictError":
      return response
        .status(409)
        .send({ Error: "Name already exists" });
    case "EmailConflictError":
      return response
        .status(409)
        .send({ Error: "Email already exists" });
    case "CreatingPlayerError":
      return response
        .status(409)
        .send({ Error: "Couldn't create the player" });
    case "PlayerNotFound":
      return response
        .status(404)
        .send({ Error: "Player(s) not found" });
    case "EmailNotExists":
      return response
        .status(401)
        .send({ Error: "Email doesn't exist" });
    case "jwt expired":
      return response.status(401).json({ Error: "Authentication required" });
    // en MongoDbManager no está NotFoundError
    case "NotFoundError":
      return response.status(404).send({ Error: "Resource not exists" });
    case "AddingGameError":
      return response.status(409).send({ Error: "Name already exists" });
    case "NoToken":
      return response
        .status(409)
        .send({ Error: "Error playing one game" });
    case "DeletingError":
      return response
        .status(409)
        .send({ Error: "Error during deletion" });
    case "GettingSuccessRateAvgError":
      return response
        .status(409)
        .send({ Error: "Error getting success rate average" });
    default:
      return response
        .status(500)
        .json({ error: error.message });
  }
};
