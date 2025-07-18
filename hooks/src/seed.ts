
import { PrismaClient } from "../src/generated/prisma"
import bcrypt from 'bcrypt'

const prismaClient = new PrismaClient();

async function main() {

    await prismaClient.$transaction(async (tx: any) => {
        const user = await tx.user.upsert({
            where: { email: 'jayanthaitha@gmail.com' },
            update: {},
            create: {
                email: 'jayanthaitha@gmail.com',
                name: 'Jayanth',
                password: await bcrypt.hash("1234567890", 10)
            },
        })
        const availabeTiggers = await tx.availableTrigger.upsert({
            where: { name: 'webhook' },
            update: {},
            create: {
                name: 'webhook',
                imageURL: "https://zapier-images.imgix.net/storage/services/6aafbb717d42f8b42f5be2e4e89e1a15.png?auto=format&fit=crop&h=60&ixlib=react-9.10.0&q=50&w=60"
            }
        })
        const availabeAction1 = await tx.availableAction.upsert({
            where: { name: 'email' },
            update: {},
            create: {
                name: 'email',
                imageURL: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRpH3rI_9E9CKiAsp0ZWJc12PLeU6B206JuAw&s'
            }
        })
        const availabeAction2 = await tx.availableAction.upsert({
            where: { name: 'send_solana' },
            update: {},
            create: {
                name: 'send_solana',
                imageURL: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRVJ3fp_jVDHChLAR96XuRAMVjMrYfk3MCuqA&s'
            }
        })
    })

}
main()