import {CreateButton} from "../components/CreateButton";
import React, {useContext} from "react";
import {UserContext} from "../context/UserContext";

export const Home = () => {
    const {user} = useContext(UserContext);

    return (
        <div className="w-screen h-screen flex flex-col justify-center items-center">
            <span>Hola, {user.name}!</span>
            <CreateButton />
        </div>
    )
}