import {useContext, useEffect, useState} from "react";
import {UserContext} from "../context/UserContext";
import socket from "../lib/socket";

export const UserChat = () => {
    const {currentContact} = useContext(UserContext);
    const [message, setMessage] = useState("");
    const [messageList, setMessageList] = useState([]);
    const [usersConnected, setUsersConnected] = useState([]);

    const getMessageList = async () => {

    }

    if(!currentContact) {
        return <div className="w-full h-full flex justify-center items-center">Seleccione un usuario</div>
    }
    return <div className="w-full h-full flex flex-col">
        <div className="w-full h-[50px] bg-white p-2 border-b grow-0">
            <span>{currentContact.id} - {currentContact.email}</span>
        </div>
        <div className="grow overflow-y-auto">
            Mensajes
        </div>
        <div className="w-full h-[80px] bg-white p-2 border-t grow-0 flex items-center">
            <div className="grow">
                <input type="text"
                       autoFocus={true}
                       className="w-full rounded-xl bg-gray-100 p-2 text-gray-600"
                       value={message}
                       onChange={(ev) => {
                           setMessage(ev.target.value);

                       }}
                />
            </div>
            <button className="
                w-[50px]
                h-[50px]
                rounded-full
                border
                mx-4
                flex
                justify-center
                items-center
                hover:bg-blue-200
                bg-white
                hover:text-white
                text-blue-200
            "
                onClick={() => {
                    socket.emit("private_message", {
                        message,
                        to: socket.id
                    })
                }}
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
                </svg>
            </button>
        </div>
    </div>
}