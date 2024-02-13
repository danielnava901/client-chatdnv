import {PrismaClient} from "@prisma/client";
import express from "express";
import verifyToken from "../../middleware/authMiddleware";
import {getMessagesTo, newMessageTo} from "../../repositories/messages";
import {
    checkIfUserIsInRoom,
    createRoom,
    getActiveRooms,
    getRoomByCode,
    getRoomUser,
    joinUserToRoom
} from "../../repositories/rooms";
const prisma = new PrismaClient();
const apiRouter = express.Router();
import {randomUUID} from "crypto";

apiRouter.post('/user', verifyToken,
    (req, res) => {

    return res.json({
        code: 200,
        data: {
            user: ("user" in req) ? req.user : null
        }
    });
});

apiRouter.post("/getUserList", verifyToken, async (
    req,
    res
) => {
    let code = 404;
    let error : string | null = "no user";
    let data: any[] = [];

    if("user" in req) {
        const user : any = req.user;

        const list : any = await prisma.users.findUnique({
            select: {
                user_contacts: {
                    select: {
                        contacts_to_user: {
                            select: {
                                id: true,
                                email: true
                            }
                        }
                    }
                }
            },
            where: {
                id: Number(user.id)
            }
        })

        code = 200;
        error = null;

        data = list.user_contacts;
    }

    return res.json({
        code,
        data,
        error
    });
});

apiRouter.post("/messages", verifyToken, async (
    req, res
) => {
    let code = 404;
    let error : string | null = "no user";
    let data: any = [];

    if("user" in req) {
        const {to} : {to: any, user: any} = req.body
        const user : any = req.user;

        data = await getMessagesTo({from: user.id, to});
        code = 200;
        error = null;
    }

    return res.json({
        code,
        data,
        error
    })
});

apiRouter.post("/newMessage", verifyToken, async (
    req, res
) => {
    let code = 404;
    let error : string | null = "No guardo mensaje";

    if("user" in req) {
        const user : any = req.user;
        const {to, content, created_at} : {to: number, content: string, created_at: any} = req.body;

        await newMessageTo({
            to,
            from: user.id,
            content,
            created_at
        });
        code = 200;
        error = null;
    }

    return res.json({
        code,
        data: null,
        error
    })
});

apiRouter.post("/newRoom", verifyToken, async (
    req, res
) => {
    let code = 404;
    let error : string | null = "Error al crear room";
    let data : any = [];

    if("user" in req) {
        const codeName = randomUUID();
        const user : any = req.user;
        const to : any = req.body.to;
        const rooms : any = await getActiveRooms({from: user.id, to});
        code = 200;
        error = null;

        if(rooms.length === 0) {
            console.log("creando", {from: user.id, to, code_name: codeName});
            data = await createRoom({
                from: user.id,
                to, /*cuando el to lo acepte, hacer update*/
                code_name: codeName
            });
        }else {
            code = 202;
            error = "Ya existe una llamada";
            data = rooms[0]
        }
    }

    return res.json({
        code,
        error,
        data
    })
});

apiRouter.post("/getRoomData", verifyToken, async (
    req,
    res) => {

    let data : any = [];
    if("user" in req) {
        const user : any = req.user;
        const roomCode : any = req.body.roomId;
        const peerId = randomUUID();

        const room : any = await getRoomByCode(roomCode);

        data = await getRoomUser({roomCode, userId: user.id});

        if(!data) {
            data = await joinUserToRoom({
                roomId: room.id,
                userId: user.id,
                peerId
            });
        }
    }

    return res.json({
        code: 200,
        data,
        error: null
    });
});

export default apiRouter;