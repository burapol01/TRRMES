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
  onClick?: (name: string) => void;
  // onViewClick?: (event: React.MouseEvent<HTMLLIElement>) => void;
  // onEditClick?: (event: React.MouseEvent<HTMLLIElement>) => void;
  // onDeleteClick?: (event: React.MouseEvent<HTMLLIElement>) => void;
  // onSubmitClick?: (event: React.MouseEvent<HTMLLIElement>) => void;
  // onApprovedClick?: (event: React.MouseEvent<HTMLLIElement>) => void;
  // onCloseClick?: (event: React.MouseEvent<HTMLLIElement>) => void; // เพิ่ม onCloseClick
  // onAcceptJobClick?: (event: React.MouseEvent<HTMLLIElement>) => void; // เพิ่ม onCloseClick
  // onTimeSheetClick?: (event: React.MouseEvent<HTMLLIElement>) => void; // เพิ่ม onCloseClick
  // onJobDoneClick?: (event: React.MouseEvent<HTMLLIElement>) => void; // เพิ่ม onCloseClick
}

export default function ActionManageCell(props: ActionManageCellProps) {
  const menuFuncList = useSelector((state: any) => state?.menuFuncList);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  menuFuncList?.sort((a: any, b: any) => a.func_id.localeCompare(b.func_id));
 
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

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
        {menuFuncList.map((menuFunc: any, index: number) => (
          <MenuItem key={index} onClick={() => props.onClick && props.onClick(menuFunc.func_name)}>
            <ListItemIcon>
            {menuFunc.func_name == "View" && <ZoomInIcon />} 
            {menuFunc.func_name == "Edit" && <EditIcon />} 
            {menuFunc.func_name == "Delete" && <DeleteIcon />} 
            </ListItemIcon>
            {menuFunc.func_name}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}
