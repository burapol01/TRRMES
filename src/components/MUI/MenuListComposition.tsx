import * as React from 'react';
import Button from '@mui/material/Button';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import MenuItem from '@mui/material/MenuItem';
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from '@mui/icons-material/Send';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DoneIcon from '@mui/icons-material/Done';
import MenuIcon from '@mui/icons-material/Menu';
import { Divider, Fade, IconButton, ListItemIcon, Typography } from '@mui/material';
import { useSelector } from 'react-redux';

interface MenuListComposition {
    disabled?: boolean;
    onClick?: (name: string) => void;
    // onViewClick?: () => void;
    // onEditClick?: () => void;
    // onDeleteClick?: () => void;
    // onSubmitClick?: () => void;
    // onApprovedClick?: () => void;
    // onCloseClick?: () => void; // เพิ่ม onCloseClick
    // onAcceptJobClick?: () => void; // เพิ่ม onCloseClick
    // onTimeSheetClick?: () => void; // เพิ่ม onCloseClick
    // onJobDoneClick?: () => void; // เพิ่ม onCloseClick
}

export default function MenuListComposition(props: MenuListComposition) {
    const menuFuncList = useSelector((state: any) => state?.menuFuncList);
    const [open, setOpen] = React.useState(false);
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

    const handleToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event: Event | React.SyntheticEvent) => {
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
    //                 Approved
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


    return (
        <div>
            <IconButton
                aria-label="menu"
                id="hamburger-button"
                aria-controls={open ? 'hamburger-menu' : undefined}
                aria-expanded={open ? 'true' : undefined}
                aria-haspopup="true"
                onClick={handleToggle}
                disabled={props.disabled}
                sx={{ color: 'brown', '&:hover': { color: 'darkred' } }}
            >
                <MenuIcon />
            </IconButton>
            <Popper
                open={open}
                anchorEl={anchorEl}
                role={undefined}
                placement="bottom-start"
                transition
                disablePortal
                sx={{ zIndex: 1200 }}
            >
                {({ TransitionProps }) => (
                    <Fade {...TransitionProps} timeout={350}>
                        <Paper>
                            <ClickAwayListener onClickAway={handleClose}>
                                <div>
                                    {menuFuncList.map((menuFunc: any) => (
                                        <MenuItem onClick={() => props.onClick && props.onClick(menuFunc.func_name)}>
                                            <ListItemIcon>
                                               {menuFunc.func_name == "View" && <ZoomInIcon />} 
                                            </ListItemIcon>
                                            {menuFunc.func_name}
                                        </MenuItem>
                                    ))}
                                </div>
                            </ClickAwayListener>
                        </Paper>
                    </Fade>
                )}
            </Popper>
        </div>
    );
}
