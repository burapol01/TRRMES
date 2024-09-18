import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect, useMemo } from 'react';
import FullWidthTextField from '../../../components/MUI/FullWidthTextField';
import AutocompleteComboBox from '../../../components/MUI/AutocompleteComboBox';
import FullWidthButton from '../../../components/MUI/FullWidthButton';
import FullWidthTextareaField from '../../../components/MUI/FullWidthTextareaField';
import { Time_Sheet_headCells } from '../../../../libs/columnname';
import BasicTable from '../../../components/MUI/BasicTable';
import debounce from 'lodash/debounce';
import moment from 'moment';
import { _POST } from '../../../service/mas';
import { v4 as uuidv4 } from 'uuid';
import { dateFormatTimeEN, stringWithCommas } from '../../../../libs/datacontrol';
import DatePickerBasic from '../../../components/MUI/DetePickerBasic';
export default function TimeSheetBody({ onDataChange, options, revisionCurrent, actions, costCenter }) {
    const [workStartDate, setWorkStartDate] = useState(null);
    const [workEndDate, setWorkEndDate] = useState(null);
    const [technician, setTechnician] = useState(null);
    // const [workHour, setWorkHour] = useState<any>(null); //ใช้สำหรับ Drop Down 
    const [workHour, setWorkHour] = useState("");
    const [description, setDescription] = useState('');
    const [dataList, setDataList] = useState([]);
    const [error, setError] = useState(null); // สถานะสำหรับข้อผิดพลาด
    const [rejectJobReason, setRejectJobReason] = useState("");
    const [optionTechnician, setOptionTechnician] = useState(options?.technician || []);
    // Effect for fetching data in "Reade" mode
    useEffect(() => {
        const fetchDataForRead = async () => {
            if (!revisionCurrent) {
                console.error("revisionCurrent is null or undefined");
                setError("Invalid revision data");
                return;
            }
            console.log('Call : fetchDataForRead', /*revisionCurrent*/ moment().format('HH:mm:ss:SSS'));
            try {
                const dataset = {
                    req_id: revisionCurrent.reqId,
                    revision_id: revisionCurrent.revisionId,
                };
                const response = await _POST(dataset, "/api_trr_mes/ServiceTimeSheet/Sub_Time_Sheet_Get");
                if (response && response.status === "success") {
                    //console.log(response, 'Success fetch SubTimeSheet Get');
                    const subTimeSheet = response.data.map((dataSubTimeSheet) => ({
                        subTimeSheetId: dataSubTimeSheet.id,
                        no: dataSubTimeSheet.time_sheet_no,
                        work_start_date: dateFormatTimeEN(dataSubTimeSheet.work_start_date, "DD/MM/YYYY"),
                        work_end_date: dateFormatTimeEN(dataSubTimeSheet.work_end_date, "DD/MM/YYYY"),
                        technician: dataSubTimeSheet.technician,
                        work_hour: dataSubTimeSheet.work_hour,
                        description: dataSubTimeSheet.description,
                        rejectJobReason: dataSubTimeSheet.reject_job_reason
                    }));
                    setDataList(subTimeSheet);
                    //console.log(subTimeSheet, 'subTimeSheet');
                    // ตั้งค่า rejectJobReason จากข้อมูลที่ได้มา
                    const firstRejectReason = Array.isArray(subTimeSheet) ? subTimeSheet.find(item => item.rejectJobReason)?.rejectJobReason || "" : "";
                    setRejectJobReason(firstRejectReason);
                }
                else {
                    setError("Failed to fetch Sub Time Sheet.");
                }
            }
            catch (error) {
                console.error("Error fetch Sub Time Sheet:", error);
                setError("An error occurred while fetching Sub Time Sheet.");
            }
        };
        console.log(actions, "actionsactionsactionsactions");
        // Only call fetchDataForRead if the conditions are met
        if ((actions === "Reade" || actions === "JobDone" || actions === "TimeSheet") && revisionCurrent && revisionCurrent.reqId && revisionCurrent.revisionId) {
            fetchDataForRead();
        }
    }, [actions, revisionCurrent]);
    // Handler for adding new data in "TimeSheet" mode
    const handleSetDataList = () => {
        if (actions === "TimeSheet" && technician && workHour && description) {
            const newData = {
                subTimeSheetId: uuidv4(), // กำหนด uuid สำหรับแต่ละแถวใหม่
                no: dataList.length + 1, // เพิ่มหมายเลขลำดับที่
                work_start_date: dateFormatTimeEN(workStartDate, "DD/MM/YYYY"),
                work_end_date: dateFormatTimeEN(workEndDate, "DD/MM/YYYY"),
                technician,
                work_hour: workHour,
                description,
                newRowDataFlag: true, // ระบุว่าเป็นข้อมูลใหม่                
            };
            console.log(newData, "newDatanewDatanewDatanewData");
            setDataList((prevList) => [...prevList, newData]);
            setTechnician(null);
            setWorkHour("");
            setDescription('');
        }
    };
    // Handler for deleting data 
    const handleDelete = (subTimeSheetIdToDelete, isNewRow) => {
        console.log(`Deleting item with ID: ${subTimeSheetIdToDelete}`);
        if (isNewRow) {
            setDataList((prevList) => {
                //console.log("Previous List:", prevList);
                const newList = prevList.filter(({ subTimeSheetId }) => subTimeSheetId !== subTimeSheetIdToDelete);
                console.log("New List after deletion:", newList);
                return newList;
            });
        }
        else {
            // Handle cases where the item is not a new row
            setDataList((prevList) => prevList.map(item => item.subTimeSheetId === subTimeSheetIdToDelete
                ? { ...item, delete_flag: true } // Set delete_flag to 1 for existing rows
                : item));
        }
    };
    // Data preparation for "TimeSheet" mode
    const dataRow = useMemo(() => {
        // กรองข้อมูลที่มี delete_flag
        const filteredList = dataList.filter(row => !row.delete_flag);
        return filteredList.map((row, index) => {
            // console.log(`Row ID: ${row.no}`); // ตรวจสอบค่า ID
            // Extract the necessary primitive values for rendering
            const technicianName = row.technician?.tecEmpName || row.technician;
            const workHour = row.work_hour?.lov_code || row.work_hour;
            const isNewRow = row.newRowDataFlag;
            return {
                ...row,
                no: index + 1 || row.no, // ใช้ index ของ map ในการกำหนดหมายเลขลำดับ
                technician: technicianName, // แสดงชื่อ technician
                work_hour: workHour, // แสดง lov_code
                key: row.subTimeSheetId, // ใช้ subTimeSheetId เป็น key
                delete: (actions !== "Reade" && (_jsx(FullWidthButton, { labelName: "Delete", colorname: "error", handleonClick: () => handleDelete(row.subTimeSheetId, isNewRow), variant_text: "contained" }))),
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
    //วิธี กรองข้อมูลแบบ เชื่อมความสัมพันธ์
    React.useEffect(() => {
        const filterTechnician = options?.technician.filter((item) => (!costCenter?.siteId || item.siteId
            .toString()
            .includes(costCenter?.siteId || costCenter)));
        //console.log(filterTechnician,'sssssssssssssssssssssssss');
        setOptionTechnician(filterTechnician);
    }, [costCenter]);
    // Data preparation for "Reade" mode
    const readOnlyDataRow = useMemo(() => {
        if (actions === "Reade" || actions === "JobDone") {
            return dataList.map((row, index) => ({
                ...row,
                no: row.no, // ใช้ค่า time_sheet_no แทน index + 1,
                technician: row.technician,
                work_hour: row.work_hour,
                key: row.subTimeSheetId, // ใช้ subTimeSheetId เป็น key                
                delete: (actions !== "Reade" && actions !== "JobDone" && (_jsx(FullWidthButton, { labelName: "Delete", colorname: "error", handleonClick: () => handleDelete(row.subTimeSheetId, row.newRowDataFlag), variant_text: "contained" }, `delete-${index}`))),
            }));
        }
        return [];
    }, [dataList, actions]);
    // Function to handle data change with debounce
    const debouncedOnDataChange = debounce((data) => {
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
    // const isCheckHour = useMemo(() => {
    //     if(workHour != ""){
    //         console.log(workHour);
    //         if(workHour > 100){
    //             return true
    //         }
    //     }
    // }, [workHour]);
    return (_jsxs("div", { className: "border rounded-xl px-2 py-2", children: [_jsxs("div", { className: "row justify-start", children: [_jsx("div", { className: "col-12 col-md-6 mb-2", children: _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("div", { className: "w-full md:w-1/2", children: _jsx(DatePickerBasic, { labelname: "\u0E27\u0E31\u0E19\u0E40\u0E23\u0E34\u0E48\u0E21\u0E15\u0E49\u0E19", valueStart: workStartDate, onchangeStart: setWorkStartDate, disableFuture: true, disabled: actions === "Reade" || actions === "JobDone" }) }), _jsx("label", { className: "pt-5 mt-5 ", children: "\u0E16\u0E36\u0E07" }), _jsx("div", { className: "w-full md:w-1/2", children: _jsx(DatePickerBasic, { labelname: "\u0E27\u0E31\u0E19\u0E2A\u0E34\u0E49\u0E19\u0E2A\u0E38\u0E14", valueStart: workEndDate, onchangeStart: setWorkEndDate, disableFuture: true, disabled: actions === "Reade" || actions === "JobDone" }) })] }) }), _jsx("div", { className: "col-md-3 mb-2", children: _jsx(AutocompleteComboBox, { labelName: "\u0E0A\u0E48\u0E32\u0E07", column: "tecEmpName", setvalue: setTechnician, options: optionTechnician || [], value: technician, disabled: actions === "Reade" || actions === "JobDone" }) }), _jsx("div", { className: "col-md-3 mb-2", children: _jsx(FullWidthTextField, { labelName: "ชั่วโมงทำงาน", value: workHour ?? "", onChange: (value) => setWorkHour(stringWithCommas(value)), disabled: actions === "Reade" || actions === "JobDone" }) })] }), _jsxs("div", { className: "row justify-start", children: [_jsx("div", { className: "col-md-9 mb-2", children: _jsx(FullWidthTextareaField, { labelName: "\u0E23\u0E32\u0E22\u0E25\u0E30\u0E40\u0E2D\u0E35\u0E22\u0E14", onChange: (value) => setDescription(value), value: description, disabled: actions === "Reade" || actions === "JobDone" }) }), _jsx("div", { className: "col-md-1 mb-2 w-5 pt-10", children: actions === "TimeSheet" && (_jsx(FullWidthButton, { labelName: "+", handleonClick: handleSetDataList, colorname: "success", variant_text: "outlined" })) })] }), _jsx("div", { className: `table-container ${actions === "Reade" ? 'disabled' : ''}`, children: _jsx(BasicTable, { columns: actions === "Reade" || actions === "JobDone" ? Time_Sheet_headCells.filter((el) => el.columnName != "delete") : Time_Sheet_headCells, rows: actions === "TimeSheet" ? dataRow : readOnlyDataRow, actions: actions }) }), dataList.some(row => row.rejectJobReason && row.rejectJobReason !== "") && (_jsx("div", { className: "row justify-start pt-5", children: _jsx("div", { className: "col-md-12 mb-2", children: _jsx(FullWidthTextareaField, { labelName: "เหตุผลปฏิเสธงาน", value: rejectJobReason, disabled: true, multiline: true, onChange: (value) => setRejectJobReason(value) }) }) }))] }));
}
