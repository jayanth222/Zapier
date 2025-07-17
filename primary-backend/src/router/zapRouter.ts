import { Router } from "express";
import { authMiddleware } from "../middleware";
import { ZapCreateSchema } from "../types";
import { prismaClient } from "../db";

const router = Router();

router.post("/", authMiddleware, async (req, res) => {
    try {
        const body = req.body;
        const parsedData = ZapCreateSchema.safeParse(body);

        if (!parsedData.success) {
            return res.status(411).json({
                message: "Incorrect Inputs"
            })
        }

        const zapExists = await prismaClient.zap.findFirst({
            where: {
                name: parsedData.data.name
            }
        })

        if (zapExists) {
            return res.status(403).json({
                message: "zap with this name already exists"
            })
        }

        const zap = await prismaClient.zap.create({
            data: {
                name: parsedData.data.name,
                // @ts-ignore
                userId: req.id,
                trigger: {
                    create: {
                        availableTriggerId: parsedData.data.availableTriggerId
                    }
                },
                actions: {
                    create: parsedData.data.actions.map((a, i) => ({
                        availableActionId: a.availabelActionId,
                        sortingOrder: i
                    }))
                }
            }
        })
        res.status(200).json({
            zapId: zap.id
        })
    } catch (e) {
        return res.status(400).json({
            message: "something went wrong"
        })
    }
})

router.get("/", authMiddleware, async (req, res) => {
    try {
        const zaps = await prismaClient.zap.findMany({
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
        })
        return res.status(200).json({
            zaps
        })
    } catch (e) {
        return res.status(400).json({
            message: "something went wrong"
        })
    }
})


router.get("/:zapId", authMiddleware, async (req, res) => {
    try {
        const zap = await prismaClient.zap.findFirst({
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
        })
        return res.status(200).json({
            zap
        })
    } catch (e) {
        return res.status(400).json({
            message: "something went wrong"
        })
    }
})

export const zapRouter = router