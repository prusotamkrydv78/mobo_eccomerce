import { v2 as cloudinary } from "cloudinary";
import ENV from "./env.js";
cloudinary.config({
  cloud_name: ENV.CLOUDINARY_CLOUD_NAME,
  api_key: ENV.CLOUDINARY_API_KEY,
  api_secret: ENV.CLOUDINARY_API_SECRET,
});

console.log("Cloudinary Config Debug:", {
  cloud_name: ENV.CLOUDINARY_CLOUD_NAME,
  has_api_key: !!ENV.CLOUDINARY_API_KEY,
  has_api_secret: !!ENV.CLOUDINARY_API_SECRET,
  secret_length: ENV.CLOUDINARY_API_SECRET
    ? ENV.CLOUDINARY_API_SECRET.length
    : 0,
});

export default cloudinary;
