import { Stack } from '@mui/material';
import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { checkIsActive, checkIsMunuPermis, checkMenuPermisction, checkMenuPermisctionList } from './helpers/RouterHelpers';
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
}
type Btnclick = {
    menu_url: string;
};
export default function SideberMenuItem({ typeMenu, isOpen, to, title, icon, dataMenu }: SideberMenuItem) {
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
            // console.log(menuList, 'menuList');
            // console.log(menu, 'menu');
        }
    }

    React.useEffect(() => {
        setMenuFunction()
    }, [isMenuPermis]);

    if (typeMenu == "main") {
        return (
            <li
                className={`text-gray-300 text-sm flex items-center gap-x-4 cursor-pointer p-2 hover:bg-gray-200 rounded-md  mr-5 mt-2 ${isActive && `bg-blue-200`}
                }`}
                onClick={() => handleClick(to)}
            >
                <Stack direction={"row"} spacing={1}>
                    <span className="text-2xl block float-left">
                        {/* {el.icon} */}
                        <i className={`${icon} fs-3`}></i>
                    </span>
                    <div className={`${isOpen ? `block`:`hidden`}`}>
                        <label
                            className={`w-40 text-base font-medium flex-1 absolute pt-1}`}
                        >
                            {title}
                        </label>
                    </div>
                </Stack>
            </li>
        )
    }
    if (typeMenu == "sub") {
        return (
            <li
                className={`text-gray-300 text-sm flex items-center gap-x-4 cursor-pointer p-1 px-10 hover:bg-gray-200 rounded-md mr-5 mt-2 ${isActive && `bg-blue-200`}
                    }`}
                onClick={() => handleClick(to)}
            >
                <Stack direction={"row"} spacing={1}>
                    <span className="text-2xl block float-left">
                        {/* {el.icon} */}
                        <i className={`${icon} fs-3`}></i>
                    </span>
                    <div>
                        <label
                            className={`w-40 text-base font-medium flex-1 absolute pt-1 sarabun-regular`}
                        >
                            {title}
                        </label>
                    </div>
                </Stack>
            </li>
        )
    }
}
