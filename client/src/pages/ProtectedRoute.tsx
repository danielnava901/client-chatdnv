import {Navigate, Outlet} from "react-router-dom";
import {useContext, useEffect} from "react";
import {getUserFromToken, isValidToken} from "../lib/util";
import {UserContext} from "../context/UserContext";

const ProtectedRoute = () => {
    const {setUser} = useContext(UserContext);

    useEffect(() => {
        let userFromToken = getUserFromToken();
        if(userFromToken) {
            setUser(userFromToken);
        }
    }, [])

    if(!isValidToken()) {
        return <Navigate to="/logout" />
    }

    return <Outlet />;
};

export default ProtectedRoute