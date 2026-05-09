import { prisma } from '../src/database/prisma_client'

async function main() {
    await prisma.user.create(
    {
        data: {
            mail: 'a.gmail.com',
            name: 'Alice',
            achievement: 3,
            achievement_date: new Date(),
            avatarText: "BBA",
        },


    }
)
}

main()