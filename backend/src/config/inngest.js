import { Inngest } from "inngest"; 
import dbConnect from "./dbConnect.js";
import User from "../models/user.model.js";


const inngest = new Inngest({
    id: "ecommerce-app",

});

const syncUser = inngest.createFunction(
    {
        id: "sync-user",
    },
    { event: "clerk/user.created" },
    async ({ event }) => {
        await dbConnect();
        const { id, first_name, last_name, email_address, image_url } = event.data
        await User.create({
            clerkId: id,
            name: `${first_name ? first_name : ""} ${last_name ? last_name : ""}` || "User",
            email: email_address,
            imageUrl: image_url,
            address: [],
            wishlist: [],
            cart: []
        });


    }
)
const deleteUserFromDB = inngest.createFunction(
    {
        id: "delete-user-from-db",
    },
    { event: "clerk/user.deleted" },
    async ({ event }) => {
        await dbConnect();
        const { id } = event.data
        await User.deleteOne({ clerkId: id });
    }
)
export const functions = [syncUser, deleteUserFromDB];
export {inngest}