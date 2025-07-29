import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const Auth = () => {
    const token = sessionStorage.getItem("authToken");
    return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default Auth;
