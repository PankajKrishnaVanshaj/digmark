import express from "express";
import bookRouter from "./Book.router";
import userRouter from "./user.router";
import reviewRouter from "./review.router";
import wishListRouter from "./wishList.router";
import searchRouter from "./search.router";

const router = express.Router();
router.use("/auth", userRouter);
router.use("/wish-list", wishListRouter);
router.use("/books", bookRouter);
router.use("/search", searchRouter);
router.use("/reviews", reviewRouter);

export default router;
