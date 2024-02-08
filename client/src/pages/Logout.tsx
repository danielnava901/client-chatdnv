import {Navigate, useNavigate} from "react-router-dom";
import {useContext, useEffect} from "react";
import {UserContext} from "../context/UserContext";

export const Logout = () => {
    const {logout} = useContext(UserContext);
    useEffect(() => {
        logout()
    }, [])
    return <Navigate to="/login" />
}