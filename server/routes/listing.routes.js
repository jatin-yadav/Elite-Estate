import express from "express";
import * as dotenv from "dotenv";
import {
  createListing,
  testList,
  deleteListing,
  updateListing,
  getListing,
  getListings,
} from "../controllers/listing.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

dotenv.config();

const router = express.Router();

router.route("/").get(testList);
router.route("/create").post(verifyToken, createListing);
router.route("/delete/:id").delete(verifyToken, deleteListing);
router.route("/update/:id").post(verifyToken, updateListing);
router.route("/get/:id").get(getListing);
router.route("/get").get(getListings);

export default router;
