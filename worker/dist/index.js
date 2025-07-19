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
        yield consumer.run({
            autoCommit: false,
            eachMessage: (_a) => __awaiter(this, [_a], void 0, function* ({ topic, partition, message }) {
                console.log({
                    partition,
                    offset: message.offset,
                    value: message.value.toString(),
                });
                const parsedData = JSON.parse(message.value.toString());
                const zapRunId = parsedData.zapRunId;
                const stage = parsedData.stage;
                const zapRunDetails = yield prismaClient.zapRun.findFirst({
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
                const currentAction = zapRunDetails === null || zapRunDetails === void 0 ? void 0 : zapRunDetails.zap.actions.find(a => a.sortingOrder === stage);
                console.log(currentAction);
                if (!currentAction) {
                    console.error("Current Action not found");
                    return;
                }
                const zapRunMetadata = zapRunDetails === null || zapRunDetails === void 0 ? void 0 : zapRunDetails.metadata;
                console.log(zapRunMetadata);
                if (currentAction.type.name.toLowerCase() === "email") {
                    const body = (0, parser_1.parse)(currentAction.metadata.body, zapRunMetadata);
                    const to = (0, parser_1.parse)(currentAction.metadata.email, zapRunMetadata);
                    console.log(`email is ${to} with body ${body}`);
                    // console.log("send email")
                }
                if (currentAction.type.name.toLowerCase() === "send_solana") {
                    const address = (0, parser_1.parse)(currentAction.metadata.address, zapRunMetadata);
                    const amount = (0, parser_1.parse)(currentAction.metadata.amount, zapRunMetadata);
                    console.log(`address is ${address} with body ${amount}`);
                    // console.log("send sol")
                }
                yield new Promise(r => setTimeout(r, 5000));
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
    });
}
main();
