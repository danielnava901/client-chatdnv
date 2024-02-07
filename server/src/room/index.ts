import {Socket} from "socket.io";
import {v4 as uuidV4} from 'uuid';

export const roomHandler = (socket: Socket) => {
    const createRoom = () => {
        const roomId = uuidV4();
        socket.join(roomId);
        socket.emit("room-created", {
            roomId
        });




        console.log("User connected this room");
    };

    const joinRoom = ({id}) => {
        console.log("User connected this room: " + id);
    };

    socket.on("create-room", createRoom);

    socket.on("join-room", joinRoom);
}