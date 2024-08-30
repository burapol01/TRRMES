import React, { useState, useEffect, useMemo } from 'react';
import FullWidthTextField from '../../../components/MUI/FullWidthTextField';
import AutocompleteComboBox from '../../../components/MUI/AutocompleteComboBox';
import FullWidthButton from '../../../components/MUI/FullWidthButton';
import FullWidthTextareaField from '../../../components/MUI/FullWidthTextareaField';
import { Time_Sheet_headCells } from '../../../../libs/columnname';
import BasicTable from '../../../components/MUI/BasicTable';
import dayjs from 'dayjs';
import debounce from 'lodash/debounce';
import moment from 'moment';
import { _POST } from '../../../service/mas';
import { v4 as uuidv4 } from 'uuid';

interface TimeSheetBodyProps {
    onDataChange?: (data: any[]) => void; 
    options?: {
        technician: any[];
        workHour: any[];
    };
    revisionCurrent: any;
    actions?: string;
}

export default function TimeSheetBody({
    onDataChange,
    options,
    revisionCurrent,
    actions
}: TimeSheetBodyProps) {
    const [date, setDate] = useState(dayjs().format('YYYY-MM-DD HH:mm:ss'));
    const [technician, setTechnician] = useState<any>(null);
    const [workHour, setWorkHour] = useState<any>(null);
    const [description, setDescription] = useState('');
    const [dataList, setDataList] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null); // สถานะสำหรับข้อผิดพลาด

    // Effect for handling real-time updates in "TimeSheet" mode
    useEffect(() => {
        if (actions === "TimeSheet") {
            const intervalId = setInterval(() => {
                setDate(dayjs().format('YYYY-MM-DD HH:mm:ss'));
            }, 3000);
            return () => clearInterval(intervalId); // Clear the interval when component unmounts
        }
    }, [actions]);

    // Effect for fetching data in "Reade" mode
    useEffect(() => {
        const fetchDataForRead = async () => {
            if (!revisionCurrent) {
                console.error("revisionCurrent is null or undefined");
                setError("Invalid revision data");
                return;
            }
            console.log('Call : fetchDataForRead', revisionCurrent, moment().format('HH:mm:ss:SSS'));
            try {
                const dataset = {
                    req_id: revisionCurrent.reqId,
                    revision_id: revisionCurrent.revisionId,
                };
                const response = await _POST(dataset, "/api_rab/ServiceTimeSheet/Sub_Time_Sheet_Get");

                if (response && response.status === "success") {
                    console.log(response, 'Success fetch SubTimeSheet Get');
                    const subTimeSheet = response.data.map((dataSubTimeSheet: any) => ({
                        subTimeSheetId: dataSubTimeSheet.id,
                        no: dataSubTimeSheet.time_sheet_no,
                        date: dataSubTimeSheet.work_date,
                        technician: dataSubTimeSheet.technician,
                        work_hour: dataSubTimeSheet.work_hour,
                        description: dataSubTimeSheet.description
                    }));

                    setDataList(subTimeSheet);
                    console.log(subTimeSheet, 'subTimeSheet');
                } else {
                    setError("Failed to fetch Sub Time Sheet.");
                }
            } catch (error) {
                console.error("Error fetch Sub Time Sheet:", error);
                setError("An error occurred while fetching Sub Time Sheet.");
            }
        };

        // Only call fetchDataForRead if the conditions are met
        if ((actions === "Reade" || actions === "TimeSheet") && revisionCurrent && revisionCurrent.reqId && revisionCurrent.revisionId) {
            fetchDataForRead();
        }
    }, [actions, revisionCurrent]);


    // Handler for adding new data in "TimeSheet" mode
    const handleSetDataList = () => {
        if (actions === "TimeSheet" && technician && workHour && description) {
            const newData = {
                subTimeSheetId: uuidv4(), // กำหนด uuid สำหรับแต่ละแถวใหม่
                no: dataList.length + 1, // เพิ่มหมายเลขลำดับที่
                date,
                technician,
                work_hour: workHour,
                description,
                newRowDataFlag: true, // ระบุว่าเป็นข้อมูลใหม่                
            };
            setDataList((prevList) => [...prevList, newData]);
            setTechnician(null);
            setWorkHour(null);
            setDescription('');
        }
    };

    // Handler for deleting data 
    const handleDelete = (subTimeSheetIdToDelete: string, isNewRow: boolean) => {
        console.log(`Deleting item with ID: ${subTimeSheetIdToDelete}`);

        if (isNewRow) {
            setDataList((prevList) => {
                console.log("Previous List:", prevList);
                const newList = prevList.filter(({ subTimeSheetId }) => subTimeSheetId !== subTimeSheetIdToDelete);
                console.log("New List after deletion:", newList);
                return newList;
            });
        } else {
            // Handle cases where the item is not a new row
            setDataList((prevList) =>
                prevList.map(item =>
                    item.subTimeSheetId === subTimeSheetIdToDelete
                        ? { ...item, delete_flag: true }  // Set delete_flag to 1 for existing rows
                        : item

                )

            );
        }
    };


    // Data preparation for "TimeSheet" mode
    const dataRow = useMemo(() => {
        // กรองข้อมูลที่มี delete_flag
        const filteredList = dataList.filter(row => !row.delete_flag);

        return filteredList.map((row, index) => {
           // console.log(`Row ID: ${row.no}`); // ตรวจสอบค่า ID

            // Extract the necessary primitive values for rendering
            const technicianName = row.technician?.userName || row.technician;
            const workHour = row.work_hour?.lov_code || row.work_hour;
            const isNewRow = row.newRowDataFlag;

            return {
                ...row,
                no: index + 1 || row.no, // ใช้ index ของ map ในการกำหนดหมายเลขลำดับ
                technician: technicianName, // แสดงชื่อ technician
                work_hour: workHour, // แสดง lov_code
                key: row.subTimeSheetId, // ใช้ subTimeSheetId เป็น key
                delete: (
                    actions !== "Reade" && (
                        <FullWidthButton
                            labelName="Delete"
                            colorname="error"
                            handleonClick={() => handleDelete(row.subTimeSheetId, isNewRow)}
                            variant_text="contained"
                        />
                    )
                ),
            };
        });
    }, [dataList, actions]);


     // New useEffect to update `no` order whenever `dataList` changes
     useEffect(() => {
        setDataList(prevList => {
            let currentIndex = 1;
            return prevList.map(row => {
                if (!row.delete_flag) {
                    // Update `no` only for items that are not deleted
                    return { ...row, no: currentIndex++ };
                }
                return row;
            });
        });
    }, [dataList]);
    


    // Data preparation for "Reade" mode
    const readOnlyDataRow = useMemo(() => {
        if (actions === "Reade") {
            return dataList.map((row, index) => ({
                ...row,
                no: row.no, // ใช้ค่า time_sheet_no แทน index + 1,
                technician: row.technician,
                work_hour: row.work_hour,
                key: row.subTimeSheetId, // ใช้ subTimeSheetId เป็น key                
                delete: (
                    actions !== "Reade" && (
                        <FullWidthButton
                            key={`delete-${index}`}
                            labelName="Delete"
                            colorname="error"
                            handleonClick={() => handleDelete(row.subTimeSheetId, row.newRowDataFlag)}
                            variant_text="contained"
                        />
                    )
                ),
            }));
        }
        return [];
    }, [dataList, actions]);

    // Function to handle data change with debounce
    const debouncedOnDataChange = debounce((data: any[]) => {
        if (typeof onDataChange === 'function') {
            onDataChange(data);
        }
    }, 300); // Adjust debounce delay as needed

    // useEffect to send data change to parent component
    useEffect(() => {
        if (actions === "TimeSheet") {
            // Call debounced function
            debouncedOnDataChange(dataList);
        }
    }, [dataList, debouncedOnDataChange, actions]);

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
                        disabled={actions === "Reade"}
                    />
                </div>
                <div className="col-md-3 mb-2">
                    <AutocompleteComboBox
                        labelName="Work Hour"
                        column="lov_code"
                        setvalue={setWorkHour}
                        options={options?.workHour || []}
                        value={workHour}
                        disabled={actions === "Reade"}
                    />
                </div>
            </div>
            <div className="row justify-start">
                <div className="col-md-9 mb-2">
                    <FullWidthTextareaField
                        labelName="Description"
                        onChange={(value) => setDescription(value)}
                        value={description}
                        disabled={actions === "Reade"}
                    />
                </div>
                <div className="col-md-1 mb-2 w-5 pt-10">
                    {actions === "TimeSheet" && (
                        <FullWidthButton
                            labelName="+"
                            handleonClick={handleSetDataList}
                            colorname="success"
                            variant_text="outlined"
                        />
                    )}
                </div>
            </div>
            <div className={`table-container ${actions === "Reade" ? 'disabled' : ''}`}>
                <BasicTable
                    columns={Time_Sheet_headCells}
                    rows={actions === "TimeSheet" ? dataRow : readOnlyDataRow}
                />
            </div>

        </div>
    );
}
