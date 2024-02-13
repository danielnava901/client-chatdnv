import {PrismaClient} from "@prisma/client";
const prisma = new PrismaClient({ errorFormat: 'minimal' });

export const createRoom = async ({from, to, code_name}) => {
    return await prisma.room.create({
        data: {
            code_name,
            from_user_id: from,
            to_user_id: to,
            created_at: new Date()
        }
    });
}

export const getActiveRooms = async ({from, to}) => {
    return await prisma.room.findMany({
        select: {
            code_name: true,
            created_at: true,
            user_to: {
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
                    AND: [
                        {
                            from_user_id: from
                        },
                        {
                            to_user_id: to
                        }
                    ]
                },
                {
                    AND: [
                        {
                            from_user_id: to
                        },
                        {
                            to_user_id: from
                        }
                    ]
                }
            ],
            AND: {
                closed_at: null
            }
        }
    })
}

export const getRoomByCode = async ({code}) => {
    return await prisma.room.findFirst({
        where: {
            code_name: code
        }
    })
}

export const checkIfUserIsInRoom = async ({roomId, userId}) => {
    const w : any = await prisma.$queryRaw`
        SELECT
            room_user.peer_id
        FROM room_user
        WHERE room_user.user_id = ${userId} AND
            room_user.room_id = ${roomId}
    `;

    return w.length > 0;
}

export const joinUserToRoom = async ({roomId, userId, peerId}) => {
    console.log("query....", {roomId, userId});

    await prisma.$queryRaw`
        INSERT INTO room_user(room_id, user_id, joined_at, peer_id)
        VALUES(${roomId}, ${userId}, utc_timestamp(), ${peerId})
        ON DUPLICATE KEY UPDATE room_id = ${roomId}
    `;

    return await prisma.room_user.findFirst({
        where: {
            room_id: roomId,
            user_id: userId,
        }
    });
}

export const getRoomUser = async ({roomCode, userId}) => {
    console.log("get room user", {roomCode, userId});
    return await prisma.room_user.findFirst({
        select: {
            peer_id: true,
            room_id: true,
            user_id: true,
            joined_at: true,
            leave_at: true
        },
        where: {
            room: {
                code_name: roomCode
            },
            user_id: userId
        }
    });
}