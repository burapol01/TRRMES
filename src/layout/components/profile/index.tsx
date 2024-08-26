import React from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import ListItemIcon from "@mui/material/ListItemIcon";
import { useDispatch, useSelector } from "react-redux";
import { addCurrentUser } from "../../../../redux/actions/userAction";
import Avatar from "@mui/material/Avatar";
import PersonAdd from "@mui/icons-material/PersonAdd";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";

interface Profile {
  isOpen: boolean;
}

export default function Profile({ isOpen }: Profile) {
  const dispatch = useDispatch();
  const currentUser = useSelector((state: any) => state?.user?.user);
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const logout = () => {
    console.log(currentUser);
    dispatch(addCurrentUser(null));
    localStorage.removeItem(import.meta.env.VITE_APP_AUTH_LOCAL_STORAGE_KEY);
    handleClose();
  };
  return (
    <div
      className={`absolute duration-300 ${
        isOpen ? `right-0 sm:right-72` : `right-0 sm:right-24`
      }`}
    >
      {/* < div className={"hidden sm:ml-6 sm:block"}> */}
      <img
        className={
          " w-14 h-14 md:w-20 md:h-20 p-1 rounded-full ring-2 ring-gray-300 dark:ring-gray-500 cursor-pointer hover:scale-110"
        }
        onClick={handleClick}
        src={currentUser?.employee_image}
        alt="Bordered avatar"
      />
      {/* </div> */}
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&::before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 30,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={handleClose}>
          <Avatar /> Profile
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <Avatar /> My account
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <PersonAdd fontSize="small" />
          </ListItemIcon>
          Add another account
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <MenuItem onClick={logout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </div>
  );
}
