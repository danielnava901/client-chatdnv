import {PrismaClient} from "@prisma/client";
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()
const saltRounds = 10;

export const getUserIfExistOrNull = async ({email}) => {
    return await prisma.users.findUnique({
        where: {
            email: `${email}`,
        },
    });
}

export const validateUserByEmailAndPassword = async ({email, password}) => {
    const user = await getUserIfExistOrNull({email});

    if(!user) return false;

    if(!await bcrypt.compare(password, `${user.password_digest}`)) {
        return false;
    }

    return user;
}