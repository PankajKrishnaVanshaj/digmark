import mongoose from "mongoose";
import { User } from "../types/user.Types";

// Define the user schema
const userSchema = new mongoose.Schema<User>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    isCreator: {
      type: Boolean,
      required: true,
      default: false,
    },
    wishList: [
      {
        _id: false,
        bookId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Book",
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model<User>("User", userSchema);
