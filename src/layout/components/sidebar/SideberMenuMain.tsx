/* eslint-disable react-hooks/exhaustive-deps */
import * as React from "react";
import { useSelector } from "react-redux";
import { Stack } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import SideberMenuItem from "./SideberMenuItem";

interface SideberMenuMain {
  isOpen: boolean;
}


export default function SideberMenuMain({ isOpen }: SideberMenuMain) {
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
    <div className="">
      <ul className="ml-[-10px]">
        {menuItems.map((el: any, index) => (
          <div key={index}>
            {el?.submenu.length == 0 ? (
              <SideberMenuItem key={index} typeMenu="main" isOpen={isOpen} to={el.menu_url} title={el.menu_name} icon={el.menu_icon} dataMenu={el} />
            ) : (
              <>
                <li
                  className={`text-gray-300 text-sm flex items-center gap-x-4 cursor-pointer p-2 hover:bg-gray-200 rounded-md  mr-5 mt-2`}
                  onClick={() => handleClickMenu(el)}
                >
                  <Stack direction={"row"} spacing={18}>
                    <div>
                      <Stack direction={"row"} spacing={1}>
                        <span className="text-2xl block float-left">
                          {/* {el.icon} */}
                          <i className={`${el.menu_icon} fs-3`}></i>
                        </span>
                        <div className={`${isOpen ? `block` : `hidden`}`}>
                          <label
                            className={`w-40 text-base font-medium flex-1 absolute pt-1 sarabun-regular`}
                          >
                            {el.menu_name}
                          </label>
                        </div>
                      </Stack>
                    </div>
                    <div className={`${isOpen ? `block` : `hidden`} pt-1`}>
                      {openSubmenu && checkMenu.menu_id == el.menu_id ? (
                        <ExpandLessIcon />
                      ) : (
                        <ExpandMoreIcon />
                      )}
                    </div>
                  </Stack>
                </li>
                <div className={`${isOpen ? `block` : `hidden`}`}>
                  {/* {openSubmenu && checkMenu.menu_id == el.menu_id ? ( */}
                  <div className={`${openSubmenu && checkMenu.menu_id == el.menu_id ? '' : 'hidden'}`}>
                    {el?.submenu.map((subMenu: any, index: number) => (

                      <SideberMenuItem key={index} typeMenu="sub" to={subMenu.menu_url} title={subMenu.menu_name} icon={subMenu.menu_icon} dataMenu={subMenu} />
                    ))}
                  </div>
                  {/* ) : (
                    <></>
                  )} */}
                </div>
              </>
            )}
          </div>
        ))}
      </ul>
    </div>
  );
}
