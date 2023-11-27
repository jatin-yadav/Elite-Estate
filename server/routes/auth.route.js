import express from "express";
import * as dotenv from "dotenv";
import { signUp } from "../controllers/auth.controller.js";

dotenv.config();

const router = express.Router();

router.route("/signup").post(signUp);

export default router;
