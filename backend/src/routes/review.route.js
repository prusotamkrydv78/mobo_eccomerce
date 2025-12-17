import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { createReview, deleteReview, getReview, updateReview } from "../controllers/review.controller.js";
const ReviewRouter = Router();

ReviewRouter.use(protectRoute)

ReviewRouter.get("/reviews", getReview)
ReviewRouter.get("/reviews/:reviewId", getReview)
ReviewRouter.post("/reviews", createReview)
ReviewRouter.delete("/reviews/:reviewId", deleteReview)
ReviewRouter.put("/reviews/:reviewId", updateReview)

export default ReviewRouter
