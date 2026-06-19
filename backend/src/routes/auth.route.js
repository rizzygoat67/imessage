import express from "express";
import { checkAuth } from "../controllers/auth.controller.js";
//import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/check", checkAuth);

export default router;
