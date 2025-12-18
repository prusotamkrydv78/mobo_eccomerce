import express from "express";
import cors from "cors";
import dbConnect from "./config/dbConnect.js";
import ENV from "./config/env.js";
import { clerkMiddleware } from "@clerk/express";
import adminRouter from "./routes/admin.route.js";
import userRouter from "./routes/user.route.js";
import orderRouter from "./routes/order.route.js";
import productRouter from "./routes/product.route.js";
import reviewRouter from "./routes/review.route.js";
import cartRouter from "./routes/cart.route.js";
import wishlistRouter from "./routes/wishlist.route.js";

const app = express();
dbConnect();

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(clerkMiddleware());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/admin", adminRouter);
app.use("/api/user", userRouter);

app.use("/api/order", orderRouter);
app.use("/api/review", reviewRouter);
app.use("/api/products", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/wishlist", wishlistRouter);

app.listen(ENV.PORT, () => {
  console.log(`Server is running on port ${ENV.PORT}`);
});
