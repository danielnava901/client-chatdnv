import express from 'express';
import http from "http";
import { Server } from 'socket.io'
import cors from 'cors';
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import apiRouter from "./routes/api";
import operationsRouter from "./routes/operations";
import bodyParser from 'body-parser';
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

app.listen(port, () => {
    console.log("listening in port "+ port);
});