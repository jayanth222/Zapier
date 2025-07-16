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
const prismaClient = new prisma_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        yield prismaClient.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
            const user = yield tx.user.upsert({
                where: { email: 'jayanthaitha@gmail.com' },
                update: {},
                create: {
                    email: 'jayanthaitha@gmail.com',
                    name: 'Jayanth',
                    password: "1234567890"
                },
            });
            const availabeTiggers = yield tx.availableTrigger.upsert({
                where: { name: 'webhook' },
                update: {},
                create: {
                    name: 'webhook'
                }
            });
            const availabeAction1 = yield tx.availableAction.upsert({
                where: { name: 'email' },
                update: {},
                create: {
                    name: 'email',
                }
            });
            const availabeAction2 = yield tx.availableAction.upsert({
                where: { name: 'send_solana' },
                update: {},
                create: {
                    name: 'send_solana',
                }
            });
            const zap = yield tx.zap.upsert({
                where: { name: 'zap 1' },
                update: {},
                create: {
                    name: "zap 1",
                    userId: user.id
                }
            });
        }));
    });
}
main();
