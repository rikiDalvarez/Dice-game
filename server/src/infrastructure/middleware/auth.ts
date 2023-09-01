// middleware/authenticate.ts
import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import sanitizedConfig from "../../../config/config";

interface CustomRequest extends Request {
  userId?: string;
}

const authenticate = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {

  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    throw new Error("NoToken");
  }
  try {
    const decodedToken = jwt.verify(token, sanitizedConfig.JWT_SECRET, {
      ignoreExpiration: false,
    }) as JwtPayload;
    req.userId = decodedToken.userId;
    next();
  } catch (error) {
    if (error === "jwt expired") {
      next(error)
    }
    next(error);
  }

};

export default authenticate;
