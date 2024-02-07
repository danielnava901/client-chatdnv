import React, {useContext} from "react";
import {RoomContext} from "../context/RoomContext";

export const CreateButton : React.FC = (props) => {
    const {ws} = useContext(RoomContext);

    const createRoom = () => {
        ws.emit("create-room");
    }

    return (
        <button
            onClick={createRoom}
            className="bg-rose-300
            p-3
            rounded
            text-white
            text-xl
            hover:bg-rose-500
            hover:shadow
            "
        >
            Nueva reunión
        </button>
    );
};

