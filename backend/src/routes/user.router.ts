import express, { Router } from "express";
import {
  changePassword,
  userProfile,
  userSignin,
  userSignup,
} from "../controller/user.controller";
import { usermiddleware } from "../jwt/middleware";

const router = Router();

router.post("/signup", userSignup);
router.post("/signin", userSignin);
router.get("/user", usermiddleware, userProfile);
router.put("/changePassword", usermiddleware, changePassword);

export default router;
