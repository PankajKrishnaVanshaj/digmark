import mongoose from "mongoose";
import { config } from "./EnvConfig";

export const dbconnection = async () => {
  try {
    // Connect to MongoDB using Mongoose
    await mongoose.connect(config.databaseUrl as string);

    // Log a message when connected successfully
    console.log("MongoDB connected");
  } catch (error) {
    // Log an error message if connection fails
    console.error("Error connecting to MongoDB:", error);
    // Throw the error to propagate it to the caller
    throw error;
  }
};
