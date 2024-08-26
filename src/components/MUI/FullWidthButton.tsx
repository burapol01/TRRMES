import { Button } from "@mui/material/";
import AddIcon from '@mui/icons-material/Add';
import LocalPrintshopOutlinedIcon from '@mui/icons-material/LocalPrintshopOutlined';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import DriveFolderUploadOutlinedIcon from '@mui/icons-material/DriveFolderUploadOutlined';

interface FullWidthButton {
  labelName: string;
  handleonClick: () => void;
  colorname: any;
  variant_text: "text" | "contained" | "outlined";
  iconAdd?: boolean;
  iconPrint?: boolean;
  iconUpload?: boolean;
  iconDownload?: boolean;
  
}


export default function FullWidthButton({ labelName, handleonClick, colorname = "success", iconAdd, iconPrint,iconDownload,iconUpload, variant_text = "contained" }: FullWidthButton) {
  //console.log(iconAdd);

  return (
    <div>
      <Button
        endIcon={
          iconAdd ? (
            <AddIcon />
          ) : iconPrint ? (
            <LocalPrintshopOutlinedIcon />
          ) : iconDownload ? (
            <SaveAltIcon />
          ) : iconUpload ? (
            <DriveFolderUploadOutlinedIcon />
          )
          : null
        }
        variant={variant_text}
        className="fs-6 py-2"
        color={colorname}
        //sx={{backgroundColor:"#502d1e"}}
        onClick={handleonClick}
        fullWidth
      >
        {labelName}
      </Button>
    </div>

  );
}