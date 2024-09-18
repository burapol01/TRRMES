import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Stack } from '@mui/material';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { checkIsActive, checkIsMunuPermis, checkMenuPermisction, checkMenuPermisctionList } from './helpers/RouterHelpers';
import { useDispatch, useSelector } from 'react-redux';
import { addRoleMenuFuncList, addRoleMenuFunction } from '../../../../redux/actions/roleAction';
export default function SideberMenuItem({ typeMenu, isOpen, to, title, icon, dataMenu }) {
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
            // console.log(menuList, 'menuList');
            // console.log(menu, 'menu');
        }
    };
    React.useEffect(() => {
        setMenuFunction();
    }, [isMenuPermis]);
    if (typeMenu == "main") {
        return (_jsx("li", { className: `text-gray-300 text-sm flex items-center gap-x-4 cursor-pointer p-2 hover:bg-gray-200 rounded-md  mr-5 mt-2 ${isActive && `bg-blue-200`}
                }`, onClick: () => handleClick(to), children: _jsxs(Stack, { direction: "row", spacing: 1, justifyItems: "center", children: [_jsx("span", { className: "text-2xl block float-left", children: _jsx("i", { className: `${icon} fs-3` }) }), _jsx("div", { className: `${isOpen ? `block` : `hidden`} mt-1`, children: _jsx("label", { className: `w-40 text-base font-medium flex-1 absolute}`, children: title }) })] }) }));
    }
    if (typeMenu == "sub") {
        return (_jsx("li", { className: `text-gray-300 text-sm flex items-center gap-x-4 cursor-pointer p-1 px-10 hover:bg-gray-200 rounded-md mr-5 mt-2 ${isActive && `bg-blue-200`}
                    }`, onClick: () => handleClick(to), children: _jsxs(Stack, { direction: "row", spacing: 1, children: [_jsx("span", { className: "text-2xl block float-left", children: _jsx("i", { className: `${icon} fs-3` }) }), _jsx("div", { children: _jsx("label", { className: `w-40 text-base font-medium flex-1 absolute pt-1 sarabun-regular`, children: title }) })] }) }));
    }
}
