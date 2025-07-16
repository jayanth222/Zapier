
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
    })

}
main()