import express from "express";
import serverless from "serverless-http";
import cors from "cors";

import { clerkMiddleware } from "@clerk/express";

import clerkWebhook from "../src/webhooks/clerk.webhook.js";
import authRoutes from "../src/routes/auth.route.js";
import messageRoutes from "../src/routes/message.route.js";

const app = express();

const FRONTEND_URL = process.env.FRONTEND_URL;

// IMPORTANT: webhook must be before express.json()
app.use("/webhooks/clerk", express.raw({ type: "application/json" }), clerkWebhook);

app.use(express.json());

app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  }),
);

app.use(clerkMiddleware());

app.get("/health", (req, res) => {
  res.status(200).json({ ok: true });
});

app.use("/auth", authRoutes);
app.use("/messages", messageRoutes);

export default serverless(app);
