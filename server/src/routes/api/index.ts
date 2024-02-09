import {PrismaClient} from "@prisma/client";
import express from "express";
import verifyToken from "../../middleware/authMiddleware";
const prisma = new PrismaClient()
const apiRouter = express.Router();

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
        console.log({user});

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
        console.log({list})
        data = list.user_contacts;
    }

    return res.json({
        code,
        data,
        error
    });
});

export default apiRouter;