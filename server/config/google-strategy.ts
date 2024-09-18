import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import passport from "passport";
import userModel from "../models/account.model";
import { config } from "./EnvConfig";
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";

passport.use(
  new GoogleStrategy(
    {
      clientID: config.googleClientId!, // Use non-null assertion
      clientSecret: config.googleClientSecret!, // Use non-null assertion
      callbackURL: "/api/v1/auth/google/callback", // Ensure this matches your route
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: any,
      done: any
    ) => {
      // Add explicit types
      try {
        const email = profile.emails?.[0]?.value || null;
        const name = profile.displayName;

        if (!email) {
          return done(new Error("No email found in profile"), null);
        }

        let user = await userModel.findOne({ email });
        if (!user) {
          const lastSixDigitsID = profile.id.slice(-6);
          const lastTwoDigitsName = name.slice(-2);
          const newPass = lastTwoDigitsName + lastSixDigitsID;
          const hashedPassword = await bcrypt.hash(newPass, 10);

          user = await userModel.create({
            name,
            email,
            password: hashedPassword,
          });
        }

        // Generate JWT token
        const token = sign({ sub: user._id }, config.jwtSecret!, {
          expiresIn: "7d",
          algorithm: "HS256",
        });

        return done(null, { user, token });
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user: any, done: any) => {
  done(null, user);
});

passport.deserializeUser((obj: any, done: any) => {
  done(null, obj);
});
