import { Box, TextField } from "@mui/material";
import InputAdornment from '@mui/material/InputAdornment';
import { grey } from '@mui/material/colors';

interface FullWidthTextFieldProps {
  value?: any;
  labelName: string;
  required?: string;
  disabled?: boolean;
  onChange?: (value: any) => void;
  readonly?: boolean;
  textAlignTextField?: 'left' | 'right' | 'center';
  endAdornment?: boolean;
  Validate?: boolean;
  validateTextLable?: string;
  hidden?: boolean; // Add new prop for hidden state
}

export default function FullWidthTextField(props: FullWidthTextFieldProps) {
  const hedelonChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    props.onChange && props.onChange(e.target.value)
  };

  return (
    <Box sx={{ display: props.hidden ? 'none' : 'block' }}>
      <label htmlFor="" className={`${props.required} fs-5 py-2 sarabun-regular`}>
        {props.labelName}
      </label>
      <TextField
        fullWidth
        sx={{ 
          
          "& .MuiInputBase-input.Mui-disabled": {
            WebkitTextFillColor: "black", // For text color in WebKit browsers
          },
          "& .MuiInputBase-root.Mui-disabled": {
            backgroundColor: "rgb(241,241,244)", // Background color for the disabled input
          },
          "& .MuiOutlinedInput-root": {
            fontFamily: "Sarabun",
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: props.Validate ? "#d50000" : "",
            },
            "&.Mui-focused": {
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "info.main",
              },
            },
          },         
        }}
        InputProps={{
          readOnly: props.readonly,
          endAdornment: props.endAdornment ? <InputAdornment position="end">%</InputAdornment> : null,
          inputProps: {
            style: { textAlign: props.textAlignTextField },
          },
        }}
        autoComplete="off"
        id="fullWidth"
        size="small"
        disabled={props.disabled}
        onChange={hedelonChange}
        value={props.value}
      />
      {props.validateTextLable ? (
        <label htmlFor="" className={`fs-7 py-1 sarabun-regular-lable-validate`}>
          {props.validateTextLable}
        </label>
      ) : null}
    </Box>
  );
}
