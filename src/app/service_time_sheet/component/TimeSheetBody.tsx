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
import { dateFormatTimeEN, stringWithCommas } from '../../../../libs/datacontrol';
import DatePickerBasic from '../../../components/MUI/DetePickerBasic';
import { checkValidate, isCheckValidateAll } from '../../../../libs/validations';
import { useListServiceTimeSheet } from '../core/service_time_sheet_provider';


interface TimeSheetBodyProps {
    onDataChange?: (data: any[]) => void;
    options?: {
        technician: any[];
        workHour: any[];
    };
    serviceCenter: any;
    revisionCurrent: any;
    actions?: string;
}

export default function TimeSheetBody({
    onDataChange,
    options,
    revisionCurrent,
    actions,
    serviceCenter
}: TimeSheetBodyProps) {

    const { isValidate, setIsValidate } = useListServiceTimeSheet()
    const [workStartDate, setWorkStartDate] = useState(null);
    const [workEndDate, setWorkEndDate] = useState(null);
    const [technician, setTechnician] = useState<any>(null);
    // const [workHour, setWorkHour] = useState<any>(null); //ใช้สำหรับ Drop Down 
    const [workHour, setWorkHour] = useState<any>("");
    const [description, setDescription] = useState('');
    const [dataList, setDataList] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null); // สถานะสำหรับข้อผิดพลาด
    const [rejectJobReason, setRejectJobReason] = useState("");
    const [optionTechnician, setOptionTechnician] = useState<any>(options?.technician || []);

    //Validate
    const [lovData, setLovData] = useState<any[]>([]); // Store response data
    const [workHourMax, setWorkHourMax] = useState<any>(""); // Your workHour state

    const isValidationEnabled = import.meta.env.VITE_APP_ENABLE_VALIDATION === 'true'; // ตรวจสอบว่าเปิดการตรวจสอบหรือไม่

    //Validate เลือกได้เฉพราะเดือนปัจจุบัน
    const year = dayjs(new Date()).format("YYYY")
    const month = dayjs(new Date()).format("MM")
    const minDate = dayjs(new Date(Number(year), Number(month) - 1, 1));
    const maxDate = dayjs(new Date(Number(year), Number(month) + 1, 0));


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
                    const subTimeSheet = response.data.map((dataSubTimeSheet: any) => ({
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



                } else {
                    setError("Failed to fetch Sub Time Sheet.");
                }
            } catch (error) {
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

        const data = {
            work_start_date: dateFormatTimeEN(workStartDate, "DD/MM/YYYY"),
            work_end_date: dateFormatTimeEN(workEndDate, "DD/MM/YYYY"),
            technician: technician?.tecEmpName,
            work_hour: workHour,
            description
        }
        console.log(data, 'data');

        const isValidate = checkValidate(data, []);
        console.log(isValidate, 'isValidate');
        const isValidateAll = isCheckValidateAll(isValidate);
        if (Object.keys(isValidateAll).length > 0 && isValidationEnabled) {
            setIsValidate(isValidate);
            return;
        }

        if (isCheckHour && isValidationEnabled) {
            setIsValidate(null);
            return;
        }

        setIsValidate(null);
        if (actions === "TimeSheet" || actions === "JobDone" && technician && workHour && description) {
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
            setIsValidate(null);
            setWorkStartDate(null);
            setWorkEndDate(null);
            setTechnician(null);
            setWorkHour("");
            setDescription('');
        }
    };

    // Handler for deleting data 
    const handleDelete = (subTimeSheetIdToDelete: string, isNewRow: boolean) => {
        console.log(`Deleting item with ID: ${subTimeSheetIdToDelete}`);

        if (isNewRow) {
            setDataList((prevList) => {
                //console.log("Previous List:", prevList);
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
            const technicianName = row.technician?.tecEmpName || row.technician;
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

    //วิธี กรองข้อมูลแบบ เชื่อมความสัมพันธ์
    React.useEffect(() => {


        const filterTechnician = options?.technician.filter((item: any) =>
        (!serviceCenter?.serviceCenterId || item.costCenterId
            .toString()
            .includes(serviceCenter?.serviceCenterId || serviceCenter))
        );
        //console.log(filterTechnician,'sssssssssssssssssssssssss');
        setOptionTechnician(filterTechnician);

    }, [serviceCenter]);

    // Data preparation for "Reade" mode
    const readOnlyDataRow = useMemo(() => {
        if (actions === "Reade" || actions === "JobDone") {
            return dataList.map((row, index) => ({
                ...row,
                no: row.no, // ใช้ค่า time_sheet_no แทน index + 1,
                technician: row.technician,
                work_hour: row.work_hour,
                key: row.subTimeSheetId, // ใช้ subTimeSheetId เป็น key                
                delete: (
                    actions !== "Reade" && actions !== "JobDone" && (
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
        if (actions === "TimeSheet" || actions === "JobDone") {
            // Call debounced function
            debouncedOnDataChange(dataList);
        }
    }, [dataList, debouncedOnDataChange, actions]);

    // Fetch max work hour data with useEffect
    useEffect(() => {
        const fetchMaxWorkHour = async () => {
            const dataset = {
                lov_type: 'work_hour_minmax_type',
                lov_code: 'Maximum',
            };

            try {
                const response = await _POST(dataset, "/api_trr_mes/LovData/Lov_Data_Get");

                if (response && response.status === "success") {
                    const fetchedData = response.data.map((item: any) => ({
                        lov_code: item.lov_code,
                        hourMax: item.lov1,  // Assuming 'lov1' holds the max hour
                    }));

                    setLovData(fetchedData);

                    if (fetchedData.length > 0) {
                        setWorkHourMax(parseInt(fetchedData[0].hourMax, 10)); // Set first entry as max hour
                    }
                }
            } catch (error) {
                console.error("Error fetching max work hour:", error);
            }
        };

        fetchMaxWorkHour();
    }, []); // Run once on mount

    // Memoize the check logic
    const isCheckHour = useMemo(() => {
        if (workHour !== "" && workHourMax !== null) {
            setIsValidate(null);
            return parseInt(workHour, 10) > workHourMax;

        } else {
            setIsValidate(null);
        }
        return false;
    }, [workHour, workHourMax]);



    return (
        <div className="border rounded-xl px-2 py-2">
            <div className="row justify-start">
                <div className="col-12 col-md-6 mb-2">
                    <div className="flex items-center space-x-2">
                        <div className="w-full md:w-1/2">
                            <DatePickerBasic
                                required={"required"}
                                labelname="วันเริ่มต้น"
                                valueStart={workStartDate}
                                onchangeStart={(value) => {
                                    setWorkStartDate(value)
                                    setWorkEndDate(null)
                                }}
                                disablePast
                                disabled={actions === "Reade" || actions === "JobDone"}
                                validate={isValidate?.work_start_date}
                                checkValidateMonth={true}                               
                            />
                        </div>
                        <label className="pt-5 mt-5 ">ถึง</label>
                        <div className="w-full md:w-1/2">
                            <DatePickerBasic
                                required={"required"}
                                labelname="วันสิ้นสุด"
                                valueStart={workEndDate}
                                onchangeStart={setWorkEndDate}
                                disablePast
                                disabled={actions === "Reade" || actions === "JobDone"}
                                validate={isValidate?.work_start_date}
                                checkValidateMonth={true}
                                startDate={workStartDate}  // ส่งค่า endDate เข้ามาเพื่อตรวจสอบ
                            />
                        </div>
                    </div>
                </div>
                <div className="col-md-3 mb-2">
                    <AutocompleteComboBox
                        required={"required"}
                        labelName="ช่าง"
                        column="tecEmpName"
                        setvalue={setTechnician}
                        options={optionTechnician || []}
                        value={technician}
                        disabled={actions === "Reade" || actions === "JobDone"}
                        Validate={isValidate?.technician}
                    />
                </div>
                <div className="col-md-3 mb-2">
                    <FullWidthTextField
                        required={"required"}
                        labelName={"ชั่วโมงทำงาน"}
                        value={workHour ?? ""}
                        onChange={(value: any) => setWorkHour(stringWithCommas(value))}
                        disabled={actions === "Reade" || actions === "JobDone"}
                        Validate={isValidate?.work_hour}
                        isCheckHour={isCheckHour}
                    />
                    {/* ปิดไว้ก่อนเผื่อกลับมาใช้ */}
                    {/* <AutocompleteComboBox
                        labelName="Work Hour"
                        column="lov_code"
                        setvalue={setWorkHour}
                        options={options?.workHour || []}
                        value={workHour}
                        disabled={actions === "Reade" || actions === "JobDone"}
                    /> */}
                </div>
            </div>
            <div className="row justify-start">
                <div className="col-md-9 mb-2">
                    <FullWidthTextareaField
                        required={"required"}
                        labelName="รายละเอียด"
                        onChange={(value) => setDescription(value)}
                        value={description}
                        disabled={actions === "Reade" || actions === "JobDone"}
                        Validate={isValidate?.description}
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
                    columns={actions === "Reade" || actions === "JobDone" ? Time_Sheet_headCells.filter((el) => el.columnName != "delete") : Time_Sheet_headCells}
                    rows={actions === "TimeSheet" ? dataRow : readOnlyDataRow}
                    actions={actions}
                />
            </div>

            {dataList.some(row => row.rejectJobReason && row.rejectJobReason !== "") && (
                <div className="row justify-start pt-5">
                    <div className="col-md-12 mb-2">
                        <FullWidthTextareaField
                            labelName={"เหตุผลปฏิเสธงาน"}
                            value={rejectJobReason}
                            disabled={true}
                            multiline={true}
                            onChange={(value) => setRejectJobReason(value)}
                        />
                    </div>
                </div>
            )}


        </div>
    );
}
