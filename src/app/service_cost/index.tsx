import React, { ChangeEvent, useEffect, useState } from 'react';
import FullWidthTextField from '../../components/MUI/FullWidthTextField';
import FullWidthButton from '../../components/MUI/FullWidthButton';
import EnhancedTable from '../../components/MUI/DataTables';
import FuncDialog from '../../components/MUI/FullDialog';
import * as XLSX from 'xlsx';
import { useDispatch, useSelector } from 'react-redux';
import CutOffBody from './component/CutOffBody';
import moment from 'moment';
import { getCurrentAccessObject, updateSessionStorageCurrentAccess } from '../../service/initmain';
import { confirmModal } from '../../components/MUI/Comfirmmodal';
import { endLoadScreen, startLoadScreen } from '../../../redux/actions/loadingScreenAction';
import { Massengmodal } from '../../components/MUI/Massengmodal';
import { _POST } from '../../service/mas';
import { service_cost_headCells } from '../../../libs/columnname';
import ActionManageCell from '../../components/MUI/ActionManageCell';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { green, grey } from '@mui/material/colors';
import AutocompleteComboBox from '../../components/MUI/AutocompleteComboBox';
import { v4 as uuidv4 } from "uuid";
import ServiceCostBody from './component/ServiceCostBody';
import { useListServiceCost } from './core/service_cost_provider';
import '../service_cost/css/styles.css';  // นำเข้าไฟล์ CSS
import { checkValidate, isCheckValidateAll } from '../../../libs/validations';

interface OptionsState {

}

const initialOptions: OptionsState = {

};

export default function ServiceCost() {
    const {

        defaultDataList,
        setDefaultDataList,
        cutOffMonthAndYear,
        setCutOffMonthAndYear,
        currentAccessModel,
        setCurrentAccessModel,
        setIsValidate,

    } = useListServiceCost();

    const dispatch = useDispatch()
    const [actionType, setActionType] = useState<string | null>(null);
    const [excelData, setExcelData] = useState<any[]>([]); // เก็บข้อมูล Excel ที่อัปโหลด

    //============================== useState ข้อมูลเริ่มต้น / ข้อมูลตาราง ================================
    const [dataList, setDataList] = useState<any[]>([]);
    const [options, setOptions] = useState<OptionsState>(initialOptions); // State for combobox options
    const [resultData, setResultData] = useState<any>(null); // State to store draft data   // State to store serviceCost data  
    const menuFuncList = useSelector((state: any) => state?.menuFuncList);
    const [openAdd, setOpenAdd] = useState(false);
    const [openView, setOpenView] = useState<any>(false);
    const [openAllocateCost, setOpenAllocateCost] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const currentUser = useSelector((state: any) => state?.user?.user);

    //========================= useState ช่องค้นหาข้อมูล ==============================================
    // const currentYear = new Date().getFullYear();

    // const monthYearOptions = Array.from({ length: 12 }, (_, i) => ({
    //     id: uuidv4(),
    //     label: `${String(i + 1).padStart(2, "0")}/${currentYear}`,
    //     value: `${String(i + 1).padStart(2, "0")}/${currentYear}`
    // }));
    // //
    // const [selectedStart, setSelectedStart] = useState<any>(monthYearOptions[0]);
    // const [selectedEnd, setSelectedEnd] = useState<any>(monthYearOptions[11]);

    const [dateStart, setDateStart] = useState("");
    const [dateEnd, setDateEnd] = useState("");


    //ตัวแปร ใช้ทุกที่
    const employeeUsername = currentUser?.employee_username.toLowerCase()
    const roleName = currentUser?.role_name;
    const roleId = currentUser?.role_id;
    //const showButton = (menuFuncList || []).some((menuFunc: any) => menuFunc.func_name === "Add");
    const isValidationEnabled = import.meta.env.VITE_APP_ENABLE_VALIDATION === 'true'; // ตรวจสอบว่าเปิดการตรวจสอบหรือไม่
    const employeeDomain = currentUser?.employee_domain;
    const screenName = 'Service Cost';

    useEffect(() => {
        const currentAccessDataList = {
            employeeUsername: employeeUsername,
            employeeDomain: employeeDomain,
            screenName: screenName, // Ensure screenName is defined.
        };

        setCurrentAccessModel(currentAccessDataList);
    }, [employeeUsername, employeeDomain, screenName]); // Add dependencies here.



    //===================================== เริ่มการทำงาน หลัก ===============================================

    // Use useEffect to call dataTableMasterUser_GET only on specific action
    useEffect(() => {

        if (actionType) {
            dataTableCutOff_GET(); // ดึงข้อมูลใส่ตารางใหม่
            setActionType(null); // Reset actionType after fetching data
        }
    }, [actionType]);

    //============================= เริ่มการทำงาน handleClick =============================================

    //------------------- ค้นหาข้อมูล
    const handleSearch = () => {
        setActionType('search');
    };

    //------------------- รีเซ็ตข้อมูล
    const handleReset = () => {
        // setSelectedStart(monthYearOptions[0])
        // setSelectedEnd(monthYearOptions[11])
        setDateStart("");
        setDateEnd("");
        setActionType('reset');
    };

    //------------------- ปิดการทำงาน Modals
    const handleClose = () => {
        setOpenAdd(false);
        setOpenView(false);
        setOpenAllocateCost(false);
        setCutOffMonthAndYear("");
        setIsValidate(false);
        dataTableCutOff_GET();
    };

    //------------------- ดึงข้อมูลจาก Modals
    const handleDataChange = (data: any) => {
        //console.log(data, 'data');
        setResultData(data);

    };

    //------------------- เพิ่มข้อมูล
    const handleClickAdd = () => {
        setOpenAdd(true);
    };

    //------------------- ดูข้อมูล
    const handleClickView = (data: any) => {
        console.log(data, 'ตอนกดปุ่ม View : ข้อมูล data');

        setOpenView(true);
        setDefaultDataList(data)
        setCutOffMonthAndYear(data.cut_off_month + '/' + data.cut_off_year)


    };
    //------------------- ปันส่วนค่าใช้จ่าย 
    const handleClickAllocateCost = (data: any) => {
        //console.log(data, 'ตอนกดปุ่ม View : ข้อมูล data');

        setOpenAllocateCost(true);
        setDefaultDataList(data)
        setCutOffMonthAndYear(data.cut_off_month + '/' + data.cut_off_year)

    };

    //===================================== เริ่มการทำงาน หลัก ===============================================       
    //------------------- เรียกใช้ตาราง User Get 
    useEffect(() => {
        console.log('Call : 🟢[2] fetch Data TableMasterUser GET', moment().format('HH:mm:ss:SSS'));
        //console.log(monthYearOptions, 'monthYearOptions');

        if (!currentUser) return;
        dataTableCutOff_GET();

    }, [currentUser]);

    //-------------------- Get ดึงข้อมูลใส่ ตาราง
    const dataTableCutOff_GET = async () => {
        console.log('Call : dataTableCutOff_GET', moment().format('HH:mm:ss:SSS'));

        if (!currentUser) return;

        // ตรวจสอบว่าเดือนเริ่มต้นมากกว่าหรือเท่ากับเดือนสิ้นสุด
        // if (selectedStart.value && selectedEnd.value && selectedStart.value > selectedEnd.value) {
        if (dateStart && dateEnd && dateStart > dateEnd) {
            // alert('กรุณาตรวจสอบรูปแบบเดือนให้ถูกต้อง: เดือนเริ่มต้นไม่สามารถมากกว่าหรือเท่ากับเดือนสิ้นสุด');
            Massengmodal.createModal(
                <div className="text-center p-4">
                    <p className="text-xl font-semibold mb-2 text-green-600">กรุณาตรวจสอบรูปแบบเดือนให้ถูกต้อง: เดือนเริ่มต้นไม่สามารถมากกว่าหรือเท่ากับเดือนสิ้นสุด</p>
                </div>,
                'error',
                async () => {
                    dispatch(endLoadScreen());
                    setDateStart("");
                    setDateEnd("");
                    // setSelectedStart(monthYearOptions[0])
                    // setSelectedEnd(monthYearOptions[11])

                }
            );
            return; // ออกจากฟังก์ชันหากตรวจพบข้อผิดพลาด
        }

        const dataset = {

            cutOffModel: {
                // start_month: selectedStart.value || null,
                // end_month: selectedEnd.value || null          
                start_month: dateStart || null,
                end_month: dateEnd || null
            },
            currentAccessModel: getCurrentAccessObject(employeeUsername, employeeDomain, screenName)
        };

        try {
            const response = await _POST(dataset, "/api_trr_mes/CutOff/CutOff_Get");

            if (response && response.status === "success") {
                const { data: result } = response;

                const newData: any = []

                Array.isArray(result) && result.forEach((el) => {
                    //console.log(el, "😊😊😊");
                    // ใช้ไอคอนจาก Material UI แทนค่า true/false
                    el.cut_off_flag_label = el.cut_off_flag ? (
                        <CheckCircleIcon style={{ color: green[500] }} />
                    ) : (
                        // <CancelIcon style={{ color: grey[400] }} />
                         "-"
                    );

                    el.import_service_cost_flag_label = el.import_service_cost_flag ? (
                        <CheckCircleIcon style={{ color: green[500] }} />
                    ) : (
                        // <CancelIcon style={{ color: grey[400] }} />
                        "-"
                    );

                    el.allcate_flag_label = el.allcate_flag ? (
                        <CheckCircleIcon style={{ color: green[500] }} />
                    ) : (
                        // <CancelIcon style={{ color: grey[400] }} />
                         "-"
                    );

                    el.cut_off_month_and_year_label = el.cut_off_month + "/" + el.cut_off_year

                    el.ACTION = null
                    el.ACTION = (
                        <ActionManageCell
                            onClick={(name) => {
                                if (name == 'View') {
                                    handleClickView(el)
                                } else if (name == 'Allocate Cost') {
                                    handleClickAllocateCost(el)
                                }
                            }}
                        //Defauft={true} //กรณีที่เป็นโหมดธรรมดาไม่มีเงื่อนไขซับซ้อน
                        />
                    )

                    newData.push(el)
                })
                console.log(newData, 'ค่าที่ดึงจาก ตาราง');

                setDataList(newData);
            }
        } catch (e) {
            console.error("Error fetching :", e);
        }
    };

    //-------------------- Add Data ไปลง Database
    const serviceCostAdd = () => {
        console.log('Call : serviceCostAdd', resultData, moment().format('HH:mm:ss:SSS'));

        // เรียกใช้งานฟังก์ชัน  Update Current Access Event Name
        updateSessionStorageCurrentAccess('event_name', 'Add/serviceCostAdd')

        const dataForValidate = {
            asOfMonth: resultData?.selectedMonth ? `${resultData?.selectedMonth?.value}/${resultData?.selectedYear?.value}` : null,
            asOfYear: resultData?.selectedYear ? `${resultData?.selectedMonth?.value}/${resultData?.selectedYear?.value}` : null
        }
        const isValidate = checkValidate(dataForValidate, ['asOfMonth', 'asOfYear'],);

        const isValidateAll = isCheckValidateAll(isValidate);

        console.log(dataForValidate, 'test');
        if (Object.keys(isValidateAll).length > 0 && isValidationEnabled) {
            console.log(isValidateAll,);
            setIsValidate(isValidate);
            return;
        }
        setIsValidate(null);
        // console.log('Call : isValidate', isValidate, moment().format('HH:mm:ss:SSS'));
        // console.log('Call : isValidateAll', isValidateAll, moment().format('HH:mm:ss:SSS'));
        confirmModal.createModal("ยืนยันที่จะบันทึกหรือไม่ ?", "info", async () => {
            if (resultData) {

                console.log("Saving serviceCostAdd data:", resultData);

                // สร้างข้อมูลที่จะส่ง
                const payload = {
                    closeMonthlyCutOffModel: {
                        as_of_month: `${resultData?.selectedMonth?.value}/${resultData?.selectedYear?.value}`
                    },
                    currentAccessModel: getCurrentAccessObject(employeeUsername, employeeDomain, screenName)
                };

                dispatch(startLoadScreen());
                setTimeout(async () => {
                    try {
                        console.log('serviceCostAdd model', payload);

                        // ใช้ _POST เพื่อส่งข้อมูล
                        const response = await _POST(payload, "/api_trr_mes/CutOff/CloseMonthlyCutOff");

                        if (response && response.status === "success") {
                            console.log('serviceCostAdd successfully:', response);

                            // เพิ่มโค้ดที่ต้องการเมื่อบันทึกสำเร็จ
                            Massengmodal.createModal(
                                <div className="text-center p-4">
                                    <p className="text-xl font-semibold mb-2 text-green-600">Success</p>
                                    {/* <p className="text-lg text-gray-800">
                            <span className="font-semibold text-gray-900">Request No:</span>
                            <span className="font-bold text-indigo-600 ml-1">{response.req_no}</span>
                          </p> */}
                                </div>,
                                'success',
                                async () => {
                                    dispatch(endLoadScreen());
                                    handleClose();
                                });
                        } else {
                            console.error('Failed to serviceCostAdd:', response);
                            dispatch(endLoadScreen());
                            // เพิ่มโค้ดที่ต้องการเมื่อเกิดข้อผิดพลาด
                            Massengmodal.createModal(
                                <div className="text-center p-4">
                                    <p className="text-xl font-semibold mb-2 text-green-600">{response.data[0].errorMessage}</p>
                                    {/* <p className="text-lg text-gray-800">
                            <span className="font-semibold text-gray-900">Request No:</span>
                            <span className="font-bold text-indigo-600 ml-1">{response.req_no}</span>
                          </p> */}
                                </div>,
                                'error',
                                async () => {
                                    dispatch(endLoadScreen());
                                });
                        }
                    } catch (error) {
                        console.error('Error serviceCostAdd:', error);
                        dispatch(endLoadScreen());
                        // เพิ่มโค้ดที่ต้องการเมื่อเกิดข้อผิดพลาดในการส่งข้อมูล
                    }

                }, 0);
            }
        });

    };

    //-------------------- Add Data ไปลง Database
    const allocateCost = () => {
        console.log('Call : allocateCost', resultData, moment().format('HH:mm:ss:SSS'));

        // เรียกใช้งานฟังก์ชัน  Update Current Access Event Name
        updateSessionStorageCurrentAccess('event_name', 'Add/Service_Request_Draft_Add')

        // const dataForValidate = {
        //     costCenter: draftData.costCenter,
        //     serviceCenter: draftData.serviceCenter,
        //     jobType: draftData.jobType,
        //     budgetCode: draftData?.jobType?.lov_code === "Repair" ? false : draftData.budgetCode,
        // }
        // const isValidate = checkValidate(dataForValidate, ['costCenter', 'serviceCenter', 'jobType', 'budgetCode', 'fixedAssetCode']);

        // if (draftData?.jobType?.lov_code === "Repair") {
        //     isValidate.budgetCode = false;
        // }

        // const isValidateAll = isCheckValidateAll(isValidate);

        // if (isDuplicate && isValidationEnabled) {
        //     return;
        // }
        // console.log(isValidateAll,);
        // if (Object.keys(isValidateAll).length > 0 && isValidationEnabled) {
        //     console.log(isValidateAll,);
        //     setIsValidate(isValidate);
        //     return;
        // }
        // setIsValidate(null);
        // console.log('Call : isValidate', isValidate, moment().format('HH:mm:ss:SSS'));
        // console.log('Call : isValidateAll', isValidateAll, moment().format('HH:mm:ss:SSS'));
        // confirmModal.createModal("ยืนยันที่จะบันทึกหรือไม่ ?", "info", async () => {
        //     if (resultData) {

        //         console.log("Saving serviceCostAdd data:", resultData);

        //         // สร้างข้อมูลที่จะส่ง
        //         const payload = {
        //             closeMonthlyCutOffModel: {
        //                 as_of_month: `${resultData?.selectedMonth?.value}/${resultData?.selectedYear?.value}`
        //             },
        //             currentAccessModel: getCurrentAccessObject(employeeUsername, employeeDomain, screenName)
        //         };

        //         dispatch(startLoadScreen());
        //         setTimeout(async () => {
        //             try {
        //                 console.log('serviceCostAdd model', payload);

        //                 // ใช้ _POST เพื่อส่งข้อมูล
        //                 const response = await _POST(payload, "/api_trr_mes/CutOff/CloseMonthlyCutOff_Reset");

        //                 if (response && response.status === "success") {
        //                     console.log('serviceCostAdd successfully:', response);

        //                     // เพิ่มโค้ดที่ต้องการเมื่อบันทึกสำเร็จ
        //                     Massengmodal.createModal(
        //                         <div className="text-center p-4">
        //                             <p className="text-xl font-semibold mb-2 text-green-600">Success</p>
        //                             {/* <p className="text-lg text-gray-800">
        //                     <span className="font-semibold text-gray-900">Request No:</span>
        //                     <span className="font-bold text-indigo-600 ml-1">{response.req_no}</span>
        //                   </p> */}
        //                         </div>,
        //                         'success',
        //                         async () => {
        //                             dispatch(endLoadScreen());
        //                             handleClose();
        //                         });
        //                 } else {
        //                     console.error('Failed to serviceCostAdd:', response);
        //                     dispatch(endLoadScreen());
        //                     // เพิ่มโค้ดที่ต้องการเมื่อเกิดข้อผิดพลาด
        //                     Massengmodal.createModal(
        //                         <div className="text-center p-4">
        //                             <p className="text-xl font-semibold mb-2 text-green-600">{response.data[0].errorMessage}</p>
        //                             {/* <p className="text-lg text-gray-800">
        //                     <span className="font-semibold text-gray-900">Request No:</span>
        //                     <span className="font-bold text-indigo-600 ml-1">{response.req_no}</span>
        //                   </p> */}
        //                         </div>,
        //                         'error',
        //                         async () => {
        //                             dispatch(endLoadScreen());
        //                         });
        //                 }
        //             } catch (error) {
        //                 console.error('Error serviceCostAdd:', error);
        //                 dispatch(endLoadScreen());
        //                 // เพิ่มโค้ดที่ต้องการเมื่อเกิดข้อผิดพลาดในการส่งข้อมูล
        //             }

        //         }, 0);
        //     }
        // });

    };









    // ล้าง excelData เมื่อ dialog เปิด
    // useEffect(() => {
    //     //console.log(currentUser, 'currentUser');

    //     if (openAdd) {
    //         setExcelData([]); // ล้างข้อมูล Excel ทุกครั้งที่เปิด dialog
    //     }
    // }, [openAdd, currentUser]);

    // useEffect(() => {

    //     //console.log(excelData, 'excelData');



    // }, [excelData]);

    return (
        <div>
            <div className="max-lg rounded overflow-hidden shadow-xl bg-white mt-5 mb-5">
                {/* ค้นหาข้อมูล */}
                <div className="px-6 pt-4">
                    <label className="text-2xl ml-2 mt-3 mb-5 sarabun-regular">ค้นหาข้อมูล</label>
                </div>
                <div className="row px-10 pt-0 pb-5">

                    <div className="px-10 pt-0 pb-5">
                        <div className="flex items-center space-x-4">
                            {/* ฟิลด์เลือกเดือน/ปีเริ่มต้น */}
                            <div className="w-full md:w-3/12">
                                <FullWidthTextField
                                    labelName={"เดือน/ปี (Ex.01/2024)"}
                                    value={dateStart}
                                    onChange={(value) => setDateStart(value)}
                                />
                                {/* <AutocompleteComboBox
                                    required="required"
                                    labelName="เดือนเริ่มต้น"
                                    column="label"
                                    setvalue={setSelectedStart}
                                    options={monthYearOptions}
                                    value={selectedStart}
                                /> */}
                            </div>
                            {/* ป้ายกำกับ "ถึง" */}
                            {/* <label className="text-lg pt-10">ถึง</label> */}
                            {/* ฟิลด์เลือกเดือน/ปีสิ้นสุด */}
                            {/* <div className="w-full md:w-2/12">
                                <FullWidthTextField
                                    labelName={"เดือนสิ้นสุด"}
                                    value={dateEnd}
                                    onChange={(value) => setDateEnd(value)}
                                />
                            </div> */}
                        </div>
                    </div>
                    <div className="flex justify-end pt-2">
                        <div className="col-md-1 px-1">
                            <FullWidthButton
                                labelName={"ค้นหา"}
                                handleonClick={handleSearch}
                                variant_text="contained"
                                colorname={"success"}
                            />
                        </div>
                        <div className="col-md-1 px-1">
                            <FullWidthButton
                                labelName={"รีเซ็ต"}
                                handleonClick={handleReset}
                                variant_text="contained"
                                colorname={"inherit"}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* ตารางข้อมูล */}
            <div className="max-lg rounded overflow-hidden shadow-lg bg-white mb-5">
                <div>
                    <EnhancedTable
                        buttonLabal_1={"ปิดงวด"}
                        buttonColor_1="info"
                        rows={dataList}
                        headCells={service_cost_headCells}
                        handleonClick_1={handleClickAdd}
                        tableName={"รายการสรุป Allocate แต่ละเดือน"}
                    />
                </div>
                {/* Dialog สำหรับอัปโหลดไฟล์ */}
                <FuncDialog
                    open={openAdd}
                    dialogWidth="xl"
                    openBottonHidden={true}
                    titlename={'ปิดงวด'}
                    handleClose={handleClose}
                    handlefunction={serviceCostAdd}
                    colorBotton="success"
                    actions={"Cutoff"}
                    element={
                        <CutOffBody
                            onDataChange={handleDataChange}
                        />}
                />
                <FuncDialog
                    open={openView}
                    dialogWidth="xl"
                    openBottonHidden={true}
                    titlename={'ดูข้อมูล'}
                    handleClose={handleClose}
                    handlefunction={allocateCost}
                    colorBotton="success"
                    actions={"Reade"}
                    element={
                        <ServiceCostBody
                            onDataChange={handleDataChange}
                            actions={"Reade"}
                            handleClose={handleClose}
                        />}
                />
                <FuncDialog
                    open={openAllocateCost}
                    dialogWidth="xl"
                    openBottonHidden={true}
                    titlename={'ปันส่วนค่าใช้จ่าย / สรุปปันส่วนค่าใช้จ่าย'}
                    handleClose={handleClose}
                    //handlefunction={serviceCostAdd}
                    colorBotton="success"
                    actions={"AllocateCost"}
                    element={
                        <ServiceCostBody
                            onDataChange={handleDataChange}
                            actions={"AllocateCost"}
                            handleClose={handleClose}
                        />}
                />


                {/* Dialog สำหรับอัปโหลดไฟล์ */}
                {/* <FuncDialog
                    open={openAdd}
                    dialogWidth="xl"
                    openBottonHidden={true}
                    titlename={'อัปโหลด Service Cost'}
                    handleClose={handleClose}
                    handlefunction={serviceCostAdd}  
                    colorBotton="success"
                    actions={"ImportFile"}
                    element={
                        <ServiceCostBody
                            handleFileUpload={handleFileUpload}
                            excelData={excelData} // ส่งข้อมูลที่ได้จากการอัปโหลดไปยัง ServiceCostBody
                        />} // ส่งฟังก์ชัน handleFileUpload ไปยัง ServiceCostBody
                /> */}
            </div>
        </div>
    );
}
