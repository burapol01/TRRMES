//@ts-nocheck
import * as React from "react";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import FullWidthButton from "./FullWidthButton";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  // "& .MuiDialogContent-root": {
  //   padding: theme.spacing(2),
  // },
  // "& .MuiDialogActions-root": {
  //   padding: theme.spacing(1),
  // },
}));

interface FuncDialog {
  element?: React.ReactNode;
  handleClose?: any;
  handlefunction?: any;
  handleRejectAction?: any;
  titlename?: string;
  open: boolean;
  dialogWidth?: string;
  openBottonHidden?: boolean;
  colorBotton?: string;
  actions?: string;

}

const actionConfig = {
  
  Draft: {
    mainButton: { label: "บันทึก", show: true },
    rejectButton: { show: false },
    cancelButton: { show: true },
  },
  Submit: {
    mainButton: { label: "ส่งข้อมูล", show: true },
    rejectButton: { show: false },
    cancelButton: { show: true },
  },
 Approved: {
    mainButton: { label: "อนุมัติ", show: true },
    rejectButton: { label: "ไม่อนุมัติ", show: true },
    cancelButton: { show: true },
  },
  AcceptJob: {
    mainButton: { label: "เริ่มงาน", show: true },
    rejectButton: { label: "ปฏิเสธ", show: true },
    cancelButton: { show: true },
  },
  TimeSheet: {
    mainButton: { label: "บันทึก", show: true },
    rejectButton: { show: false },
    cancelButton: { show: true },
  },
  JobDone: {
    mainButton: { label: "บันทึก", show: true },
    rejectButton: { show: false },
    cancelButton: { show: true },
  },
  Close: {
    mainButton: { label: "ปิดงาน", show: true },
    rejectButton: { label: "ปฏิเสธงาน", show: true },
    cancelButton: { show: true },
  },
  Read: {
    mainButton: { show: false },
    rejectButton: { show: false },
    cancelButton: { show: true },
  },
  Create: {
    mainButton: { label: "บันทึก", show: true },
    rejectButton: { show: false },
    cancelButton: { show: true },
  },
  Update: {
    mainButton: { label: "แก้ไขข้อมูล", show: true },
    rejectButton: { show: false },
    cancelButton: { show: true },
  },
  Delete: {
    mainButton: { label: "ลบข้อมูล", show: true },
    rejectButton: { show: false },
    cancelButton: { show: true },
  },
  RejectReason: {
    mainButton: { label: "บันทึก", show: true },
    rejectButton: { show: false },
    cancelButton: { show: true },
  },
  ImportFile: {
    mainButton: { label: "นำเข้า", show: true },
    rejectButton: { show: false },
    cancelButton: { show: true },
  },
};

export default function FuncDialog(props: FuncDialog) {
  const config = actionConfig[props.actions] || {
    mainButton: { show: false },
    rejectButton: { show: false },
    cancelButton: { show: true },
  };
  return (
    <React.Fragment>
      <BootstrapDialog
        fullWidth
        maxWidth={props.dialogWidth} // สามารถกำหนดขนาดตรงนี้ เช่น "xs", "sm", "md", "lg", "xl"
        onClose={props.handleClose}
        // aria-labelledby="customized-dialog-title"
        open={props.open}
      >
        <div className="px-6 pt-4">
          <label className="text-2xl ml-2 mt-3 mb-5 sarabun-regular">
            {props.titlename}
          </label>
        </div>
        <IconButton
          aria-label="close"
          onClick={props.handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>{props.element}</DialogContent>
        <DialogActions>
          {config.mainButton.show && props.openBottonHidden && (
            <div className="py-3">
              <FullWidthButton
                handleonClick={props.handlefunction}
                labelName={config.mainButton.label || props.titlename}
                variant_text="contained"
                colorname={props.colorBotton}
              />
            </div>
          )}

          {config.rejectButton.show && (
            <div className="pr-5">
              <FullWidthButton
                handleonClick={props.handleRejectAction}
                labelName={config.rejectButton.label || "Reject"}
                variant_text="contained"
                colorname="error"
              />
            </div>
          )}

          {config.cancelButton.show && (
            <div className="pr-5">
              <FullWidthButton
                handleonClick={props.handleClose}
                labelName="ยกเลิก"
                variant_text="contained"
                colorname="error"
              />
            </div>
          )}         
        </DialogActions>
      </BootstrapDialog>
    </React.Fragment>
  );
}
