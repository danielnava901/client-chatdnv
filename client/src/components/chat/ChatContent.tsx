import {useContext, useEffect, useRef, useState} from "react";
import {axiosApi, getToken, getUserFromToken} from "../../lib/util";
import {UserContext, UserType} from "../../context/UserContext";
import socket from "../../lib/socket";

export const ChatContent = ({messageList}: {messageList: any}) => {
    console.log("mentra chat content")
    const {currentContact} = useContext(UserContext);
    const user : UserType | false = getUserFromToken();
    const [loading, setLoading] = useState(false);
    const [_messageList, setMessageList] = useState(messageList);
    const chatRef = useRef<any>(null);

    const updateMessageList = (msg: any) => {
        let list : any = [..._messageList, msg];
        setMessageList(list);
    }

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

    useEffect(() => {
        socket.on("private message", ({ message: msg, from }) => {
            if(currentContact.email === from) {
                updateMessageList({
                    from,
                    content: msg
                });
            }
        });

        return () => {
            socket.off("private message");
        }

    }, [messageList])

    useEffect(() => {
        getMessageList();
    }, [currentContact]);

    return <div className="grow overflow-y-auto">
        {
            _messageList.map((messageItem: any, index: number) => {
                return <div key={index}
                            className={`flex w-full ${!!user && messageItem.from === user.email ?
                                "justify-end" : "justify-start"}`}
                >
                    <div className={`border rounded-xl w-fit m-2  max-w-[calc(50%-50px)]
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
}