import {Navigate, Outlet} from "react-router-dom";
import {useContext} from "react";
import {UserContext} from "../context/UserContext";

const ProtectedRoute = () => {
    let {user} = useContext(UserContext);

    if (user.id < 0) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute