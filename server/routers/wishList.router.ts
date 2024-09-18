import express from "express";

import authenticate from "../middlewares/authenticate";
import {
  getWishList,
  toggleWishList,
  WishListStatus,
} from "../controllers/WishList.controller";

const wishListRouter = express.Router();

wishListRouter.get("/:bookId", authenticate, WishListStatus);
wishListRouter.post("/:bookId", authenticate, toggleWishList);
wishListRouter.get("/", authenticate, getWishList);

export default wishListRouter;
