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
Object.defineProperty(exports, "__esModule", { value: true });
exports.zapRouter = void 0;
const express_1 = require("express");
const middleware_1 = require("../middleware");
const types_1 = require("../types");
const db_1 = require("../db");
const router = (0, express_1.Router)();
router.post("/", middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const parsedData = types_1.ZapCreateSchema.safeParse(body);
        if (!parsedData.success) {
            console.error(parsedData.error);
            return res.status(411).json({
                message: "Incorrect Inputs"
            });
        }
        const zapExists = yield db_1.prismaClient.zap.findFirst({
            where: {
                name: parsedData.data.name
            }
        });
        if (zapExists) {
            return res.status(403).json({
                message: "zap with this name already exists"
            });
        }
        const zap = yield db_1.prismaClient.zap.create({
            data: {
                name: parsedData.data.name,
                // @ts-ignore
                userId: req.id,
                trigger: {
                    create: {
                        availableTriggerId: parsedData.data.availableTriggerId,
                        metadata: parsedData.data.triggerMetadata
                    }
                },
                actions: {
                    create: parsedData.data.actions.map((a, i) => ({
                        availableActionId: a.availabelActionId,
                        sortingOrder: i,
                        metadata: a.actionMetadata
                    }))
                }
            }
        });
        res.status(200).json({
            zapId: zap.id
        });
    }
    catch (e) {
        console.error(e);
        return res.status(400).json({
            message: "something went wrong"
        });
    }
}));
router.get("/", middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const zaps = yield db_1.prismaClient.zap.findMany({
            where: {
                // @ts-ignore
                userId: req.id
            },
            include: {
                trigger: {
                    include: {
                        type: true
                    }
                },
                actions: {
                    include: {
                        type: true
                    }
                }
            }
        });
        return res.status(200).json({
            zaps
        });
    }
    catch (e) {
        return res.status(400).json({
            message: "something went wrong"
        });
    }
}));
router.get("/:zapId", middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const zap = yield db_1.prismaClient.zap.findFirst({
            where: {
                // @ts-ignore
                userId: req.id,
                id: req.params.zapId
            },
            include: {
                trigger: {
                    include: {
                        type: true
                    }
                },
                actions: {
                    include: {
                        type: true
                    }
                }
            }
        });
        return res.status(200).json({
            zap
        });
    }
    catch (e) {
        return res.status(400).json({
            message: "something went wrong"
        });
    }
}));
exports.zapRouter = router;
