import {CreateButton} from "../components/CreateButton";
import React from "react";

export const Home = () => {
    return (
        <div className="w-screen h-screen flex flex-col justify-center items-center">
            <span>Home</span>
            <CreateButton />
        </div>
    )
}