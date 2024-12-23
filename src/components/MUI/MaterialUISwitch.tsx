import * as React from 'react';
import { styled } from '@mui/material/styles';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

interface CustomizedSwitchesProps {
  labelName: string;
  checked?: boolean | undefined;
  disabled?: boolean;
  handleOnClick?: (checked: boolean) => void; // กำหนด callback function สำหรับ switch
  Validate?: boolean;
  required?: string; // Prop สำหรับ dynamic class
}

const Android12Switch = styled(Switch)(({ theme }) => ({
  padding: 8,
  '& .MuiSwitch-track': {
    borderRadius: 22 / 2,
    '&::before, &::after': {
      content: '""',
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      width: 16,
      height: 16,
    },
    '&::before': {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        theme.palette.getContrastText(theme.palette.primary.main),
      )}" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>')`,
      left: 12,
    },
    '&::after': {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        theme.palette.getContrastText(theme.palette.primary.main),
      )}" d="M19,13H5V11H19V13Z" /></svg>')`,
      right: 12,
    },
  },
  '& .MuiSwitch-thumb': {
    boxShadow: 'none',
    width: 16,
    height: 16,
    margin: 2,
  },
}));

const CustomizedSwitches: React.FC<CustomizedSwitchesProps> = (props) => {
  const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // เรียก callback function และส่งค่า checked กลับ
    props.handleOnClick && props.handleOnClick(event.target.checked);
  };

  return (
    <FormGroup>
      <label htmlFor="" className={`${props.required} fs-5 py-2 sarabun-regular`}>
        {props.labelName}
      </label>

      <FormControlLabel
        control={<Android12Switch disabled={props.disabled} checked={props.checked} onChange={handleSwitchChange} />}
        label=""
      />
      {props.Validate && (
        <p style={{ color: "#d50000", fontSize: "0.875rem", marginTop: "4px" }}>
          กรุณากรอกข้อมูล
        </p>
      )}
    </FormGroup>
  );
};

export default CustomizedSwitches;
