import Review from "../models/review.model.js";
import Order from "../models/order.model.js";
const createReview = async (req, res) => {
    try {
        const { productId, orderId, rating } = req.body
        if (!productId || !orderId || !rating) {
            return res.status(400).json({ message: "Bad request" })
        }
        if (rating < 1 || rating > 5) {
            return res.status(400).json({ message: "Rating should be between 1 and 5" })
        }
        const user = req.user;

        const order = await Order.findById(orderId)
        if (!order) {
            return res.status(404).json({ message: "Order not found" })
        }
        if (order.clerkId !== user.clerkId) {
            return res.status(401).json({ message: "Unauthorized" })
        }
        if (order.status !== "delivered") {
            return res.status(401).json({ message: "Order is not delivered" })
        }
        const productInOrder = order.orderItems.find(item => item.productId === productId)
        if (!productInOrder) {
            return res.status(401).json({ message: "Product not found in order" })
        }


        const review = await Review.create({
            productId,
            orderId,
            rating,
            clerkId: user.clerkId
        })
        res.status(200).json({ review })
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}

const getReview = async (req, res) => {
    try {
        const reviews = await Review.find()
        if (!reviews) {
            return res.status(404).json({ message: "Reviews not found" })
        }
        res.status(200).json({ reviews })
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}

const getReviewById = async (req, res) => {
    try {
        const { reviewId } = req.params
        const review = await Review.findById(reviewId)
        if (!review) {
            return res.status(404).json({ message: "Review not found" })
        }
        res.status(200).json({ review })
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}

const updateReview = async (req, res) => {
    try {
        const { reviewId } = req.params
        const review = await Review.findByIdAndUpdate(reviewId, req.body, { new: true })
        if (!review) {
            return res.status(404).json({ message: "Review not found" })
        }
        res.status(200).json({ review })
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}

const deleteReview = async (req, res) => {
    try {
        const { reviewId } = req.params
        const review = await Review.findByIdAndDelete(reviewId)
        if (!review) {
            return res.status(404).json({ message: "Review not found" })
        }
        res.status(200).json({ review })
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}

export { createReview, getReview, getReviewById, updateReview, deleteReview }