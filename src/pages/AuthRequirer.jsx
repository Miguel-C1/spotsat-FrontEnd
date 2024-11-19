import React from "react";
import { useLocation, Navigate, Outlet } from "react-router-dom";
import  useAuth from "../hooks/hookAuthUser.ts";

const RequireAuth = () => {
    const { auth } = useAuth();
    const location = useLocation();

    return (
        auth.username && auth.token
            ? <Outlet />
            : <Navigate to="/login" state={{ from: location }} replace />
    );
}

export default RequireAuth;


