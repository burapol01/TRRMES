import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import { useDispatch, useSelector } from "react-redux";
import { addCurrentUser } from "../../../../redux/actions/userAction";
import Logout from "@mui/icons-material/Logout";
export default function Profile({ isOpen }) {
    const dispatch = useDispatch();
    const currentUser = useSelector((state) => state?.user?.user);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const logout = () => {
        // console.log(currentUser);
        dispatch(addCurrentUser(null));
        sessionStorage.removeItem(import.meta.env.VITE_APP_AUTH_LOCAL_STORAGE_KEY);
        handleClose();
    };
    // console.log(currentUser);
    return (_jsxs("div", { className: `absolute duration-300 ${isOpen ? `right-0 sm:right-72` : `right-0 sm:right-24`}`, children: [_jsxs("div", { className: "flex items-center gap-5", children: [_jsxs("div", { className: "flex flex-col", children: [_jsx("label", { className: "text-xl max-sm:text-lg font-bold", children: `${currentUser?.employee_fname_en} ${currentUser?.employee_lname_en}` }), _jsx("label", { className: "text-lg max-sm:text-md font-medium", children: `${currentUser?.role_name}` })] }), _jsx("img", { className: " w-14 h-14 md:w-20 md:h-20 p-1 rounded-full ring-2 ring-gray-300 dark:ring-gray-500 cursor-pointer hover:scale-110", onClick: handleClick, src: currentUser?.employee_image, alt: "Bordered avatar" })] }), _jsxs(Menu, { id: "basic-menu", anchorEl: anchorEl, open: open, onClose: handleClose, PaperProps: {
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
                }, transformOrigin: { horizontal: "right", vertical: "top" }, anchorOrigin: { horizontal: "right", vertical: "bottom" }, children: [_jsx(MenuItem, { onClick: handleClose, children: _jsxs("div", { className: "flex w-32 items-center gap-4", children: [_jsx("img", { className: " w-10 h-10 p-1 rounded-full ring-2 ring-gray-300 dark:ring-gray-500", onClick: handleClick, src: currentUser?.employee_image, alt: "Bordered avatar" }), " Profile"] }) }), _jsx(MenuItem, { onClick: logout, children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx(ListItemIcon, { children: _jsx(Logout, { fontSize: "large" }) }), "Logout"] }) })] })] }));
}
