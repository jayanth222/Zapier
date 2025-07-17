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
exports.userRouter = void 0;
const express_1 = require("express");
const middleware_1 = require("../middleware");
const types_1 = require("../types");
const db_1 = require("../db");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const router = (0, express_1.Router)();
router.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const parsedData = types_1.SignUpSchema.safeParse(req.body);
        if (!parsedData.success) {
            return res.status(411).json({
                message: "Incorrect Inputs"
            });
        }
        const userExists = yield db_1.prismaClient.user.findFirst({
            where: {
                email: parsedData.data.email
            }
        });
        if (userExists) {
            return res.status(403).json({
                message: "User already exists"
            });
        }
        yield db_1.prismaClient.user.create({
            data: {
                email: parsedData.data.email,
                name: parsedData.data.name,
                password: yield bcrypt_1.default.hash(parsedData.data.password, 10)
            }
        });
        res.status(200).json({
            message: "User Created"
        });
    }
    catch (e) {
        return res.status(404).json({
            message: "something went wrong"
        });
    }
}));
router.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const parsedData = types_1.SignInSchema.safeParse(req.body);
        if (!parsedData.success) {
            return res.status(411).json({
                message: "Incorrect Inputs"
            });
        }
        const user = yield db_1.prismaClient.user.findFirst({
            where: {
                email: parsedData.data.email,
            }
        });
        if (!(user === null || user === void 0 ? void 0 : user.password)) {
            return res.status(411).json({
                message: "contact customer care"
            });
        }
        const match = yield bcrypt_1.default.compare(parsedData.data.password, user === null || user === void 0 ? void 0 : user.password);
        if (!match) {
            return res.status(401).json({
                message: "invalid credentials"
            });
        }
        const token = jsonwebtoken_1.default.sign({
            id: user.id
        }, config_1.JWT_SECRET);
        return res.status(200).json({
            token
        });
    }
    catch (e) {
        return res.status(404).json({
            message: "something went wrong"
        });
    }
}));
router.get("/", middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // @ts-ignore
        const id = req.id;
        const user = yield db_1.prismaClient.user.findFirst({
            where: {
                id: id
            },
            select: {
                email: true,
                name: true
            }
        });
        return res.json({
            user
        });
    }
    catch (e) {
        return res.status(404).json({
            message: "something went wrong"
        });
    }
}));
exports.userRouter = router;
