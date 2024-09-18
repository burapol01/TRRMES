import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Stack, Typography, Box } from "@mui/material";
let confirmModal;
const ConfirmModalDialog = () => {
    const [message, setMessage] = React.useState("");
    const [types, setTypes] = React.useState("info");
    const [onSubmit, setOnSubmit] = React.useState();
    const [onCancel, setOnCancel] = React.useState();
    const [open, setOpen] = React.useState(false);
    React.useEffect(() => {
        confirmModal = {
            createModal: (msg, type, submit, cancel) => {
                setMessage(msg);
                setTypes(type);
                setOnSubmit(() => submit);
                setOnCancel(() => cancel);
                setOpen(true);
            },
        };
    }, []);
    const handleClose = () => {
        setOpen(false);
    };
    return (_jsxs(Dialog, { open: open, onClose: handleClose, sx: {
            zIndex: (theme) => theme.zIndex.modal + 10,
        }, children: [_jsx(DialogTitle, { children: _jsxs("div", { style: { fontSize: "1.25rem", fontWeight: "bold", textAlign: "center" }, children: [types === "success" && "Success", types === "error" && "Error", types === "warning" && "Warning", types === "info" && "Information"] }) }), _jsx(DialogContent, { children: _jsxs(Stack, { direction: "column", alignItems: "center", spacing: 2, children: [_jsxs("div", { className: "flex justify-center", children: [types === "success" && (_jsx("img", { src: "media/alertMasseng/icons8-success.gif", alt: "success", className: "w-24 h-24" })), types === "error" && (_jsx("img", { src: "media/alertMasseng/icons8-error.gif", alt: "error", className: "w-24 h-24" })), types === "warning" && (_jsx("img", { src: "media/alertMasseng/icons8-warning.gif", alt: "warning", className: "w-24 h-24" })), types === "info" && (_jsx("img", { src: "media/alertMasseng/icons8-info.gif", alt: "info", className: "w-24 h-24" }))] }), _jsx(Stack, { direction: "row", justifyContent: "center", py: 3, children: _jsx(Typography, { variant: "body1", align: "center", children: message }) })] }) }), _jsx(Box, { sx: { display: 'flex', justifyContent: 'center', padding: '1rem' }, children: _jsxs(Stack, { spacing: 2, direction: "row", alignItems: "center", children: [_jsx(Button, { variant: "contained", color: "primary", sx: { width: 120 }, onClick: () => {
                                if (onSubmit)
                                    onSubmit();
                                handleClose();
                            }, autoFocus // ให้ปุ่มนี้ถูกโฟกัสเมื่อไดอะล็อกเปิด
                            : true, children: "\u0E22\u0E37\u0E19\u0E22\u0E31\u0E19" }), onCancel && (_jsx(Button, { variant: "outlined", color: "secondary", sx: { width: 120 }, onClick: () => {
                                if (onCancel)
                                    onCancel();
                                handleClose();
                            }, children: "\u0E22\u0E01\u0E40\u0E25\u0E34\u0E01" })), _jsx(Button, { variant: "outlined", sx: { width: 120 }, onClick: handleClose, children: "\u0E1B\u0E34\u0E14" })] }) })] }));
};
export default ConfirmModalDialog;
export { confirmModal };
