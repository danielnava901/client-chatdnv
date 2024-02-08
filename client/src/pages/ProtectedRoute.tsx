import {Navigate, Outlet, useNavigate} from "react-router-dom";
import {useContext, useEffect, useState} from "react";
import {UserContext} from "../context/UserContext";
import {axiosApi, isValidToken} from "../lib/util";

const ProtectedRoute = () => {
    if(!isValidToken()) {
        return <Navigate to="/logout" />
    }
    return <Outlet />;
};

export default ProtectedRoute