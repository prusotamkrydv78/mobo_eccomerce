import Product from "../models/product.model.js";

const getProducts = async (req, res) => {
    try {
        const products = await Product.find()
        if (!products) {
            return res.status(404).json({ message: "Products not found" })
        }

        res.status(200).json({ products })
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}

const getProductById = async (req, res) => {
    try {
        const { productId } = req.params
        const product = await Product.findById(productId)
        if (!product) {
            return res.status(404).json({ message: "Product not found" })
        }
        res.status(200).json({ product })
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}

const createProduct = async (req, res) => {
    try {
        const product = await Product.create(req.body)
        if (!product) {
            return res.status(404).json({ message: "Product not found" })
        }
        res.status(200).json({ product })
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}

const updateProduct = async (req, res) => {
    try {
        const { productId } = req.params
        const product = await Product.findByIdAndUpdate(productId, req.body, { new: true })
        if (!product) {
            return res.status(404).json({ message: "Product not found" })
        }
        res.status(200).json({ product })
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}

const deleteProduct = async (req, res) => {
    try {
        const { productId } = req.params
        const product = await Product.findByIdAndDelete(productId)
        if (!product) {
            return res.status(404).json({ message: "Product not found" })
        }
        res.status(200).json({ product })
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}
export { getProducts, getProductById, createProduct, updateProduct, deleteProduct };