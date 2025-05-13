import { NextFunction, Request, RequestHandler, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_PASSWORD } from "./config";

export const usermiddleware = function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const header = req.headers["authorization"];
  const token = header?.replace("bearer ", "");
  if (!token) {
    res.status(401).json({
      message: " no token provided",
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_PASSWORD);
    if (decoded) {
      if (typeof decoded === "string") {
        res.status(403).json({
          message: "You are not logged in",
        });
        return;
      }
      req.userId = (decoded as JwtPayload).id;
      next();
    } else {
      res.status(403).json({
        message: "You are not logged in",
      });
    }
  } catch (error) {
    res.status(401).json({
      message: "invalid token",
    });
    return;
  }
};
