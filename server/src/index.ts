import express from 'express';
import http from "http";
import { Server } from 'socket.io'
import cors from 'cors';
import {roomHandler} from "./room";


const port = 8080;
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.use(cors);

io.on("connection", (socket) => {
    console.log("user ready connected");

    roomHandler(socket);

    socket.on("disconnect", () => {
        console.log("disconnect");
    });
});



server.listen(port, () => {
    console.log("listening in port "+ port);
});