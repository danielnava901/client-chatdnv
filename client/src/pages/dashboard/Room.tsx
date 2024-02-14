import {Link, useParams} from "react-router-dom";
import {useContext, useEffect, useState} from "react";
import socket, {socketConnect} from "../../lib/socket";
import {getUserFromToken, axiosApi, getToken, } from "../../lib/util";
import Peer from "peerjs";
import {RoomContext} from "../../context/RoomContext";
import {VideoPlayer} from "../../components/VideoPlayer";

export const Room = () => {
    const {me, setMe, setStream, stream, peers, setPeers} = useContext(RoomContext);
    const [incomingCall, setIncomingCall] = useState<any>([]);

    const user = getUserFromToken();
    let {id} = useParams()

    const getData = async (cb = (data: any) => {}) => {
        if(user) {
            const response = await axiosApi(getToken()).post(`/getRoomData`, {
                roomId: id,
            });
            let {data} = response.data;
            cb(data);
        }
    }

    useEffect(() => {
        socket.on("room_user_joined", (params) => {
            const joinedPeerId = params.peerId;
            if(!me || !stream) return;

            const call = me.call(joinedPeerId, stream);

            call.answer(stream);
            call.on("stream", (peerStream: any) => {
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
                    const peer : any = new Peer(data.peer_id);
                    peer.on("open", (peerId : string) => {
                        navigator.mediaDevices
                            .getUserMedia({video: true, audio: true})
                            .then((stream) => {
                                setMe(peer);

                                peer.on('call', (receivingCall : any) => {

                                    receivingCall.answer(stream);

                                    receivingCall.on("stream", (peerStream: any) => {
                                        setPeers([...peers, peerStream]);
                                    });

                                    setIncomingCall([...incomingCall, receivingCall]);
                                });

                                socket.emit("room_user_join", {
                                    roomId: id,
                                    userId: user.id,
                                    peerId: peerId
                                });

                                setStream(stream);
                            });
                    });
                }catch (e) {
                    console.error(e);
                }
            }
        });
    }, []);

    if(!stream) return <div>Cargando...</div>

    return <div className="w-screen h-screen bg-gray-200 flex flex-col">
        <div className="w-full justify-between items-center">
            <div className="font-bold text-lg">Sesión {id}</div>
            <div><Link to="/dashboard">Regresar</Link></div>
        </div>
        <div className="w-full flex flex-col">
            <div>
                <VideoPlayer stream={stream} />
                <span>{me._id}</span>
            </div>
            <div className="flex w-full items-center justify-center w-[200px]">
                {
                    peers.map((peerStream: any, index: number) => {
                        return <div key={index}>
                            <VideoPlayer
                                stream={peerStream}  />
                            <span>{incomingCall[index].peer}</span>
                        </div>
                    })
                }
            </div>

        </div>
    </div>
}