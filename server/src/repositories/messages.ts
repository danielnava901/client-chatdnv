import {PrismaClient} from "@prisma/client";
const prisma = new PrismaClient();

type MessageType = {
    to?: number,
    from?: number,
    content?: string,
    created_at?: any
}

export const getMessagesTo = async ({from, to}: MessageType) => {
    const messages = await prisma.message.findMany({
        select: {
            created_at: true,
            seen_at: true,
            content: true,
            users_to: {
                select: {
                    email: true
                }
            },
            user_from: {
                select: {
                    email: true
                }
            }
        },
        where: {
            OR: [
                {
                    from_user_id: from,
                    to_user_id: to,
                    removed: 0
                },
                {
                    from_user_id: to,
                    to_user_id: from,
                    removed: 0
                }
            ]
        },
        orderBy: {
            created_at: 'asc'
        }
    });

    const ms : any = messages.map(message => {
        return {
            from: message.user_from.email,
            to: message.users_to.email,
            content: message.content,
            created_at: new Date(message.created_at).toLocaleString()
        }
    });

    return ms;
};

export const newMessageTo = async ({from, to, content,
                                       created_at = new Date()}: MessageType) => {
    if(to && from) {
        await prisma.message.create({
            data: {
                to_user_id: to,
                from_user_id: from,
                content: `${content}`,
                created_at: `${created_at}`,
                removed: 0
            }
        });
    }
};