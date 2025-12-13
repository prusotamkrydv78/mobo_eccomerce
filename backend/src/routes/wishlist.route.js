import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getWishlist, toggleWishlist } from "../controllers/wishlist.controller.js";

const wishlistRouter = Router();

wishlistRouter.use(protectRoute);

wishlistRouter.get("/", getWishlist);
wishlistRouter.post("/", toggleWishlist);

export default wishlistRouter;
