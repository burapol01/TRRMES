import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Stack, Typography, Box } from "@mui/material";

type Types = "success" | "error" | "warning" | "info";

interface ConfirmModal {
  createModal: (
    msg: string,
    type: Types,
    submit: () => void,
    cancel?: () => void
  ) => void;
}

let confirmModal: ConfirmModal;

const ConfirmModalDialog: React.FC = () => {
  const [message, setMessage] = React.useState<string>("");
  const [types, setTypes] = React.useState<Types>("info");
  const [onSubmit, setOnSubmit] = React.useState<(() => void) | undefined>();
  const [onCancel, setOnCancel] = React.useState<(() => void) | undefined>();
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    confirmModal = {
      createModal: (
        msg: string,
        type: Types,
        submit: () => void,
        cancel?: () => void
      ) => {
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

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      sx={{
        zIndex: (theme) => theme.zIndex.modal + 10,
      }}
    >
      <DialogTitle>
        <div style={{ fontSize: "1.25rem", fontWeight: "bold", textAlign: "center" }}>
          {types === "success" && "Success"}
          {types === "error" && "Error"}
          {types === "warning" && "Warning"}
          {types === "info" && "Information"}
        </div>
      </DialogTitle>

      <DialogContent>
        <Stack direction="column" alignItems="center" spacing={2}>
          <div className="flex justify-center">
            {types === "success" && (
              <img
                src="media/alertMasseng/icons8-success.gif"
                alt="success"
                className="w-24 h-24"
              />
            )}
            {types === "error" && (
              <img
                src="media/alertMasseng/icons8-error.gif"
                alt="error"
                className="w-24 h-24"
              />
            )}
            {types === "warning" && (
              <img
                src="media/alertMasseng/icons8-warning.gif"
                alt="warning"
                className="w-24 h-24"
              />
            )}
            {types === "info" && (
              <img
                src="media/alertMasseng/icons8-info.gif"
                alt="info"
                className="w-24 h-24"
              />
            )}
          </div>
          <Stack direction="row" justifyContent="center" py={3}>
            <Typography variant="body1" align="center">
              {message}
            </Typography>
          </Stack>
        </Stack>
      </DialogContent>
      <Box sx={{ display: 'flex', justifyContent: 'center', padding: '1rem' }}>
        <Stack spacing={2} direction="row" alignItems="center">
          <Button
            variant="contained"
            color="primary"
            sx={{ width: 120 }}
            onClick={() => {
              if (onSubmit) onSubmit();
              handleClose();
            }}
            autoFocus  // ให้ปุ่มนี้ถูกโฟกัสเมื่อไดอะล็อกเปิด
          >
            ยืนยัน
          </Button>

          {onCancel && (
            <Button
              variant="outlined"
              color="secondary"
              sx={{ width: 120 }} // Fixed width for consistency
              onClick={() => {
                if (onCancel) onCancel();
                handleClose();
              }}
            >
              ยกเลิก
            </Button>
          )}
          <Button
            variant="outlined"
            sx={{ width: 120 }} // Fixed width for consistency
            onClick={handleClose}
          >
            ปิด
          </Button>
        </Stack>
      </Box>
    </Dialog>
  );
};

export default ConfirmModalDialog;
export { confirmModal };
