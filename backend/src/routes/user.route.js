import { Router } from "express";
import { addAddress, addToWishlist, deleteAddress, getAddresses, getWishlist, removeFromWishlist, updateAddress } from "../controllers/user.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
const UserRouter = Router();

UserRouter.use(protectRoute)

//Adress Routes
UserRouter.post("/addresses", addAddress)
UserRouter.get("/addresses", getAddresses)
UserRouter.put("/addresses/:addressId", updateAddress)
UserRouter.delete("/addresses/:addressId", deleteAddress)

//Wishlist routes
UserRouter.post("/wishlist", addToWishlist)
UserRouter.get("/wishlist", getWishlist)
UserRouter.delete("/wishlist/:productId", removeFromWishlist)

export default UserRouter
