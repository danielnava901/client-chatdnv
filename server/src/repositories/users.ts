import {PrismaClient} from "@prisma/client";
const prisma = new PrismaClient();


export const getUserById = async ({userId}) => {
    return await prisma.users.findFirst({
        select: {
            id: true,
            email: true
        },
        where: {
           id: userId
        }
    });
}