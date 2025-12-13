import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
    label: {
        type: String,
        required: true
    },
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
    country: {
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

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    clerkId: {
        type: String,
        required: true
    },
    address: {
        type: [addressSchema],
        required: true
    },
    wishlist: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product"
        }
    ],
    cart: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product"
        }
    ]
}, {
    timestamps: true
});

const User = mongoose.model("User", userSchema);

export default User;
