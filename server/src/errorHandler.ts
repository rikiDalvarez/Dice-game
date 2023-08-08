import  { NextFunction, Response } from "express";



export const errorHandler = (error:Error, response:Response, next:NextFunction) =>{


if (response.headersSent) {
    return next(error);
  }

  if (error.name === 'ValidationError'){
      return response
        .status(400)
        .send({ Error: "Wrong email format" });
  }

  switch (error.message) {
    case "NameEmailConflictError":
      return response
        .status(409)
        .send({ Error: "name or email already exists" });
    case "NameConflictError":
      return response
        .status(409)
        .send({ Error: "name already exists" });
    case "NotFoundError":
      return response
        .status(404)
        .send({ Error: "Resource not exists" });
        default:
      return response
        .status(500)
        .json({ error: error.message, error_code: "PP001" });
  }
}