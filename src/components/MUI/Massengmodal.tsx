import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Stack, Typography, IconButton, Box, createTheme, useMediaQuery, ThemeProvider } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

type Types = "success" | "error" | "warning" | "info";

interface Massengmodal {
  createModal: (
    msg: React.ReactNode,
    type: Types,
    submit: () => void,
    cancel?: () => void
  ) => void;
}

let Massengmodal: Massengmodal;

const MassengmodalProvider: React.FC = () => {
  const [message, setMessage] = React.useState<React.ReactNode>("");
  const [types, setTypes] = React.useState<Types>("info");
  const [onSubmit, setOnSubmit] = React.useState<(() => void) | undefined>(
    undefined
  );
  const [onCancel, setOnCancel] = React.useState<(() => void) | undefined>(
    undefined
  );
  const [open, setOpen] = React.useState(false);

  const theme = createTheme(); // สร้าง theme
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm")); // ใช้ theme สำหรับ useMediaQuery

  React.useEffect(() => {
    Massengmodal = {
      createModal: (
        msg: React.ReactNode,
        type: Types,
        submit: () => void,
        cancel?: () => void
      ) => {
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

  return (
    <ThemeProvider theme={theme}> {/* ครอบ MassengmodalProvider ด้วย ThemeProvider */}
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth={isSmallScreen}
      maxWidth={isSmallScreen ? "xs" : "sm"}
      sx={{
        zIndex: (theme) => theme.zIndex.modal + 10,
        "& .MuiDialog-paper": {
          width: isSmallScreen ? "90%" : "25%",
          maxWidth: "600px",
        },
      }}
    >
      <DialogTitle>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">
            {types.charAt(0).toUpperCase() + types.slice(1)}
          </Typography>

        </Stack>
      </DialogTitle>
      <DialogContent dividers sx={{ p: 4 }}>
        <Stack direction="column" alignItems="center" spacing={3}>
          {types === "success" && <img src="media/alertMasseng/icons8-success.gif" alt="success" />}
          {types === "error" && <img src="media/alertMasseng/icons8-error.gif" alt="error" />}
          {types === "warning" && <img src="media/alertMasseng/icons8-warning.gif" alt="warning" />}
          {types === "info" && <img src="media/alertMasseng/icons8-info.gif" alt="info" />}
          <Typography component="div">{message}</Typography> {/* เปลี่ยน Typography */}
        </Stack>
      </DialogContent>

      <DialogActions>
        <Box width="100%" display="flex" justifyContent="center">
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              if (onSubmit) onSubmit();
              handleClose();
            }}
            autoFocus  // ให้ปุ่มนี้ถูกโฟกัสเมื่อไดอะล็อกเปิด
          >
            ตกลง
          </Button>
          {onCancel && (
            <Button
              variant="outlined"
              sx={{ ml: 2 }}  // เพิ่มระยะห่างระหว่างปุ่ม
              onClick={() => {
                if (onCancel) onCancel();
                handleClose();
              }}
            >
              ยกเลิก
            </Button>
          )}
        </Box>
      </DialogActions>
    </Dialog>
    </ThemeProvider>
  );
};

export default MassengmodalProvider;
export { Massengmodal };
