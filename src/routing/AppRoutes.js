import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import React from "react";
import App from "../App";
import { Routes, BrowserRouter, Route, Navigate } from "react-router-dom";
import PrivateRoutes from "./PrivateRoutes";
import { useSelector } from "react-redux";
/**
 * Base URL of the website.
 *
 * @see https://facebook.github.io/create-react-app/docs/using-the-public-folder
 */
const { BASE_URL } = import.meta.env;
import { ErrorsPage } from "../errors";
import { Logout } from "../auth/Logout";
import AuthPage from "../auth/AuthPage";
const AppRoutes = () => {
    const [checkLogin, setCheckLogin] = React.useState(true);
    const currentuser = useSelector((state) => state?.user?.user);
    React.useEffect(() => {
        if (currentuser) {
            setCheckLogin(currentuser);
        }
        else {
            setCheckLogin(false);
        }
    }, [currentuser]);
    //console.log(currentuser,'55555555555');
    return (_jsx(BrowserRouter, { basename: BASE_URL, children: _jsx(Routes, { children: _jsxs(Route, { element: _jsx(App, {}), children: [_jsx(Route, { path: "error/*", element: _jsx(ErrorsPage, {}) }), _jsx(Route, { path: "logout", element: _jsx(Logout, {}) }), checkLogin ? (_jsxs(_Fragment, { children: [_jsx(Route, { path: "/*", element: _jsx(PrivateRoutes, {}) }), _jsx(Route, { index: true, element: _jsx(Navigate, { to: "/home" }) })] })) : (_jsxs(_Fragment, { children: [_jsx(Route, { path: "auth/*", element: _jsx(AuthPage, {}) }), _jsx(Route, { path: "*", element: _jsx(Navigate, { to: "/auth" }) })] }))] }) }) }));
};
export default AppRoutes;
