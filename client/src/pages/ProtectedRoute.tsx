import {Navigate, Outlet} from "react-router-dom";
import {useContext, useEffect} from "react";
import {getUserFromToken, isValidToken} from "../lib/util";
import {UserContext} from "../context/UserContext";
import socket, {socketConnect} from "../lib/socket";

const ProtectedRoute = () => {

    if(!isValidToken()) {
        return <Navigate to="/logout" />
    }

    return <Outlet />;
};

export default ProtectedRoute