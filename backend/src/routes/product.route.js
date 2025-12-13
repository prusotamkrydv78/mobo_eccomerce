import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { createProduct, deleteProduct, getProducts, getProductById, updateProduct } from "../controllers/product.controller.js";
const ProductRouter = Router();

ProductRouter.use(protectRoute)

ProductRouter.get("/products", getProducts)
ProductRouter.get("/products/:productId", getProductById)
ProductRouter.post("/products", createProduct)
ProductRouter.delete("/products/:productId", deleteProduct)
ProductRouter.put("/products/:productId", updateProduct)

export default ProductRouter;