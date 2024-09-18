import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Route, Routes } from 'react-router-dom';
import { Error500 } from './components/Error500';
import { Error404 } from './components/Error404';
import ErrorsLayout from './ErrorsLayout';
const ErrorsPage = () => (_jsx(Routes, { children: _jsxs(Route, { element: _jsx(ErrorsLayout, {}), children: [_jsx(Route, { path: '404', element: _jsx(Error404, {}) }), _jsx(Route, { path: '500', element: _jsx(Error500, {}) }), _jsx(Route, { index: true, element: _jsx(Error404, {}) })] }) }));
export { ErrorsPage };
