import React, { useEffect, useState } from 'react'
import moment from 'moment'
import { useListConCenter } from './core/CostCenterProvider'
import { _GET, _POST } from '../../../service'
import ActionManageCell from '../../../components/MUI/ActionManageCell'
import FullWidthTextField from '../../../components/MUI/FullWidthTextField'
import FullWidthButton from '../../../components/MUI/FullWidthButton'
import AutocompleteComboBox from '../../../components/MUI/AutocompleteComboBox'
import { useDispatch, useSelector } from 'react-redux'
import FuncDialog from '../../../components/MUI/FullDialog'
import EnhancedTable from '../../../components/MUI/DataTables'
import CostCenterBody from './component/CostCenterBody'
import { Master_Cost_Center } from '../../../../libs/columnname'
import { checkValidate, isCheckValidateAll } from '../../../../libs/validations'
import { confirmModal } from '../../../components/MUI/Comfirmmodal'
import { endLoadScreen, startLoadScreen } from '../../../../redux/actions/loadingScreenAction'
import { Massengmodal } from '../../../components/MUI/Massengmodal'
import { result } from 'lodash'
import { v4 as uuidv4 } from 'uuid';
import { getCurrentAccessObject, updateSessionStorageCurrentAccess } from '../../../service/initmain'
import { setValueMas } from '../../../../libs/setvaluecallback'
import { _number, dateFormatTimeEN } from '../../../../libs/datacontrol'

// ======================== OptionsState ข้อมูล Drop Down ==========================
/* --------- ให้สร้าง interface optionsState เพื่อระบุประเภท (Type) --------- */
interface OptionsState {
    siteData: any[];
    costcenterData: any[];
}

const initialCostCenterValues = { //-----สร้างหน้าใหม่ให้เปลี่ยนแค่ชื่อ
    id: "",
    siteCode: "",
    costcenterCode: "",
    costcenterName: "",
    appReqUser: "",
    serviceCenter: false
};

export default function CostCenter() {

    // =============================== SearchCostCenter ช่องค้นหาข้อมูล ===============================
    const [dataCostCenter, setDataCostCenter] = useState<any[]>([]);
    const [selectsiteCode, setSelectSiteCode] = useState<any>([]);
    const [siteCode, setSiteCode] = useState<any>(null);
    const [costcenterCode, setCostCenterCode] = useState<any>(null);
    const [costcenterName, setCostCenterName] = useState("");
    const [appReqUser, setAppReqUser] = useState("");
    const [serviceCenter, setServiceCenter] = useState<any>(null);
    const handleAutocompleteChange = (setter: React.Dispatch<React.SetStateAction<any>>) => (value: any) => { setter(value) };
    const [error, setError] = useState<string | null>(null); // แสดงสถานะสำหรับข้อผิดพลาด

    // ============================== useState ข้อมูลเริ่มต้น / ข้อมูลตาราง ================================
    const menuFuncList = useSelector((state: any) => state?.menuFuncList);
    const [openAdd, setOpenAdd] = useState(false);
    const [openView, setOpenView] = useState<any>(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const currentUser = useSelector((state: any) => state?.user?.user);

    // State to store default values รับและส่ง
    const [defaultValues, setDefaultValues] = useState(initialCostCenterValues);
    const [resultData, setResultData] = useState<any>(null); // State to store draft data : สถานะที่จะจัดเก็บข้อมูลฉบับร่าง

    // ตัวแปร ใช้ทุกที่ : ไว้จัดการสิทธิ์ให้ปุ่ม "เพิ่ม" แสดง และ ไม่แสดง
    const employeeUsername = currentUser?.employee_username.toLowerCase()
    const showButton = (menuFuncList || []).some((menuFunc: any) => menuFunc.func_name === "Add");
    const isValidationEnabled = import.meta.env.VITE_APP_ENABLE_VALIDATION === 'true'; // ตรวจสอบว่าเปิดการตรวจสอบหรือไม่
    const roleName = currentUser?.role_name;
    const dispatch = useDispatch(); // dispatch : LoadScreen [startLoadScreen - endLoadScreen]
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

    // ==================================== useState Validate  =====================================
    const { isValidate, setIsValidate } = useListConCenter()

    // ============================= เริ่มการทำงาน หน้าค้นหาข้อมูล =========================================
    useEffect(() => {
        console.log('Call : 🟢[1] Search Master Site Data', moment().format('HH:mm:ss:SSS'));
        const initFetch = async () => {
            try {
                await Master_Site_Get();
            } catch (error) {
                console.error('Error initFetch : ', error);
            }
        };
        initFetch();
    }, []); // [] หมายถึงการรันแค่ครั้งเดียวตอน component ถูก mount

    useEffect(() => {
        console.log('Call : 🟢[1] Search Master Cost Center Data', moment().format('HH:mm:ss:SSS'));
        if (selectsiteCode) {
            Master_Cost_Center_Get(null);
        }
    }, [selectsiteCode]);

    const Master_Site_Get = async () => {
        console.log('Master Site : Master_Site_Get', moment().format('YYYY-MM-DD HH:mm'));

        const dataset = {};

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

    const Master_Cost_Center_Get = async (dataset: any) => {
        console.log('Master Cost Center : Master_Cost_Center_Get', serviceCenter, moment().format('YYYY-MM-DD HH:mm'));

        try {
            const response = await _POST(dataset, "/api_trr_mes/MasterData/Master_Cost_Center_Get");

            if (response && response.status === "success") {
                const allCostCenter = response.data;
                const newData: any = [];

                // แยกข้อมูล Master Cost Center
                Array.isArray(allCostCenter) && allCostCenter.forEach((center) => {
                    center.create_date = dateFormatTimeEN(center.create_date, "DD/MM/YYYY HH:mm:ss")
                    center.update_date = dateFormatTimeEN(center.update_date, "DD/MM/YYYY HH:mm:ss")

                    center.service_center_flag_ = center.service_center_flag === true || center.service_center_flag === "1" ? "เป็น" : "ไม่เป็น";

                    center.ACTION = <ActionManageCell onClick={(name) => {
                        if (name == 'View') {
                            handleClickView(center);
                        } else if (name == 'Edit') {
                            handleClickEdit(center);
                        } else if (name == 'Delete') {
                            handleClickDelete(center);
                        }
                    }}
                        Defauft={true} //กรณีที่เป็นโหมดธรรมดาไม่มีเงื่อนไขซับซ้อน
                    />
                    newData.push(center);
                    // -------------------------------------------- //
                });

                await setDataCostCenter(newData); // อัปเดตข้อมูลแสดงผลหลังรีเซ็ต

            } else {
                setError("Failed to fetch master cost centers.");
            }
        } catch (e) {
            console.error("Error fetching master cost centers:", e);
            setError("An error occurred while fetching master cost centers.");
        }
    }

    const Master_Cost_Center_Add = async () => {
        console.log('Master Cost Center : Master_Cost_Center_Add', resultData, moment().format('YYYY-MM-DD HH:mm'));

        // เรียกใช้งานฟังก์ชัน Update Current Access Event Name
        updateSessionStorageCurrentAccess('event_name', 'Add/Master_Cost_Center_Add');

        // ---------------------------------------------------------------------------------------------------------------

        const dataForValidate = {
            site_id: resultData.siteCode?.id,
            cost_center_code: resultData.costcenterCode,
            cost_center_name: resultData.costcenterName,
            app_req_user: resultData.appReqUser,
        }

        console.log("Data validation:", dataForValidate);

        const isValidate = checkValidate(dataForValidate, ['costCenter']);
        const isValidateAll = isCheckValidateAll(isValidate);

        if (Object.keys(isValidateAll).length > 0 && isValidationEnabled) {
            console.log("Validation errors:", isValidateAll);
            setIsValidate(isValidate);
            return; // return ถ้า validate ไม่ผ่าน
        }
        setIsValidate(null); // ถ้า validate ผ่าน

        // ---------------------------------------------------------------------------------------------------------------

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
                        service_center_flag: resultData.serviceCenter || null,
                    }],
                    currentAccessModel: getCurrentAccessObject(employeeUsername, employeeDomain, screenName) // ใช้ค่า user_id จาก currentUser หรือค่าเริ่มต้น
                };

                dispatch(startLoadScreen());
                setTimeout(async () => {
                    try {
                        console.log("payload model", payload);

                        // ใช้ _POST เพื่อส่งข้อมูล
                        const response = await _POST(payload, "/api_trr_mes/MasterData/Master_Cost_Center_Add");

                        if (response && response.status === "success") {
                            console.log('Successfully :', response);

                            // เพิ่มโค้ดที่ต้องการเมื่อบันทึกสำเร็จ
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
                            console.error('Failed :', response);

                            dispatch(endLoadScreen());
                            Massengmodal.createModal(
                                <div className="text-center p-4">
                                    <p className="text-xl font-semibold mb-2 text-green-600">{response.data[0].errorMessage}</p>
                                </div>,

                                'error', () => {
                                    dispatch(endLoadScreen());
                                }
                            );
                        }
                    } catch (e) {
                        console.log('Error : Master Cost Center Add', e);
                        dispatch(endLoadScreen());
                    }
                }, 0);
            }
        });
    }

    const Master_Cost_Center_Edit = async () => {
        console.log('Master Cost Center : Master_Cost_Center_Edit', resultData, moment().format('YYYY-MM-DD HH:mm'));

        // เรียกใช้งานฟังก์ชัน  Update Current Access Event Name
        updateSessionStorageCurrentAccess('evernt_name', 'Edit/Master_Cost_Center_Edit');

        // ---------------------------------------------------------------------------------------------------------------

        const dataForValidate = {
            site_id: resultData.siteCode?.id,
            cost_center_code: resultData.costcenterCode,
            cost_center_name: resultData.costcenterName,
            app_req_user: resultData.appReqUser,
        }

        console.log("Data validation:", dataForValidate);

        const isValidate = checkValidate(dataForValidate, ['costCenter']);
        const isValidateAll = isCheckValidateAll(isValidate);

        if (Object.keys(isValidateAll).length > 0 && isValidationEnabled) {
            console.log("Validation errors:", isValidateAll);
            setIsValidate(isValidate);
            return; // return ถ้า validate ไม่ผ่าน
        }
        setIsValidate(null); // ถ้า validate ผ่าน

        // ---------------------------------------------------------------------------------------------------------------

        setIsValidate(null);
        confirmModal.createModal("ยืนยันที่จะบันทึกหรือไม่ ?", "info", async () => {
            if (resultData) {
                console.log("Saving resultData:", resultData);

                // สร้างข้อมูลที่จะส่ง
                const payload = {
                    CostCenterModel: [{
                        id: resultData.id,
                        site_id: resultData.siteCode.id,
                        cost_center_code: resultData.costcenterCode,
                        cost_center_name: resultData.costcenterName,
                        app_req_user: resultData.appReqUser,
                        service_center_flag: resultData?.serviceCenter ? true : false,
                    }],
                    currentAccessModel: getCurrentAccessObject(employeeUsername, employeeDomain, screenName)
                };

                console.log(payload, 'payload');

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
                            console.error(response, 'Failed ');
                            dispatch(endLoadScreen());
                        }
                    } catch (e) {
                        console.error(error, 'Failed Edit');
                        dispatch(endLoadScreen());
                    }
                }, 0);
            }
        })
    }

    const Master_Cost_Center_Delete = async () => {
        console.log('Master Cost Center : Master_Cost_Center_Delete', resultData, moment().format('YYYY-MM-DD HH:mm'));

        // เรียกใช้งานฟังก์ชัน  Update Current Access Event Name
        updateSessionStorageCurrentAccess('event_name', 'Delete/Master_User_Delete');

        // ---------------------------------------------------------------------------------------------------------------

        const dataForValidate = {
            site_id: resultData.siteCode?.id,
            cost_center_code: resultData.costcenterCode,
            cost_center_name: resultData.costcenterName,
            app_req_user: resultData.appReqUser,
        }

        console.log("Data validation:", dataForValidate);

        const isValidate = checkValidate(dataForValidate, ['costCenter']);
        const isValidateAll = isCheckValidateAll(isValidate);

        if (Object.keys(isValidateAll).length > 0 && isValidationEnabled) {
            console.log("Validation errors:", isValidateAll);
            setIsValidate(isValidate);
            return; // return ถ้า validate ไม่ผ่าน
        }
        setIsValidate(null); // ถ้า validate ผ่าน

        // ---------------------------------------------------------------------------------------------------------------

        setIsValidate(null);
        confirmModal.createModal("ยืนยันที่จะบันทึกหรือไม่ ?", "info", async () => {
            if (resultData) {
                console.log("Saving resultData:", resultData);

                // สร้างข้อมูลที่จะส่ง
                const payload = {
                    CostCenterModel: [{
                        id: resultData.id, // ใช้ ID เดิมในการ Delete
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
                }, 0)
            }
        });
    }

    // ------------------- SetData Reade สำหรับดึงข้อมูลกลับมาแสดง
    const readData = async (data: any) => {
        console.log('Call : 🟢[2] readData', data, moment().format('HH:mm:ss:SSS'));
        const setData = {
            ...defaultValues,
            id: data?.id || '',
            siteCode: data?.site_code != "" ? setValueMas(selectsiteCode, data?.site_code, "site_code") : "",
            costcenterCode: data?.cost_center_code || '',
            costcenterName: data?.cost_center_name || '',
            appReqUser: data?.app_req_user || '',
            serviceCenter: data?.service_center_flag || '',
        }
        await setDefaultValues(setData)
    };

    // ------------------- ค้นหาข้อมูล
    const handleSearch = () => {
        const dataset = {
            site_code: siteCode?.site_code ? siteCode?.site_code : null,
            cost_center_code: costcenterCode ? costcenterCode : null,
            cost_center_name: costcenterName ? costcenterName : null,
            app_req_user: appReqUser ? appReqUser : null,
        };
        console.log('Call : 🟢[3] Dataset : Search', dataset, moment().format('HH:mm:ss:SSS'));
        Master_Cost_Center_Get(dataset);
    };

    // ------------------- รีเซ็ตข้อมูล
    const handleReset = async () => {
        console.log('Call : 🟢[4] Dataset : Reset', moment().format('HH:mm:ss:SSS'));
        await setCostCenterCode(null);
        await setCostCenterName("");
        await setAppReqUser("");
        await setSiteCode(null);
        await setServiceCenter(null);
        await Master_Cost_Center_Get(null);
    };

    // ------------------- ปิดการทำงาน Modals
    const handleClose = () => {
        setOpenView(false);
        setOpenAdd(false);
        setOpenEdit(false);
        setOpenDelete(false);
        setIsValidate(null);
        readData(null);
        Master_Cost_Center_Get(null); // เรียกใช้ฟังก์ชันเพื่อดึงข้อมูล Cost Center ใหม่หลังเคลียร์ - รีเซ็ต 
    };

    // ------------------- เพิ่มข้อมูล
    const handleClickAdd = () => {
        console.log('ตอนกดปุ่ม Add : เพิ่มข้อมูล data');
        setOpenAdd(true);
    };

    // ------------------- ดูข้อมูล
    const handleClickView = (data: any) => {
        console.log(data, 'ตอนกดปุ่ม View : ข้อมูล data');
        setOpenView(true);
        readData(data)
    };

    // ------------------- แก้ไขข้อมูล
    const handleClickEdit = (data: any) => {
        console.log(data, 'ตอนกดปุ่ม Edit : ข้อมูล data');
        setOpenEdit(true);
        readData(data)
    };

    // ------------------- ลบข้อมูล
    const handleClickDelete = (data: any) => {
        console.log(data, 'ตอนกดปุ่ม Delete : ข้อมูล data');
        setOpenDelete(true);
        readData(data)
    };

    // ------------------- ดึงข้อมูลจาก Models
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
                            value={siteCode}
                            options={selectsiteCode}
                            column="fullname"
                            setvalue={handleAutocompleteChange(setSiteCode)}
                        />
                    </div>
                    <div className="col-md-3 mb-2">
                        <FullWidthTextField
                            labelName={"Cost Center Code"}
                            value={costcenterCode ? _number(costcenterCode) : ""}
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

                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-1 mx-1">
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
                    handlefunction={Master_Cost_Center_Add}
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
                    handlefunction={Master_Cost_Center_Edit}
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
                    handlefunction={Master_Cost_Center_Delete}
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

