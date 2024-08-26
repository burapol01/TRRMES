import * as React from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import IconButton from "@mui/material/IconButton";
import MenuIcon from '@mui/icons-material/Menu';
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from '@mui/icons-material/Send';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DoneIcon from '@mui/icons-material/Done'; // เพิ่มไอคอน Done
import { Divider } from "@mui/material";
import { useSelector } from "react-redux";

interface ActionManageCellProps {
  disabled?: boolean;
  onViewClick?: (event: React.MouseEvent<HTMLLIElement>) => void;
  onEditClick?: (event: React.MouseEvent<HTMLLIElement>) => void;
  onDeleteClick?: (event: React.MouseEvent<HTMLLIElement>) => void;
  onSubmitClick?: (event: React.MouseEvent<HTMLLIElement>) => void;
  onApprovedClick?: (event: React.MouseEvent<HTMLLIElement>) => void;
  onCloseClick?: (event: React.MouseEvent<HTMLLIElement>) => void; // เพิ่ม onCloseClick
  onAcceptJobClick?: (event: React.MouseEvent<HTMLLIElement>) => void; // เพิ่ม onCloseClick
  onTimeSheetClick?: (event: React.MouseEvent<HTMLLIElement>) => void; // เพิ่ม onCloseClick
  onJobDoneClick?: (event: React.MouseEvent<HTMLLIElement>) => void; // เพิ่ม onCloseClick
}

export default function ActionManageCell(props: ActionManageCellProps) {
  const menuFuncList = useSelector((state: any) => state?.menuFuncList);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // สร้างเมนูไอเท็มเป็นอาร์เรย์
  const menuItems = [
    props.onViewClick && (
      <div  key="View" >   
      <MenuItem onClick={props.onViewClick}>
        <ListItemIcon>
          <ZoomInIcon />
        </ListItemIcon>
        View
      </MenuItem>
      <Divider key="view-divider" />
      </div>
    ),
    props.onEditClick && (
      <div  key="Edit"  >   
      <MenuItem onClick={props.onEditClick}>
        <ListItemIcon>
          <EditIcon />
        </ListItemIcon>
        Edit
      </MenuItem>
      <Divider key="edit-divider" />
      </div>
    ),
    props.onDeleteClick && (
      <div  key="Delete" >
      <MenuItem  onClick={props.onDeleteClick}>
        <ListItemIcon>
          <DeleteIcon />
        </ListItemIcon>
        Delete
      </MenuItem>
      <Divider key="delete-divider" />
      </div>
    ),
    props.onSubmitClick && (
      <div  key="Submit" >
      <MenuItem  onClick={props.onSubmitClick}>
        <ListItemIcon>
          <SendIcon />
        </ListItemIcon>
        Submit
      </MenuItem>
      <Divider key="submit-divider" />
      </div>
    ),
    props.onApprovedClick && (
      <div  key="Approved" >
      <MenuItem  onClick={props.onApprovedClick}>
        <ListItemIcon>
          <CheckCircleIcon />
        </ListItemIcon>
        Approved
      </MenuItem>
      <Divider key="approved-divider" />
      </div>
    ),
    props.onCloseClick && (
      <div key="Close">
      <MenuItem  onClick={props.onCloseClick}>
        <ListItemIcon>
          <DoneIcon /> {/* ใช้ไอคอน Done แทน */}
        </ListItemIcon>
        Close {/* เปลี่ยนข้อความให้สะท้อนถึงการจบงานสมบูรณ์ */}
      </MenuItem>
      <Divider key="close-divider" />
      </div>
    ),
    props.onAcceptJobClick && (
      <div key="Accept Job">
      <MenuItem  onClick={props.onAcceptJobClick}>
        <ListItemIcon>
          <DoneIcon /> {/* ใช้ไอคอน Done แทน */}
        </ListItemIcon>
        Accept Job {/* เปลี่ยนข้อความให้สะท้อนถึงการจบงานสมบูรณ์ */}
      </MenuItem>
      <Divider key="acceptjob-divider" />
      </div>
    ),
    props.onTimeSheetClick && (
      <div key="Time Sheet">
        <MenuItem onClick={props.onTimeSheetClick}>
          <ListItemIcon>
            <DoneIcon /> {/* ใช้ไอคอน Done แทน */}
          </ListItemIcon>
          Time Sheet {/* เปลี่ยนข้อความให้สะท้อนถึงการจบงานสมบูรณ์ */}
        </MenuItem>
        <Divider key="timesheet-divider" />
      </div>
    ),
    props.onJobDoneClick && (
      <div key="Job Done">
      <MenuItem key="Jobdone" onClick={props.onJobDoneClick}>
        <ListItemIcon>
          <DoneIcon /> {/* ใช้ไอคอน Done แทน */}
        </ListItemIcon>
        Job Done {/* เปลี่ยนข้อความให้สะท้อนถึงการจบงานสมบูรณ์ */}
      </MenuItem>
      <Divider key="jobdone-divider" />
      </div>
    ),
  ];

  
  const menuList = React.useMemo(() => {
    if (menuFuncList && menuFuncList.length > 0) {
      const newData: any = []
      Array.isArray(menuFuncList) && menuFuncList.forEach((item) => {
        const filterMenu = menuItems.filter((func: any) => func?.key === item?.func_name)
        const result = filterMenu.reduce((acc: any, current: any) => {
          return current;
        }, {});
        newData.push(result);
      });
      return newData;
    }
    if (menuFuncList && menuFuncList.length == 0) {
      const filterMenu = menuItems.filter((func: any) => func?.key == "View")
      return filterMenu
    }
  }, [menuFuncList]);

  return (
    <div>
      <IconButton
        aria-label="menu"
        id="hamburger-button"
        aria-controls={open ? 'hamburger-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleClick}
        disabled={props.disabled}
        sx={{ color: 'brown', '&:hover': { color: 'darkred' } }}
      >
        <MenuIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        id="hamburger-menu"
        open={open}
        onClose={handleClose}
        PaperProps={{
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
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {menuList} {/* กรองเฉพาะเมนูที่มีการใช้งาน */}
      </Menu>
    </div>
  );
}
