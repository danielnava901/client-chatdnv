import React, {createContext, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {axiosHome, removeToken, storeToken} from "../lib/util";


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
    setCurrentContact: () => void
}

const defaultValue : UserContextValueType = {
    user: userDefault,
    setUser: () => {},
    logout: () => {},
    login: () => {},
    currentContact: null,
    setCurrentContact: () => {}
};

export const UserContext = createContext<null|any>(defaultValue);

type Props = {
    children: React.ReactNode
}
export const UserProvider = ({children} : Props) => {
    let navigation = useNavigate();

    const [user, setUser] = useState<UserType>(userDefault);
    const [currentContact, setCurrentContact] = useState<UserType | null>(null)

    const logout = () => {
        setUser(userDefault);
        navigation("/login");
        removeToken();
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

    return <UserContext.Provider value={{
        user,
        setUser,
        logout,
        login,
        currentContact,
        setCurrentContact
    }}>
        {children}
    </UserContext.Provider>
}