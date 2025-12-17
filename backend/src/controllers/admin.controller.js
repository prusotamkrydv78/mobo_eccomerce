import cloudinary from "../config/cloudinary.js";
import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import User from "../models/user.model.js";
const getProduct = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    return res.status(200).json({ products });
  } catch (error) {
    console.log("Error in getProduct controller", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    return res.status(200).json({ product });
  } catch (error) {
    console.log("Error in getProductById controller", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, description, price, images, category } = req.body;
    if (!name || !description || !price || !images || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (!Array.isArray(images) || images.length === 0) {
      return res.status(400).json({ message: "Images are required" });
    }
    const uploadImages = await Promise.all(
      images.map((image) => cloudinary.uploader.upload(image))
    );
    const imagesUrls = uploadImages.map((image) => image.secure_url);


    const product = await Product.create({
      name,
      description,
      price,
      imageUrls: imagesUrls,
      category,
    });
    return res.status(201).json({ product });
  } catch (error) {
    console.log("Error in createProduct controller", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    return res.status(200).json({ product });
  } catch (error) {
    console.log("Error in deleteProduct controller", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, images, category } = req.body;
    if (!name || !description || !price || !images || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (!Array.isArray(images) || images.length === 0) {
      return res.status(400).json({ message: "Images are required" });
    }
    const uploadImages = await Promise.all(
      images.map((image) => cloudinary.uploader.upload(image))
    );
    const imagesUrls = uploadImages.map((image) => image.secure_url);
    const product = await Product.findByIdAndUpdate(
      id,
      {
        name,
        description,
        price,
        images: imagesUrls,
        category,
      },
      {
        new: true,
      }
    );
    return res.status(200).json({ product });
  } catch (error) {
    console.log("Error in updateProduct controller", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "name email")
      .populate("orderItems.productId")
      .sort({ createdAt: -1 });
    return res.status(200).json({ orders });
  } catch (error) {
    console.log("Error in getAllOrders controller", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!orderId || !status) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;
    if (status === "completed") {
      order.deliveredAt = new Date();
    }
    if (status === "shipped") {
      order.shippedAt = new Date();
    }
    if (status === "pending") {
      order.shippedAt = null;
      order.deliveredAt = null;
    }

    await order.save();
    return res.status(200).json({ order });
  } catch (error) {
    console.log("Error in updateOrderStatus controller", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const getAllCustomers = async (req, res) => {
  try {
    const customers = await User.find().sort({ createdAt: -1 });
    return res.status(200).json({ customers });
  } catch (error) {
    console.log("Error in getAllCustomers controller", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const stats = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: "$totalPrice" },
          averageOrderValue: { $avg: "$totalPrice" },
          highestOrderValue: { $max: "$totalPrice" },
          lowestOrderValue: { $min: "$totalPrice" },
        },
      },
    ]);
    return res.status(200).json({ stats });
  } catch (error) {
    console.log("Error in getDashboardStats controller", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export {
  getProduct,
  createProduct,
  deleteProduct,
  updateProduct,
  getProductById,
  getAllOrders,
  updateOrderStatus,
  getAllCustomers,
  getDashboardStats,
};
