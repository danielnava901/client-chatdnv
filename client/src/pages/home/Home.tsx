import React, {useContext, useEffect} from "react";
import {UserContext, UserType} from "../../context/UserContext";
import LeftSide from "./LeftSide";
import {RightSide} from "./RightSide";
import MainMenu from "../../components/MainMenu";
import {UserList} from "../../components/UsersList";
import {UserChat} from "../../components/chat/UserChat";
import socket, {socketConnect} from "../../lib/socket";
import {getUserFromToken} from "../../lib/util";

export const Home = () => {
    const user : UserType | false = getUserFromToken();
    const {setContactsConnected} = useContext(UserContext);

    useEffect(() => {
        socketConnect(user);

        socket.emit("users_request");

        socket.on("users_request", (users) => {
            setContactsConnected(users);
        })

        socket.on("user_connected", (users) => {
            setContactsConnected(users);
        });

        socket.on("user_disconnected", (users) => {
            setContactsConnected(users);
        });

        return () => {
            socket.disconnect();
        }

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