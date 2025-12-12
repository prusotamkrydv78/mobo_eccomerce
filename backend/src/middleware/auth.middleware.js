import { requireAuth } from "@clerk/express"
import User from "../models/user.model.js"
import ENV from "../config/env.js";

const protectRoute = [
    requireAuth(),
    async (req, res, next) => {
        try {
            const clerkId = req.auth().userId;
            if (!clerkId) {
                return res.status(401).json({ message: "User is Unauthorized" })
            }
            const user = await User.findOne({ clerkId })
            if (!user) {
                return res.status(401).json({ message: "User is Unauthorized" })
            }
            req.user = user;
            next();
        } catch (error) {
            console.log("Error in protectRoute middleware", error)
            return res.status(500).json({ message: "Internal Server Error" })
        }
    }
]
const isAdmin = (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "User is Unauthorized" })
        }
        if (req.user.email !== ENV.ADMIN_EMAIL) {
            return res.status(403).json({ message: "Forbidden task access denied" })
        }
        next();

    } catch (error) {
        console.log("Error in isAdmin middleware", error)
        return res.status(500).json({ message: "Internal Server Error" })
    }
}

export { protectRoute, isAdmin }
