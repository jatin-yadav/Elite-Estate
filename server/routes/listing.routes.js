import express from "express";
import * as dotenv from "dotenv";
import { createListing, testList } from "../controllers/listing.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

dotenv.config();

const router = express.Router();

router.route("/").get(testList);
router.route("/create").post(verifyToken, createListing);

export default router;
