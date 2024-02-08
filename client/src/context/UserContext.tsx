import React, {createContext, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {axiosApi, axiosHome, removeToken, storeToken} from "../lib/util";


type UserType = {
    id: number,
    name: string,
    email: string
};


const userDefault : UserType = {
    id: -1,
    name: "Default DNV",
    email: "example@email.com"
}

interface UserValueType {
    user: UserType,
    setUser: () => void,
    logout: () => void,
    login: () => void
}

const defaultValue : UserValueType = {
    user: userDefault,
    setUser: () => {},
    logout: () => {},
    login: () => {}
};

export const UserContext = createContext<null|any>(defaultValue);

type Props = {
    children: React.ReactNode
}
export const UserProvider = ({children} : Props) => {
    let navigation = useNavigate();
    const [user, setUser] = useState<UserType>(userDefault);
    const getUserData = async () => {

    }

    const logout = () => {
        setUser(userDefault);
        navigation("/login");
        removeToken();
    }

    const login = async ({email, password} : {email: string, password: string}) => {
        // hacer login al server
        let response = await axiosHome.post("/login", {
            email, password
        });
        let {data} = response.data
        let userLogged = data;
        let {user, token} = userLogged;

        if(!!user) {
            setUser(user);
            storeToken(token);
            navigation("/dashboard");
        }else {
            logout();
        }
    }

    useEffect(() => {
        getUserData();
        console.log("Aqui deberia ir a buscar data");
    }, []);

    return <UserContext.Provider value={{
        user,
        setUser,
        logout,
        login
    }}>
        {children}
    </UserContext.Provider>
}