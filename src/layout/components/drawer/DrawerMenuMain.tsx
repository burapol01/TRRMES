/* eslint-disable react-hooks/exhaustive-deps */
import * as React from "react";
import { useSelector } from "react-redux";
import { SlArrowDown } from "react-icons/sl";
import { SlArrowUp } from "react-icons/sl";
import SideberMenuItem from "./DrawerMenuItem";


interface DrawerMenuItems {
    isOpen: boolean;
    toggleDrawer: (event: React.KeyboardEvent | React.MouseEvent) => void
}


export default function DrawerMenuItems({ isOpen, toggleDrawer }: DrawerMenuItems) {
    const [openSubmenu, setOpenSubmenu] = React.useState(false);
    const menu = useSelector((state: any) => state?.user_menu?.user_menu);
    const [menuItems, setMenuItems] = React.useState([]);
    const [checkMenu, setCheckMenu] = React.useState<any>(null);


    const handleClickMenu = (data: any) => {
        setCheckMenu(data == checkMenu ? null : data);
        setOpenSubmenu(data == checkMenu ? false : true);
    };

    const setSubMenu = () => {
        const data = menu;
        const newData: any = [];
        const newDataSub: any = [];
        Array.isArray(data) &&
            data.forEach((el) => {
                if (el.menu_sub == 0) {
                    newData.push(el);
                }
                if (el.menu_sub != 0) {
                    newDataSub.push(el);
                }
            });
        const newMenu: any = [];
        Array.isArray(newData) &&
            newData.forEach((menu) => {
                const newSubMenu: any = [];
                Array.isArray(newDataSub) &&
                    newDataSub.forEach((submenu) => {
                        if (menu.menu_id == submenu.menu_sub) {
                            newSubMenu.push(submenu);
                        }
                    });
                newMenu.push({ ...menu, ...{ submenu: newSubMenu } });

            });
        setMenuItems(newMenu);
    };

    React.useEffect(() => {
        setSubMenu();
    }, [menu]);


    return (

        <div className='mt-5 flex flex-col gap-4 relative'>
            {menuItems?.map((menu: any, index) => menu?.submenu.length == 0 ? (
                <SideberMenuItem key={index} typeMenu="main" to={menu.menu_url} title={menu.menu_name} icon={menu.menu_icon} dataMenu={menu} index={index} toggleDrawer={toggleDrawer}/>
            ) : (
                <div key={index}>
                    <div key={index} className='flex items-center text-sm gap-3.5 font-medium p-2 hover:bg-blue-100 rounded-md' onClick={() => handleClickMenu(menu)}>
                        <div><i className={`${menu.menu_icon} fs-2`} /></div>
                        <div style={{ transitionDelay: `${index + 1}00ms` }}
                            className={`w-full flex items-center justify-between whitespace-pre duration-500 ${!isOpen && "opacity-0 translate-x-28 overflow-hidden"}`}
                        >
                            <label className="text-lg">
                                {menu.menu_name}
                            </label>
                            {openSubmenu && checkMenu.menu_id == menu.menu_id ? (
                                <SlArrowUp />
                            ) : (
                                <SlArrowDown />
                            )}
                        </div>
                    </div>
                    <div style={{ transitionDelay: `${index + 1}00ms` }} className={`ml-5 transition-all whitespace-pre duration-500 ease-in-out ${openSubmenu && checkMenu.menu_id === menu.menu_id ? "max-h-[1000px] opacity-100 translate-x-0" : "max-h-0 opacity-0 overflow-hidden translate-x-28"}`}>
                        {menu?.submenu?.map((subMenu: any, index: number) => (
                            <SideberMenuItem key={index} typeMenu="sub" to={subMenu.menu_url} title={subMenu.menu_name} icon={subMenu.menu_icon} dataMenu={subMenu} index={index} toggleDrawer={toggleDrawer}/>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
