"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const zod_1 = __importDefault(require("zod"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const db_1 = require("./db");
const middleware_1 = require("./middleware");
const utils_1 = require("./utils");
const config_1 = require("./config");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.post("/api/v1/signup", function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const signUpSchema = zod_1.default.object({
            username: zod_1.default.string(),
            password: zod_1.default.string(),
        });
        const result = signUpSchema.safeParse(req.body);
        if (!result.success) {
            res.status(400).json({
                message: "Invalid Credentials",
            });
            return;
        }
        const { username, password } = result.data;
        const hashedPassword = yield bcrypt_1.default.hash(password, 5); // Added await here
        try {
            yield db_1.userModel.create({
                // Added await here
                username,
                password: hashedPassword,
            });
            res.status(201).json({
                message: "user signup",
            });
        }
        catch (error) {
            res.status(500).json({
                // Added proper status code
                message: "signup failed",
            });
        }
    });
});
app.post("/api/v1/signin", function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const signInSchema = zod_1.default.object({
            username: zod_1.default.string(),
            password: zod_1.default.string(),
        });
        const result = signInSchema.safeParse(req.body);
        if (!result.success) {
            res.status(400).json({
                message: "Invalid Credentials",
            });
            return;
        }
        const { username, password } = result.data;
        try {
            const user = yield db_1.userModel.findOne({
                username,
            });
            if (!user || !user.password) {
                res.status(401).json({ message: "Invalid credentials" });
                return;
            }
            const compare = bcrypt_1.default.compare(password, user.password);
            if (!compare) {
                res.status(404).json({
                    message: "invalid credentials",
                });
            }
            const token = jsonwebtoken_1.default.sign({
                id: user._id,
            }, config_1.JWT_PASSWORD);
            res.status(200).json({
                token,
                message: "signin successfull",
            });
        }
        catch (error) {
            res.status(501).json({
                message: "signnn failed",
            });
        }
    });
});
app.post("/api/v1/content", middleware_1.usermiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const link = req.body.link;
    const type = req.body.type;
    yield db_1.contentModel.create({
        link,
        type,
        title: req.body.title,
        userId: req.userId,
        tags: [],
    });
    res.json({
        message: "Content added",
    });
}));
app.get("/api/v1/content", middleware_1.usermiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    const content = yield db_1.contentModel
        .find({
        userId: userId,
    })
        .populate("userId", "username");
    res.json({
        content,
    });
}));
app.delete("/api/v1/content", middleware_1.usermiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const contentId = req.body.contentId;
    yield db_1.contentModel.deleteMany({
        contentId,
        userId: req.userId,
    });
    res.json({
        message: "Deleted",
    });
}));
app.post("/api/v1/brain/share", middleware_1.usermiddleware, function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const share = req.body.share;
        if (share) {
            const existingUser = yield db_1.linkModel.findOne({
                userId: req.userId,
            });
            if (existingUser) {
                res.json({
                    hash: existingUser.hash,
                });
                return;
            }
            const hash = (0, utils_1.random)(10);
            yield db_1.linkModel.create({
                userId: req.userId,
                hash,
            });
            res.json({
                hash,
            });
        }
        else
            yield db_1.linkModel.deleteOne({
                userId: req.userId,
            });
    });
});
app.get("/api/v1/brain/:shareLink", middleware_1.usermiddleware, function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const hash = req.params.shareLink;
        const link = yield db_1.linkModel.findOne({
            hash,
        });
        if (!link) {
            res.status(411).json({
                message: "sorry incorrect input",
            });
            return;
        }
        const content = yield db_1.contentModel.findOne({
            userId: link.userId,
        });
        const user = yield db_1.userModel.create({
            _id: link.userId,
        });
        if (!user) {
            res.status(411).json({
                message: "user not found, error should ideally not happen",
            });
            return;
        }
        res.json({
            username: user.username,
            content: content,
        });
    });
});
app.listen(3000);
