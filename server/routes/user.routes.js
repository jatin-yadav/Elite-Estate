import express from "express";
import * as dotenv from "dotenv";
import {
  test,
  updateUser,
  deleteUser,
} from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

dotenv.config();

const router = express.Router();

router.route("/").get(test);
router.route("/update/:id").post(verifyToken, updateUser);
router.route("/delete/:id").delete(verifyToken, deleteUser);

export default router;
