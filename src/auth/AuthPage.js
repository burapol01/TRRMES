import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Routes, Route } from 'react-router-dom';
import AuthLayout from './AuthLayout';
import Login from './Login';
export default function AuthPage() {
    return (_jsx(Routes, { children: _jsxs(Route, { element: _jsx(AuthLayout, {}), children: [_jsx(Route, { path: 'login', element: _jsx(Login, {}) }), _jsx(Route, { index: true, element: _jsx(Login, {}) })] }) }));
}
