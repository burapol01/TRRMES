import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { checkIsActive, checkIsMunuPermis, checkMenuPermisction, checkMenuPermisctionList } from './helpers/RouterHelpers';
import { useDispatch, useSelector } from 'react-redux';
import { addRoleMenuFuncList, addRoleMenuFunction } from '../../../../redux/actions/roleAction';
export default function SideberMenuItem({ typeMenu, isOpen, to, title, icon, dataMenu, index }) {
    const dispatch = useDispatch();
    const { pathname } = useLocation();
    const user_menu_func = useSelector((state) => state?.user_menu_func);
    // is check Active
    const isActive = checkIsActive(pathname, `/${to}`);
    // is check permission memu
    const isMenuPermis = checkIsMunuPermis(pathname, to, dataMenu, user_menu_func);
    const navigate = useNavigate();
    const handleClick = (to) => {
        navigate(`/${to}`);
    };
    const setMenuFunction = async () => {
        if (isMenuPermis) {
            const menuList = await checkMenuPermisctionList(isMenuPermis);
            dispatch(await addRoleMenuFuncList(null));
            dispatch(addRoleMenuFuncList(menuList));
            const menu = await checkMenuPermisction(isMenuPermis);
            dispatch(addRoleMenuFunction(null));
            dispatch(addRoleMenuFunction(menu));
            // console.log(menu,'isMenuPermis');
        }
    };
    React.useEffect(() => {
        setMenuFunction();
    }, [isMenuPermis]);
    if (typeMenu == "main") {
        return (_jsxs("div", { onClick: () => handleClick(to), className: `flex items-center text-sm gap-3.5 font-medium p-2 my-2 hover:bg-blue-100 hover:scale-110 rounded-md ${isActive && `bg-blue-200`}`, children: [_jsx("div", { children: _jsx("i", { className: `${icon} fs-2` }) }), _jsx("label", { style: { transitionDelay: `${index + 1}00ms` }, className: `whitespace-pre duration-500 text-lg ${!isOpen && "opacity-0 translate-x-28 overflow-hidden"}`, children: title })] }));
    }
    if (typeMenu == "sub") {
        return (_jsxs("div", { onClick: () => handleClick(to), className: `flex items-center text-sm gap-3.5 font-medium p-2 my-2 hover:bg-blue-100 rounded-md ${isActive && `bg-blue-200`}`, children: [_jsx("div", { children: _jsx("i", { className: `${icon} fs-2` }) }), _jsx("label", { className: "text-lg", children: title })] }));
    }
}
