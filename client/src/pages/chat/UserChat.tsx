import {useContext, useEffect, useRef, useState} from "react";
import {UserContext, UserType} from "../../context/UserContext";
import socket from "../../lib/socket";
import {axiosApi, getToken, getUserFromToken} from "../../lib/util";
import {ChatHeader} from "./ChatHeader";

export const UserChat = () => {
    const [loading, setLoading] = useState(false);
    const {currentContact} = useContext(UserContext);
    const user : UserType | false = getUserFromToken();
    const [message, setMessage] = useState("");
    const [messageList, setMessageList] = useState([]);
    const chatRef = useRef<any>(null);
    const chatInputRef = useRef<any>(null);

    const getMessageList = async () => {
        // Borramos lista para pedir por api
        setMessageList([]);
        if(!!currentContact) {
            setLoading(true);
            const response : any = await axiosApi(getToken()).post("/messages", {
                to: currentContact.id
            });
            let {data: {data}} = response;
            setLoading(false);
            setMessageList(data);
        }

        if(chatRef && chatRef.current && chatRef.current["scrollIntoView"]) {
            chatRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }

    const updateMessageList = (msg: any) => {
        let list : any = [...messageList, msg];
        setMessageList(list);

        if(chatInputRef && chatInputRef.current) {
            chatInputRef.current.focus();
        }
    }

    const sendMessage = async (message: string) => {
        if(user) {
            let date = new Date();
            const response : any = await axiosApi(getToken()).post("/newMessage", {
                to: currentContact.id,
                content: message,
                created_at: date,
            });
            let {data: {data}} = response;

            updateMessageList({
                from: user.email,
                content: message,
                created_at: date.toLocaleString()
            });
        }

        setMessage("");
    }

    const sendMessageHandler = async () => {
        if(message.trim().length === 0 || !user) {
            return
        }

        socket.emit("private message", {
            message,
            to: currentContact.email
        });
        await sendMessage(message);
    }

    useEffect(() => {
        getMessageList();
    }, [currentContact]);

    useEffect(() => {
        socket.on("private message", ({ message: msg, from }) => {
            console.log("private message", {msg, from, currentContact});

            if(currentContact.email === from) {
                updateMessageList({
                    from,
                    content: msg
                });
            }
        });

        if(chatRef && chatRef.current && chatRef.current["scrollIntoView"]) {
            chatRef.current.scrollIntoView({ behavior: "smooth" });
        }

        return () => {
            socket.off("private message");
        }

    }, [messageList])

    if(!currentContact) {
        return <div className="w-full h-full flex justify-center items-center">Seleccione un usuario</div>
    }

    return <div className="w-full h-full flex flex-col">
        <ChatHeader />
        <div className="grow overflow-y-auto">
            {
                messageList.map((messageItem: any, index) => {
                    return <div key={index}
                        className={`flex w-full ${!!user && messageItem.from === user.email ? 
                            "justify-end" : "justify-start"}`}
                    >
                        <div className={`
                            border 
                            m-2
                            rounded-xl 
                            w-full 
                            lg:w-fit  
                            lg:max-w-[calc(50%-50px)]
                            ${!!user && messageItem.from === user.email ? 
                            "bg-green-200" : 
                            "bg-white"}
                        `}>
                            {
                                !!user && messageItem.from !== user.email ? <div
                                    className={`p-3 text-xs text-right border-b`}>
                                    {messageItem.from}
                                </div> : null
                            }

                            <div className="p-3 text-sm mb-2">{messageItem.content}</div>
                            <div className="p-3 text-xs">{messageItem.created_at}</div>
                        </div>
                    </div>
                })
            }
            <div id="chat-bottom" ref={chatRef}></div>
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
                       onKeyUp={async (ev) => {
                           if(ev.key === "Enter") {
                               await sendMessageHandler();
                           }

                       }}
                       ref={chatInputRef}
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
                onClick={async () => {
                    await sendMessageHandler();
                }}
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
                </svg>
            </button>
        </div>
    </div>
}