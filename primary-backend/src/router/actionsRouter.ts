import { Router } from "express"
import { authMiddleware } from "../middleware"
import { prismaClient } from "../db"

const router = Router()


router.get("/available", authMiddleware, async (req, res) => {
    try {
        const availableActions = await prismaClient.availableAction.findMany({})
        return res.status(200).json({ availableActions })
    } catch (e) {
        console.error(e);
        res.status(400).json({
            message: "There was something wrong"
        })
    }
})


export const actionsRouter = router