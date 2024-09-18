import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import { useSelector } from "react-redux";
export default function ActionManageCell(props) {
    const menuFuncList = useSelector((state) => state?.menuFuncList);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    menuFuncList?.sort((a, b) => String(a.menu_func_sequence).localeCompare(String(b.menu_func_sequence)));
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    return (_jsxs("div", { children: [_jsxs(IconButton, { "aria-label": "menu", id: "hamburger-button", "aria-controls": open ? 'hamburger-menu' : undefined, "aria-expanded": open ? 'true' : undefined, "aria-haspopup": "true", onClick: handleClick, disabled: props.disabled, sx: { color: 'brown', '&:hover': { color: 'darkred' } }, children: [_jsx("i", { className: "fas fa-bars" }), " "] }), _jsx(Menu, { anchorEl: anchorEl, id: "hamburger-menu", open: open, onClose: handleClose, PaperProps: {
                    elevation: 3,
                    sx: {
                        overflow: "visible",
                        filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                        mt: 1.5,
                        "&::before": {
                            content: '""',
                            display: "block",
                            position: "absolute",
                            top: 0,
                            right: 12,
                            width: 10,
                            height: 10,
                            bgcolor: "background.paper",
                            transform: "translateY(-50%) rotate(45deg)",
                            zIndex: 0,
                        },
                    },
                }, transformOrigin: { horizontal: "right", vertical: "top" }, anchorOrigin: { horizontal: "right", vertical: "bottom" }, children: menuFuncList.map((menuFunc, index) => {
                    let shouldRender = false;
                    // ปุ่ม "View" จะแสดงในทุกสถานะ
                    if (menuFunc.func_name === "View") {
                        shouldRender = true;
                    }
                    // เงื่อนไขการแสดงผลปุ่มตาม reqStatus
                    if ((props.reqStatus === "Draft" && ["Edit", "Delete", "Submit"].includes(menuFunc.func_name)) ||
                        (props.reqStatus === "Job Done" && menuFunc.func_name === "Close")) {
                        shouldRender = true;
                    }
                    switch (props.reqStatus) {
                        case "Submit":
                            if (menuFunc.func_name === "Approve" &&
                                props.appUser &&
                                props.appUser !== "" &&
                                props.currentUser === props.appUser) {
                                shouldRender = true;
                            }
                            break;
                        case "Approved":
                            if (menuFunc.func_name === "Accept Job") {
                                shouldRender = true;
                            }
                            break;
                        case "Start":
                        case "On process":
                            if (menuFunc.func_name === "Time Sheet" ||
                                (props.reqStatus === "On process" &&
                                    menuFunc.func_name === "Job Done")) {
                                shouldRender = true;
                            }
                            break;
                        default:
                            break;
                    }
                    if (shouldRender) {
                        return (_jsx(MenuItem, { onClick: () => props.onClick && props.onClick(menuFunc.func_name), children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { children: _jsx("i", { className: `${menuFunc.menu_func_icon}` }) }), " ", menuFunc.display_name] }) }, index));
                    }
                    return null;
                }) })] }));
}
