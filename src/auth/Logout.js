import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect } from 'react';
import { Navigate, Routes } from 'react-router-dom';
import { useSelector } from "react-redux";
export function Logout() {
    const currentuser = useSelector((state) => state?.user);
    useEffect(() => {
        document.location.reload();
    }, [currentuser]);
    return (_jsx(Routes, { children: _jsx(Navigate, { to: '/auth' }) }));
}
