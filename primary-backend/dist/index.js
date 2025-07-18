"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const userRouter_1 = require("./router/userRouter");
const zapRouter_1 = require("./router/zapRouter");
const actionsRouter_1 = require("./router/actionsRouter");
const triggerRouter_1 = require("./router/triggerRouter");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use("/api/v1/user", userRouter_1.userRouter);
app.use("/api/v1/zap", zapRouter_1.zapRouter);
app.use("/api/v1/trigger", triggerRouter_1.triggerRouter);
app.use("/api/v1/action", actionsRouter_1.actionsRouter);
app.get("/", (req, res) => {
    res.send("Health check");
});
app.listen(3001, () => {
    console.log("backend started and listening on port 3001");
});
