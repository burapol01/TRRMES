import { Stack } from '@mui/material';
import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { checkIsActive, checkIsMunuPermis, checkMenuPermisction, checkMenuPermisctionList } from '../sidebar/helpers/RouterHelpers';
import { useDispatch, useSelector } from 'react-redux';
import { Menu } from '../../../../types/user';
import { addRoleMenuFuncList, addRoleMenuFunction } from '../../../../redux/actions/roleAction';

interface SideberMenuItem {
    typeMenu: "main" | "sub";
    isOpen?: boolean;
    to: string;
    title: string;
    icon?: string;
    dataMenu?: Menu[];
    index: number;
    toggleDrawer: (event: React.KeyboardEvent | React.MouseEvent) => void
}
type Btnclick = {
    menu_url: string;
};
export default function SideberMenuItem({ typeMenu, isOpen, to, title, icon, dataMenu, index, toggleDrawer }: SideberMenuItem) {
    const dispatch = useDispatch();
    const { pathname } = useLocation();
    const user_menu_func = useSelector((state: any) => state?.user_menu_func);

    // is check Active
    const isActive = checkIsActive(pathname, `/${to}`);
    // is check permission memu
    const isMenuPermis = checkIsMunuPermis(pathname, to, dataMenu, user_menu_func);

    const navigate = useNavigate();
    const handleClick = (to: string) => {
        navigate(`/${to}`);
    };

    const setMenuFunction = async () => {
        if (isMenuPermis) {
            const menuList = await checkMenuPermisctionList(isMenuPermis);
            dispatch(await addRoleMenuFuncList(null));
            dispatch(addRoleMenuFuncList(menuList));
            const menu = await checkMenuPermisction(isMenuPermis)
            dispatch(addRoleMenuFunction(null));
            dispatch(addRoleMenuFunction(menu));
            //console.log(menu, 'isMenuPermis');

        }
    }

    React.useEffect(() => {
        setMenuFunction()
    }, [isMenuPermis]);

    if (typeMenu == "main") {
        return (
            <div
                onClick={(e) => {
                    handleClick(to)
                    toggleDrawer(e)
                }}
                className={`flex items-center text-sm gap-3.5 font-medium p-2 my-2 hover:bg-blue-100 hover:scale-110 rounded-md ${isActive && `bg-blue-200`}`}
            >
                <div><i className={`${icon} fs-2`} /></div>
                <label
                    style={{ transitionDelay: `${index + 1}00ms` }}
                    className={`whitespace-pre duration-500 text-lg ${!isOpen && "opacity-0 translate-x-28 overflow-hidden"}`}
                >
                    {title}
                </label>
            </div>
        )
    }
    if (typeMenu == "sub") {
        return (
            <div
                onClick={(e) => {
                    handleClick(to)
                    toggleDrawer(e)
                }}
                className={`flex items-center text-sm gap-3.5 font-medium p-2 my-2 hover:bg-blue-100 rounded-md ${isActive && `bg-blue-200`}`}
            >
                <div><i className={`${icon} fs-2`} /></div>
                <label className="text-lg">
                    {title}
                </label>
            </div>
        )
    }
}
