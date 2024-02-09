import {useContext, useEffect, useState} from "react";
import {UserContext} from "../context/UserContext";
import {axiosApi} from "../lib/util";

export const UserList = () => {
    const [list, setList] = useState([]);
    const {
        setCurrentContact,
        currentContact
    } = useContext(UserContext);
    const getData = async () => {
        const response = await axiosApi.post("/getUserList");
        let {data} = response.data;
        setList(data);
    }

    useEffect(() => {
        getData();
    }, [])

    return <div>
        {
            list.map((item : any, index) => {
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
                    <div className="font-semibold text-sm">
                        {contacts_to_user.email}
                    </div>
                </div>
            })
        }
    </div>
}