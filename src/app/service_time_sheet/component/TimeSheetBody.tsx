import React, { useState, useEffect, useMemo } from 'react';
import FullWidthTextField from '../../../components/MUI/FullWidthTextField';
import AutocompleteComboBox from '../../../components/MUI/AutocompleteComboBox';
import FullWidthButton from '../../../components/MUI/FullWidthButton';
import FullWidthTextareaField from '../../../components/MUI/FullWidthTextareaField';
import { Time_Sheet_headCells } from '../../../../libs/columnname';
import BasicTable from '../../../components/MUI/BasicTable';
import dayjs from 'dayjs';
import debounce from 'lodash/debounce';

interface TimeSheetBodyProps {
    onDataChange?: (data: any[]) => void; // แก้เป็น List
    options?: {
        technician: any[];
        workHour: any[];
    };
}

export default function TimeSheetBody({ 
    onDataChange,
    options 
}: TimeSheetBodyProps) {
    const [date, setDate] = useState(dayjs().format('YYYY-MM-DD HH:mm:ss'));
    const [technician, setTechnician] = useState<any>(null);
    const [workHour, setWorkHour] = useState<any>(null);
    const [description, setDescription] = useState('');
    const [dataList, setDataList] = useState<any[]>([]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setDate(dayjs().format('YYYY-MM-DD HH:mm:ss'));
        }, 3000);
        return () => clearInterval(intervalId); // Clear the interval when component unmounts
    }, []);

    const handleSetDataList = () => {
        if (technician && workHour && description) {
            const newData = {
                date,
                technician,
                work_hour: workHour,
                description
            };
            setDataList((prevList) => [...prevList, newData]);
            setTechnician(null);
            setWorkHour(null);
            setDescription('');
        }
    };

    const handleDelete = (dateToDelete: string) => {
        setDataList((prevList) => prevList.filter(({ date }) => date !== dateToDelete));
    };

    const dataRow = useMemo(() => {
        return dataList.map((row, index) => ({
            ...row,
            no: index + 1,
            technician: row.technician?.userName, // แสดงชื่อ technician
            work_hour: row.work_hour?.lov_code, // แสดง lov_code
            delete: (
                <FullWidthButton
                    key={`delete-${index}`} // ใช้ key ที่ไม่ซ้ำกัน
                    labelName="Delete"
                    colorname="error"
                    handleonClick={() => handleDelete(row.date)}
                    variant_text="contained"
                />
            ),
        }));
    }, [dataList]);
    
    // Function to handle data change with debounce
    const debouncedOnDataChange = debounce((data: any[]) => {
        if (typeof onDataChange === 'function') {
            onDataChange(data);
        }
    }, 300); // Adjust debounce delay as needed

    // useEffect to send data change to parent component
    useEffect(() => {
        // Call debounced function
        debouncedOnDataChange(dataList);
    }, [dataList, debouncedOnDataChange]);

    return (
        <div className="border rounded-xl px-2 py-2">
            <div className="row justify-start">
                <div className="col-md-3 mb-2">
                    <FullWidthTextField
                        labelName="Date"
                        value={date}
                        disabled
                    />
                </div>
                <div className="col-md-3 mb-2">
                    <AutocompleteComboBox
                        labelName="Technician"
                        column="userAd"
                        setvalue={setTechnician}
                        options={options?.technician || []}
                        value={technician}
                    />
                </div>
                <div className="col-md-3 mb-2">
                    <AutocompleteComboBox
                        labelName="Work Hour"
                        column="lov_code"
                        setvalue={setWorkHour}
                        options={options?.workHour || []}
                        value={workHour}
                    />
                </div>
            </div>
            <div className="row justify-start">
                <div className="col-md-9 mb-2">
                    <FullWidthTextareaField
                        labelName="Description"
                        onChange={(value) => setDescription(value)}
                        value={description}
                    />
                </div>
                <div className="col-md-1 mb-2 w-5 pt-10">
                    <FullWidthButton
                        labelName="+"
                        handleonClick={handleSetDataList}
                        colorname="success"
                        variant_text="outlined"
                    />
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-x-4 py-2">
                <BasicTable
                    columns={Time_Sheet_headCells}
                    rows={dataRow}
                />
            </div>
        </div>
    );
}
