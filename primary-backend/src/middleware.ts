import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "./config";

export const authMiddleware: RequestHandler = (req, res, next) => {
    const token = req.headers.authorization as unknown as string
    try {
        const payload = jwt.verify(token, JWT_SECRET)
        // @ts-ignore
        req.id = payload.id
    } catch (e) {
        return res.status(403).json({
            message: "You are not logged in"
        })
    }
    next()
}