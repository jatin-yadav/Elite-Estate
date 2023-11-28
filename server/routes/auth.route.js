import express from "express";
import * as dotenv from "dotenv";
import { signIn, signUp } from "../controllers/auth.controller.js";

dotenv.config();

const router = express.Router();

router.route("/signup").post(signUp);
router.route("/signin").post(signIn);


export default router;
