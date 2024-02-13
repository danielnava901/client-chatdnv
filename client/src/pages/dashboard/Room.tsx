import {Link, useParams} from "react-router-dom";
import {useContext, useEffect, useState} from "react";
import socket, {socketConnect} from "../../lib/socket";
import {getUserFromToken, axiosApi, getToken, } from "../../lib/util";
import Peer from "peerjs";
import {RoomContext} from "../../context/RoomContext";
import {VideoPlayer} from "../../components/VideoPlayer";

export const Room = () => {
    const {me, setMe, setStream, stream, peers, setPeers} = useContext(RoomContext);
    const [myPeerId, setMyPeerId] = useState(null);

    const user = getUserFromToken();
    let {id} = useParams()

    const getData = async (cb = (data: any) => {}) => {
        if(user) {
            const response = await axiosApi(getToken()).post(`/getRoomData`, {
                roomId: id,
            });
            let {data} = response.data;
            console.log({data});
            cb(data);
        }
    }

    useEffect(() => {
        socket.on("room_user_joined", ({peerId}) => {
            if(!me || !stream) return;
            console.log("Debo marcar a ", peerId);
            const call = me.call(peerId, stream);

            console.log("me:::::|||>", call);
            call.on("stream", (peerStream: any) => {
                console.log("stream segundos", peerStream.id);
                setPeers([...peers, peerStream]);
            });
        });

        return () => {
            socket.off("room_user_joined");
        }
    }, [me, stream]);

    useEffect(() => {
        socketConnect(user);

        getData((data) => {
            if(!!user) {
                try {
                    setMyPeerId(data.peer_id);
                    console.log("YO SOY ", data.peer_id);

                    const peer : any = new Peer(data.peer_id);
                    console.log("try", navigator.mediaDevices);
                    peer.on("open", (peerId : string) => {
                        navigator.mediaDevices
                            .getUserMedia({video: true, audio: true})
                            .then((stream) => {
                                setStream(stream);
                                socket.emit("room_user_join", {
                                    roomId: id,
                                    userId: user.id,
                                    peerId: peerId
                                });
                            });
                        setMe(peer);

                        peer.on('call', (call : any) => {
                            console.log("answer call", {call});
                            call.answer(stream);
                        });
                    });

                }catch (e) {
                    console.error(e);
                }
            }
        });
    }, []);


    return <div className="w-screen h-screen bg-gray-200 flex flex-col">
        <div className="w-full justify-between items-center">
            <div className="font-bold text-lg">Sesión {id}</div>
            <div><Link to="/dashboard">Regresar</Link></div>
        </div>
        <div className="w-full flex flex-col">
            <div>
                <VideoPlayer stream={stream} />
            </div>
            <div className="flex w-full items-center justify-center w-[200px]">
                {
                    peers.map((peerStream: any, index: number) => {
                        return <VideoPlayer
                            key={index}
                            stream={peerStream}  />
                    })
                }
            </div>

        </div>
    </div>
}