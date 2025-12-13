import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";

export const getCart = async (req, res) => {
    try {
        const userId = req.user._id;
        const cart = await Cart.findOne({ userId }).populate("items.productId");

        if (!cart) {
            return res.status(200).json({ items: [] });
        }

        res.status(200).json(cart);
    } catch (error) {
        console.error("Error in getCart:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const addToCart = async (req, res) => {
    try {
        const { productId, quantity = 1 } = req.body;
        const userId = req.user._id;

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = new Cart({
                userId,
                clerkId: req.user.clerkId,
                items: []
            });
        }

        const existingItemIndex = cart.items.findIndex(
            (item) => item.productId.toString() === productId
        );

        if (existingItemIndex > -1) {
            cart.items[existingItemIndex].quantity += quantity;
        } else {
            cart.items.push({ productId, quantity });
        }

        await cart.save();
        // Re-fetch or populate to return updated cart with product details
        const updatedCart = await Cart.findById(cart._id).populate("items.productId");

        res.status(200).json(updatedCart);
    } catch (error) {
        console.error("Error in addToCart:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const updateCartItem = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const userId = req.user._id;

        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        const itemIndex = cart.items.findIndex(
            (item) => item.productId.toString() === productId
        );

        if (itemIndex > -1) {
            if (quantity > 0) {
                cart.items[itemIndex].quantity = quantity;
            } else {
                // Remove if quantity is 0 or less
                cart.items.splice(itemIndex, 1);
            }
            await cart.save();
            const updatedCart = await Cart.findById(cart._id).populate("items.productId");
            return res.status(200).json(updatedCart);
        } else {
            return res.status(404).json({ message: "Item not found in cart" });
        }
    } catch (error) {
        console.error("Error in updateCartItem:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const removeFromCart = async (req, res) => {
    try {
        const { productId } = req.params; // Assuming productId is passed in URL
        const userId = req.user._id;

        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        cart.items = cart.items.filter(
            (item) => item.productId.toString() !== productId
        );

        await cart.save();
        const updatedCart = await Cart.findById(cart._id).populate("items.productId");
        res.status(200).json(updatedCart);
    } catch (error) {
        console.error("Error in removeFromCart:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const clearCart = async (req, res) => {
    try {
        const userId = req.user._id;
        const cart = await Cart.findOne({ userId });

        if (cart) {
            cart.items = [];
            await cart.save();
        }

        res.status(200).json({ message: "Cart cleared successfully", items: [] });
    } catch (error) {
        console.error("Error in clearCart:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
