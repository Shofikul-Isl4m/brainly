"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usermiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("./config");
const usermiddleware = function (req, res, next) {
    const header = req.headers["authorization"];
    const token = header === null || header === void 0 ? void 0 : header.replace("bearer ", "");
    if (!token) {
        res.status(401).json({
            message: " no token provided",
        });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, config_1.JWT_PASSWORD);
        if (decoded) {
            if (typeof decoded === "string") {
                res.status(403).json({
                    message: "You are not logged in",
                });
                return;
            }
            req.userId = decoded.id;
            next();
        }
        else {
            res.status(403).json({
                message: "You are not logged in",
            });
        }
    }
    catch (error) {
        res.status(401).json({
            message: "invalid token",
        });
        return;
    }
};
exports.usermiddleware = usermiddleware;
