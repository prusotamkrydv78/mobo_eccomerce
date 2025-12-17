import User from "../models/user.model.js";

const addAddress = async (req, res) => {
  try {
    const { userId } = req.user;
    const {
      label,
      fullName,
      streetAddress,
      city,
      state,
      zipCode,
      phoneNumber,
      isDefault,
    } = req.body;
    const address = {
      label,
      fullName,
      streetAddress,
      city,
      state,
      zipCode,
      phoneNumber,
      isDefault,
    };
    if (isDefault) {
      const user = await User.findById(userId);
      user.addresses.forEach((address) => {
        address.isDefault = false;
      });
    }
    const user = await User.findById(userId);
    user.addresses.push(address);
    await user.save();
    res.status(200).json({ message: "Address added successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAddresses = async (req, res) => {
  try {
    const { userId } = req.user;
    const user = await User.findById(userId);
    res.status(200).json({ addresses: user.addresses });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
const updateAddress = async (req, res) => {
  try {
    const { userId } = req.user;
    const { addressId } = req.params;
    const {
      label,
      fullName,
      streetAddress,
      city,
      state,
      zipCode,
      phoneNumber,
      isDefault,
    } = req.body;
    const address = {
      label,
      fullName,
      streetAddress,
      city,
      state,
      zipCode,
      phoneNumber,
      isDefault,
    };
    if (isDefault) {
      const user = await User.findById(userId);
      user.addresses.forEach((address) => {
        address.isDefault = false;
      });
    }
    const user = await User.findById(userId);
    const addressToUpdate = user.addresses.id(addressId);
    if (addressToUpdate) {
      addressToUpdate.set(address);
    }
    await user.save();
    res.status(200).json({ message: "Address updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
const deleteAddress = async (req, res) => {
  try {
    const { userId } = req.user;
    const { addressId } = req.params;
    const user = await User.findById(userId);
    // user.addresses.id(addressId).remove()
    user.addresses.pull(addressId);
    await user.save();
    res.status(200).json({ message: "Address deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const addToWishlist = async (req, res) => {
  try {
    const { userId } = req.user;
    const { productId } = req.params;
    const user = await User.findById(userId);
    if (user.wishlist.includes(productId)) {
      return res.status(400).json({ message: "Product already in wishlist" });
    }
    user.wishlist.push(productId);
    await user.save();
    res.status(200).json({ message: "Product added to wishlist" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const getWishlist = async (req, res) => {
  try {
    const { userId } = req.user;
    const user = await User.findById(userId);
    res.status(200).json({ wishlist: user.wishlist });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const removeFromWishlist = async (req, res) => {
  try {
    const { userId } = req.user;
    const { productId } = req.params;
    const user = await User.findById(userId);
    user.wishlist.pull(productId);
    await user.save();
    res.status(200).json({ message: "Product removed from wishlist" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export {
  addAddress,
  getAddresses,
  updateAddress,
  deleteAddress,
  addToWishlist,
  getWishlist,
  removeFromWishlist,
};
