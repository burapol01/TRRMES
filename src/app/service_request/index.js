import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import FullWidthTextField from "../../components/MUI/FullWidthTextField";
import { _POST } from "../../service/mas";
import AutocompleteComboBox from "../../components/MUI/AutocompleteComboBox";
import FullWidthButton from "../../components/MUI/FullWidthButton";
import EnhancedTable from "../../components/MUI/DataTables";
import { Request_headCells } from "../../../libs/columnname";
import FuncDialog from "../../components/MUI/FullDialog";
import ServiceRequestBody from "./component/ServiceRequestBody";
import { useSelector } from "react-redux";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import moment from 'moment';
import { confirmModal } from "../../components/MUI/Comfirmmodal";
import { Massengmodal } from "../../components/MUI/Massengmodal";
import ActionManageCell from "../../components/MUI/ActionManageCell";
import BasicChips from "../../components/MUI/BasicChips";
import { dateFormatTimeEN, DateToDB } from "../../../libs/datacontrol";
import FullWidthTextareaField from "../../components/MUI/FullWidthTextareaField";
const initialOptions = {
    costCenter: [],
    serviceCenter: [],
    jobType: [],
    budgetCode: [],
    fixedAssetCode: [],
};
const defaultVal = {
    requestNo: "",
    requestDate: "",
    requestId: "",
    reqUser: "",
    appReqUser: "",
    costCenterId: "",
    costCenterCode: "",
    costCenterName: "",
    status: "Draft",
    site: "",
    countRevision: "1",
    serviceCenterId: "",
    jobType: "",
    budgetCode: "",
    description: "",
    fixedAssetId: "",
    fixedAssetDescription: "",
    siteId: "",
    rejectSubmitReason: "",
    rejectStartReason: "",
};
export default function ServiceRequest() {
    const [requestNo, setRequestNo] = useState("");
    const [status, setStatus] = useState("");
    const currentUser = useSelector((state) => state?.user?.user);
    const [appReqUser, setAppReqUser] = useState("");
    const [textValue, setTextValue] = useState("");
    const [statusValue, setStatusValue] = useState("");
    const [selectedServiceCenter, setSelectedServiceCenter] = useState(null);
    const [selectedJobType, setSelectedJobType] = useState(null);
    const [selectedAssetCode, setSelectedAssetCode] = useState(null);
    const [openAdd, setOpenAdd] = useState(false);
    const [openView, setOpenView] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [openSubmit, setOpenSubmit] = useState(false);
    const [openApproved, setOpenApproved] = useState(false);
    const [openClose, setOpenClose] = useState(false);
    const [dataList, setDataList] = useState([]);
    const [draftData, setDraftData] = useState(null); // State to store draft data  
    const [options, setOptions] = useState(initialOptions); // State for combobox options
    const [optionsSearch, setOptionsSearch] = useState(initialOptions); // State for combobox options
    const [error, setError] = useState(null); // สถานะสำหรับข้อผิดพลาด 
    const [errorMessage, setErrorMessage] = useState(null); // State for error messages
    const handleTextChange = (value) => setTextValue(value);
    const handleStatusChange = (value) => setStatusValue(value);
    const handleAutocompleteChange = (setter) => (value) => {
        setter(value);
    };
    const [actionType, setActionType] = useState(null); // Corrected type
    // State to store default values
    const [defaultValues, setDefaultValues] = useState(defaultVal);
    //For Reject Reasons
    const [openReject, setOpenReject] = useState(false);
    const [rejectReason, setRejectReason] = useState("");
    const [openRejectJob, setOpenRejectJob] = useState(false);
    const [rejectJobReason, setRejectJobReason] = useState("");
    //ตัวแปร ใช้ทุกที่
    const employeeUsername = currentUser?.employee_username.toLowerCase();
    const roleName = currentUser?.role_name;
    // useEffect ที่ใช้ดึงข้อมูล initial data เมื่อ component ถูกสร้างครั้งแรก
    //============================================================================================================================
    //ดึงข้อมูลจาก Master Data ไว้สำหรับหน้าค้นหาข้อมูล
    useEffect(() => {
        console.log('Call : 🟢[1] Search fetch Master Data', moment().format('HH:mm:ss:SSS'));
        const fetchData = async () => {
            await Promise.all([
                searchFetchServiceCenters(), // เรียกใช้ฟังก์ชันเมื่อคอมโพเนนต์ถูกเรนเดอร์ครั้งแรก
                searchFetchJobTypes(), // เรียกใช้ฟังก์ชันเพื่อดึงข้อมูล job types
                searchFetchFixedAssetCodes(), // เรียกใช้ฟังก์ชันเพื่อดึงข้อมูล fixed asset codes
            ]);
        };
        fetchData();
    }, [defaultValues]);
    //ดึงข้อมูลจาก User มาตรวจสอบก่อนว่ามีอยู่ในระบบหรือไม่
    useEffect(() => {
        console.log('Call : 🟢[2] fetch UserData&serviceRequest', moment().format('HH:mm:ss:SSS'));
        if (employeeUsername) {
            fetchUserData(); // เรียกใช้ฟังก์ชันเพื่อดึงงข้อมูล User   
            dataTableServiceRequest_GET();
        }
    }, [employeeUsername]);
    //ดึงข้อมูลจาก Master Data ไว้สำหรับหน้า ServiceRequestBody
    useEffect(() => {
        console.log('Call : 🟢[3] Fetch Master Data', moment().format('HH:mm:ss:SSS'));
        if (defaultValues?.reqUser)
            fetchCostCenters();
        fetchServiceCenters();
        if (defaultValues) {
            fetchJobTypes();
            fetchBudgetCodes(); // เรียกใช้ฟังก์ชันเพื่อดึงข้อมูล budget codes 
            fetchFixedAssetCodes(); // เรียกใช้ฟังก์ชันเพื่อดึงข้อมูล fixed asset codes     
        }
    }, [defaultValues]);
    // หน้าค้นหา Search ========================================================================================================= 
    const searchFetchServiceCenters = async () => {
        console.log('Call : searchFetchServiceCenters', moment().format('HH:mm:ss:SSS'));
        const dataset = {};
        try {
            const response = await _POST(dataset, "/api_trr_mes/MasterData/Service_Center_Get");
            if (response && response.status === "success") {
                const serviceCenters = response.data.map((center) => ({
                    serviceCenterId: center.id,
                    serviceCenterCode: center.cost_center_code,
                    serviceCenterName: center.cost_center_name,
                    serviceCentersCodeAndName: center.cost_center_name + ' [' + center.cost_center_code + ']'
                }));
                // console.log(serviceCenters, 'Service Center');
                setOptionsSearch((prevOptions) => ({
                    ...prevOptions,
                    serviceCenter: serviceCenters,
                }));
            }
            else {
                setError("Failed to fetch service centers.");
            }
        }
        catch (error) {
            console.error("Error fetching service centers:", error);
            setError("An error occurred while fetching service centers.");
        }
    };
    const searchFetchJobTypes = async () => {
        console.log('Call : searchFetchJobTypes', moment().format('HH:mm:ss:SSS'));
        try {
            const dataset = {
                "lov_type": "job_type"
            };
            const response = await _POST(dataset, "/api_trr_mes/LovData/Lov_Data_Get");
            if (response && response.status === "success") {
                //console.log(response, 'Success fetch job');
                const jobTypes = response.data.map((job) => ({
                    lov_code: job.lov_code,
                    lov_name: job.lov1,
                }));
                setOptionsSearch((prevOptions) => ({
                    ...prevOptions,
                    jobType: jobTypes,
                }));
            }
            else {
                setError("Failed to fetch job types.");
            }
        }
        catch (error) {
            console.error("Error fetching job types:", error);
            setError("An error occurred while fetching job types.");
        }
    };
    const searchFetchFixedAssetCodes = async () => {
        console.log('Call : searchFetchFixedAssetCodes', moment().format('HH:mm:ss:SSS'));
        const dataset = {};
        try {
            const response = await _POST(dataset, "/api_trr_mes/MasterData/Fixed_Asset_Get");
            if (response && response.status === "success") {
                //console.log('Fixed_Asset_Get', response);
                const fixedAssetCodes = response.data.map((asset) => ({
                    assetCodeId: asset.id,
                    assetCode: asset.fixed_asset_code,
                    assetDescription: asset.description
                }));
                setOptionsSearch((prevOptions) => ({
                    ...prevOptions,
                    fixedAssetCode: fixedAssetCodes,
                }));
            }
            else {
                setError("Failed to fetch fixed asset codes.");
            }
        }
        catch (error) {
            console.error("Error fetching fixed asset codes:", error);
            setError("An error occurred while fetching fixed asset codes.");
        }
    };
    // ฟังก์ชันเรียก API Master Data Aotocomplete combobox options =================================================================
    /*
        ใช้สำหรับหน้า ServicesRequestBody
    */
    const fetchCostCenters = async () => {
        console.log('Call : fetchCostCenters', moment().format('HH:mm:ss:SSS'));
        const dataset = {
            user_ad: employeeUsername
        };
        try {
            const response = await _POST(dataset, "/api_trr_mes/MasterData/Cost_Center_Get");
            if (response && response.status === "success") {
                //console.log('Cost_Center_Get', response)
                const costCenters = response.data.map((costCenter) => ({
                    costCenterId: costCenter.id,
                    appReqUser: costCenter.app_req_user,
                    costCenterCode: costCenter.cost_center_code,
                    costCenterName: costCenter.cost_center_name,
                    costCentersCodeAndName: '[' + costCenter.cost_center_code + ']' + ' | ' + costCenter.cost_center_name,
                    siteCode: costCenter.site_code
                }));
                setOptions((prevOptions) => ({
                    ...prevOptions,
                    costCenter: costCenters,
                }));
            }
            else {
                setError("Failed to fetch Cost Centers.");
            }
        }
        catch (error) {
            console.error("Error fetching Cost Centers:", error);
            setError("An error occurred while fetching Cost Centers.");
        }
    };
    const fetchServiceCenters = async () => {
        console.log('Call : fetchServiceCenters', moment().format('HH:mm:ss:SSS'));
        const dataset = {};
        try {
            const response = await _POST(dataset, "/api_trr_mes/MasterData/Service_Center_Get");
            if (response && response.status === "success") {
                //console.log('ServiceCenters', response)
                const serviceCenters = response.data.map((center) => ({
                    serviceCenterId: center.id,
                    serviceCenterCode: center.cost_center_code,
                    serviceCenterName: center.cost_center_name,
                    serviceCentersCodeAndName: '[' + center.cost_center_code + ']' + ' | ' + center.cost_center_name,
                    siteCode: center.site_code
                }));
                setOptions((prevOptions) => ({
                    ...prevOptions,
                    serviceCenter: serviceCenters,
                }));
            }
            else {
                setError("Failed to fetch service centers.");
            }
        }
        catch (error) {
            console.error("Error fetching service centers:", error);
            setError("An error occurred while fetching service centers.");
        }
    };
    const fetchJobTypes = async () => {
        console.log('Call : fetchJobTypes', moment().format('HH:mm:ss:SSS'));
        try {
            const dataset = {
                "lov_type": "job_type"
            };
            const response = await _POST(dataset, "/api_trr_mes/LovData/Lov_Data_Get");
            if (response && response.status === "success") {
                //console.log(response, 'Success fetch job');
                const jobTypes = response.data.map((job) => ({
                    lov_code: job.lov_code,
                    lov_name: job.lov1,
                }));
                setOptions((prevOptions) => ({
                    ...prevOptions,
                    jobType: jobTypes,
                }));
            }
            else {
                setError("Failed to fetch job types.");
            }
        }
        catch (error) {
            console.error("Error fetching job types:", error);
            setError("An error occurred while fetching job types.");
        }
    };
    const fetchBudgetCodes = async () => {
        console.log('Call : fetchBudgetCodes', moment().format('HH:mm:ss:SSS'));
        try {
            const dataset = {
            //"cost_center_id": costCenterId
            };
            const response = await _POST(dataset, "/api_trr_mes/MasterData/Budget_Get");
            if (response && response.status === "success") {
                //console.log(response, 'Budget_Get');
                // กำหนดประเภทสำหรับ budgetCodes
                const budgetCodes = response.data.map((budget) => ({
                    budgetId: budget.id,
                    costCenterId: budget.cost_center_id,
                    budgetCode: budget.budget_code,
                    jobType: budget.job_type,
                    budgetCodeAndJobType: '[' + budget.budget_code + ']' + ' | ' + budget.description + ' (' + budget.job_type + ')'
                }));
                setOptions((prevOptions) => ({
                    ...prevOptions,
                    budgetCode: budgetCodes,
                }));
                // ส่ง jobType ไปยัง fetchJobTypes
                //fetchJobTypes(budgetCodes.map((b: { jobType: string }) => b.jobType));
            }
            else {
                setError("Failed to fetch budget codes.");
            }
        }
        catch (error) {
            console.error("Error fetching budget codes:", error);
            setError("An error occurred while fetching budget codes.");
        }
    };
    //BackUp budget
    /*-----------------------------------------------------------------------------------------------------------------
    // const fetchJobTypes = async (jobTypesFromBudget: string[]) => {
    //   console.log('Call : fetchJobTypes', moment().format('HH:mm:ss:SSS'));
    //   try {
    //     const dataset = {
    //       "lov_type": "job_type"
    //     };
  
    //     const response = await _POST(dataset, "/api_trr_mes/LovData/Lov_Data_Get");
  
    //     if (response && response.status === "success") {
    //       console.log('job_type', response);
    //       const jobTypes = response.data
    //         .filter((job: any) => jobTypesFromBudget.includes(job.lov_code))  // กรองข้อมูลด้วย jobTypesFromBudget
    //         .map((job: any) => ({
    //           lov_code: job.lov_code,
    //           lov_name: job.lov1,
    //         }));
  
    //       setOptions((prevOptions) => ({
    //         ...prevOptions,
    //         jobType: jobTypes,
    //       }));
    //     } else {
    //       setError("Failed to fetch job types.");
    //     }
    //   } catch (error) {
    //     console.error("Error fetching job types:", error);
    //     setError("An error occurred while fetching job types.");
    //   }
    // };
    --------------------------------------------------------------------------------------------------------------------*/
    const fetchFixedAssetCodes = async () => {
        console.log('Call : fetchFixedAssetCodes', moment().format('HH:mm:ss:SSS'));
        const dataset = {
        //"cost_center_id": costCenterId
        };
        try {
            const response = await _POST(dataset, "/api_trr_mes/MasterData/Fixed_Asset_Get");
            if (response && response.status === "success") {
                // console.log('Fixed_Asset_Get', response);
                const fixedAssetCodes = response.data.map((asset) => ({
                    assetCodeId: asset.id,
                    costCenterId: asset.cost_center_id,
                    assetCode: asset.fixed_asset_code,
                    assetDescription: asset.description,
                    assetCodeAndDescription: '[' + asset.fixed_asset_code + ']' + ' | ' + asset.description
                }));
                setOptions((prevOptions) => ({
                    ...prevOptions,
                    fixedAssetCode: fixedAssetCodes,
                }));
            }
            else {
                setError("Failed to fetch fixed asset codes.");
            }
        }
        catch (error) {
            console.error("Error fetching fixed asset codes:", error);
            setError("An error occurred while fetching fixed asset codes.");
        }
    };
    // สำหรับ handle กับเหตุการณ์หรือสถานะต่าง ๆ ในโค้ด ==============================================================================
    /*หน้า ค้นหาข้อมูล*/
    const handleSearch = () => {
        setActionType('search');
    };
    const handleReset = () => {
        setTextValue("");
        setStatusValue("");
        setSelectedServiceCenter(null);
        setSelectedJobType(null);
        setSelectedAssetCode(null);
        setRequestNo("");
        setStatus("");
        setActionType('reset');
    };
    // Use useEffect to call dataTableServiceRequest_GET only on specific action
    useEffect(() => {
        if (actionType) {
            dataTableServiceRequest_GET();
            setActionType(null); // Reset actionType after fetching data
        }
    }, [actionType]);
    /*หน้า ServiceRequestBody*/
    const readData = async (data) => {
        console.log('Call : readData', data, moment().format('HH:mm:ss:SSS'));
        await setDefaultValues({
            ...defaultValues,
            requestNo: data?.req_no || '',
            requestDate: data?.req_date || '',
            requestId: data?.id || '',
            costCenterId: data?.cost_center_id || '',
            costCenterName: data?.cost_center_name || '',
            reqUser: data?.req_user || '',
            appReqUser: appReqUser || '',
            costCenterCode: data?.cost_center_id || '',
            status: data?.req_status || '',
            countRevision: data?.count_revision || '',
            serviceCenterId: data?.service_center_id || '',
            site: data?.site_code || '',
            jobType: data?.job_type || '',
            budgetCode: data?.budget_id || '',
            description: data?.description || '',
            fixedAssetId: data?.fixed_asset_id || '',
            fixedAssetDescription: data?.fixed_asset_description || '',
            rejectSubmitReason: data?.reject_submit_reason || '',
            rejectStartReason: data?.reject_start_reason || '',
        });
    };
    const handleClickView = (data) => {
        //console.log(data, 'ตอนกดปุ่ม View : ข้อมูล data');
        setOpenView(true);
        readData(data);
        fetchUserData(); // เรียกใช้ฟังก์ชันเพื่อดึงงข้อมูล User 
    };
    const handleClickAdd = () => {
        setOpenAdd(true);
    };
    const handleClickEdit = (data) => {
        setOpenEdit(true);
        ;
        readData(data);
        fetchUserData(); // เรียกใช้ฟังก์ชันเพื่อดึงงข้อมูล User   
    };
    const handleClickDelete = (data) => {
        setOpenDelete(true);
        readData(data);
        fetchUserData(); // เรียกใช้ฟังก์ชันเพื่อดึงงข้อมูล User 
    };
    const handleClickSubmit = (data) => {
        setOpenSubmit(true);
        readData(data);
        fetchUserData(); // เรียกใช้ฟังก์ชันเพื่อดึงงข้อมูล User 
    };
    const handleClickApproved = (data) => {
        setOpenApproved(true);
        readData(data);
        fetchUserData(); // เรียกใช้ฟังก์ชันเพื่อดึงงข้อมูล User 
    };
    const handleClickClose = (data) => {
        setOpenClose(true);
        readData(data);
        fetchUserData(); // เรียกใช้ฟังก์ชันเพื่อดึงงข้อมูล User   
    };
    const handleClose = () => {
        setOpenView(false);
        setOpenAdd(false);
        setOpenEdit(false);
        setOpenDelete(false);
        setOpenSubmit(false);
        setOpenApproved(false);
        setOpenClose(false);
        setDefaultValues(defaultVal);
        readData(null);
        fetchUserData(); // เรียกใช้ฟังก์ชันเพื่อดึงงข้อมูล User ใหม่หลังเคลียร์  
        dataTableServiceRequest_GET(); // เรียกใช้ฟังก์ชันเพื่อดึงงข้อมูล serviceRequest ใหม่หลังเคลียร์ 
        setOpenReject(false); //ปิด Modal Reject Reason
        setOpenRejectJob(false); //ปิด Modal Reject Job Reason 
    };
    const handleDataChange = (data) => {
        setDraftData(data); // Store draft data
    };
    //================================================================================================
    //ตรวจสอบว่ามี User ไหม ?
    const fetchUserData = async () => {
        console.log('Call : เริ่มต้น fetchUserData ', moment().format('HH:mm:ss:SSS'));
        if (!employeeUsername)
            return;
        const dataset = {
            user_ad: employeeUsername || null
        };
        try {
            const response = await _POST(dataset, "/api_trr_mes/MasterData/User_Get");
            if (response && response.status === "success") {
                if (response.data && Array.isArray(response.data) && response.data.length > 0) {
                    const userData = response.data[0];
                    if (userData.user_ad === employeeUsername || userData.app_req_user === employeeUsername) {
                        //console.log(userData,"userData");
                        //setAppReqUser(userData.app_req_user);
                        setDefaultValues(prevValues => ({
                            ...prevValues,
                            reqUser: employeeUsername || prevValues.reqUser, // เพิ่มค่า user_ad ใน reqUser
                            // appReqUser: userData.app_req_user || prevValues.appReqUser,
                            // costCenterId: userData.cost_center_id || prevValues.costCenterId,
                            // costCenterCode: userData.cost_center_code || prevValues.costCenterCode,
                            // costCenterName: userData.cost_center_name || prevValues.costCenterName,
                            // site: userData.site_code || prevValues.site,
                            // siteId: userData.site_id || prevValues.siteId
                        }));
                        //console.log(response, 'UserGet');
                    }
                    else {
                        setErrorMessage("ข้อมูล User ไม่ตรงกับข้อมูลปัจจุบัน");
                    }
                }
                else {
                    setErrorMessage("ไม่มีข้อมูล User ที่ตรงกับเงื่อนไข");
                }
            }
            else {
                setErrorMessage("ไม่สามารถดึงข้อมูล User ได้");
            }
        }
        catch (error) {
            console.error("Error fetching user data:", error);
            setErrorMessage("เกิดข้อผิดพลาดในการดึงข้อมูล User");
        }
    };
    //Get ดึงข้อมูลใส่ ตาราง
    const dataTableServiceRequest_GET = async () => {
        console.log('Call : dataTableServiceRequest_GET', moment().format('HH:mm:ss:SSS'));
        if (!currentUser)
            return;
        const dataset = {
            "req_user": employeeUsername,
            "service_center_id": selectedServiceCenter?.serviceCenterId,
            "req_no": requestNo?.toString(),
            "job_type": selectedJobType?.lov_code,
            "fixed_asset_id": selectedAssetCode?.assetCodeId,
            "req_status": status
        };
        try {
            const response = await _POST(dataset, "/api_trr_mes/ServiceRequest/Service_Request_Get");
            if (response && response.status === "success") {
                const { data: result } = response;
                const newData = [];
                Array.isArray(result) && result.forEach((el) => {
                    //console.log(el, "😊😊😊");
                    el.req_date = dateFormatTimeEN(el.req_date, "DD/MM/YYYY HH:mm:ss");
                    el.status_update = dateFormatTimeEN(el.status_update, "DD/MM/YYYY HH:mm:ss");
                    el.cost_center_label = el.cost_center_name + " [" + el.cost_center_code + "]";
                    el.service_center_label = el.service_center_name + " [" + el.service_center_code + "]";
                    el.ACTION = null;
                    el.ACTION = (_jsx(ActionManageCell, { onClick: (name) => {
                            if (name == 'View') {
                                handleClickView(el);
                            }
                            else if (name == 'Edit') {
                                handleClickEdit(el);
                            }
                            else if (name == 'Delete') {
                                handleClickDelete(el);
                            }
                            else if (name == 'Submit') {
                                handleClickSubmit(el);
                            }
                            else if (name == 'Approve') {
                                handleClickApproved(el);
                            }
                            else if (name == 'Close') {
                                handleClickClose(el);
                            }
                        }, reqStatus: el.req_status, appUser: el.app_user, currentUser: employeeUsername, roleName: roleName }));
                    if (el.req_status === "Draft") {
                        el.req_status_label = _jsx(BasicChips, { label: `${el.req_status}`, backgroundColor: "#B3B3B3", borderColor: "#B3B3B3" });
                    }
                    else if (el.req_status === "Submit") {
                        el.req_status_label = _jsx(BasicChips, { label: `${el.req_status}`, backgroundColor: "#BDE3FF", borderColor: "#BDE3FF" });
                    }
                    else if (el.req_status === "Approved") {
                        el.req_status_label = _jsx(BasicChips, { label: `${el.req_status}`, backgroundColor: "#E4CCFF", borderColor: "#E4CCFF" });
                    }
                    else if (el.req_status === "Start") {
                        el.req_status_label = _jsx(BasicChips, { label: `${el.req_status}`, backgroundColor: "#FFE8A3", borderColor: "#FFE8A3" });
                    }
                    else if (el.req_status === "On process") {
                        el.req_status_label = _jsx(BasicChips, { label: `${el.req_status}`, backgroundColor: "#FFA629", borderColor: "#FFA629" });
                    }
                    else if (el.req_status === "Job Done") {
                        el.req_status_label = _jsx(BasicChips, { label: `${el.req_status}`, backgroundColor: "#AFF4C6", borderColor: "#AFF4C6" });
                    }
                    else if (el.req_status === "Close") {
                        el.req_status_label = _jsx(BasicChips, { label: `${el.req_status}`, backgroundColor: "#1E1E1E", borderColor: "#1E1E1E", textColor: "#FFFFFF" });
                    }
                    newData.push(el);
                });
                console.log(newData, 'ค่าที่ดึงจาก ตาราง');
                setDataList(newData);
            }
        }
        catch (e) {
            console.error("Error fetching service requests:", e);
        }
    };
    //Add Data ไปลง Database
    const serviceRequestDraftAdd = async () => {
        console.log('Call : serviceRequestDraftAdd', draftData, moment().format('HH:mm:ss:SSS'));
        confirmModal.createModal("Confirm Save Data ?", "info", async () => {
            if (draftData) {
                console.log("Saving draft data:", draftData);
                // สร้างข้อมูลที่จะส่ง
                const payload = {
                    serviceRequestModel: {
                        req_date: DateToDB(new Date()), // ใช้วันที่ปัจจุบัน
                        req_user: draftData.reqUser || "",
                        app_user: null,
                        cost_center_id: draftData.costCenter.costCenterId || "",
                        service_center_id: draftData.serviceCenter?.serviceCenterId || "",
                        description: draftData.description || "",
                        req_status: draftData.status || "",
                        count_revision: draftData.countRevision || 0,
                        status_update: DateToDB(new Date()), // ใช้วันที่ปัจจุบัน
                        fixed_asset_id: draftData.fixedAssetCode.assetCodeId || "",
                        budget_id: draftData.budgetCode.budgetId || "",
                        job_type: draftData.jobType.lov_code || "",
                    },
                    currentAccessModel: {
                        user_id: employeeUsername || "" // ใช้ค่า user_id จาก currentUser หรือค่าเริ่มต้น
                    },
                    documentRunningModel: {
                        code_group: draftData.site,
                        code_type: "RQ",
                        trans_date: DateToDB(new Date()), // ใช้วันที่ปัจจุบัน
                    }
                };
                try {
                    console.log('Running model', payload);
                    // ใช้ _POST เพื่อส่งข้อมูล
                    const response = await _POST(payload, "/api_trr_mes/ServiceRequest/Service_Request_Draft_Add");
                    if (response && response.status === "success") {
                        console.log('Draft saved successfully:', response);
                        // เพิ่มโค้ดที่ต้องการเมื่อบันทึกสำเร็จ
                        Massengmodal.createModal(_jsxs("div", { className: "text-center p-4", children: [_jsx("p", { className: "text-xl font-semibold mb-2 text-green-600", children: "Save Draft" }), _jsxs("p", { className: "text-lg text-gray-800", children: [_jsx("span", { className: "font-semibold text-gray-900", children: "Request No:" }), _jsx("span", { className: "font-bold text-indigo-600 ml-1", children: response.req_no })] })] }), 'success', () => {
                            handleClose();
                        });
                    }
                    else {
                        console.error('Failed to save draft:', response);
                        // เพิ่มโค้ดที่ต้องการเมื่อเกิดข้อผิดพลาด
                    }
                }
                catch (error) {
                    console.error('Error saving draft:', error);
                    // เพิ่มโค้ดที่ต้องการเมื่อเกิดข้อผิดพลาดในการส่งข้อมูล
                }
            }
        });
    };
    //Add Edit ไปลง Database
    const serviceRequestDraftEdit = async () => {
        console.log('Call : serviceRequestDraftEdit', draftData, moment().format('HH:mm:ss:SSS'));
        confirmModal.createModal("Confirm Save Data ?", "info", async () => {
            if (draftData) {
                console.log("Saving draft data:", draftData);
                //สร้างข้อมูลที่จะส่ง
                const payload = {
                    serviceRequestModel: {
                        id: draftData?.requestId || "",
                        req_no: draftData?.requestNo || "",
                        req_date: DateToDB(draftData.requestDate), // ใช้วันที่ปัจจุบัน
                        req_user: draftData.reqUser || "",
                        app_user: "",
                        req_status: draftData.status || "",
                        count_revision: draftData.countRevision || 0,
                        status_update: DateToDB(new Date()), // ใช้วันที่ปัจจุบัน
                        cost_center_id: draftData.costCenter.costCenterId || "",
                        service_center_id: draftData.serviceCenter.serviceCenterId || "",
                        description: draftData.description || "",
                        fixed_asset_id: draftData.fixedAssetCode.assetCodeId || "",
                        budget_id: draftData.budgetCode.budgetId || "",
                        job_type: draftData.jobType.lov_code || "",
                    },
                    currentAccessModel: {
                        user_id: employeeUsername || "" // ใช้ค่า user_id จาก currentUser หรือค่าเริ่มต้น
                    }
                };
                console.log(payload, 'payload');
                try {
                    // ใช้ _POST เพื่อส่งข้อมูล
                    const response = await _POST(payload, "/api_trr_mes/ServiceRequest/Service_Request_Draft_Edit");
                    if (response && response.status === "success") {
                        console.log('Draft saved successfully:', response);
                        // เพิ่มโค้ดที่ต้องการเมื่อบันทึกสำเร็จ
                        Massengmodal.createModal(_jsx("div", { className: "text-center p-4", children: _jsx("p", { className: "text-xl font-semibold mb-2 text-green-600", children: "Success" }) }), 'success', () => {
                            handleClose();
                        });
                    }
                    else {
                        console.error('Failed to save draft:', response);
                        // เพิ่มโค้ดที่ต้องการเมื่อเกิดข้อผิดพลาด
                    }
                }
                catch (error) {
                    console.error('Error saving draft:', error);
                    // เพิ่มโค้ดที่ต้องการเมื่อเกิดข้อผิดพลาดในการส่งข้อมูล
                }
            }
        });
    };
    //Add Delete ไปลง Database
    const serviceRequestDraftDelete = async () => {
        console.log('Call : serviceRequestDraftDelete', draftData.requestId, moment().format('HH:mm:ss:SSS'));
        confirmModal.createModal("Confirm Submit Data ?", "info", async () => {
            if (draftData) {
                console.log("Saving draft data:", draftData);
                // สร้างข้อมูลที่จะส่ง
                const payload = {
                    serviceRequestModel: {
                        id: draftData.requestId
                    },
                    currentAccessModel: {
                        user_id: employeeUsername || "" // ใช้ค่า user_id จาก currentUser หรือค่าเริ่มต้น
                    }
                };
                try {
                    // ใช้ _POST เพื่อส่งข้อมูล
                    const response = await _POST(payload, "/api_trr_mes/ServiceRequest/Service_Request_Draft_Delete");
                    if (response && response.status === "success") {
                        console.log('Draft delete successfully:', response);
                        // เพิ่มโค้ดที่ต้องการเมื่อบันทึกสำเร็จ
                        Massengmodal.createModal(_jsx("div", { className: "text-center p-4", children: _jsx("p", { className: "text-xl font-semibold mb-2 text-green-600", children: "Success" }) }), 'success', () => {
                            handleClose();
                        });
                    }
                    else {
                        console.error('Failed to save draft:', response);
                        // เพิ่มโค้ดที่ต้องการเมื่อเกิดข้อผิดพลาด
                    }
                }
                catch (error) {
                    console.error('Error saving draft:', error);
                    // เพิ่มโค้ดที่ต้องการเมื่อเกิดข้อผิดพลาดในการส่งข้อมูล
                }
            }
        });
    };
    //Add Submit ไปลง Database
    const serviceRequestDraftSubmit = async () => {
        console.log('Call : serviceRequestDraftSubmit', draftData, moment().format('HH:mm:ss:SSS'));
        confirmModal.createModal("Confirm Submit Data ?", "info", async () => {
            if (draftData) {
                console.log("Submit Data:", draftData);
                // สร้างข้อมูลที่จะส่ง
                const payload = {
                    changeStatusModel: {
                        id: draftData.requestId,
                        new_status: "Submit",
                        app_user: draftData.costCenter.appReqUser
                    },
                    currentAccessModel: {
                        user_id: employeeUsername || "" // ใช้ค่า user_id จาก currentUser หรือค่าเริ่มต้น
                    }
                };
                try {
                    console.log('payload', payload);
                    // ใช้ _POST เพื่อส่งข้อมูล
                    const response = await _POST(payload, "/api_trr_mes/ChangeStatus/Change_Status");
                    if (response && response.status === "success") {
                        console.log('Submit successfully:', response);
                        // เพิ่มโค้ดที่ต้องการเมื่อบันทึกสำเร็จ
                        Massengmodal.createModal(_jsx("div", { className: "text-center p-4", children: _jsx("p", { className: "text-xl font-semibold mb-2 text-green-600", children: "Success" }) }), 'success', () => {
                            handleClose();
                        });
                    }
                    else {
                        console.error('Failed to Submit:', response);
                        // เพิ่มโค้ดที่ต้องการเมื่อเกิดข้อผิดพลาด
                    }
                }
                catch (error) {
                    console.error('Error Submit:', error);
                    // เพิ่มโค้ดที่ต้องการเมื่อเกิดข้อผิดพลาดในการส่งข้อมูล
                }
            }
        });
    };
    //AddApprove ไปลง Database
    const serviceRequestApproved = async () => {
        console.log('Call : serviceRequestApproved', draftData, moment().format('HH:mm:ss:SSS'));
        confirmModal.createModal("ConfirmApprove Data ?", "info", async () => {
            if (draftData) {
                console.log("Approved Data:", draftData);
                // สร้างข้อมูลที่จะส่ง
                const payload = {
                    changeStatusModel: {
                        id: draftData.requestId,
                        new_status: "Approved",
                        app_user: draftData.appReqUser
                    },
                    currentAccessModel: {
                        user_id: employeeUsername || "" // ใช้ค่า user_id จาก currentUser หรือค่าเริ่มต้น
                    }
                };
                try {
                    // ใช้ _POST เพื่อส่งข้อมูล
                    const response = await _POST(payload, "/api_trr_mes/ChangeStatus/Change_Status");
                    if (response && response.status === "success") {
                        console.log('Submit successfully:', response);
                        // เพิ่มโค้ดที่ต้องการเมื่อบันทึกสำเร็จ
                        Massengmodal.createModal(_jsx("div", { className: "text-center p-4", children: _jsx("p", { className: "text-xl font-semibold mb-2 text-green-600", children: "Success" }) }), 'success', () => {
                            handleClose();
                        });
                    }
                    else {
                        console.error('Failed toApprove:', response);
                        // เพิ่มโค้ดที่ต้องการเมื่อเกิดข้อผิดพลาด
                    }
                }
                catch (error) {
                    console.error('ErrorApprove:', error);
                    // เพิ่มโค้ดที่ต้องการเมื่อเกิดข้อผิดพลาดในการส่งข้อมูล
                }
            }
        });
    };
    //Add SubmitReject ไปลง Database
    const serviceRequestSubmitReject = async () => {
        console.log('Call : serviceRequestSubmitReject', draftData, moment().format('HH:mm:ss:SSS'));
        console.log('Call : rejectReason', rejectReason, moment().format('HH:mm:ss:SSS'));
        //confirmModal.createModal("Submit Reject Data ?", "info", async () => {
        if (draftData && rejectReason) {
            console.log("Submit Reject Data:", draftData);
            // สร้างข้อมูลที่จะส่ง
            const payload = {
                rejectActionModel: {
                    req_id: draftData.requestId,
                    req_status: "Submit Reject",
                    reject_reason: rejectReason
                },
                currentAccessModel: {
                    user_id: employeeUsername || "" // ใช้ค่า user_id จาก currentUser หรือค่าเริ่มต้น
                }
            };
            try {
                // ใช้ _POST เพื่อส่งข้อมูล
                const response = await _POST(payload, "/api_trr_mes/RejectAction/Reject_Action");
                if (response && response.status === "success") {
                    console.log('Submit Reject successfully:', response);
                    // เพิ่มโค้ดที่ต้องการเมื่อบันทึกสำเร็จ
                    Massengmodal.createModal(_jsx("div", { className: "text-center p-4", children: _jsx("p", { className: "text-xl font-semibold mb-2 text-green-600", children: "Success" }) }), 'success', () => {
                        handleClose();
                    });
                }
                else {
                    console.error('Failed to Submit Reject:', response);
                    // เพิ่มโค้ดที่ต้องการเมื่อเกิดข้อผิดพลาด
                }
            }
            catch (error) {
                console.error('Error Submit Reject:', error);
                // เพิ่มโค้ดที่ต้องการเมื่อเกิดข้อผิดพลาดในการส่งข้อมูล
            }
        }
        // });
    };
    //Add Close ไปลง Database
    const serviceRequestClose = async () => {
        console.log('Call : serviceRequestClose', draftData, moment().format('HH:mm:ss:SSS'));
        confirmModal.createModal("Confirm Close Data ?", "info", async () => {
            if (draftData) {
                console.log("Close Data:", draftData);
                // สร้างข้อมูลที่จะส่ง
                const payload = {
                    changeStatusModel: {
                        id: draftData.requestId,
                        new_status: "Close",
                        app_user: draftData.appReqUser
                    },
                    currentAccessModel: {
                        user_id: employeeUsername || "" // ใช้ค่า user_id จาก currentUser หรือค่าเริ่มต้น
                    }
                };
                try {
                    console.log('Running model', payload);
                    // ใช้ _POST เพื่อส่งข้อมูล
                    const response = await _POST(payload, "/api_trr_mes/ChangeStatus/Change_Status");
                    if (response && response.status === "success") {
                        console.log('Close successfully:', response);
                        // เพิ่มโค้ดที่ต้องการเมื่อบันทึกสำเร็จ
                        Massengmodal.createModal(_jsx("div", { className: "text-center p-4", children: _jsx("p", { className: "text-xl font-semibold mb-2 text-green-600", children: "Success" }) }), 'success', () => {
                            handleClose();
                        });
                    }
                    else {
                        console.error('Failed to Close:', response);
                        // เพิ่มโค้ดที่ต้องการเมื่อเกิดข้อผิดพลาด
                    }
                }
                catch (error) {
                    console.error('Error Close:', error);
                    // เพิ่มโค้ดที่ต้องการเมื่อเกิดข้อผิดพลาดในการส่งข้อมูล
                }
            }
        });
    };
    //Add RejectJob ไปลง Database
    const serviceRequestRejectJob = async () => {
        console.log('Call : serviceRequestRejectJob', draftData, moment().format('HH:mm:ss:SSS'));
        console.log('Call : rejectJobReason', rejectJobReason, moment().format('HH:mm:ss:SSS'));
        //confirmModal.createModal("Reject Job Reject Data ?", "info", async () => {
        if (draftData && rejectJobReason) {
            console.log("Reject Job Reject Data:", draftData);
            // สร้างข้อมูลที่จะส่ง
            const payload = {
                rejectActionModel: {
                    req_id: draftData.requestId,
                    req_status: "Reject Job",
                    reject_reason: rejectJobReason,
                    revision_no: String(draftData.countRevision)
                },
                currentAccessModel: {
                    user_id: employeeUsername || "" // ใช้ค่า user_id จาก currentUser หรือค่าเริ่มต้น
                }
            };
            try {
                // ใช้ _POST เพื่อส่งข้อมูล
                const response = await _POST(payload, "/api_trr_mes/RejectAction/Reject_Action");
                if (response && response.status === "success") {
                    console.log('Reject Job Reject successfully:', response);
                    // เพิ่มโค้ดที่ต้องการเมื่อบันทึกสำเร็จ
                    Massengmodal.createModal(_jsx("div", { className: "text-center p-4", children: _jsx("p", { className: "text-xl font-semibold mb-2 text-green-600", children: "Success" }) }), 'success', () => {
                        handleClose();
                    });
                }
                else {
                    console.error('Failed to Reject Job Reject:', response);
                    // เพิ่มโค้ดที่ต้องการเมื่อเกิดข้อผิดพลาด
                }
            }
            catch (error) {
                console.error('Error Reject Job Reject:', error);
                // เพิ่มโค้ดที่ต้องการเมื่อเกิดข้อผิดพลาดในการส่งข้อมูล
            }
        }
        // });
    };
    //================================================================================================
    return (_jsxs("div", { children: [_jsxs("div", { className: "max-lg rounded overflow-hidden shadow-xl bg-white mt-5 mb-5", children: [_jsx("div", { className: "px-6 pt-4", children: _jsx("label", { className: "text-2xl ml-2 mt-3 mb-5 sarabun-regular", children: "\u0E04\u0E49\u0E19\u0E2B\u0E32\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25" }) }), _jsxs("div", { className: "row px-10 pt-0 pb-5", children: [_jsx("div", { className: "col-md-3 mb-2", children: _jsx(FullWidthTextField, { labelName: "เลขที่ใบคำขอ", value: requestNo, onChange: (value) => setRequestNo(value) }) }), _jsx("div", { className: "col-md-3 mb-2", children: _jsx(AutocompleteComboBox, { value: selectedServiceCenter, labelName: "Service Center", options: optionsSearch.serviceCenter, column: "serviceCentersCodeAndName", setvalue: handleAutocompleteChange(setSelectedServiceCenter) }) }), _jsx("div", { className: "col-md-3 mb-2", children: _jsx(AutocompleteComboBox, { value: selectedJobType, labelName: "ประเภทงาน", options: optionsSearch.jobType, column: "lov_name", setvalue: handleAutocompleteChange(setSelectedJobType) }) }), _jsx("div", { className: "col-md-3 mb-2", children: _jsx(AutocompleteComboBox, { value: selectedAssetCode, labelName: "Fixed Asset Code", options: optionsSearch.fixedAssetCode, column: "assetCode", setvalue: handleAutocompleteChange(setSelectedAssetCode) }) }), _jsx("div", { className: "col-md-3 mb-2", children: _jsx(FullWidthTextField, { labelName: "สถานะ", value: status, onChange: (value) => setStatus(value) }) }), _jsxs("div", { className: "flex justify-end pt-2", children: [_jsx("div", { className: "col-md-1 px-1", children: _jsx(FullWidthButton, { labelName: "ค้นหา", handleonClick: handleSearch, variant_text: "contained", colorname: "success" }) }), _jsx("div", { className: "col-md-1 px-1", children: _jsx(FullWidthButton, { labelName: "รีเซ็ต", handleonClick: handleReset, variant_text: "contained", colorname: "inherit" }) })] })] })] }), _jsxs("div", { className: "max-lg rounded overflow-hidden shadow-lg bg-white mb-5", children: [_jsx("div", { children: _jsx(EnhancedTable, { rows: dataList, buttonLabal_1: "\u0E40\u0E1E\u0E34\u0E48\u0E21\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25", buttonColor_1: "info", headCells: Request_headCells, tableName: "บันทึกขอใช้บริการ", handleonClick_1: handleClickAdd, roleName: currentUser?.role_name }) }), _jsx(FuncDialog, { open: openAdd, dialogWidth: "xl", openBottonHidden: true, titlename: 'เพิ่มข้อมูล', handleClose: handleClose, handlefunction: serviceRequestDraftAdd, colorBotton: "success", actions: "Draft", element: _jsx(ServiceRequestBody, { onDataChange: handleDataChange, defaultValues: defaultValues, options: options, actions: "Create" }) }), _jsx(FuncDialog, { open: openView, dialogWidth: "xl", openBottonHidden: true, titlename: 'ดูข้อมูล', handleClose: handleClose, colorBotton: "success", actions: "Reade", element: _jsx(ServiceRequestBody, { onDataChange: handleDataChange, defaultValues: defaultValues, options: options, disableOnly: true }) }), _jsx(FuncDialog, { open: openEdit, dialogWidth: "xl", openBottonHidden: true, titlename: 'แก้ไขข้อมูล', handleClose: handleClose, handlefunction: serviceRequestDraftEdit, colorBotton: "success", actions: "Update", element: _jsx(ServiceRequestBody, { onDataChange: handleDataChange, defaultValues: defaultValues, options: options, actions: "Update" }) }), _jsx(FuncDialog, { open: openDelete, dialogWidth: "xl", openBottonHidden: true, titlename: 'ลบข้อมูล', handleClose: handleClose, handlefunction: serviceRequestDraftDelete, colorBotton: "success", actions: "Delete", element: _jsx(ServiceRequestBody, { onDataChange: handleDataChange, defaultValues: defaultValues, options: options, disableOnly: true }) }), _jsx(FuncDialog, { open: openSubmit, dialogWidth: "xl", openBottonHidden: true, titlename: 'ส่งข้อมูล', handleClose: handleClose, handlefunction: serviceRequestDraftSubmit, colorBotton: "success", actions: "Submit", element: _jsx(ServiceRequestBody, { onDataChange: handleDataChange, defaultValues: defaultValues, options: options, disableOnly: true }) }), _jsx(FuncDialog, { open: openApproved, dialogWidth: "xl", openBottonHidden: true, titlename: 'อนุมัติ', handleClose: handleClose, handlefunction: serviceRequestApproved, handleRejectAction: () => setOpenReject(true), colorBotton: "success", actions: "Approved", element: _jsx(ServiceRequestBody, { onDataChange: handleDataChange, defaultValues: defaultValues, options: options, disableOnly: true }) }), _jsx(FuncDialog, { open: openClose, dialogWidth: "xl", openBottonHidden: true, titlename: 'ปิดงาน', handleClose: handleClose, handlefunction: serviceRequestClose, handleRejectAction: () => setOpenRejectJob(true), colorBotton: "success", actions: "Close", element: _jsx(ServiceRequestBody, { onDataChange: handleDataChange, defaultValues: defaultValues, options: options, disableOnly: true }) })] }), _jsx(FuncDialog, { open: openReject, dialogWidth: 'sm', openBottonHidden: true, titlename: 'ไม่อนุมัติ', handleClose: () => setOpenReject(false), handlefunction: serviceRequestSubmitReject, actions: "RejectReason", element: _jsx(FullWidthTextareaField, { required: "*", labelName: "โปรดระบุเหตุผล", value: rejectReason, multiline: true, onChange: (value) => setRejectReason(value) }) }), _jsx(FuncDialog, { open: openRejectJob, dialogWidth: 'sm', openBottonHidden: true, titlename: 'ปฏิเสธงาน', handleClose: () => setOpenRejectJob(false), handlefunction: serviceRequestRejectJob, actions: "RejectReason", element: _jsx(FullWidthTextareaField, { required: "*", labelName: "โปรดระบุเหตุผลในการปฏิเสธงาน", value: rejectJobReason, multiline: true, onChange: (value) => setRejectJobReason(value) }) }), _jsxs(Dialog, { open: !!errorMessage, onClose: () => setErrorMessage(null), "aria-labelledby": "error-dialog-title", "aria-describedby": "error-dialog-description", children: [_jsx(DialogTitle, { id: "error-dialog-title", children: "Error" }), _jsx(DialogContent, { children: _jsx("p", { id: "error-dialog-description", children: errorMessage }) }), _jsx(DialogActions, { children: _jsx(Button, { onClick: () => setErrorMessage(null), color: "primary", children: "Close" }) })] })] }));
}
