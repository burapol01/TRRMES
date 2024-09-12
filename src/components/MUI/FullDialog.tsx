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
    mainButton: { label: "Save", show: true },
    rejectButton: { show: false },
    cancelButton: { show: true },
  },
  Submit: {
    mainButton: { label: "Submit", show: true },
    rejectButton: { show: false },
    cancelButton: { show: true },
  },
 Approved: {
    mainButton: { label: "Approve", show: true },
    rejectButton: { label: "Submit Reject", show: true },
    cancelButton: { show: false },
  },
  AcceptJob: {
    mainButton: { label: "Start", show: true },
    rejectButton: { label: "Reject", show: true },
    cancelButton: { show: false },
  },
  TimeSheet: {
    mainButton: { label: "Save", show: true },
    rejectButton: { show: false },
    cancelButton: { show: true },
  },
  JobDone: {
    mainButton: { label: "Job Done", show: true },
    rejectButton: { show: false },
    cancelButton: { show: true },
  },
  Close: {
    mainButton: { label: "Close", show: true },
    rejectButton: { label: "Reject Job", show: true },
    cancelButton: { show: true },
  },
  Read: {
    mainButton: { show: false },
    rejectButton: { show: false },
    cancelButton: { show: true },
  },
  Create: {
    mainButton: { label: "Create", show: true },
    rejectButton: { show: false },
    cancelButton: { show: true },
  },
  Update: {
    mainButton: { label: "Edit", show: true },
    rejectButton: { show: false },
    cancelButton: { show: true },
  },
  Delete: {
    mainButton: { label: "Delete", show: true },
    rejectButton: { show: false },
    cancelButton: { show: true },
  },
  RejectReason: {
    mainButton: { label: "Save", show: true },
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
                labelName="Cancel"
                variant_text="contained"
                colorname="error"
              />
            </div>
          )}

          {/* {props.actions === "AcceptJob" || props.actions === "TimeSheet" ? (
            <div className="py-3">
              {props.openBottonHidden && (
                <FullWidthButton
                  handleonClick={props.handlefunction}
                  labelName={props.actions === "AcceptJob" ? "Start" : "Save"}
                  variant_text="contained"
                  colorname={props.colorBotton}>
                </FullWidthButton>
              )}
            </div>
          ) : (

            <div className="py-3">
              {props.openBottonHidden && (
                <FullWidthButton
                  handleonClick={props.handlefunction}
                  labelName={props.titlename}
                  variant_text="contained"
                  colorname={props.colorBotton}>
                </FullWidthButton>
              )}
            </div>


          )}

          {props.actions === "Approved" || props.actions === "AcceptJob" ? (
            <div className="pr-5">
              <FullWidthButton
                handleonClick={props.handleRejectAction}
                labelName={props.actions === "Approved" ? "Submit Reject" : "Reject" }
                variant_text="contained"
                colorname="error"
              />
            </div>
          ) : (
            <div className="pr-5">
              <FullWidthButton
                handleonClick={props.handleClose}
                labelName="Cancel"
                variant_text="contained"
                colorname="error"
              />
            </div>
          )} */}
        </DialogActions>
      </BootstrapDialog>
    </React.Fragment>
  );
}
