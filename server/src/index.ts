import express from 'express';
import http from "http";
import { Server } from 'socket.io'
import cors from 'cors';
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import apiRouter from "./api";



const port = 8080;
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

dotenv.config({ path: './.env' });
app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello World!')
})
app.post("/login", (req,
 res, next) => {
    console.log({body: req.body });

    const user = {
        id: 100,
        name: "DanielN",
        email: "daniel@nava.com"
    };

    let token;
    try {
        token = jwt.sign(
            {
                userId: 1,
                email: "daniel@dnv.com"
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

    console.log({login: token});

    res.json({
        code: 200,
        data: {
            user,
            token
        }
    })
})

app.use('/api', apiRouter);

app.listen(port, () => {
    console.log("listening in port "+ port);
});