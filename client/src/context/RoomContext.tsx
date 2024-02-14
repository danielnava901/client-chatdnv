import React, {createContext, useEffect, useState} from "react";
import Peer from "peerjs";
import {axiosApi, getToken} from "../lib/util";


const defultVal = {
    me: Peer
};

export const RoomContext = createContext<null|any>(defultVal);

type Props = {
    children: React.ReactNode
}

type CurrentStateTypes = {
    isInVideoCall: boolean
}

const currentRoomStateDefault : CurrentStateTypes = {
    isInVideoCall: false
}

export const RoomProvider = ({children} : Props) => {
    const [me, setMe] = useState<Peer>();
    const [stream, setStream] = useState<MediaStream>();
    const [peers, setPeers] = useState<Peer[]>([]);
    const [currentRoomState, setCurrentRoomState] = useState<CurrentStateTypes|null>(currentRoomStateDefault);

    const getRoomData = async () => {
        const response = await axiosApi(getToken()).post("/user/getUserRoomState");
    }

    useEffect(() => {

    },  []);

    return (<RoomContext.Provider value={{
        me,
        setMe,
        stream,
        setStream,
        peers,
        setPeers,
        currentRoomState,
        setCurrentRoomState
    }}>
        {children}
    </RoomContext.Provider>)
}