import express from "express";
import { usermiddleware } from "../jwt/middleware";
import {
  GetShareId,
  GetshareOn,
  PostShareOff,
  PostshareOn,
} from "../controller/share.controller";

const router = express.Router();

router.post("/shareon", usermiddleware, PostshareOn);
router.get("/shareon", usermiddleware, GetshareOn);
router.post("/shareoff", usermiddleware, PostShareOff);
router.get("/share/:id", GetShareId);

export default router;
