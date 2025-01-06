import * as React from 'react';
import Switch from '@mui/material/Switch';

const label = { inputProps: { 'aria-label': 'Switch demo' } };

interface BasicSwitchesProps {
    labelName?: string;
    required?: string; // (Prop) สำหรับ dynamic class
}

export default function BasicSwitches({ labelName, required }: BasicSwitchesProps) {
    return (
        <div className='flex flex-col'>
            <label htmlFor="" className={`${required} fs-5 py-2 sarabun-regular`}>
                {labelName}
            </label>
            <Switch {...label} defaultChecked />
        </div>
    );
}
