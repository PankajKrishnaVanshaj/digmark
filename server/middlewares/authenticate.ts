import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { verify } from "jsonwebtoken";
import { config } from "../config/EnvConfig";

export interface AuthRequest extends Request {
  userId?: string;
}

const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header("Authorization");

  if (!token) {
    return next(createHttpError(401, "Authorization token is required."));
  }

  try {
    // Extract token from "Bearer <token>" format
    const parsedToken = token.split(" ")[1];

    // Verify the token
    const decoded = verify(parsedToken, config.jwtSecret as string);

    // Attach userId (or other decoded token details) to the request object
    const _req = req as AuthRequest;
    _req.userId = (decoded as { sub: string }).sub; // Assuming `sub` contains the userId

    // Continue to the next middleware or route handler
    next();
  } catch (err) {
    console.error("Token verification error:", err);
    return next(createHttpError(401, "Invalid or expired token."));
  }
};

export default authenticate;
