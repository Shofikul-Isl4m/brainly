import express from "express";

import { usermiddleware } from "../jwt/middleware";
import {
  ContentDelete,
  ContentDeleteId,
  contentGet,
  ContentGetId,
  contentPost,
  ContentPutId,
} from "../controller/contetnt.controller";

const router = express.Router();

router.get("", usermiddleware, contentGet);
router.post("", usermiddleware, contentPost);
router.delete("", usermiddleware, ContentDelete);
router.get("/:id", usermiddleware, ContentGetId);
router.put("/:id", usermiddleware, ContentPutId);
router.delete("/:id", usermiddleware, ContentDeleteId);

export default router;
