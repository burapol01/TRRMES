import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import MenuItem from '@mui/material/MenuItem';
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import MenuIcon from '@mui/icons-material/Menu';
import { Fade, IconButton, ListItemIcon } from '@mui/material';
import { useSelector } from 'react-redux';
export default function MenuListComposition(props) {
    const menuFuncList = useSelector((state) => state?.menuFuncList);
    const [open, setOpen] = React.useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const handleToggle = (event) => {
        setAnchorEl(event.currentTarget);
        setOpen((prevOpen) => !prevOpen);
    };
    const handleClose = (event) => {
        setOpen(false);
    };
    // สร้างเมนูไอเท็มเป็นอาร์เรย์
    // const menuItems = [
    //     props.onViewClick && (
    //         <div key="View" >
    //             <MenuItem onClick={props.onViewClick}>
    //                 <ListItemIcon>
    //                     <ZoomInIcon />
    //                 </ListItemIcon>
    //                 View
    //             </MenuItem>
    //             <Divider key="view-divider" />
    //         </div>
    //     ),
    //     props.onEditClick && (
    //         <div key="Edit"  >
    //             <MenuItem onClick={props.onEditClick}>
    //                 <ListItemIcon>
    //                     <EditIcon />
    //                 </ListItemIcon>
    //                 Edit
    //             </MenuItem>
    //             <Divider key="edit-divider" />
    //         </div>
    //     ),
    //     props.onDeleteClick && (
    //         <div key="Delete" >
    //             <MenuItem onClick={props.onDeleteClick}>
    //                 <ListItemIcon>
    //                     <DeleteIcon />
    //                 </ListItemIcon>
    //                 Delete
    //             </MenuItem>
    //             <Divider key="delete-divider" />
    //         </div>
    //     ),
    //     props.onSubmitClick && (
    //         <div key="Submit" >
    //             <MenuItem onClick={props.onSubmitClick}>
    //                 <ListItemIcon>
    //                     <SendIcon />
    //                 </ListItemIcon>
    //                 Submit
    //             </MenuItem>
    //             <Divider key="submit-divider" />
    //         </div>
    //     ),
    //     props.onApprovedClick && (
    //         <div key="Approved" >
    //             <MenuItem onClick={props.onApprovedClick}>
    //                 <ListItemIcon>
    //                     <CheckCircleIcon />
    //                 </ListItemIcon>
    //                Approve
    //             </MenuItem>
    //             <Divider key="approved-divider" />
    //         </div>
    //     ),
    //     props.onCloseClick && (
    //         <div key="Close">
    //             <MenuItem onClick={props.onCloseClick}>
    //                 <ListItemIcon>
    //                     <DoneIcon /> {/* ใช้ไอคอน Done แทน */}
    //                 </ListItemIcon>
    //                 Close {/* เปลี่ยนข้อความให้สะท้อนถึงการจบงานสมบูรณ์ */}
    //             </MenuItem>
    //             <Divider key="close-divider" />
    //         </div>
    //     ),
    //     props.onAcceptJobClick && (
    //         <div key="Accept Job">
    //             <MenuItem onClick={props.onAcceptJobClick}>
    //                 <ListItemIcon>
    //                     <DoneIcon /> {/* ใช้ไอคอน Done แทน */}
    //                 </ListItemIcon>
    //                 Accept Job {/* เปลี่ยนข้อความให้สะท้อนถึงการจบงานสมบูรณ์ */}
    //             </MenuItem>
    //             <Divider key="acceptjob-divider" />
    //         </div>
    //     ),
    //     props.onTimeSheetClick && (
    //         <div key="Time Sheet">
    //             <MenuItem onClick={props.onTimeSheetClick}>
    //                 <ListItemIcon>
    //                     <DoneIcon /> {/* ใช้ไอคอน Done แทน */}
    //                 </ListItemIcon>
    //                 Time Sheet {/* เปลี่ยนข้อความให้สะท้อนถึงการจบงานสมบูรณ์ */}
    //             </MenuItem>
    //             <Divider key="timesheet-divider" />
    //         </div>
    //     ),
    //     props.onJobDoneClick && (
    //         <div key="Job Done">
    //             <MenuItem key="Jobdone" onClick={props.onJobDoneClick}>
    //                 <ListItemIcon>
    //                     <DoneIcon /> {/* ใช้ไอคอน Done แทน */}
    //                 </ListItemIcon>
    //                 Job Done {/* เปลี่ยนข้อความให้สะท้อนถึงการจบงานสมบูรณ์ */}
    //             </MenuItem>
    //             <Divider key="jobdone-divider" />
    //         </div>
    //     ),
    // ];
    // const menuList = React.useMemo(() => {
    //     if (menuFuncList && menuFuncList.length > 0) {
    //         const newData: any = []
    //         Array.isArray(menuFuncList) && menuFuncList.forEach((item) => {
    //             const filterMenu = menuItems.filter((func: any) => func?.key === item?.func_name)
    //             const result = filterMenu.reduce((acc: any, current: any) => {
    //                 return current;
    //             }, {});
    //             newData.push(result);
    //         });
    //         return newData;
    //     }
    //     if (menuFuncList && menuFuncList.length == 0) {
    //         const filterMenu = menuItems.filter((func: any) => func?.key == "View")
    //         return filterMenu
    //     }
    // }, [menuFuncList]);
    return (_jsxs("div", { children: [_jsx(IconButton, { "aria-label": "menu", id: "hamburger-button", "aria-controls": open ? 'hamburger-menu' : undefined, "aria-expanded": open ? 'true' : undefined, "aria-haspopup": "true", onClick: handleToggle, disabled: props.disabled, sx: { color: 'brown', '&:hover': { color: 'darkred' } }, children: _jsx(MenuIcon, {}) }), _jsx(Popper, { open: open, anchorEl: anchorEl, role: undefined, placement: "bottom-start", transition: true, disablePortal: true, sx: { zIndex: 1200 }, children: ({ TransitionProps }) => (_jsx(Fade, { ...TransitionProps, timeout: 350, children: _jsx(Paper, { children: _jsx(ClickAwayListener, { onClickAway: handleClose, children: _jsx("div", { children: menuFuncList.map((menuFunc) => (_jsxs(MenuItem, { onClick: () => props.onClick && props.onClick(menuFunc.func_name), children: [_jsx(ListItemIcon, { children: menuFunc.func_name == "View" && _jsx(ZoomInIcon, {}) }), menuFunc.func_name] }))) }) }) }) })) })] }));
}
