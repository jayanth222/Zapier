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
exports.triggerRouter = void 0;
const express_1 = require("express");
const db_1 = require("../db");
const middleware_1 = require("../middleware");
const router = (0, express_1.Router)();
router.get("/available", middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const availableTriggers = yield db_1.prismaClient.availableTrigger.findMany({});
        return res.status(200).json({ availableTriggers });
    }
    catch (e) {
        console.error(e);
        res.status(400).json({
            message: "There was something wrong"
        });
    }
}));
exports.triggerRouter = router;
