import express from "express";
import dbConnect from "./config/dbConnect.js";
import ENV from "./config/env.js";
import { clerkMiddleware } from '@clerk/express'
import { serve } from "inngest/express";
import { functions, inngest } from "./config/inngest.js";
import adminRouter from "./routes/admin.route.js";
import userRouter from "./routes/user.route.js";
const app = express();
dbConnect();


app.use(express.json())
app.use(clerkMiddleware())
app.use('/api/inngest', serve({ client: inngest, functions, signingKey: process.env.INNGEST_SIGN_KEY, }))

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.use("/api/admin", adminRouter);
app.use("/api/user", userRouter);

app.listen(ENV.PORT, () => {
    console.log(`Server is running on port ${ENV.PORT}`);
});
