import * as React from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import { useSelector } from "react-redux";

interface ActionManageCellProps {
  disabled?: boolean;
  onClick?: (name: string) => void;
  reqStatus?: string;
  appUser?: string;
  currentUser?: string;
  roleName?: string;
  Defauft?: boolean; // เพิ่มค่า Defauft
}

export default function ActionManageCell(props: ActionManageCellProps) {
  const menuFuncList = useSelector((state: any) => state?.menuFuncList);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  menuFuncList?.sort((a: any, b: any) => String(a.menu_func_sequence).localeCompare(String(b.menu_func_sequence)));

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
        <i className="fas fa-bars"></i> {/* ใช้ไอคอนของคุณ */}
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
        {menuFuncList && menuFuncList.map((menuFunc: any, index: number) => { // {menuFuncList.map((menuFunc: any, index: number) => {
          let shouldRender = false;

          // ถ้าส่ง Defauft = true มาให้แสดงเฉพาะ func_name ที่ตรงเงื่อนไขนี้
          if (props.Defauft) {
            if (["View", "Edit", "Delete"].includes(menuFunc.func_name)) {
              shouldRender = true;
            }
          } else {
            // ปุ่ม "View" จะแสดงในทุกสถานะ
            if (menuFunc.func_name === "View") {
              shouldRender = true;
            }

            // เงื่อนไขการแสดงผลปุ่มตาม reqStatus
            if (
              (props.reqStatus === "Draft" && ["Edit", "Delete", "Submit"].includes(menuFunc.func_name)) ||
              (props.reqStatus === "Job Done" && menuFunc.func_name === "Close")
            ) {
              shouldRender = true;
            }

            switch (props.reqStatus) {
              case "Submit":
                if (
                  menuFunc.func_name === "Approve" &&
                  props.appUser &&
                  props.appUser !== "" &&
                  props.currentUser === props.appUser
                ) {
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
                if (
                  menuFunc.func_name === "Time Sheet" ||
                  (props.reqStatus === "On process" && menuFunc.func_name === "Job Done")
                ) {
                  shouldRender = true;
                }

                // เพิ่มเงื่อนไขสำหรับ "On process"
                if (props.reqStatus === "On process" && menuFunc.func_name === "Pending") {
                  shouldRender = true;
                }
                break;
                case "Pending":
                  if (menuFunc.func_name === "Unpending") {
                    shouldRender = true;
                  }
                  break;

              default:
                break;
            }
          }

          if (shouldRender) {
            return (
              <MenuItem key={index} onClick={() => props.onClick && props.onClick(menuFunc.func_name)}>
                <div className="flex items-center gap-2">
                  <div><i className={`${menuFunc.menu_func_icon}`}></i></div> {/* ใช้ไอคอนจาก menuFunc.menu_func_icon */}
                  {menuFunc.display_name}
                </div>
              </MenuItem>
            );
          }

          return null;
        })}
      </Menu>
    </div>
  );
}


//Back Up 2024/10/22
// import * as React from "react";
// import Menu from "@mui/material/Menu";
// import MenuItem from "@mui/material/MenuItem";
// import IconButton from "@mui/material/IconButton";
// import { useSelector } from "react-redux";

// interface ActionManageCellProps {
//   disabled?: boolean;
//   onClick?: (name: string) => void;
//   reqStatus?: string;
//   appUser?: string;
//   currentUser?: string;
//   roleName?: string;
// }

// export default function ActionManageCell(props: ActionManageCellProps) {
//   const menuFuncList = useSelector((state: any) => state?.menuFuncList);
//   const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
//   const open = Boolean(anchorEl);

//   menuFuncList?.sort((a: any, b: any) => String(a.menu_func_sequence).localeCompare(String(b.menu_func_sequence)));

//   const handleClick = (event: React.MouseEvent<HTMLElement>) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleClose = () => {
//     setAnchorEl(null);
//   };

//   return (
//     <div>
//       <IconButton
//         aria-label="menu"
//         id="hamburger-button"
//         aria-controls={open ? 'hamburger-menu' : undefined}
//         aria-expanded={open ? 'true' : undefined}
//         aria-haspopup="true"
//         onClick={handleClick}
//         disabled={props.disabled}
//         sx={{ color: 'brown', '&:hover': { color: 'darkred' } }}
//       >
//         <i className="fas fa-bars"></i> {/* ใช้ไอคอนของคุณ */}
//       </IconButton>
//       <Menu
//         anchorEl={anchorEl}
//         id="hamburger-menu"
//         open={open}
//         onClose={handleClose}
//         PaperProps={{
//           elevation: 3,
//           sx: {
//             overflow: "visible",
//             filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
//             mt: 1.5,
//             "&::before": {
//               content: '""',
//               display: "block",
//               position: "absolute",
//               top: 0,
//               right: 12,
//               width: 10,
//               height: 10,
//               bgcolor: "background.paper",
//               transform: "translateY(-50%) rotate(45deg)",
//               zIndex: 0,
//             },
//           },
//         }}
//         transformOrigin={{ horizontal: "right", vertical: "top" }}
//         anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
//       >
//         {menuFuncList.map((menuFunc: any, index: number) => {
//           let shouldRender = false;

//           // ปุ่ม "View" จะแสดงในทุกสถานะ
//           if (menuFunc.func_name === "View") {
//             shouldRender = true;
//           }

//           // เงื่อนไขการแสดงผลปุ่มตาม reqStatus
//           if (
//             (props.reqStatus === "Draft" && ["Edit", "Delete", "Submit"].includes(menuFunc.func_name)) ||
//             (props.reqStatus === "Job Done" && menuFunc.func_name === "Close")
//           ) {
//             shouldRender = true;
//           }

//           switch (props.reqStatus) {
//             case "Submit":
//               if (
//                 menuFunc.func_name === "Approve" &&
//                 props.appUser &&
//                 props.appUser !== "" &&
//                 props.currentUser === props.appUser
//               ) {
//                 shouldRender = true;
//               }
//               break;

//             case "Approved":
//               if (menuFunc.func_name === "Accept Job") {
//                 shouldRender = true;
//               }
//               break;

//             case "Start":
//             case "On process":
//               if (
//                 menuFunc.func_name === "Time Sheet" ||
//                 (props.reqStatus === "On process" &&
//                   menuFunc.func_name === "Job Done")
//               ) {
//                 shouldRender = true;
//               }
//               break;

//             default:
//               break;
//           }

//           if (shouldRender) {
//             return (
//               <MenuItem key={index} onClick={() => props.onClick && props.onClick(menuFunc.func_name)}>
//                 <div className="flex items-center gap-2">
//                   <div><i className={`${menuFunc.menu_func_icon}`}></i></div> {/* ใช้ไอคอนจาก menuFunc.menu_func_icon */}
//                   {menuFunc.display_name}
//                 </div>
//               </MenuItem>
//             );
//           }

//           return null;
//         })}
//       </Menu>
//     </div>
//   );
// }
