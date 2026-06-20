import express from "express";
import User from "../models/user.model.js";
import { verifyWebhook } from "@clerk/backend/webhooks";

const router = express.Router();

router.post("/", async (req, res) => {
  console.log("🔥 CLERK REQUEST ARRIVED");

  try {
    const signingSecret = process.env.CLERK_WEBHOOK_SIGNING_SECRET;

    if (!signingSecret) {
      return res.status(503).json({
        message: "Webhook secret is not provided",
      });
    }

    // Get raw body from Clerk
    const payload = Buffer.isBuffer(req.body) ? req.body.toString("utf8") : String(req.body);

    // Create request for Clerk verification
    const request = new Request("http://internal/webhooks/clerk", {
      method: "POST",
      headers: {
        "svix-id": req.headers["svix-id"],
        "svix-timestamp": req.headers["svix-timestamp"],
        "svix-signature": req.headers["svix-signature"],
        "content-type": "application/json",
      },
      body: payload,
    });

    // Verify webhook
    const evt = await verifyWebhook(request, {
      signingSecret,
    });

    console.log("CLERK EVENT:", evt.type);

    // CREATE OR UPDATE USER
    if (evt.type === "user.created" || evt.type === "user.updated") {
      const u = evt.data;

      const email =
        u.email_addresses?.find((e) => e.id === u.primary_email_address_id)?.email_address ??
        u.email_addresses?.[0]?.email_address;

      const fullName = [u.first_name, u.last_name].filter(Boolean).join(" ") || u.username || email?.split("@")[0];

      const savedUser = await User.findOneAndUpdate(
        {
          clerkId: u.id,
        },
        {
          clerkId: u.id,
          email: email,
          fullName: fullName,
          profilePic: u.image_url,
        },
        {
          new: true,
          upsert: true,
        },
      );

      console.log("✅ SAVED USER:", savedUser);
    }

    // DELETE USER
    if (evt.type === "user.deleted") {
      await User.findOneAndDelete({
        clerkId: evt.data.id,
      });

      console.log("🗑 USER DELETED");
    }

    res.status(200).json({
      received: true,
    });
  } catch (error) {
    console.error("❌ Error in Clerk webhook:", error);

    res.status(400).json({
      message: "Webhook verification failed",
    });
  }
});

export default router;
