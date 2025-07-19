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
const prisma_1 = require("../src/generated/prisma");
const kafkajs_1 = require("kafkajs");
const prismaClient = new prisma_1.PrismaClient();
const kafka = new kafkajs_1.Kafka({
    clientId: 'outbox-processor',
    brokers: ['localhost:9092']
});
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const producer = kafka.producer();
        yield producer.connect();
        while (1) {
            const pendingRows = yield prismaClient.zapRunOutBox.findMany({
                take: 10
            });
            yield producer.send({
                topic: 'zap-events',
                messages: pendingRows.map((r) => ({
                    value: JSON.stringify({ zapRunId: r.zapRunId, stage: 0 })
                }))
            });
            yield prismaClient.zapRunOutBox.deleteMany({
                where: {
                    id: {
                        in: pendingRows.map(r => r.id)
                    }
                }
            });
        }
    });
}
main();
