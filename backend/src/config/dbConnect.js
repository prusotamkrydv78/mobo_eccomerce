import mongoose from "mongoose";
import ENV from "../config/env.js";
const dbConnect =async () => {
    try {
       const conn = await mongoose.connect(ENV.MONOG_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.log("MongoDB connection error", error);
        process.exit(1);
    }
};

export default dbConnect;