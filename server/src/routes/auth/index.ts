import express from "express";
import jwt from "jsonwebtoken";
import {validateUserByEmailAndPassword} from "../../lib/authUtil";

const authRouter = express.Router();

authRouter.post("/login", async (req,
                           res, next) => {
    const {email, password} = req.body

    const user = await validateUserByEmailAndPassword({
        email,
        password
    });

    if(!user) {
        return res.json({
            code: 404,
            data: null,
            error: "Credenciales inconrrectas"
        })
    }

    let token;
    try {
        token = jwt.sign(
            {
                id: user.id,
                email: user.email
            },
            `${process.env.JWT_SECRET}`,
            { expiresIn: "1h" }
        );
    } catch (err) {
        console.log(err);
        const error =
            new Error("Error! Something went wrong.");
        return next(error);
    }

    res.json({
        code: 200,
        data: {
            user,
            token
        }
    })
})

export default authRouter;