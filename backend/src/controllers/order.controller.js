import Order from "../models/order.model.js";
import Review from "../models/review.model.js";
import Product from "../models/product.model.js";
const getOrders = async (req, res) => {
    try {
        const orders = await Order.find({ clerkId: req.user.clerkId }).populate("orderItems.product")
            .sort({ createdAt: -1 })

        const ordersWithReviewStatus = await Promise.all(
            orders.map(async (order) => {
                const hasReviewed = await Review.findOne({
                    userId: req.user.userId,
                    orderId: order._id
                })
                return {
                    ...order.toObject(),
                    hasReviewed: !!hasReviewed
                }
            })
        )

        res.status(200).json({ orders: ordersWithReviewStatus })
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}

const createOrder = async (req, res) => {
    try {
        const { userId } = req.user
        const { orderItems, shippingAdress, paymentResult, totalPrice } = req.body
        if (!orderItems || !shippingAdress || !paymentResult || !totalPrice) {
            return res.status(400).json({ message: "Bad request" })
        }
        for (const item of orderItems) {
            const product = await Product.findById(item.productId)
            if (!product) {
                return res.status(404).json({ message: "Product not found" })
            }
            if (product.stock < item.quantity) {
                return res.status(400).json({ message: "Not enough stock" })
            }
            product.stock -= item.quantity
            await product.save()
        }
        const order = await Order.create({ userId, orderItems, shippingAdress, paymentResult, totalPrice })
        res.status(200).json({ order })
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}

const deleteOrder = async (req, res) => {
    try {
        const { userId } = req.user
        const { orderId } = req.params
        const order = await Order.findByIdAndDelete(orderId)
        res.status(200).json({ order })
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}

const updateOrder = async (req, res) => {
    try {
        const { userId } = req.user
        const { orderId } = req.params
        const order = await Order.findByIdAndUpdate(orderId, req.body, { new: true })
        res.status(200).json({ order })
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}

export { getOrders, createOrder, deleteOrder, updateOrder }