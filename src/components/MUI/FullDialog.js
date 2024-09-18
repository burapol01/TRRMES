import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
        mainButton: { label: "Create", show: true },
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
};
export default function FuncDialog(props) {
    const config = actionConfig[props.actions] || {
        mainButton: { show: false },
        rejectButton: { show: false },
        cancelButton: { show: true },
    };
    return (_jsx(React.Fragment, { children: _jsxs(BootstrapDialog, { fullWidth: true, maxWidth: props.dialogWidth, onClose: props.handleClose, 
            // aria-labelledby="customized-dialog-title"
            open: props.open, children: [_jsx("div", { className: "px-6 pt-4", children: _jsx("label", { className: "text-2xl ml-2 mt-3 mb-5 sarabun-regular", children: props.titlename }) }), _jsx(IconButton, { "aria-label": "close", onClick: props.handleClose, sx: {
                        position: "absolute",
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }, children: _jsx(CloseIcon, {}) }), _jsx(DialogContent, { dividers: true, children: props.element }), _jsxs(DialogActions, { children: [config.mainButton.show && props.openBottonHidden && (_jsx("div", { className: "py-3", children: _jsx(FullWidthButton, { handleonClick: props.handlefunction, labelName: config.mainButton.label || props.titlename, variant_text: "contained", colorname: props.colorBotton }) })), config.rejectButton.show && (_jsx("div", { className: "pr-5", children: _jsx(FullWidthButton, { handleonClick: props.handleRejectAction, labelName: config.rejectButton.label || "Reject", variant_text: "contained", colorname: "error" }) })), config.cancelButton.show && (_jsx("div", { className: "pr-5", children: _jsx(FullWidthButton, { handleonClick: props.handleClose, labelName: "\u0E22\u0E01\u0E40\u0E25\u0E34\u0E01", variant_text: "contained", colorname: "error" }) }))] })] }) }));
}
