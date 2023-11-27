import express from "express";
import * as dotenv from "dotenv";
import { test } from "../controllers/user.controller.js";

dotenv.config();

const router = express.Router();

router.route("/").get(test);

export default router;
