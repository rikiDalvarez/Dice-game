// middleware/authenticate.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import sanitizedConfig from "../../../config/config";

interface CustomRequest extends Request {
  userId?: string; // or the appropriate type for your user IDs
}

const authenticate = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    throw new Error ('NoToken')
  }
  try {
    const decodedToken = jwt.verify(token, sanitizedConfig.JWT_SECRET) as {
      userId: string;
    };
    req.userId = decodedToken.userId;
    next();
  } catch (error) {
    next(error);
  }
};

export default authenticate;
