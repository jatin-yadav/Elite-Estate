import express from "express";
import * as dotenv from "dotenv";
import { google, signIn, signUp } from "../controllers/auth.controller.js";

dotenv.config();

const router = express.Router();

router.route("/signup").post(signUp);
router.route("/signin").post(signIn);
router.route("/google").post(google);

export default router;
