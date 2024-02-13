import {io} from 'socket.io-client';
import {IP, PORT, HTTPS} from './constants';

const WS = PORT ? `${HTTPS}://${IP}:${PORT}` : `${HTTPS}://${IP}`;

const socket = io(WS, { autoConnect: false });

socket.onAny((event, ...args) => {
    //console.log("SOCKET", event, args);
});

socket.on("connect_error", (err) => {
    if (err.message === "invalid username") {
        console.log("username tomado");
    }
});

export const destroySocket = () => {
    socket.disconnect();
}

export const socketConnect = (user : any, cb = (s : any) => {}) => {
    socket.auth = { username: user.email };
    socket.connect();
    cb(socket);
}

export default socket;