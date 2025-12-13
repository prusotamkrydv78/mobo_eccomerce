import User from "../models/user.model.js";
import Product from "../models/product.model.js";

export const getWishlist = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId).populate("wishlist");

        // Return the populated wishlist
        res.status(200).json(user.wishlist);
    } catch (error) {
        console.error("Error in getWishlist:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const toggleWishlist = async (req, res) => {
    try {
        const { productId } = req.body;
        const userId = req.user._id;

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        const user = await User.findById(userId);

        // check if product is already in wishlist
        const isInWishlist = user.wishlist.some(
            (id) => id.toString() === productId
        );

        if (isInWishlist) {
            // Remove from wishlist
            user.wishlist = user.wishlist.filter(
                (id) => id.toString() !== productId
            );
            await user.save();
            return res.status(200).json({
                message: "Removed from wishlist",
                wishlist: user.wishlist
            });
        } else {
            // Add to wishlist
            user.wishlist.push(productId);
            await user.save();
            return res.status(200).json({
                message: "Added to wishlist",
                wishlist: user.wishlist
            });
        }

    } catch (error) {
        console.error("Error in toggleWishlist:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
