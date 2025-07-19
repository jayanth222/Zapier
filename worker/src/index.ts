import { Kafka } from "kafkajs"
import { PrismaClient } from "../src/generated/prisma";
import { JsonObject } from "./generated/prisma/runtime/library";
import { parse } from "./parser";
import { sendEmail } from "./email";
import { sendSolana } from "./solana";

const KAFKA_TOPIC = "zap-events"

const kafka = new Kafka({
    clientId: 'outbox-processor',
    brokers: ['localhost:9092']
})

async function main() {
    const consumer = kafka.consumer({ groupId: "main-worker" });
    const prismaClient = new PrismaClient();
    const producer = kafka.producer();

    await consumer.connect();
    await producer.connect();

    await consumer.subscribe({ topic: KAFKA_TOPIC, fromBeginning: true })

    try {
        await consumer.run({
            autoCommit: false,
            eachMessage: async ({ topic, partition, message }) => {
                console.log({
                    partition,
                    offset: message.offset,
                    value: message.value?.toString(),
                })
                const parsedData = JSON.parse((message.value || "").toString());
                const zapRunId = parsedData.zapRunId;
                const stage = parsedData.stage
                let zapRunDetails;
                try {
                    zapRunDetails = await prismaClient.zapRun.findFirst({
                        where: {
                            id: zapRunId
                        },
                        include: {
                            zap: {
                                include: {
                                    actions: {
                                        include: {
                                            type: true
                                        }
                                    }
                                }
                            }
                        }
                    })
                } catch (e) {
                    console.error(e);
                    return;

                }

                const currentAction = zapRunDetails?.zap.actions.find(a => a.sortingOrder === stage)
                if (!currentAction) {
                    console.error("Current Action not found")
                    return;
                }
                const zapRunMetadata = zapRunDetails?.metadata
                if (currentAction.type.name.toLowerCase() === "email") {
                    const to = parse((currentAction.metadata as JsonObject).email as string, zapRunMetadata);
                    const body = parse((currentAction.metadata as JsonObject).body as string, zapRunMetadata);
                    sendEmail(to, body)
                }
                if (currentAction.type.name.toLowerCase() === "send_solana") {
                    const address = parse((currentAction.metadata as JsonObject).address as string, zapRunMetadata);
                    const amount = parse((currentAction.metadata as JsonObject).amount as string, zapRunMetadata);
                    sendSolana(address, amount)
                }

                // await new Promise(r => setTimeout(r, 5000))

                const lastStage = (zapRunDetails?.zap.actions.length || 1) - 1

                if (lastStage !== stage) {
                    await producer.send({
                        topic: 'zap-events',
                        messages: [{
                            value: JSON.stringify({
                                stage: stage + 1,
                                zapRunId
                            })
                        }]
                    })
                }

                await consumer.commitOffsets([{
                    topic: KAFKA_TOPIC,
                    offset: (parseInt(message.offset) + 1).toString(),
                    partition: partition
                }])
            },

        })
    } catch (error) {
        console.error(error);
        return
    }
}
main()