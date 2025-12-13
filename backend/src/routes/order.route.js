import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { createOrder, deleteOrder, getOrders, updateOrder } from "../controllers/order.controller.js";
const OrderRouter = Router();

OrderRouter.use(protectRoute)

OrderRouter.get("/orders", getOrders)
OrderRouter.post("/orders", createOrder)
OrderRouter.delete("/orders/:orderId", deleteOrder)
OrderRouter.put("/orders/:orderId", updateOrder)

export default OrderRouter;
