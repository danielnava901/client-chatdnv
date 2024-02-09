import React, {useContext} from "react";
import {UserContext} from "../../context/UserContext";
import LeftSide from "./LeftSide";
import {RightSide} from "./RightSide";
import MainMenu from "../../components/MainMenu";
import {UserList} from "../../components/UsersList";
import {UserChat} from "../../components/UserChat";

export const Home = () => {
    const {user} = useContext(UserContext);

    return (
        <div className="w-screen h-screen flex">
            <MainMenu />
            <LeftSide>
                <div className="p-2">
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