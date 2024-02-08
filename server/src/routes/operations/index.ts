import express from "express";
import bcrypt from 'bcrypt'
import {getUserIfExistOrNull, validateUserByEmailAndPassword} from '../../lib/authUtil';
import {PrismaClient} from "@prisma/client";
const prisma = new PrismaClient()
const saltRounds = 10;
const operationsRouter = express.Router();

operationsRouter.post("/create", async (
    req,
    res) => {
    const {_email, _password} = req.body;

    if(!_email || !_password || _email.trim().length === 0 || _password.trim().length === 0) {
        return res.json({
            user: null,
            code: 401,
            error: "Parametros faltantes"
        });
    }

    let user = await getUserIfExistOrNull({email: _email});

    if(!user) {
        const salt = await bcrypt.genSalt(saltRounds);
        const hash = await bcrypt.hash(_password, salt);

        user = await prisma.users.create({
            data: {
                email: _email,
                created_at: new Date(),
                password_digest: hash
            }
        })
    }

    return res.json({
        user,
        code: 200,
        error: null
    })
})

operationsRouter.post("/login", async (
    req, res
) => {
    const {_email, _password} = req.body
    if(!await validateUserByEmailAndPassword({email: _email, password: _password})) {
        return res.json({
            code: 404,
            data: null,
            error: "Usuario no encontrado"
        });
    }

    return res.json({
        code: 200,
        data: "Usuario correcto",
        error: false
    })
})

export default operationsRouter;