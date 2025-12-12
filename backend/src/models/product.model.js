import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    imageUrl: [
        {
            type: String,
            required: true
        }
    ],
    category: {
        type: String,
        required: true
    },
    averageRating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    },
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review"
        }
    ]
}, {
    timestamps: true
});

const Product = mongoose.model("Product", productSchema);

export default Product;


