import { Inngest } from "inngest"; 
import dbConnect from "./dbConnect.js";
import User from "../models/user.model.js";

const inngest = new Inngest({
  id: "ecommerce-app",
  signingKey: process.env.INNGEST_SIGNING_KEY  // required if enabled
});

const syncUser = inngest.createFunction(
  { id: "sync-user" },
  { event: "clerk/user.created" },
  async ({ event }) => {

    await dbConnect();

    const { id, first_name, last_name, image_url } = event.data;

    const email_address = event.data.email_addresses?.[0]?.email_address;

    const fullName = [first_name, last_name].filter(Boolean).join(" ") || "User";

    await User.create({
      clerkId: id,
      name: fullName,
      email: email_address,
      imageUrl: image_url,
      address: [],
      wishlist: [],
      cart: [],
    });
  }
);

const deleteUserFromDB = inngest.createFunction(
  { id: "delete-user-from-db" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    await dbConnect();

    const { id } = event.data;

    await User.deleteOne({ clerkId: id });
  }
);

export const functions = [syncUser, deleteUserFromDB];
export { inngest };
