import React, {createContext, useEffect, useState} from "react";
import Peer from "peerjs";
import {getUserFromToken} from "../lib/util";


const defultVal = {
    me: Peer
};

export const RoomContext = createContext<null|any>(defultVal);

type Props = {
    children: React.ReactNode
}

export const RoomProvider = ({children} : Props) => {
    const user = getUserFromToken();
    const [me, setMe] = useState<Peer>();
    const [stream, setStream] = useState<MediaStream>();
    const [peers, setPeers] = useState<any>([]);



    return (<RoomContext.Provider value={{
        me,
        setMe,
        stream,
        setStream,
        peers,
        setPeers
    }}>
        {children}
    </RoomContext.Provider>)
}