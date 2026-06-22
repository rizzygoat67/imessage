import express from "express";
import cors from "cors";

import { clerkMiddleware } from "@clerk/express";

import clerkWebhook from "../src/webhooks/clerk.webhook.js";
import authRoutes from "../src/routes/auth.route.js";
import messageRoutes from "../src/routes/message.route.js";

const app = express();

const FRONTEND_URL = process.env.FRONTEND_URL;

// Clerk webhook MUST be before express.json()
app.use("/api/webhooks/clerk", express.raw({ type: "application/json" }), clerkWebhook);

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

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

export default app;
