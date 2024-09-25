import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { verify } from "jsonwebtoken";
import { config } from "../config/EnvConfig";
import Users from "../models/account.model";

export interface AuthRequest extends Request {
  userId?: string;
  isCreator?: boolean;
}

const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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

    // Fetch user data from the database to get `isCreator`
    const user = await Users.findById(_req.userId).select("isCreator");
    if (user) {
      _req.isCreator = user.isCreator;
    } else {
      return next(createHttpError(404, "User not found."));
    }

    // Continue to the next middleware or route handler
    next();
  } catch (err) {
    console.error("Token verification error:", err);
    return next(createHttpError(401, "Invalid or expired token."));
  }
};

export default authenticate;
