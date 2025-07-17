import { Router } from "express";
import { authMiddleware } from "../middleware";
import { SignInSchema, SignUpSchema } from "../types";
import { prismaClient } from "../db";
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken";
import { JWT_SECRET } from '../config'

const router = Router();

router.post("/signup", async (req, res) => {
    try {
        const parsedData = SignUpSchema.safeParse(req.body);

        if (!parsedData.success) {
            return res.status(411).json({
                message: "Incorrect Inputs"
            })
        }

        const userExists = await prismaClient.user.findFirst({
            where: {
                email: parsedData.data.email
            }
        })

        if (userExists) {
            return res.status(403).json({
                message: "User already exists"
            })
        }

        await prismaClient.user.create({
            data: {
                email: parsedData.data.email,
                name: parsedData.data.name,
                password: await bcrypt.hash(parsedData.data.password, 10)
            }
        })

        res.status(200).json({
            message: "User Created"
        })
    } catch (e) {
        return res.status(404).json({
            message: "something went wrong"
        })
    }
})

router.post("/signin", async (req, res) => {
    try {
        const parsedData = SignInSchema.safeParse(req.body);

        if (!parsedData.success) {
            return res.status(411).json({
                message: "Incorrect Inputs"
            })
        }

        const user = await prismaClient.user.findFirst({
            where: {
                email: parsedData.data.email,
            }
        })
        if (!user?.password) {
            return res.status(411).json({
                message: "contact customer care"
            })
        }
        const match = await bcrypt.compare(parsedData.data.password, user?.password);

        if (!match) {
            return res.status(401).json({
                message: "invalid credentials"
            })
        }
        const token = jwt.sign({
            id: user.id
        }, JWT_SECRET)

        return res.status(200).json({
            token
        })
    } catch (e) {
        return res.status(404).json({
            message: "something went wrong"
        })
    }
})

router.get("/", authMiddleware, async (req, res) => {
    try {
        // @ts-ignore
        const id = req.id;

        const user = await prismaClient.user.findFirst({
            where: {
                id: id
            },
            select: {
                email: true,
                name: true
            }
        })
        return res.json({
            user
        })
    } catch (e) {
        return res.status(404).json({
            message: "something went wrong"
        })
    }
})

export const userRouter = router