import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Stack, Typography, Box } from "@mui/material";
let Massengmodal;
const MassengmodalProvider = () => {
    const [message, setMessage] = React.useState("");
    const [types, setTypes] = React.useState("info");
    const [onSubmit, setOnSubmit] = React.useState(undefined);
    const [onCancel, setOnCancel] = React.useState(undefined);
    const [open, setOpen] = React.useState(false);
    React.useEffect(() => {
        Massengmodal = {
            createModal: (msg, type, submit, cancel) => {
                setMessage(msg);
                setTypes(type);
                setOnSubmit(() => submit);
                setOnCancel(cancel);
                setOpen(true);
            }
        };
    }, []);
    const handleClose = () => {
        setOnSubmit(undefined);
        setOpen(false);
    };
    return (_jsxs(Dialog, { open: open, onClose: handleClose, sx: {
            zIndex: (theme) => theme.zIndex.modal + 10,
            "& .MuiDialog-paper": {
                width: "20%", // Make it responsive
                maxWidth: "600px", // Max width to prevent it from growing too large
            },
        }, children: [_jsx(DialogTitle, { children: _jsx(Stack, { direction: "row", justifyContent: "space-between", alignItems: "center", children: _jsx(Typography, { variant: "h6", children: types.charAt(0).toUpperCase() + types.slice(1) }) }) }), _jsx(DialogContent, { dividers: true, sx: { p: 4 }, children: _jsxs(Stack, { direction: "column", alignItems: "center", spacing: 3, children: [types === "success" && _jsx("img", { src: "media/alertMasseng/icons8-success.gif", alt: "success" }), types === "error" && _jsx("img", { src: "media/alertMasseng/icons8-error.gif", alt: "error" }), types === "warning" && _jsx("img", { src: "media/alertMasseng/icons8-warning.gif", alt: "warning" }), types === "info" && _jsx("img", { src: "media/alertMasseng/icons8-info.gif", alt: "info" }), _jsx(Typography, { component: "div", children: message }), " "] }) }), _jsx(DialogActions, { children: _jsxs(Box, { width: "100%", display: "flex", justifyContent: "center", children: [_jsx(Button, { variant: "contained", color: "primary", onClick: () => {
                                if (onSubmit)
                                    onSubmit();
                                handleClose();
                            }, autoFocus // ให้ปุ่มนี้ถูกโฟกัสเมื่อไดอะล็อกเปิด
                            : true, children: "\u0E15\u0E01\u0E25\u0E07" }), onCancel && (_jsx(Button, { variant: "outlined", sx: { ml: 2 }, onClick: () => {
                                if (onCancel)
                                    onCancel();
                                handleClose();
                            }, children: "\u0E22\u0E01\u0E40\u0E25\u0E34\u0E01" }))] }) })] }));
};
export default MassengmodalProvider;
export { Massengmodal };
