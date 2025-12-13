import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
    addToCart,
    clearCart,
    getCart,
    removeFromCart,
    updateCartItem
} from "../controllers/cart.controller.js";

const cartRouter = Router();

cartRouter.use(protectRoute);

cartRouter.get("/", getCart);
cartRouter.post("/", addToCart);
cartRouter.put("/", updateCartItem); // Using body for productId and quantity
cartRouter.delete("/:productId", removeFromCart);
cartRouter.delete("/", clearCart);

export default cartRouter;
