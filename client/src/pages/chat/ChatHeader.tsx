import {useContext, useEffect} from "react";
import {UserContext, UserType} from "../../context/UserContext";
import {axiosApi, getToken, getUserFromToken} from "../../lib/util";
import {useNavigate} from "react-router-dom";
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

import socket from "../../lib/socket";

export const ChatHeader = () => {
    const user : UserType | false = getUserFromToken();
    const {currentContact} = useContext(UserContext);
    const navigate = useNavigate();

    const onClickVideocall = async () => {
        if(!!user) {
            const response = await axiosApi(getToken()).post("/newRoom", {
                from: user.id,
                to: currentContact.id,
            });

            if(response.data) {
                const {data: {data, error}} = response;
                if(error) {
                    confirmAlert({
                        title: error,
                        message: "¿Desea ir a la sesión?",
                        buttons: [
                            {
                                label: "Si",
                                onClick: () => {
                                    navigate(`/dashboard/room/${data.code_name}`);
                                },
                            },
                            {
                                label: "No"
                            }
                        ]
                    });
                }else {
                    socket.emit("request_join_room", {
                        code_name: data.code_name,
                        to: currentContact.email
                    });
                    navigate(`/dashboard/room/${data.code_name}`);
                }
            }
        }
    }

    useEffect(() => {
        socket.on("request_join_room", ({code_name, from}) => {
            confirmAlert({
                title: 'Llamada en espera',
                message: `${from} está llamando, ¿Desea contestar?`,
                buttons: [
                    {
                        label: 'Si',
                        onClick: () => {
                            navigate(`/dashboard/room/${code_name}`);
                        }
                    },
                    {
                        label: 'No',
                        onClick: () => {}
                    }
                ]
            });
        });

        return () => {
            socket.off("request_join_room");
        }
    }, []);

    return <div className="w-full h-[50px] bg-white p-2 border-b grow-0 flex justify-between">
        <div><span>{currentContact.id} - {currentContact.email}</span></div>
        <div>
            <span className="
                w-8
                h-8
                cursor-pointer
                flex justify-center items-center
                text-gray-600
                rounded border
                hover:opacity-75
                hover:bg-gray-600
                hover:text-white"
                  onClick={onClickVideocall}
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                  <path d="M4.5 4.5a3 3 0 0 0-3 3v9a3 3 0 0 0 3 3h8.25a3 3 0 0 0 3-3v-9a3 3 0 0 0-3-3H4.5ZM19.94 18.75l-2.69-2.69V7.94l2.69-2.69c.944-.945 2.56-.276 2.56 1.06v11.38c0 1.336-1.616 2.005-2.56 1.06Z" />
                </svg>
            </span>
        </div>
    </div>
}