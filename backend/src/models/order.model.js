import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        default: 1,
        min: 1
    }
})

const shippingAddressSchema = new mongoose.Schema({

    fullName: {
        type: String,
        required: true
    },
    streetAdress: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },

    zipCode: {
        type: String,
        required: true
    },
    isDefault: {
        type: Boolean,
        required: true
    }
});

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    clerkId: {
        type: String,
        required: true
    },
    orderItems: [orderItemSchema],

    shippingAddress: {
        type: shippingAddressSchema,
        required: true
    },
    totalPrice: {
        type: Number,
        required: true
    },
    paymentResult: {
        id: String,
        status: String,
    },
    status: {
        type: String,
        required: true,
        enum: ["pending", "completed", "failed"],
        default: "pending"
    },
    deliveredAt: {
        type: Date,
        required: true
    },
    shippedAt: {
        type: Date,
        required: true
    },

}, {
    timestamps: true
});

const Order = mongoose.model("Order", orderSchema);

export default Order;
