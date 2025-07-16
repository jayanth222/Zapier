import { PrismaClient } from "../src/generated/prisma";
import { Kafka } from "kafkajs";

const prismaClient = new PrismaClient();
const kafka = new Kafka({
    clientId: 'outbox-processor',
    brokers: ['localhost:9092']
})

async function main() {
    const producer = kafka.producer();
    await producer.connect();
    while (1) {
        const pendingRows = await prismaClient.zapRunOutBox.findMany({
            take: 10
        })
        await producer.send({
            topic: 'zap-events',
            messages: pendingRows.map((r) => ({
                value: r.zapRunId
            }))
        })
        await prismaClient.zapRunOutBox.deleteMany({
            where: {
                id: {
                    in: pendingRows.map(r => r.id)
                }
            }
        })
    }
}
main();
