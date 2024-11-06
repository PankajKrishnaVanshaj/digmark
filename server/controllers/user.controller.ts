import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import bcrypt from "bcrypt";
import userModel from "../models/account.model";
import { sign, verify } from "jsonwebtoken";
import { config } from "../config/EnvConfig";
import { User } from "../types/user.Types";
import sendMail from "../config/sendMail";

// Custom Request Interface to include userId
export interface AuthRequest extends Request {
  userId?: string;
}

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;

  // Validation
  if (!name || !email || !password) {
    return next(createHttpError(400, "All fields are required"));
  }

  try {
    // Check if the user already exists
    const userExists = await userModel.findOne({ email });
    if (userExists) {
      return next(createHttpError(400, "User already exists with this email."));
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user
    const newUser: User = await userModel.create({
      name,
      email,
      password: hashedPassword,
    });

    // Generate JWT token
    const token = sign({ sub: newUser._id }, config.jwtSecret as string, {
      expiresIn: "7d",
    });

    // Respond with the token
    // Set token in a cookie
    res.cookie("token", token);
    res.status(201).json({
      success: true,
      message: "Account created successfully",
      newUser,
      token,
    });
  } catch (err) {
    console.error("Error creating user:", err);
    return next(createHttpError(500, "Error while creating user."));
  }
};

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    return next(createHttpError(400, "All fields are required"));
  }

  try {
    // Find user by email
    const user = await userModel.findOne({ email });
    if (!user) {
      return next(createHttpError(404, "User not found."));
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(createHttpError(400, "Username or password incorrect!"));
    }

    // Generate JWT token
    const token = sign({ sub: user._id }, config.jwtSecret as string, {
      expiresIn: "7d",
    });

    // Respond with the token
    res.cookie("token", token); // Set cookie options if needed
    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
    });
  } catch (err) {
    console.error("Error logging in:", err);
    return next(createHttpError(500, "Error while logging in."));
  }
};

const meUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Assuming req.userId contains the authenticated user's ID
    const authReq = req as AuthRequest;
    const userId = authReq.userId;

    if (!userId) {
      return next(createHttpError(401, "Unauthorized access."));
    }

    // Fetch the user data from the database
    const user = await userModel.findById(userId).select("-password"); // Exclude password

    if (!user) {
      return next(createHttpError(404, "User not found."));
    }

    // Return the user data
    res.json(user);
  } catch (error) {
    console.error("Error fetching user data:", error);
    return next(createHttpError(500, "Error while fetching user data."));
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Clear the token cookie
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
    });

    res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    return next(createHttpError(500, "Error while fetching user data."));
  }
};

// Utility function to generate password reset token
const generatePasswordResetToken = async (email: string): Promise<string> => {
  // Generate a unique reset token
  const resetToken = sign({ email }, config.jwtSecret as string, {
    expiresIn: "1h", // Token expires in 1 hour
  });
  return resetToken;
};

// Utility function to send password reset email
const sendPasswordResetEmail = async (
  email: string,
  resetToken: string
): Promise<void> => {
  try {
    // Construct the reset password URL
    const resetPasswordUrl = `${config.clientDomain}/reset-password?token=${resetToken}`;

    // Compose the email message
    const message = `Click the following link to reset your password: ${resetPasswordUrl}`;

    // Send the password reset email
    await sendMail({
      email,
      subject: "Password Reset",
      message,
    });
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw createHttpError(500, "Error sending password reset email.");
  }
};

// Controller for requesting a password reset
const requestPasswordReset = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email } = req.body;

  // Validation
  if (!email) {
    return next(createHttpError(400, "Email is required"));
  }

  try {
    // Find user by email
    const user = await userModel.findOne({ email });
    if (!user) {
      return next(createHttpError(404, "User not found."));
    }

    // Generate password reset token
    const resetToken = await generatePasswordResetToken(email);

    // Send password reset email
    await sendPasswordResetEmail(email, resetToken);

    // Respond with success message
    res.json({ message: "Password reset email sent successfully." });
  } catch (err) {
    console.error("Error requesting password reset:", err);
    return next(createHttpError(500, "Error while requesting password reset."));
  }
};

// Controller for resetting the password
const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password, token } = req.body;

  // Validation
  if (!email || !password || !token) {
    return next(
      createHttpError(400, "Email, password, and token are required")
    );
  }

  try {
    // Verify the token
    const decodedToken = verify(token, config.jwtSecret as string) as {
      email: string;
    };
    if (decodedToken.email !== email) {
      return next(createHttpError(400, "Invalid token."));
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user's password
    await userModel.updateOne(
      { email },
      { $set: { password: hashedPassword } }
    );

    // Respond with success message
    res.json({ message: "Password reset successfully." });
  } catch (err) {
    console.error("Error resetting password:", err);
    return next(createHttpError(500, "Error while resetting password."));
  }
};

export { createUser, loginUser, meUser, requestPasswordReset, resetPassword };
