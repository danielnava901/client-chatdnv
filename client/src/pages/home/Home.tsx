import React, {useContext, useEffect} from "react";
import {UserContext, UserType} from "../../context/UserContext";
import LeftSide from "./LeftSide";
import {RightSide} from "./RightSide";
import MainMenu from "../../components/MainMenu";
import {UserList} from "../../components/UsersList";
import {UserChat} from "../../components/UserChat";
import socket, {destroySocket, socketConnect} from "../../lib/socket";
import {getUserFromToken} from "../../lib/util";

export const Home = () => {
    const user : UserType | false = getUserFromToken();
    const {setContactsConnected} = useContext(UserContext);

    socketConnect(user, {
        onUsersConnect: (users : any) => {
            console.log("callback userconnect", users);
            setContactsConnected(users);
        },
        onPrivateMessage: ({message, from} : {message: any, from: any}) => {
            console.log("callback private msg", message, from);
        }
    });

    useEffect(() => {
        //return () => destroySocket()
    }, [])

    if(!user) return <div>Cargando</div>

    return (
        <div className="w-screen h-screen flex">
            <MainMenu />
            <LeftSide>
                <div className="p-2 h-[50px] border-b">
                    <span>Hola, {user.email}!</span>
                </div>
                <UserList />
            </LeftSide>
            <RightSide>
                <UserChat />
            </RightSide>
        </div>
    )
}