
import { create } from "domain";
import { PrismaClient } from "../src/generated/prisma"

const prismaClient = new PrismaClient();

async function main() {

    await prismaClient.$transaction(async (tx: any) => {
        const user = await tx.user.upsert({
            where: { email: 'jayanthaitha@gmail.com' },
            update: {},
            create: {
                email: 'jayanthaitha@gmail.com',
                name: 'Jayanth',
                password: "1234567890"
            },
        })
        const availabeTiggers = await tx.availableTrigger.upsert({
            where: { name: 'webhook' },
            update: {},
            create: {
                name: 'webhook'
            }
        })
        const availabeAction1 = await tx.availableAction.upsert({
            where: { name: 'email' },
            update: {},
            create: {
                name: 'email',
            }
        })
        const availabeAction2 = await tx.availableAction.upsert({
            where: { name: 'send_solana' },
            update: {},
            create: {
                name: 'send_solana',
            }
        })
        const zap = await tx.zap.upsert({
            where: { name: 'zap 1' },
            update: {},
            create: {
                name: "zap 1",
                userId: user.id
            }
        })
    })

}
main()