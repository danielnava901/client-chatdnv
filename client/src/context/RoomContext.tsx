import socketIO from 'socket.io-client';
import React, {createContext, useEffect} from "react";
import {useNavigate} from "react-router-dom";

const WS = 'http://localhost:8080';
const ws = socketIO(WS);

const defultVal = {
    ws: null
};

export const RoomContext = createContext<null|any>(defultVal);

type Props = {
    children: React.ReactNode
}

export const RoomProvider = ({children} : Props) => {
    const navigate = useNavigate();

    useEffect(() => {
        ws.on("room-created", ({roomId}) => {
            console.log("RoomId: ", roomId);
            navigate(`/dashboard/room/${roomId}`);
        })
    }, [])

    return (<RoomContext.Provider value={{ws}}>
        {children}
    </RoomContext.Provider>)
}