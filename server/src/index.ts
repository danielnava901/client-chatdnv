import express from 'express';
import http from "http";
import { Server } from 'socket.io'
import cors from 'cors';
import dotenv from 'dotenv'
import apiRouter from "./routes/api";
import operationsRouter from "./routes/operations";
import authRouter from "./routes/auth";
import {checkIfUserIsInRoom, getRoomByCode, joinUserToRoom} from "./repositories/rooms";
import {getUserById} from "./repositories/users";

const port = 8080;
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

io.use((socket, next) => {
    const username = socket.handshake.auth.username;
    if (!username) {
        return next(new Error("invalid username"));
    }
    socket["username"] = username;
    next();
});

const getUserConnected = () => {
    const usersConnected : any[] = []
    const kv : any = io.of("/").sockets;

    for (const [id, socket] of kv) {
        usersConnected.push({
            socketId: id,
            username: socket.username,
        });
    }

    return usersConnected;
}

io.on("connection", (socket) => {
    socket.join(socket["username"]);

    socket.on("private message", ({ message, to }) => {
        socket.to(to).emit("private message", {from: socket["username"], message});
    });

    socket.on("join_user", (email) => {
        if(email.trim().length > 0) {
            socket.join(email);
        }
    });

    socket.on("users_request", () => {
        const usersConnected = getUserConnected();
        socket.broadcast.emit("user_disconnected", usersConnected);
    });

    socket.on("request_join_room", ({code_name, to}) => {
        socket.join(code_name);
        socket.to(to).emit("request_join_room", {
            code_name,
            from: socket["username"]
        });
    }) ;

    socket.on("room_user_join", async ({roomId, peerId}) => {
        const room : any = await getRoomByCode({code: roomId});
        console.log("Room: ", roomId, " user join, PeerId", peerId);
        socket.join(roomId);
        socket.to(roomId)
            .emit("room_user_joined", {peerId});
    });


    socket.on("disconnect", (reason) => {
        console.log("disconnected", {reason});
        const usersConnected = getUserConnected();
        socket.broadcast.emit("user_disconnected", usersConnected);
    });

    socket.on("connect_error", (error) => {
        const usersConnected = getUserConnected();
        socket.broadcast.emit("user_disconnected", usersConnected);
    });
});

dotenv.config({ path: './.env' });
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


/**
 * Manejador de rutas del API, que responderan a la app del FRONT
 */
app.use('/api', apiRouter);


/**
 * Ruta con manejador de LOGIN
 */
app.use('/auth', authRouter);

/**
 * Ruta solo para crear usuarios desde afuera
 */
app.use('/operations', operationsRouter);

app.get('/', (req, res) => {
    res.send('Hello World!')
})

server.listen(port, () => {
    console.log("listening in port "+ port);
});