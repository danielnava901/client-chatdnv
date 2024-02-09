import {io} from 'socket.io-client';
const WS = 'http://localhost:8080';

const socket = io(WS, { autoConnect: false });

socket.onAny((event, ...args) => {
    console.log("SOCKET", event, args);
});

socket.on("connect_error", (err) => {
    if (err.message === "invalid username") {
        console.log("username tomado");
    }
});

export const destroySocket = () => {
    socket.disconnect();
}

export const socketConnect = (user : any, {
    onUsersConnect,
    onPrivateMessage
}: { onUsersConnect: any, onPrivateMessage: any }) => {
    console.log("Socket connect", user.email);
    socket.auth = { username: user.email };
    socket.connect();

    socket.on("user_connected", (users) => {
        users.forEach((user : any) => {
            user.self = user.socketId === socket.id;
        });
        onUsersConnect(users);
    });

    socket.on("user_disconnected", (users) => {
        users.forEach((user : any) => {
            user.self = user.socketId === socket.id;
        });
        onUsersConnect(users);
    });

    socket.on("private_message", ({ message, from }) => {
        console.log({message, from});
        onPrivateMessage({message, from});
    });
}

export default socket;