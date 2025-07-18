import { Router } from "express"
import { prismaClient } from "../db"
import { authMiddleware } from "../middleware"

const router = Router()

router.get("/available", authMiddleware, async (req, res) => {
    try {
        const availableTriggers = await prismaClient.availableTrigger.findMany({})
        return res.status(200).json({ availableTriggers })
    } catch (e) {
        console.error(e);
        res.status(400).json({
            message: "There was something wrong"
        })
    }
})

export const triggerRouter = router