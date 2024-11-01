import React, { useEffect, useState } from 'react'
import moment from 'moment'
import { useListConCenter } from './core/CostCenterProvider'
import { _GET, _POST } from '../../../service'
import ActionManageCell from '../../../components/MUI/ActionManageCell'
import CustomizedSwitches from '../../../components/MUI/MaterialUISwitch'
import FullWidthTextField from '../../../components/MUI/FullWidthTextField'
import FullWidthButton from '../../../components/MUI/FullWidthButton'
import AutocompleteComboBox from '../../../components/MUI/AutocompleteComboBox'
import { useDispatch, useSelector } from 'react-redux'
import FuncDialog from '../../../components/MUI/FullDialog'
import EnhancedTable from '../../../components/MUI/DataTables'
import CostCenterBody from './component/CostCenterBody'
import { Master_Cost_Center } from '../../../../libs/columnname'
import { dateFormatTimeEN } from '../../../../libs/datacontrol'
import { createFilterOptions } from '@mui/material'
import { checkValidate, isCheckValidateAll } from '../../../../libs/validations'
import { confirmModal } from '../../../components/MUI/Comfirmmodal'
import { endLoadScreen, startLoadScreen } from '../../../../redux/actions/loadingScreenAction'
import { Massengmodal } from '../../../components/MUI/Massengmodal'
import { result } from 'lodash'
import { v4 as uuidv4 } from 'uuid';
import { getCurrentAccessObject, updateSessionStorageCurrentAccess } from '../../../service/initmain'
import { setValueMas } from '../../../../libs/setvaluecallback'

//======================== OptionsState ข้อมูล Drop Down ==========================
/* --------- ให้สร้าง interface optionsState เพื่อระบุประเภท (Type) --------- */
interface OptionsState {
    siteData: any[];
    costcenterData: any[];
}

// const initialOptions: OptionsState = {
//     siteData: [],
//     costcenterData: [],
// };

//=================================== set ข้อมูล  ==================================
//------------------- ประกาศค่าเริ่มต้น

const initialCostCenterValues = { //-----สร้างหน้าใหม่ให้เปลี่ยนแค่ชื่อ
    costcenterId: "",
    siteCode: "",
    costcenterCode: "",
    costcenterName: "",
    appReqUser: "",
    serviceCenter: false
};

export default function CostCenter() {

    //========================= SearchCostCenter ช่องค้นหาข้อมูล ==============================================
    const [dataCostCenter, setDataCostCenter] = useState<any[]>([]);
    const [selectsiteCode, setSelectSiteCode] = useState<any>(null); // Dropdown : Site Code
    const [siteCode, setSiteCode] = useState<any>(null);
    const [costcenterCode, setCostCenterCode] = useState("");
    const [costcenterName, setCostCenterName] = useState("");
    const [appReqUser, setAppReqUser] = useState("");
    // const [optionsSearch, setOptionsSearch] = useState<OptionsState>(initialOptions); // State for combobox options
    // const [options, setOptions] = useState<OptionsState>(initialOptions); // State for combobox options
    const handleAutocompleteChange = (setter: React.Dispatch<React.SetStateAction<any>>) => (value: any) => {
        setter(value);
    };
    const [actionType, setActionType] = useState<string | null>(null); // Corrected type
    const [error, setError] = useState<string | null>(null); // แสดงสถานะสำหรับข้อผิดพลาด

    //============================== useState ข้อมูลเริ่มต้น / ข้อมูลตาราง ================================
    const menuFuncList = useSelector((state: any) => state?.menuFuncList);
    const [openAdd, setOpenAdd] = useState(false);
    const [openView, setOpenView] = useState<any>(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const currentUser = useSelector((state: any) => state?.user?.user);

    // State to store default values รับและส่ง
    const [defaultValues, setDefaultValues] = useState(initialCostCenterValues);
    const [resultData, setResultData] = useState<any>(null); // State to store draft data  

    //ตัวแปร ใช้ทุกที่ : ไว้จัดการสิทธิ์ให้ปุ่ม "เพิ่ม" แสดง และ ไม่แสดง
    const employeeUsername = currentUser?.employee_username.toLowerCase()
    const showButton = (menuFuncList || []).some((menuFunc: any) => menuFunc.func_name === "Add");
    const isValidationEnabled = import.meta.env.VITE_APP_ENABLE_VALIDATION === 'true'; // ตรวจสอบว่าเปิดการตรวจสอบหรือไม่
    const roleName = currentUser?.role_name;
    const dispatch = useDispatch(); // dispatch คือ LoadScreen [startLoadScreen - endLoadScreen]
    const employeeDomain = currentUser?.employee_domain;
    const screenName = 'Cost Center';

    // ฟังก์ชันในการดึงและทำความสะอาดข้อมูลจาก sessionStorage
    function cleanAccessData(key: string) {
        // ดึงค่าจาก session storage
        const storedAccessData = sessionStorage.getItem(key);
        if (storedAccessData) {
            try {
                // ลองแปลงข้อมูล JSON เป็นอ็อบเจกต์ทันที
                return JSON.parse(storedAccessData);
            } catch (error) {
                // กรณีที่แปลงไม่ได้ ลองลบอักขระพิเศษเพิ่มเติมที่อาจเกิดขึ้น
                const cleanedData = storedAccessData.replace(/\\/g, '').replace(/[\u0000-\u001F\u007F-\u009F]/g, '');
                try {
                    return JSON.parse(cleanedData);
                } catch (error) {
                    console.error('Error parsing JSON after cleanup:', error);
                    return null; // คืนค่า null ถ้ามีข้อผิดพลาดในการแปลง
                }
            }
        } else {
            console.log(`No value found in sessionStorage for ${key}.`);
            return null; // คืนค่า null ถ้าไม่พบข้อมูล
        }
    }

    // เริ่มใช้งาน Current Access
    cleanAccessData('current_access');
    updateSessionStorageCurrentAccess('screen_name', screenName);

    //==================================== useState Validate  =====================================
    const { isValidate, setIsValidate } = useListConCenter()

    //============================= เริ่มการทำงาน หน้าค้นหาข้อมูล =========================================
    useEffect(() => {
        console.log('Call : 🟢[1] Search fetch Master Data', moment().format('HH:mm:ss:SSS'));

        const initFetch = async () => {
            try {
                // เรียกใช้ฟังก์ชันทั้งหมดพร้อมกัน
                await MasterSiteGet(),
                    await MasterCostCenterGet(),
                    await searchFetchCostCenter();
            } catch (error) {
                console.error('Error in initFetch:', error);
            }
        };

        initFetch();
    }, []); // [] หมายถึงการรันแค่ครั้งเดียวตอน component ถูก mount

    //ตัวกรองข้อมูลแค่แสดง 200 แต่สามารถค้นหาได้ทั้งหมด
    // const OPTIONS_LIMIT = 200;
    // const defaultFilterOptions = createFilterOptions();
    // const filterOptions = (optionsSearch: any[], state: any) => {
    //     return defaultFilterOptions(optionsSearch, state).slice(0, OPTIONS_LIMIT);
    // };

    // // ใช้ useEffect เพื่อเรียกใช้ MasterSiteGet - MasterCostCenterGet เฉพาะเมื่อดำเนินการบางอย่างเท่านั้น
    // useEffect(() => {
    //     if (actionType) {
    //         MasterCostCenterGet(); // ดึงข้อมูลใส่ตารางใหม่
    //         setActionType(null); // Reset actionType after fetching data
    //     }
    // }, [actionType]);

    //============================= ส่วนไว้ใช้สำหรับเลือก และกรอก ค้นหาข้อมูล =========================================

    const searchFetchCostCenter = async () => {
        console.log('Call : searchFetchCostCenters', moment().format('HH:mm:ss:SSS'));

        const dataset = {};

        try {
            const response = await _POST(dataset, "/api_trr_mes/MasterData/Master_Cost_Center_Get");

            if (response && response.status === "success") {
                // ดึงข้อมูล Cost Center ทั้งหมด
                const allCenters = response.data;

                // กรองข้อมูลเฉพาะที่ไม่ใช่ Site (service_center_flag = false)
                const costCenter = allCenters
                    .filter((center: any) => !center.service_center_flag) // กรองจาก service_center_flag = false
                    .map((center: any) => ({
                        "id": center.id,
                        "cost_center_code": center.cost_center_code,
                        "cost_center_name": center.cost_center_name,
                        "app_req_user": center.app_req_user,
                    }));

                // กรองข้อมูลเฉพาะที่เป็น Site
                const siteCenter = allCenters
                    .filter((center: any) => center.service_center_flag) // กรองจาก service_center_flag = false
                    .map((center: any) => ({
                        "site_code": center.site_code,
                        "site_name": center.site_name,
                        "fullname": `[${center.site_code}] ${center.site_name}`,
                    }));

                // อัพเดตค่าใน setOptionsSearch
                // setOptionsSearch((prevOptions) => ({
                //     ...prevOptions,
                //     costCenter: costCenter, // ข้อมูล Cost Center
                //     siteCenter: siteCenter, // ข้อมูล Site
                // }));

                console.log(costCenter, 'Master Cost Center');
                console.log(siteCenter, 'Master Site');

            } else {
                setError("Failed to fetch master cost centers.");
            }
        } catch (error) {
            console.error("Error fetching cost centers:", error);
            setError("An error occurred while fetching master cost centers.");
        }
    };

    // -------------------------------- ดึงข้อมูล Master_Site_Get --------------------------------
    const MasterSiteGet = async () => {
        console.log('Master Site : MasterSiteGet', moment().format('YYYY-MM-DD HH:mm'));

        const dataset = {
        };

        try {
            const response = await _POST(dataset, "/api_trr_mes/MasterData/Master_Site_Get");

            if (response && response.status === "success") {
                // ดึงข้อมูล Site ทั้งหมด
                const allSite = response.data;

                // แยกข้อมูล Master Site
                const siteData = allSite.map((site: any) => ({
                    "id": site.id,
                    "site_code": site.site_code,
                    "site_name": site.site_name,
                    "domain": site.domain,
                    "fullname": `[${site.site_code}] ${site.site_name}`,
                }));

                setSelectSiteCode(siteData)
                console.log(allSite, 'site');

            } else {
                setError("Failed to fetch master site.");
            }
        } catch (error) {
            console.error("Error fetching master site:", error);
            setError("An error occurred while fetching site.");
        }
    }

    // -------------------------------- ดึงข้อมูล Master_Cost_Center_Get --------------------------------
    const MasterCostCenterGet = async () => {
        console.log('Master Cost Center : Master_Cost_Center_Get', moment().format('YYYY-MM-DD HH:mm'));

        if (!currentUser) return;

        const dataset = {};

        try {
            const response = await _POST(dataset, "/api_trr_mes/MasterData/Master_Cost_Center_Get");

            if (response && response.status === "success") {
                const allCostCenter = response.data;

                const newData: any = []

                // แยกข้อมูล Master Cost Center
                const CostCenter = allCostCenter.map((center: any) => ({
                    "id": center.id,
                    "site_code": center.site_code,
                    "cost_center_code": center.cost_center_code,
                    "cost_center_name": center.cost_center_name,
                    "app_req_user": center.app_req_user,
                    "service_center_flag": center.service_center_flag === true || center.service_center_flag === "1" ? "เป็น" : "ไม่เป็น",

                    // "service_center_flag": String(center.service_center_flag),
                    "create_by": center.create_by,
                    "create_date": center.create_date,
                    "update_by": center.update_by,
                    "update_date": center.update_date,

                    "ACTION": <ActionManageCell onClick={(name) => {
                        if (name == 'View') {
                            handleClickView(center)
                        } else if (name == 'Edit') {
                            handleClickEdit(center)
                        } else if (name == 'Delete') {
                            handleClickDelete(center)
                        }
                    }}
                        Defauft={true} //กรณีที่เป็นโหมดธรรมดาไม่มีเงื่อนไขซับซ้อน
                    />
                }));

                await setDataCostCenter(CostCenter);

            } else {
                setError("Failed to fetch master cost centers.");
            }
        } catch (e) {
            console.error("Error fetching master cost centers:", e);
            setError("An error occurred while fetching master cost centers.");
        }
    }

    // -------------------------------- เพิ่มข้อมูล Master_Cost_Center_Add ไปลง Database --------------------------------
    const MasterCostCenterAdd = async () => {
        console.log('Master Cost Center : Master_Cost_Center_Add', resultData, moment().format('YYYY-MM-DD HH:mm'));

        // เรียกใช้งานฟังก์ชัน  Update Current Access Event Name
        updateSessionStorageCurrentAccess('event_name', 'Add/Master_Cost_Center_Add');

        // ===================================================================================================================
        
        // const dataForValidate = {
        //     siteCode: resultData.siteCode,
        //     costcenterCode: resultData.costcenterCode,
        //     costcenterName: resultData.costcenterName,
        //     appReqUser: resultData.appReqUser,
        //     serviceCenterFlag: resultData.serviceCenterFlag,
        // }

        // const isValidate = checkValidate(dataForValidate, ['costcenterCode']);
        // const isValidateAll = isCheckValidateAll(isValidate);
        // if (Object.keys(isValidateAll).length > 0 && isValidationEnabled) {
        //     console.log(isValidateAll,);
        //     setIsValidate(isValidate);
        //     return;
        // }

        // ===================================================================================================================
        
        setIsValidate(null);
        confirmModal.createModal("ยืนยันที่จะบันทึกหรือไม่ ?", "info", async () => {
            if (resultData) {
                console.log("Saving resultData:", resultData);

                // สร้างข้อมูลที่ต้องการจะส่ง
                const payload = {
                    CostCenterModel: [{
                        id: uuidv4(), // สร้าง ID ใหม่สำหรับการ Add
                        site_id: resultData.siteCode?.id,
                        cost_center_code: resultData.costcenterCode,
                        cost_center_name: resultData.costcenterName,
                        app_req_user: resultData.appReqUser,
                        service_center_flag: resultData.serviceCenterFlag,
                    }],
                    currentAccessModel: getCurrentAccessObject(employeeUsername, employeeDomain, screenName) // ใช้ค่า user_id จาก currentUser หรือค่าเริ่มต้น
                };

                dispatch(startLoadScreen());
                setTimeout(async () => {
                    try {
                        console.log("payload model", payload);

                        // ใช้ _POST เพื่อส่งข้อมูล
                        const response = await _POST(payload, "/api_trr_mes/MasterData/Master_Cost_Center_Add");
                        console.log("API response:", response);

                        if (response && response.status === "success") {
                            console.log('Successfully:', response);

                            // เพิ่มโค้ดที่ต้องการเมื่อบันทึกสำเร็จ
                            Massengmodal.createModal(
                                <div className="text-center p-4">
                                    <p className="text-xl' font-semibold mb-2 text-green-600">Success</p>
                                </div>,
                                'success', () => {
                                    dispatch(endLoadScreen());
                                    handleClose();
                                }
                            );
                        } else {
                            console.error('Failed:', response);
                            dispatch(endLoadScreen());
                            Massengmodal.createModal(
                                <div className="text-center p-4">
                                    <p className="text-xl font-semibold md-2 text-green-600">{response.data[0].errorMessage}</p>
                                </div>,
                                'error', () => {
                                    dispatch(endLoadScreen());
                                }
                            );
                        }
                    } catch (e) {
                        console.log('Error : Master Cost Center Add', e);
                        dispatch(endLoadScreen());
                        // เพิ่มโค้ดที่ต้องการเมื่อเกิดข้อผิดพลาดในการส่งข้อมูล
                    }
                }, 2000);
            }
        });
    }

    // -------------------------------- แก้ไขข้อมูล Master_Cost_Center_Edit ไปลง Database --------------------------------
    const MasterCostCenterEdit = async () => {
        console.log('Master Cost Center : Master_Cost_Center_Edit', resultData, moment().format('YYYY-MM-DD HH:mm'));

        // เรียกใช้งานฟังก์ชัน  Update Current Access Event Name
        updateSessionStorageCurrentAccess('evernt_name', 'Edit/Master_Cost_Center_Edit');

        // ===================================================================================================================

        // // ดึงข้อมูล currentAccessObject ใหม่จาก sessionStorage หลังการอัปเดต
        // const storedAccessData = sessionStorage.getItem('current_access');
        // const currentAccessObject = storedAccessData ? JSON.parse(storedAccessData) : {};
        // console.log(currentAccessObject, 'currentAccessObject');

        // const dataForValidate = {
        //     siteCode: resultData.siteCode,
        //     costcenterCode: resultData.costcenterCode,
        //     costcenterName: resultData.costcenterName,
        //     appReqUser: resultData.appReqUser,
        //     serviceCenterFlag: resultData.serviceCenterFlag,
        // }

        // const isValidate = checkValidate(dataForValidate, ['costCenter']);
        // const isValidateAll = isCheckValidateAll(isValidate);
        // if (Object.keys(isValidateAll).length > 0 && isValidationEnabled) {
        //     console.log(isValidateAll,);
        //     setIsValidate(isValidate);
        //     return;
        // }

        // ===================================================================================================================

        setIsValidate(null);
        confirmModal.createModal("ยืนยันที่จะบันทึกหรือไม่ ?", "info", async () => {
            if (resultData) {
                console.log("Saving resultData:", resultData);

                // if (!resultData.costcenterId) {
                //     console.warn('No ID found for editing');  // แจ้งเตือนถ้าไม่มี ID
                //     return;
                // }

                // สร้างข้อมูลที่จะส่ง
                const payload = {
                    CostCenterModel: [{
                        id: resultData.costcenterId, // ใช้ ID เดิมในการ Edit
                        site_id: resultData.siteCode.id,
                        cost_center_code: resultData.costcenterCode,
                        cost_center_name: resultData.costcenterName,
                        app_req_user: resultData.appReqUser,
                        service_center_flag: resultData.serviceCenterFlag,
                    }],
                    currentAccessModel: getCurrentAccessObject(employeeUsername, employeeDomain, screenName) // ใช้ค่า user_id จาก currentUser หรือค่าเริ่มต้น
                };

                dispatch(startLoadScreen());
                setTimeout(async () => {
                    try {
                        console.log("payload model", payload);

                        const response = await _POST(payload, "/api_trr_mes/MasterData/Master_Cost_Center_Edit")

                        if (response && response.status === "success") {
                            console.log('Successfully :', response);

                            Massengmodal.createModal(
                                <div className='text-center p-4'>
                                    <p className='text-xl font-semibold mb-2 text-green-600'>Success</p>
                                </div>,
                                'success', () => {
                                    dispatch(endLoadScreen());
                                    handleClose();
                                }
                            );
                        } else {
                            console.error(response, 'Failed');
                            dispatch(endLoadScreen());
                        }
                    } catch (e) {
                        console.error(error, 'Failed Edit');
                        dispatch(endLoadScreen());
                    }
                }, 2000);
            }
        })
    }

    // -------------------------------- ลบข้อมูล Master_Cost_Center_Delete ไปลง Database --------------------------------
    const MasterCostCenterDelete = async () => {
        console.log('Master Cost Center : Master_Cost_Center_Delete', resultData, moment().format('YYYY-MM-DD HH:mm'));

        // เรียกใช้งานฟังก์ชัน  Update Current Access Event Name
        updateSessionStorageCurrentAccess('event_name', 'Delete/Master_User_Delete');

        // ===================================================================================================================

        // // ดึงข้อมูล currentAccessObject ใหม่จาก sessionStorage หลังการอัปเดต
        // const storedAccessData = sessionStorage.getItem('current_access');
        // const currentAccessObject = storedAccessData ? JSON.parse(storedAccessData) : {};
        // console.log(currentAccessObject, 'currentAccessObject');

        // const dataForValidate = {
        //     siteCode: resultData.siteCode,
        //     costcenterCode: resultData.costcenterCode,
        //     costcenterName: resultData.costcenterName,
        //     appReqUser: resultData.appReqUser,
        //     serviceCenterFlag: resultData.serviceCenterFlag,
        // }

        // const isValidate = checkValidate(dataForValidate, ['costCenter']);
        // const isValidateAll = isCheckValidateAll(isValidate);
        // if (Object.keys(isValidateAll).length > 0 && isValidationEnabled) {
        //     console.log(isValidateAll,);
        //     setIsValidate(isValidate);
        //     return;
        // }

        // ===================================================================================================================

        setIsValidate(null);
        confirmModal.createModal("ยืนยันที่จะบันทึกหรือไม่ ?", "info", async () => {
            if (resultData) {
                console.log("Saving resultData:", resultData);

                // สร้างข้อมูลที่จะส่ง
                const payload = {
                    CostCenterModel: [{
                        id: resultData.costcenterId, // ใช้ ID เดิมในการ Delete
                    }],
                    currentAccessModel: getCurrentAccessObject(employeeUsername, employeeDomain, screenName) // ใช้ค่า user_id จาก currentUser หรือค่าเริ่มต้น
                };

                dispatch(startLoadScreen());
                setTimeout(async () => {
                    try {
                        console.log('payload model', payload);

                        const response = await _POST(payload, "/api_trr_mes/MasterData/Master_Cost_Center_Delete")

                        if (response && response.status === "success") {
                            console.log('Successfully :', response);

                            Massengmodal.createModal(
                                <div className="text-center p-4">
                                    <p className="text-xl font-semibold mb-2 text-green-600">Success</p>
                                </div>,
                                'success', () => {
                                    dispatch(endLoadScreen());
                                    handleClose();
                                }
                            );
                        } else {
                            console.error(response, 'Failed');
                            dispatch(endLoadScreen());
                        }
                    } catch (e) {
                        console.error(error, 'Failed Edit');
                        dispatch(endLoadScreen());
                    }
                }, 2000)
            }
        });
    }

    //------------------- SetData Reade สำหรับดึงข้อมูลกลับมาแสดง
    const readData = async (data: any) => {
        console.log('Call : readData', data, moment().format('HH:mm:ss:SSS'));
        await setDefaultValues({
            ...defaultValues,
            costcenterId: data?.id || '',
            siteCode: data?.site_code != "" ? setValueMas(selectsiteCode, data?.site_code, "site_code") : "",
            costcenterCode: data?.cost_center_code || '',
            costcenterName: data?.cost_center_name || '',
            appReqUser: data?.app_req_user || '',
            serviceCenter: data?.service_center_flag,
        })
        console.log(setValueMas(selectsiteCode, data?.site_code, "site_code"), "5555555555");
    };

    //------------------- ค้นหาข้อมูล
    const handleSearch = () => {
        setActionType('search');
    };

    //------------------- รีเซ็ตข้อมูล
    const handleReset = () => {
        setSelectSiteCode(null);
        setCostCenterCode("");
        setCostCenterName("");
        setAppReqUser("");
        setActionType('reset');
    };

    //------------------- ปิดการทำงาน Modals
    const handleClose = () => {
        setOpenView(false);
        setOpenAdd(false);
        setOpenEdit(false);
        setOpenDelete(false);
        setIsValidate(null);
        readData(null);
        MasterCostCenterGet(); // เรียกใช้ฟังก์ชันเพื่อดึงงข้อมูล User ใหม่หลังเคลียร์ 
    };

    //------------------- เพิ่มข้อมูล
    const handleClickAdd = () => {
        console.log('ตอนกดปุ่ม Add : เพิ่มข้อมูล data');

        setOpenAdd(true);
    };

    //------------------- ดูข้อมูล
    const handleClickView = (data: any) => {
        console.log(data, 'ตอนกดปุ่ม View : ข้อมูล data');

        setOpenView(true);
        readData(data)
    };

    //------------------- แก้ไขข้อมูล
    const handleClickEdit = (data: any) => {
        console.log(data, 'ตอนกดปุ่ม Edit : ข้อมูล data');

        setOpenEdit(true);;
        readData(data)
    };

    //------------------- ลบข้อมูล
    const handleClickDelete = (data: any) => {
        console.log(data, 'ตอนกดปุ่ม Delete : ข้อมูล data');

        setOpenDelete(true);;
        readData(data)
    };

    //------------------- ดึงข้อมูลจาก Modals
    const handleDataChange = (data: any) => {
        setResultData(data); // ผลรับที่ได้จาก Models
    };

    return (
        <div>
            <div className="max-lg rounded overflow-hidden shadow-xl bg-white mt-5 mb-5">
                <div className="px-6 pt-4">
                    <label className="text-2xl ml-2 mt-3 mb-5 sarabun-regular">ค้นหาข้อมูล</label>
                </div>
                <div className="row px-10 pt-0 pb-5">
                    <div className="col-md-3 mb-2">
                        <AutocompleteComboBox
                            labelName={"Site"}
                            //filterOptions={filterOptions}
                            value={siteCode}
                            options={selectsiteCode}
                            column="fullname"
                            setvalue={handleAutocompleteChange(setSiteCode)}
                        />
                    </div>
                    <div className="col-md-3 mb-2">
                        <FullWidthTextField
                            labelName={"Cost Center Code"}
                            value={costcenterCode}
                            onChange={(value) => setCostCenterCode(value)}
                        />
                    </div>
                    <div className="col-md-3 mb-2">
                        <FullWidthTextField
                            labelName={"ชื่อ Cost Center"}
                            value={costcenterName}
                            onChange={(value) => setCostCenterName(value)}
                        />
                    </div>
                    <div className="col-md-3 mb-2">
                        <FullWidthTextField
                            labelName={"ผู้อนุมัติ"}
                            value={appReqUser}
                            onChange={(value) => setAppReqUser(value)}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-10 mx-10">
                    <div className='flex justify-between items-center'>

                        {/* ---------------------- Switch (True - Flase) ---------------------- */}
                        <CustomizedSwitches
                            labelName='Service Center'
                        />
                        {/* ------------------------------------------------------------------- */}

                        <div className="flex items-center space-x-2">
                            <div className="">
                                <FullWidthButton
                                    labelName={"ค้นหา"}
                                    handleonClick={handleSearch}
                                    variant_text="contained"
                                    colorname={"success"}
                                />
                            </div>
                            <div className="">
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
            </div>

            <div className="max-lg rounded overflow-hidden shadow-lg bg-white mb-5">
                <div>
                    <EnhancedTable
                        rows={dataCostCenter}
                        buttonLabal_1={showButton ? "เพิ่มข้อมูล" : ""} // Show button label only if "Add" is found
                        buttonColor_1="info"
                        headCells={Master_Cost_Center}
                        tableName={"บันทึกข้อมูลศูนย์ต้นทุน"}
                        handleonClick_1={handleClickAdd}
                        roleName={currentUser?.role_name}
                    />
                </div>
                <FuncDialog
                    open={openAdd} // เปิด dialog ถ้า openAdd, openView, openEdit หรือ openDelete เป็น true
                    dialogWidth="lg"
                    openBottonHidden={true}
                    titlename={'เพิ่มข้อมูล'}
                    handleClose={handleClose}
                    handlefunction={MasterCostCenterAdd}
                    colorBotton="success"
                    actions={"Create"}
                    element={
                        <CostCenterBody
                            onDataChange={handleDataChange}
                            defaultValues={defaultValues}
                            siteData={selectsiteCode} // ส่งข้อมูล Combobox ไปยัง CostCenterBody   
                            actions={"Create"}
                        />
                    }
                />
                <FuncDialog
                    open={openView} // เปิด dialog ถ้า openAdd, openView, openEdit หรือ openDelete เป็น true
                    dialogWidth="lg"
                    openBottonHidden={true}
                    titlename={'ดูข้อมูล'}
                    handleClose={handleClose}
                    colorBotton="success"
                    actions={"Reade"}
                    element={
                        <CostCenterBody
                            onDataChange={handleDataChange}
                            defaultValues={defaultValues}
                            siteData={selectsiteCode} // ส่งข้อมูล Combobox ไปยัง CostCenterBody  
                            disableOnly
                            actions={"Reade"}
                            
                        />
                    }
                />
                <FuncDialog
                    open={openEdit} // เปิด dialog ถ้า openAdd, openView, openEdit หรือ openDelete เป็น true
                    dialogWidth="lg"
                    openBottonHidden={true}
                    titlename={'แก้ไขข้อมูล'}
                    handleClose={handleClose}
                    handlefunction={MasterCostCenterEdit}
                    colorBotton="success"
                    actions={"Update"}
                    element={
                        <CostCenterBody
                            onDataChange={handleDataChange}
                            defaultValues={defaultValues}
                            siteData={selectsiteCode} // ส่งข้อมูล Combobox ไปยัง CostCenterBody 
                            actions={"Update"}
                        />
                    }
                />
                <FuncDialog
                    open={openDelete} // เปิด dialog ถ้า openAdd, openView, openEdit หรือ openDelete เป็น true
                    dialogWidth="lg"
                    openBottonHidden={true}
                    titlename={'ลบข้อมูล'}
                    handleClose={handleClose}
                    handlefunction={MasterCostCenterDelete} // service
                    colorBotton="success"
                    actions={"Delete"}
                    element={
                        <CostCenterBody
                            onDataChange={handleDataChange}
                            defaultValues={defaultValues}
                            siteData={selectsiteCode} // ส่งข้อมูล Combobox ไปยัง CostCenterBody 
                            disableOnly
                            actions={"Reade"}
                        />
                    }
                />
            </div>
        </div>
    )
}

