import express from "express";
const adminRouter = express.Router(); 
import { protectRoute,isAdmin } from "../middleware/auth.middleware.js"; 
import { createProduct, deleteProduct, getAllOrders,getProductById, getProduct, getAllCustomers, getDashboardStats, updateOrderStatus, updateProduct } from "../controllers/admin.controller.js";
import upload from "../middleware/multer.middleware.js";

adminRouter.use(protectRoute,isAdmin)

adminRouter.get("/product", getProduct);
adminRouter.get("/product/:id", getProductById);
adminRouter.post("/product", upload.array("images", 5), createProduct);
adminRouter.delete("/product/:id", deleteProduct);
adminRouter.put("/product/:id", upload.array("images", 5), updateProduct);



adminRouter.get("/orders",getAllOrders) 
adminRouter.patch("/order/:orderId/status",updateOrderStatus) 


adminRouter.get("/customers",getAllCustomers)
adminRouter.get("/dashboardStats",getDashboardStats)
export default adminRouter;

