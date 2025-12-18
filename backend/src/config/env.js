import dotenv from "dotenv";
dotenv.config();

const ENV = {
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI || "mongodb://localhost:27017/ecommerce",
  CLERK_PUBLISHABLE_KEY: process.env.CLERK_PUBLISHABLE_KEY,
  CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET?.trim(),
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY?.trim(),
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME?.trim(),
  ADMIN_EMAIL: process.env.ADMIN_EMAIL,
};
export default ENV;
