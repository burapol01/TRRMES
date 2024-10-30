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

//======================== OptionsState ข้อมูล Drop Down ==========================
/* --------- ให้สร้าง interface optionsState เพื่อระบุประเภท (Type) --------- */
interface OptionsState {
    Site: any[];
    CostCenter: any[];
}

const initialOptions: OptionsState = {
    Site: [],
    CostCenter: [],
};

//=================================== set ข้อมูล  ==================================
//------------------- ประกาศค่าเริ่มต้น
const initialCostCenterValues = { //-----สร้างหน้าใหม่ให้เปลี่ยนแค่ชื่อ
    siteCode: "",
    costcenterCode: "",
    costcenterName: "",
    appreqUser: "",
};

export default function CostCenter() {

    //========================= SearchCostCenter ช่องค้นหาข้อมูล ==============================================
    const { siteCode, setSiteCode } = useListConCenter();
    const [costcenterCode, setCostCenterCode] = useState("");
    const [costcenterName, setCostCenterName] = useState("");
    const [appreqUser, setAppReqUser] = useState("");
    const { dataCostCenter, setDataCostCenter } = useListConCenter();
    const handleAutocompleteChange = (setter: React.Dispatch<React.SetStateAction<any>>) => (value: any) => {
        setter(value);
    };
    const [optionsSearch, setOptionsSearch] = useState<OptionsState>(initialOptions); // State for combobox options
    const [options, setOptions] = useState<OptionsState>(initialOptions); // State for combobox options
    const [actionType, setActionType] = useState<string | null>(null); // Corrected type
    const [error, setError] = useState<string | null>(null); // แสดงสถานะสำหรับข้อผิดพลาด

    //============================== useState ข้อมูลเริ่มต้น / ข้อมูลตาราง ================================
    // State to store default values รับและส่ง
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
    const menuFuncList = useSelector((state: any) => state?.menuFuncList);
    const showButton = (menuFuncList || []).some((menuFunc: any) => menuFunc.func_name === "Add");
    const isValidationEnabled = import.meta.env.VITE_APP_ENABLE_VALIDATION === 'true'; // ตรวจสอบว่าเปิดการตรวจสอบหรือไม่
    const roleName = currentUser?.role_name;
    const dispatch = useDispatch()

    //==================================== useState Validate  =====================================
    const { isValidate, setIsValidate } = useListConCenter()

    //============================= เริ่มการทำงาน หน้าค้นหาข้อมูล =========================================
    useEffect(() => {
        console.log('Call : Search fetch Master Data', moment().format('HH:mm:ss:SSS'));
        const initFetch = async () => {
            try {
                await searchFetchCostCenter(); // เรียกใช้ฟังก์ชันเมื่อ component ถูกเรนเดอร์ครั้งแรก
            } catch (error) {
                console.error('Error in initFetch:', error);
            }
        };
        initFetch();
    }, []); // [] หมายถึงการรันแค่ครั้งเดียวตอนคอมโพเนนต์ถูก mount

    //ตัวกรองข้อมูลแค่แสดง 200 แต่สามารถค้นหาได้ทั้งหมด
    const OPTIONS_LIMIT = 200;
    const defaultFilterOptions = createFilterOptions();
    const filterOptions = (optionsSearch: any[], state: any) => {
        return defaultFilterOptions(optionsSearch, state).slice(0, OPTIONS_LIMIT);
    };

    // ใช้ useEffect เพื่อเรียกใช้ dataTableMasterCostCenter_GET เฉพาะเมื่อดำเนินการบางอย่างเท่านั้น
    useEffect(() => {
        if (actionType) {
            Master_Cost_Center_Get(); // ดึงข้อมูลใส่ตารางใหม่
            setActionType(null); // Reset actionType after fetching data
        }
    }, [actionType]);

    const searchFetchCostCenter = async () => {
        console.log('Call : searchFetchCostCenters', moment().format('HH:mm:ss:SSS'));

        const dataset = {};

        try {
            const response = await _POST(dataset, "/api_trr_mes/MasterData/Master_Cost_Center_Get");

            if (response && response.status === "success") {
                // ดึงข้อมูล Cost Center ทั้งหมด
                const allCenters = response.data;

                // กรองข้อมูลเฉพาะที่ไม่ใช่ Service Center (service_center_flag = false)
                const costCenter = allCenters
                    .filter((center: any) => !center.service_center_flag) // กรองจาก service_center_flag = false
                    .map((center: any) => ({
                        "id": center.id,
                        "cost_center_code": center.cost_center_code,
                        "cost_center_name": center.cost_center_name,
                        "app_req_user": center.app_req_user,
                    }));

                // กรองข้อมูลเฉพาะที่ไม่ใช่ Service Center (service_center_flag = false)
                const site = allCenters
                    .filter((center: any) => !center.service_center_flag) // กรองจาก service_center_flag = false
                    .map((center: any) => ({
                        "site_code": center.site_code,
                        "site_name": center.site_name,
                    }));

                // อัพเดตค่าใน setOptionsSearch
                setOptionsSearch((prevOptions) => ({
                    ...prevOptions,
                    costCenter: costCenter, // ข้อมูล Cost Center
                }));

                console.log(costCenter, 'Master Cost Center');
                console.log(site, 'Master Site');
                
            } else {
                setError("Failed to fetch cost centers.");
            }
        } catch (error) {
            console.error("Error fetching cost centers:", error);
            setError("An error occurred while fetching cost centers.");
        }
    };

    // -------------------------------- ดึงข้อมูล Master_Site_Get --------------------------------
    const Master_Site_Get = async () => {
        console.log('Master Site : Master_Site_Get', moment().format('YYYY-MM-DD HH:mm'));

        if (!currentUser) return;
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
                    // siteId: site.id,
                    // siteCode: site.site_code,
                    // siteName: site.site_name,
                    // siteDomain: site.domain,
                    // siteFullname: "[" + site.site_code + "] " + site.site_name,
                }));

                setSiteCode(siteData)
                console.log(allSite);

            } else {
                setError("Failed to fetch master site.");
            }
        } catch (error) {
            console.error("Error fetching master site:", error);
            setError("An error occurred while fetching site.");
        }
    }

    // -------------------------------- ดึงข้อมูล Master_Cost_Center_Get --------------------------------
    const Master_Cost_Center_Get = async () => {
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
                    "service_center_flag": center.service_center_flag,
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
                    // newData.push(center)
                }));

                console.log(newData, 'ค่าที่ดึงจากตาราง');
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
    const Master_Cost_Center_Add = async () => {
        console.log('Master Cost Center : Master_Cost_Center_Add', resultData, moment().format('YYYY-MM-DD HH:mm'));

        const dataForValidate = {
            siteCode: resultData.siteCode,
            costcenterCode: resultData.costcenterCode,
            costcenterName: resultData.costcenterName,
            appReqUser: resultData.appReqUser,
            serviceCenterFlag: resultData.serviceCenterFlag,
        }

        const isValidate = checkValidate(dataForValidate, ['costcenterCode']);
        const isValidateAll = isCheckValidateAll(isValidate);
        if (Object.keys(isValidateAll).length > 0 && isValidationEnabled) {
            console.log(isValidateAll,);
            setIsValidate(isValidate);
            return;
        }
        setIsValidate(null);
        confirmModal.createModal("ยืนยันที่จะบันทึกหรือไม่ ?", "info", async () => {
            if (resultData) {
                console.log("Saving resultData:", resultData);

                // สร้างข้อมูลที่ต้องการจะส่ง
                const payload = {
                    costCenterModel: {
                        site_code: resultData.siteCode,
                        cost_center_code: resultData.costcenterCode,
                        cost_center_name: resultData.costcenterName,
                        app_req_user: resultData.appReqUser,
                        service_center_flag: resultData.serviceCenterFlag,
                    },
                    currentAccessModel: {
                        user_id: employeeUsername || "" // ใช้ค่า user_id จาก currentUser หรือค่าเริ่มต้น
                    }
                };
                dispatch(startLoadScreen());
                setTimeout(async () => {
                    try {
                        console.log("payload model", payload);

                        // ใช้ _POST เพื่อส่งข้อมูล
                        const response = await _POST(payload, "/api_trr_mes/MasterData/Master_Cost_Center_Add");

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


    // -------------------------------- ลบข้อมูล Master_Cost_Center_Delete ไปลง Database --------------------------------


    React.useEffect(() => {
        Master_Site_Get();
        Master_Cost_Center_Get();
        Master_Cost_Center_Add();
    }, [])

    //============================= เริ่มการทำงาน handleClick =============================================
    //------------------- ค้นหาข้อมูล
    const handleSearch = () => {
        setActionType('search');
    };

    //------------------- รีเซ็ตข้อมูล
    const handleReset = () => {
        setSiteCode(null);
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
        Master_Cost_Center_Get(); // เรียกใช้ฟังก์ชันเพื่อดึงงข้อมูล User ใหม่หลังเคลียร์ 
    };

    //------------------- SetData Reade สำหรับดึงข้อมูลกลับมาแสดง
    const readData = async (data: any) => {
        console.log('Call : readData', data, moment().format('HH:mm:ss:SSS'));
        await setDefaultValues({
            ...defaultValues,
            siteCode: data?.site_code || '',
            costcenterCode: data?.cost_center_code || '',
            costcenterName: data?.cost_center_name || '',
            appreqUser: data?.app_req_user || '',
        })
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
            {/* <SearchCostCenter /> */}
            <div className="max-lg rounded overflow-hidden shadow-xl bg-white mt-5 mb-5">
                <div className="px-6 pt-4">
                    <label className="text-2xl ml-2 mt-3 mb-5 sarabun-regular">ค้นหาข้อมูล</label>
                </div>
                <div className="row px-10 pt-0 pb-5">
                    <div className="col-md-3 mb-2">
                        <AutocompleteComboBox
                            labelName={"Site"}
                            filterOptions={filterOptions}
                            value={null} // value={sitecode}
                            options={siteCode} // options={optionsSearch.masterCostCenter}                           
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
                            value={appreqUser}
                            onChange={(value) => setAppReqUser(value)}
                        />
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-10 mx-10">
                    <div className='flex justify-between items-center'>

                        {/* ---------------------- Switch (True - Flase) ---------------------- */}
                            <CustomizedSwitches labelName='Service Center'/>
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

            {/* <ListDataCostCenter /> */}
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
                    handlefunction={""}
                    colorBotton="success"
                    actions={"Create"}
                    element={
                        <CostCenterBody
                            onDataChange={handleDataChange}
                            defaultValues={defaultValues}
                            options={options} // ส่งข้อมูล Combobox ไปยัง CostCenterBody   
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
                            options={options} // ส่งข้อมูล Combobox ไปยัง ServiceRequestBody     
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
                    handlefunction={""}
                    colorBotton="success"
                    actions={"Update"}
                    element={
                        <CostCenterBody
                            onDataChange={handleDataChange}
                            defaultValues={defaultValues}
                            options={options} // ส่งข้อมูล Combobox ไปยัง ServiceRequestBody 
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
                    handlefunction={""} // service
                    colorBotton="success"
                    actions={"Delete"}
                    element={
                        <CostCenterBody
                            onDataChange={handleDataChange}
                            defaultValues={defaultValues}
                            options={options} // ส่งข้อมูล Combobox ไปยัง ServiceRequestBody
                            disableOnly
                            actions={"Reade"}
                        />
                    }
                />
            </div>
        </div>
    )
}













