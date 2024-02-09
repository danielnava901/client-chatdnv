import React, {createContext, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {axiosHome, removeToken, storeToken} from "../lib/util";
import {destroySocket, socketConnect} from "../lib/socket";


export type UserType = {
    id: number,
    name?: string,
    email: string
};


const userDefault : UserType = {
    id: -1,
    email: "example@email.com"
}

interface UserContextValueType {
    user: UserType,
    setUser: () => void,
    logout: () => void,
    login: () => void,
    currentContact: UserType|null,
    setCurrentContact: () => void,
    contactsConnected: []
}

const defaultValue : UserContextValueType = {
    user: userDefault,
    setUser: () => {},
    logout: () => {},
    login: () => {},
    currentContact: null,
    setCurrentContact: () => {},
    contactsConnected: []
};

export const UserContext = createContext<null|any>(defaultValue);

type Props = {
    children: React.ReactNode
}
export const UserProvider = ({children} : Props) => {
    let navigation = useNavigate();

    const [user, setUser] = useState<UserType>(userDefault);
    const [currentContact, setCurrentContact] = useState<UserType | null>(null)
    const [_contactsConnected, _setContactsConnected] = useState([]);

    const logout = () => {
        setUser(userDefault);
        navigation("/login");
        removeToken();
        destroySocket();
    }

    const login = async ({email, password} : {email: string, password: string}) => {
        // hacer login al server
        let response = await axiosHome.post("/auth/login", {
            email, password
        });

        let {code, data, error} = response.data
        if(code === 200) {
            let {user, token} = data;
            setUser(user);
            storeToken(token);
            navigation("/dashboard");
        }else {
            alert(error);
            logout();
        }
    }

    const setContactsConnected = (contacts : []) => {
        localStorage.setItem("contacts", JSON.stringify(contacts));
        _setContactsConnected(contacts);
    }

    const contactsConnected = () => {
        return JSON.parse(localStorage.getItem("contacts") || "[]");
    }

    return <UserContext.Provider value={{
        user,
        setUser,
        logout,
        login,
        currentContact,
        setCurrentContact,
        contactsConnected,
        setContactsConnected
    }}>
        {children}
    </UserContext.Provider>
}