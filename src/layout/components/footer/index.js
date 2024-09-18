import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export default function Footer(props) {
    return (_jsx("footer", { className: `duration-300 ${props.isOpen ? `ml-0 sm:ml-72` : 'ml-0 sm:ml-20'}`, children: _jsxs("div", { className: "w-full p-2 sm:flex sm:items-center sm:justify-between", children: [_jsx("span", { className: "ml-10 sm:ml-0 text-sm text-gray-500 sm:text-center dark:text-gray-400", children: import.meta.env.VITE_VERSION }), _jsx("span", { children: import.meta.env.VITE_COPYRIGHT })] }) }));
}
