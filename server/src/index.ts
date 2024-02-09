import express from 'express';
import http from "http";
import { Server } from 'socket.io'
import cors from 'cors';
import dotenv from 'dotenv'
import apiRouter from "./routes/api";
import operationsRouter from "./routes/operations";
import authRouter from "./routes/auth";

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
    console.log("socket use user", username);
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
        console.log("onconection", id, socket.username);
        usersConnected.push({
            socketId: id,
            username: socket.username,
        });
    }

    return usersConnected;
}

io.on("connection", (socket) => {
    const usersConnected = getUserConnected();

    socket.on("private_message", ({ message, to }) => {
        console.log({message, to});
        socket.to(to).emit("private_message", {
            message,
            from: socket.id,
        });
    });
    socket.broadcast.emit("user_connected", usersConnected);

    socket.on("disconnect", (reason) => {
        const usersConnected = getUserConnected();
        socket.broadcast.emit("user_disconnected", usersConnected);
        // called when the underlying connection is closed
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