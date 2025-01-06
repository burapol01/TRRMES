import React from 'react';
import { Box, TextField } from '@mui/material';
import { grey } from '@mui/material/colors';

interface FullWidthTextareaFieldProps {
  value?: string;
  labelName: string;
  required?: string;
  disabled?: boolean;
  onChange?: (value: string) => void;
  readonly?: boolean;
  textAlignTextField?: 'left' | 'right' | 'center';
  rows?: number;
  Validate?: boolean;
  validateTextLable?: string;
  multiline?: boolean;
}

export default function FullWidthTextareaField({
  value = '',
  labelName,
  required = '',
  disabled = false,
  onChange,
  readonly = false,
  textAlignTextField = 'left',
  rows = 4,
  Validate = false,
  validateTextLable = '',
  multiline = false,
}: FullWidthTextareaFieldProps) {

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange && onChange(e.target.value);
  };

  return (
    <Box>
      <label htmlFor="" className={`${required ? 'required' : ''} fs-5 py-2 sarabun-regular`}>
        {labelName}
      </label>
      <TextField
        fullWidth
        multiline={multiline}
        rows={rows}
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
              borderColor: Validate ? "#d50000" : "",
            },
            "&.Mui-focused": {
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "info.main",
              },
            },
          }, 
        }}
        InputProps={{
          readOnly: readonly,
          inputProps: {
            style: { textAlign: textAlignTextField },
          },
        }}
        autoComplete="off"
        size="small"
        disabled={disabled}
        onChange={handleChange}
        value={value}
      />
      {Validate && (
        <p style={{ color: "#d50000", fontSize: "0.875rem", marginTop: "4px" }}>
          กรุณากรอกข้อมูล
        </p>
      )}
      {validateTextLable && (
        <label htmlFor="" className={`fs-7 py-1 sarabun-regular-lable-validate`}>
          {validateTextLable}
        </label>
      )}
    </Box>
  );
}
