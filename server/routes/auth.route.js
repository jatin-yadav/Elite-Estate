import express from "express";
import * as dotenv from "dotenv";
import {
  google,
  signIn,
  signUp,
  signOut,
} from "../controllers/auth.controller.js";

dotenv.config();

const router = express.Router();

router.route("/signup").post(signUp);
router.route("/signin").post(signIn);
router.route("/google").post(google);
router.route("/signout").get(signOut);

export default router;
