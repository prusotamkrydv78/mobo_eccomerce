import express from "express";
import dbConnect from "./config/dbConnect.js";
import ENV  from "./config/env.js";
import { clerkMiddleware } from '@clerk/express'
const app = express();
dbConnect();


 
app.use(clerkMiddleware())


app.get("/", (req, res) => {
    res.send("Hello World!");
});
app.listen(ENV.PORT, () => {
    console.log(`Server is running on port ${ENV.PORT}`);
});
