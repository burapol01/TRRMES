import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Routes, Route, Navigate } from 'react-router-dom';
import MasterLayout from '../layout/MasterLayout';
import Example from '../app/Example';
import Home from './../app/Home';
import ServiceRequest from '../app/service_request';
import ServiceTimeSheet from '../app/service_time_sheet';
import User from '../app/master/user';
export default function PrivateRoutes() {
    // const [urlName, setUrlName] = React.useState<string>("0")
    // const getUrl = async () => {
    //     if (!sessionStorage) {
    //         return
    //     }
    //     const lsValue = await sessionStorage.getItem(import.meta.env.VITE_APP_AUTH_LOCAL_STORAGE_KEY)
    //     if (!lsValue) {
    //         return
    //     }
    //     try {
    //         const auth = await JSON.parse(lsValue)
    //         if (auth) {
    //             const data = auth?.data?.auth_role_menu[0]
    //             if (data?.menu_url) {
    //                 setUrlName(data?.menu_url)
    //             } else {
    //                 setUrlName("Home")
    //             }
    //         }
    //     } catch (error) {
    //         console.error('AUTH LOCAL STORAGE PARSE ERROR', error)
    //     }
    // }
    // React.useEffect(() => {
    //     getUrl()
    // }, [])
    // React.useEffect(() => {
    //     //console.log(urlName, '5555555555555555555');
    // }, [urlName])
    return (_jsx(Routes, { children: _jsxs(Route, { element: _jsx(MasterLayout, {}), children: [_jsx(Route, { path: 'auth/*', element: _jsx(Navigate, { to: `/home` }) }), _jsx(Route, { path: 'home', element: _jsx(Home, {}) }), _jsx(Route, { path: 'service_request', element: _jsx(ServiceRequest, {}) }), _jsx(Route, { path: 'service_time_sheet', element: _jsx(ServiceTimeSheet, {}) }), _jsx(Route, { path: 'user', element: _jsx(User, {}) }), _jsx(Route, { path: "apps/*", element: _jsx(Example, {}) })] }) }));
}
