import mongoose from "mongoose";
import userModel from "../models/account.model";
import { Request, Response } from "express";

const WishListStatus = async (req: Request, res: Response) => {
  const bookId = req.params.bookId as string;

  const authReq = req as any; // Adjust based on your actual type for authReq
  const userId = authReq.userId;

  try {
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized access" });
    }

    // Find the user by ID
    const user = await userModel.findById(userId).exec();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Convert bookId to ObjectId
    const bookObjectId = new mongoose.Types.ObjectId(bookId);

    // Check if the book is already in the wish list
    const isInWishList = user.wishList.some((item) =>
      item.bookId.equals(bookObjectId)
    );

    // Respond with the status
    res.status(200).json({
      message: isInWishList
        ? "Book is in wish-list"
        : "Book is not in wish list",
      isInWishList,
    });
  } catch (error) {
    console.error("Error fetching wish-list status:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const toggleWishList = async (req: Request, res: Response) => {
  const bookId = req.params.bookId as string;

  const authReq = req as any; // Adjust based on your actual type for authReq
  const userId = authReq.userId;

  try {
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized access" });
    }

    // Find the user by ID
    const user = await userModel.findById(userId).exec();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Convert bookId to ObjectId
    const bookObjectId = new mongoose.Types.ObjectId(bookId);

    // Check if the book is already in the wish list
    const isInWishList = user.wishList.some((item) =>
      item.bookId.equals(bookObjectId)
    );

    if (isInWishList) {
      // Remove the book from the wish list
      user.wishList = user.wishList.filter(
        (item) => !item.bookId.equals(bookObjectId)
      );
    } else {
      // Add the book to the wish list
      user.wishList.push({ bookId: bookObjectId });
    }

    // Save the updated user document
    await user.save();

    res.status(200).json({
      message: isInWishList
        ? "Book removed from wish-list"
        : "Book added to wish list",
      isInWishList: !isInWishList,
    });
  } catch (error) {
    console.error("Error toggling wish list:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getWishList = async (req: Request, res: Response) => {
  const authReq = req as any; // Adjust based on your actual type for authReq
  const userId = authReq.userId;

  try {
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized access" });
    }

    // Find the user by ID and populate wish list
    const user = await userModel
      .findById(userId)
      .populate("wishList.bookId")
      .exec();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Respond with the user's wish list
    res.status(200).json({
      message: "Wish list fetched successfully",
      wishList: user.wishList,
    });
  } catch (error) {
    console.error("Error fetching wish list:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export { toggleWishList, WishListStatus, getWishList };
