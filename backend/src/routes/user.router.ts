import express, { Router } from "express";

import { usermiddleware } from "../jwt/middleware";
import {
  changePassword,
  userProfile,
  userSignin,
  userSignup,
} from "../controller/user.controller";

const router = Router();

router.post("/signup", userSignup);
router.post("/signin", userSignin);
router.get("/user", usermiddleware, userProfile);
router.put("/changePassword", usermiddleware, changePassword);

export default router;
