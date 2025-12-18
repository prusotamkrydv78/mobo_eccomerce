import { requireAuth, createClerkClient } from "@clerk/express";
import User from "../models/user.model.js";
import ENV from "../config/env.js";
const clerkClient = createClerkClient({ secretKey: ENV.CLERK_SECRET_KEY });

const protectRoute = [
  requireAuth(),
  async (req, res, next) => {
    try {
      const clerkId = req.auth().userId;
      if (!clerkId) {
        return res.status(401).json({ message: "User is Unauthorized" });
      }

      let user = await User.findOne({ clerkId });

      // If user doesn't exist in local DB, sync from Clerk (JIT provisioning)
      if (!user) {
        console.log(`Syncing user ${clerkId} from Clerk to local DB...`);
        try {
          const clerkUser = await clerkClient.users.getUser(clerkId);
          const email = clerkUser.emailAddresses[0]?.emailAddress;
          const fullName =
            `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() ||
            "User";

          user = await User.create({
            clerkId: clerkId,
            name: fullName,
            email: email,
            imageUrl: clerkUser.imageUrl,
            addresses: [],
            wishlist: [],
            cart: [],
          });
        } catch (clerkError) {
          console.error("Error fetching user from Clerk:", clerkError);
          return res.status(401).json({ message: "User not found in Clerk" });
        }
      }

      req.user = user;
      next();
    } catch (error) {
      console.log("Error in protectRoute middleware", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },
];
const isAdmin = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "User is Unauthorized" });
    }
    if (req.user.email !== ENV.ADMIN_EMAIL) {
      return res.status(403).json({ message: "Forbidden task access denied" });
    }
    next();
  } catch (error) {
    console.log("Error in isAdmin middleware", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export { protectRoute, isAdmin };
