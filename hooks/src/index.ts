import express from "express";
import { PrismaClient } from "../src/generated/prisma"

const app = express();
const prismaClient = new PrismaClient();
app.use(express.json());


app.post("/hooks/catch/:userId/:zapId", async (req, res) => {
    const userId = req.params.userId;
    const zapId = req.params.zapId;
    const body = req.body;

    await prismaClient.$transaction(async (tx: any) => {
        const run = await tx.zapRun.create({
            data: {
                zapId: zapId,
                metadata: body
            }
        })
        await tx.zapRunOutBox.create({
            data: {
                zapRunId: run.id
            }
        })
    })
    res.json({
        metadata: body
    })
})

app.listen(3000)