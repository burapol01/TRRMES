import { jsx as _jsx } from "react/jsx-runtime";
import { Button } from "@mui/material/";
import AddIcon from '@mui/icons-material/Add';
import LocalPrintshopOutlinedIcon from '@mui/icons-material/LocalPrintshopOutlined';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import DriveFolderUploadOutlinedIcon from '@mui/icons-material/DriveFolderUploadOutlined';
export default function FullWidthButton({ labelName, handleonClick, colorname = "success", iconAdd, iconPrint, iconDownload, iconUpload, variant_text = "contained" }) {
    //console.log(iconAdd);
    return (_jsx("div", { children: _jsx(Button, { endIcon: iconAdd ? (_jsx(AddIcon, {})) : iconPrint ? (_jsx(LocalPrintshopOutlinedIcon, {})) : iconDownload ? (_jsx(SaveAltIcon, {})) : iconUpload ? (_jsx(DriveFolderUploadOutlinedIcon, {}))
                : null, variant: variant_text, className: "fs-6 py-2", color: colorname, 
            //sx={{backgroundColor:"#502d1e"}}
            onClick: handleonClick, fullWidth: true, children: labelName }) }));
}
