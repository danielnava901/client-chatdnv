import {useContext, useEffect, useState} from "react";
import {UserContext} from "../context/UserContext";
import {axiosApi, getToken} from "../lib/util";
import socket from "../lib/socket";

export const UserList = () => {
    const [list, setList] = useState([]);
    const {
        setCurrentContact,
        currentContact,
        contactsConnected,
    } = useContext(UserContext);

    const getData = async () => {
        const response = await axiosApi(getToken()).post("/getUserList");
        let {data} = response.data;
        setList(data);
    }

    useEffect(() => {
        getData();
    }, [])

    return <div>
        {
            list.map((item : any, index) => {
                let connected = false;
                contactsConnected().forEach((contact : any) => {
                   if(item.contacts_to_user.email === contact.username) {
                       connected = true;
                   }
                });
                let {contacts_to_user} = item;
                return <div key={index}
                            className={`
                            w-full
                            border-b
                            flex
                            py-4
                            px-2
                            cursor-pointer
                            ${(!!currentContact && currentContact.id == contacts_to_user.id) ? 
                                "bg-blue-200 hover:bg-blue-100" : "hover:bg-gray-100"}
                        `}
                    onClick={() => {
                        setCurrentContact(contacts_to_user)
                    }}
                >
                    <div className="font-semibold text-sm flex justify-between items-center w-full">
                        <span>{contacts_to_user.email}</span>
                        <span>{connected ? <div className="h-2 w-2 mx-8 rounded-full bg-green-400">
                            &nbsp;
                        </div> : ""}</span>
                    </div>
                </div>
            })
        }
    </div>
}