import {useParams} from "react-router-dom";
import {useContext, useEffect} from "react";
import {RoomContext} from "../context/RoomContext";

export const Room = () => {
    let {ws} = useContext(RoomContext);
    let {id} = useParams()

    useEffect(() => {
        ws.emit("join-room", {id});

    }, [])
    return <div className="w-screen h-screen bg-gray-200">
        Room {id}
    </div>
}