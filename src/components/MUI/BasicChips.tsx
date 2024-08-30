import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';

interface BasicChips {
  label?: string;
  backgroundColor?: string;
  borderColor?: string;
}

export default function BasicChips(props: BasicChips) {
  return (
    <>
      <Stack direction="row" spacing={1}>
        <Chip 
          label= {props.label}
          variant="outlined" 
          sx={{
            backgroundColor: props.backgroundColor,
            color: '#00000',
            borderColor: props.borderColor,
          }}
          />
      </Stack>
      {/* <Box>
        <label htmlFor="" className={`${props.required} fs-5 py-2 sarabun-regular`}>
          {props.labelName}
        </label>
        <TextField
          fullWidth
          sx={{
            bgcolor: props.bgcolorTextField ? grey[200] : null,
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
      </Box> */}
    </>
  );
}