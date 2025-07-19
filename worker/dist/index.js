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
const kafkajs_1 = require("kafkajs");
const prisma_1 = require("../src/generated/prisma");
const parser_1 = require("./parser");
const email_1 = require("./email");
const solana_1 = require("./solana");
const KAFKA_TOPIC = "zap-events";
const kafka = new kafkajs_1.Kafka({
    clientId: 'outbox-processor',
    brokers: ['localhost:9092']
});
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const consumer = kafka.consumer({ groupId: "main-worker" });
        const prismaClient = new prisma_1.PrismaClient();
        const producer = kafka.producer();
        yield consumer.connect();
        yield producer.connect();
        yield consumer.subscribe({ topic: KAFKA_TOPIC, fromBeginning: true });
        try {
            yield consumer.run({
                autoCommit: false,
                eachMessage: (_a) => __awaiter(this, [_a], void 0, function* ({ topic, partition, message }) {
                    var _b;
                    console.log({
                        partition,
                        offset: message.offset,
                        value: (_b = message.value) === null || _b === void 0 ? void 0 : _b.toString(),
                    });
                    const parsedData = JSON.parse((message.value || "").toString());
                    const zapRunId = parsedData.zapRunId;
                    const stage = parsedData.stage;
                    let zapRunDetails;
                    try {
                        zapRunDetails = yield prismaClient.zapRun.findFirst({
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
                        });
                    }
                    catch (e) {
                        console.error(e);
                        return;
                    }
                    const currentAction = zapRunDetails === null || zapRunDetails === void 0 ? void 0 : zapRunDetails.zap.actions.find(a => a.sortingOrder === stage);
                    if (!currentAction) {
                        console.error("Current Action not found");
                        return;
                    }
                    const zapRunMetadata = zapRunDetails === null || zapRunDetails === void 0 ? void 0 : zapRunDetails.metadata;
                    if (currentAction.type.name.toLowerCase() === "email") {
                        const to = (0, parser_1.parse)(currentAction.metadata.email, zapRunMetadata);
                        const body = (0, parser_1.parse)(currentAction.metadata.body, zapRunMetadata);
                        (0, email_1.sendEmail)(to, body);
                    }
                    if (currentAction.type.name.toLowerCase() === "send_solana") {
                        const address = (0, parser_1.parse)(currentAction.metadata.address, zapRunMetadata);
                        const amount = (0, parser_1.parse)(currentAction.metadata.amount, zapRunMetadata);
                        (0, solana_1.sendSolana)(address, amount);
                    }
                    // await new Promise(r => setTimeout(r, 5000))
                    const lastStage = ((zapRunDetails === null || zapRunDetails === void 0 ? void 0 : zapRunDetails.zap.actions.length) || 1) - 1;
                    if (lastStage !== stage) {
                        yield producer.send({
                            topic: 'zap-events',
                            messages: [{
                                    value: JSON.stringify({
                                        stage: stage + 1,
                                        zapRunId
                                    })
                                }]
                        });
                    }
                    yield consumer.commitOffsets([{
                            topic: KAFKA_TOPIC,
                            offset: (parseInt(message.offset) + 1).toString(),
                            partition: partition
                        }]);
                }),
            });
        }
        catch (error) {
            console.error(error);
            return;
        }
    });
}
main();
