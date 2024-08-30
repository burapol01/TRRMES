import React from 'react';
import AnchorTemporaryDrawer from '../drawer';
import Profile from '../profile';
// import MenuItem from './MenuItem';
import IconButton from '@mui/material/IconButton';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import MenuListItem from './MenuListItem';

export type Anchor = 'top' | 'left' | 'bottom' | 'right';

interface NavBar {
  open: boolean
}
export default function NavBar({ open }: NavBar) {
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const toggleDrawer =
    (anchor: Anchor, open: boolean) =>
      (event: React.KeyboardEvent | React.MouseEvent) => {
        console.log('5555555555555555');
        
        if (
          event.type === 'keydown' &&
          ((event as React.KeyboardEvent).key === 'Tab' ||
            (event as React.KeyboardEvent).key === 'Shift')
        ) {
          return;
        }

        setState({ ...state, [anchor]: open });
      };

  return (
    <nav className={`w-full ${open ? `ml-0 sm:ml-72 md:ml-72 lg:ml-72` : `ml-0 sm:ml-20 md:ml-20 lg:ml-20`} border fixed top-0 py-10 select-none transition-all z-10 border-gray-200 bg-gray-200`}>
      <div className={"px-2 sm:px-6 lg:px-8"}>
        <div className={"relative flex h-5 items-center sm:justify-between"}>
          {/* <div className={"sm:flex sm:items-center sm:justify-between"}> */}
          <div className={"absolute inset-y-0 left-0 flex items-center sm:hidden"}>
            {/* <MenuListItem /> */}
            <AnchorTemporaryDrawer />
          </div>
          <div className={"absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0"}>
            <div className={"hidden sm:ml-6 sm:block"}>
              {/* <MenuItem /> */}
            </div>
          </div>
          <Profile isOpen={open} />
        </div>
      </div>
    </nav>
  )
}
