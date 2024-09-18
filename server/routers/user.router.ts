// routers/user.router.ts
import express from "express";
import {
  createUser,
  loginUser,
  meUser,
  requestPasswordReset,
  resetPassword,
} from "../controllers/user.controller";
import authenticate from "../middlewares/authenticate";
import "../config/google-strategy";
import passport from "passport";
import { config } from "../config/EnvConfig";
import { User } from "../types/user.Types"; // Import the User interface

const userRouter = express.Router();

userRouter.post("/signup", createUser);
userRouter.post("/signin", loginUser);
userRouter.get("/me", authenticate, meUser);

// Route to request password reset
userRouter.post("/forgot-password", requestPasswordReset);

// Route to reset password
userRouter.post("/reset-password", resetPassword);

// Route for initiating Google OAuth
userRouter.get(
  "/google",
  passport.authenticate("google", {
    session: false,
    scope: ["profile", "email"],
  })
);

// Route for handling Google OAuth callback
userRouter.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${config.clientDomain}`,
  }),
  (req, res) => {
    const { user, token } = req.user as { user: User; token: string }; // Explicitly cast the type

    // Set token in a cookie
    res.cookie("token", token);

    // Successful authentication, redirect home.
    res.redirect(`${config.clientDomain}`);
  }
);

export default userRouter;
