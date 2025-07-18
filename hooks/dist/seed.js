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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../src/generated/prisma");
const bcrypt_1 = __importDefault(require("bcrypt"));
const prismaClient = new prisma_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        yield prismaClient.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
            const user = yield tx.user.upsert({
                where: { email: 'jayanthaitha@gmail.com' },
                update: {
                    email: 'jayanthaitha@gmail.com',
                    name: 'Jayanth',
                    password: yield bcrypt_1.default.hash("1234567890", 10)
                },
                create: {
                    email: 'jayanthaitha@gmail.com',
                    name: 'Jayanth',
                    password: yield bcrypt_1.default.hash("1234567890", 10)
                },
            });
            const availabeTiggers = yield tx.availableTrigger.upsert({
                where: { name: 'webhook' },
                update: {},
                create: {
                    name: 'webhook',
                    imageURL: "https://zapier-images.imgix.net/storage/services/6aafbb717d42f8b42f5be2e4e89e1a15.png?auto=format&fit=crop&h=60&ixlib=react-9.10.0&q=50&w=60"
                }
            });
            const availabeAction1 = yield tx.availableAction.upsert({
                where: { name: 'email' },
                update: {},
                create: {
                    name: 'email',
                    imageURL: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRpH3rI_9E9CKiAsp0ZWJc12PLeU6B206JuAw&s'
                }
            });
            const availabeAction2 = yield tx.availableAction.upsert({
                where: { name: 'send_solana' },
                update: {},
                create: {
                    name: 'send_solana',
                    imageURL: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRVJ3fp_jVDHChLAR96XuRAMVjMrYfk3MCuqA&s'
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
