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
    return res.status(401).json({ error: "Authentication required" });
  }

  try {
    const decodedToken = jwt.verify(token, sanitizedConfig.JWT_SECRET) as {
      userId: string;
    };
    req.userId = decodedToken.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: "Authentication failed" });
  }
};

export default authenticate;
