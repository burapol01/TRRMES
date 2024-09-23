import React, { useState, useEffect } from "react";
import FullWidthTextField from "../../components/MUI/FullWidthTextField";
import { _GET, _POST } from "../../service/mas";
import AutocompleteComboBox from "../../components/MUI/AutocompleteComboBox";
import FullWidthButton from "../../components/MUI/FullWidthButton";
import EnhancedTable from "../../components/MUI/DataTables";
import { Request_headCells } from "../../../libs/columnname";
import FuncDialog from "../../components/MUI/FullDialog";
import { useSelector } from "react-redux";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import moment from 'moment';
import ServiceTimeSheetBody from "./component/ServiceTimeSheetBody";
import { confirmModal } from "../../components/MUI/Comfirmmodal";
import { Massengmodal } from "../../components/MUI/Massengmodal";
import ActionManageCell from "../../components/MUI/ActionManageCell";
import BasicChips from "../../components/MUI/BasicChips";
import { dateFormatTimeEN, DateToDB } from "../../../libs/datacontrol";
import FullWidthTextareaField from "../../components/MUI/FullWidthTextareaField";
import { useListServiceTimeSheet } from "./core/service_time_sheet_provider";
import { checkValidate, isCheckValidateAll } from "../../../libs/validations";

interface OptionsState {
  costCenter: any[];
  serviceCenter: any[];
  jobType: any[];
  budgetCode: any[];
  fixedAssetCode: any[];
  revision: any[];
  technician: any[];
  workHour: any[];
}

const initialOptions: OptionsState = {
  costCenter: [],
  serviceCenter: [],
  jobType: [],
  budgetCode: [],
  fixedAssetCode: [],
  revision: [],
  technician: [],
  workHour: [],
};

interface SelectedData {
  reqUser: string;
  costCenterCode: string;
  status: string;
  countRevision: string;
  serviceCenter: string;
  site: string;
  jobType: string;
  budgetCode: string;
  description: string;
  fixedAssetCode: string;
  fixedAssetDescription: string;
}

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
}

export default function ServiceTimeSheet() {

  const { isValidate, setIsValidate } = useListServiceTimeSheet()
  const [requestNo, setRequestNo] = useState("");
  const [status, setStatus] = useState("");
  const currentUser = useSelector((state: any) => state?.user?.user);
  const [appReqUser, setAppReqUser] = useState<string>("");
  const [siteId, setSiteId] = useState<string>("");
  const [costCenterId, setCostCenterId] = useState<string>("");
  const [textValue, setTextValue] = useState<string>("");
  const [statusValue, setStatusValue] = useState<string>("");
  const [selectedServiceCenter, setSelectedServiceCenter] = useState<any>(null);
  const [selectedJobType, setSelectedJobType] = useState<any>(null);
  const [selectedAssetCode, setSelectedAssetCode] = useState<any>(null);
  const [openAdd, setOpenAdd] = useState(false);
  const [openView, setOpenView] = useState<any>(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openAcceptJob, setOpenAcceptJob] = useState<any>(false);
  const [openTimeSheet, setOpenTimeSheet] = useState<any>(false);
  const [openJobDone, setOpenJobDone] = useState<any>(false);
  const [dataList, setDataList] = useState<any[]>([]);
  const [draftData, setDraftData] = useState<any>(null); // State to store draft data  
  const [options, setOptions] = useState<OptionsState>(initialOptions); // State for combobox options
  const [optionsSearch, setOptionsSearch] = useState<OptionsState>(initialOptions); // State for combobox options
  const [error, setError] = useState<string | null>(null); // สถานะสำหรับข้อผิดพลาด 
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // State for error messages
  const handleTextChange = (value: string) => setTextValue(value);
  const handleStatusChange = (value: string) => setStatusValue(value);
  const handleAutocompleteChange = (setter: React.Dispatch<React.SetStateAction<any>>) => (value: any) => {
    setter(value);
  };
  const [actionType, setActionType] = useState<string | null>(null); // Corrected type
  // State to store default values
  const [defaultValues, setDefaultValues] = useState(defaultVal);

  //For Reject Reasons
  const [openReject, setOpenReject] = useState(false);
  const [rejectReason, setRejectReason] = useState<string>("");

  //ตัวแปร ใช้ทุกที่
  const employeeUsername = currentUser?.employee_username.toLowerCase()
  const isValidationEnabled = import.meta.env.VITE_APP_ENABLE_VALIDATION === 'true'; // ตรวจสอบว่าเปิดการตรวจสอบหรือไม่

  // useEffect ที่ใช้ดึงข้อมูล initial data เมื่อ component ถูกสร้างครั้งแรก
  //============================================================================================================================

  //ดึงข้อมูลจาก User มาตรวจสอบก่อนว่ามีอยู่ในระบบหรือไม่
  useEffect(() => {
    console.log('Call : 🟢[1] fetch UserData&serviceTimeSheet', moment().format('HH:mm:ss:SSS'));

    if (employeeUsername) {
      fetchUserData(); // เรียกใช้ฟังก์ชันเพื่อดึงข้อมูล User   
      dataTableServiceTimeSheet_GET();
    }
  }, [employeeUsername]);

  //ดึงข้อมูลจาก Master Data ไว้สำหรับหน้าค้นหาข้อมูล
  useEffect(() => {
    console.log('Call : 🟢[2] Search fetch Master Data', moment().format('HH:mm:ss:SSS'));
    const fetchData = async () => {
      await Promise.all([
        searchFetchServiceCenters(), // เรียกใช้ฟังก์ชันเพื่อดึงข้อมูล service centers
        searchFetchJobTypes(), // เรียกใช้ฟังก์ชันเพื่อดึงข้อมูล job types
        searchFetchFixedAssetCodes(), // เรียกใช้ฟังก์ชันเพื่อดึงข้อมูล fixed asset codes      
      ]);
    };
    fetchData();
  }, [defaultValues]);

  //ดึงข้อมูลจาก Master Data ไว้สำหรับหน้า ServiceTimeSheetBody
  useEffect(() => {
    console.log('Call : 🟢[3] Fetch Master Data', moment().format('HH:mm:ss:SSS'));

    if (defaultValues) {
      fetchCostCenters();
      fetchServiceCenters();
      fetchRevision();
      // fetchTechnician();
      fetchServiceStaff();
      //fetchWorkHour();  //ปิดไว้ก่อนเผื่อกลับมาใช้

    }

    if (defaultValues.costCenterId != "") {
      fetchFixedAssetCodes(); // เรียกใช้ฟังก์ชันเพื่อดึงข้อมูล fixed asset codes     
      fetchBudgetCodes(); // เรียกใช้ฟังก์ชันเพื่อดึงข้อมูล budget codes 
    }

    if (defaultValues.requestId != "") {
      console.log(defaultValues.requestId, "request");
      fetchRevision();
    }
    fetchJobTypes();

  }, [defaultValues]);




  // หน้าค้นหา Search ========================================================================================================= 
  const searchFetchServiceCenters = async () => {
    console.log('Call : searchFetchServiceCenters', moment().format('HH:mm:ss:SSS'));

    const dataset = {

    };

    try {
      const response = await _POST(dataset, "/api_trr_mes/MasterData/Service_Center_Get");

      if (response && response.status === "success") {
        const serviceCenters = response.data.map((center: any) => ({

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
      } else {
        setError("Failed to fetch service centers.");
      }
    } catch (error) {
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
        const jobTypes = response.data.map((job: any) => ({
          lov_code: job.lov_code,
          lov_name: job.lov1,
        }));

        setOptionsSearch((prevOptions) => ({
          ...prevOptions,
          jobType: jobTypes,
        }));
      } else {
        setError("Failed to fetch job types.");
      }
    } catch (error) {
      console.error("Error fetching job types:", error);
      setError("An error occurred while fetching job types.");
    }
  };

  const searchFetchFixedAssetCodes = async () => {
    console.log('Call : searchFetchFixedAssetCodes', moment().format('HH:mm:ss:SSS'));

    const dataset = {

    };

    try {
      const response = await _POST(dataset, "/api_trr_mes/MasterData/Fixed_Asset_Get");

      if (response && response.status === "success") {
        //console.log('Fixed_Asset_Get', response);
        const fixedAssetCodes = response.data.map((asset: any) => ({
          assetCodeId: asset.id,
          assetCode: asset.fixed_asset_code,
          assetDescription: asset.description
        }));

        setOptionsSearch((prevOptions) => ({
          ...prevOptions,
          fixedAssetCode: fixedAssetCodes,
        }));
      } else {
        setError("Failed to fetch fixed asset codes.");
      }
    } catch (error) {
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

    };

    try {
      const response = await _POST(dataset, "/api_trr_mes/MasterData/Cost_Center_Get");

      if (response && response.status === "success") {
        console.log('Cost_Center_Get', response)
        const costCenters = response.data.map((costCenter: any) => ({
          costCenterId: costCenter.id,
          appReqUser: costCenter.app_req_user,
          costCenterCode: costCenter.cost_center_code,
          costCenterName: costCenter.cost_center_name,
          costCentersCodeAndName: '[' + costCenter.cost_center_code + ']' + ' | ' + costCenter.cost_center_name,
          siteCode: costCenter.site_code,
          siteId: costCenter.site_id

        }));

        setOptions((prevOptions) => ({
          ...prevOptions,
          costCenter: costCenters,
        }));

      } else {
        setError("Failed to fetch Cost Centers.");
      }
    } catch (error) {
      console.error("Error fetching Cost Centers:", error);
      setError("An error occurred while fetching Cost Centers.");
    }
  };

  const fetchServiceCenters = async () => {
    console.log('Call : fetchServiceCenters', moment().format('HH:mm:ss:SSS'));

    const dataset = {

    };

    try {
      const response = await _POST(dataset, "/api_trr_mes/MasterData/Service_Center_Get");

      if (response && response.status === "success") {
        //console.log('ServiceCenters', response)
        const serviceCenters = response.data.map((center: any) => ({

          serviceCenterId: center.id,
          serviceCenterCode: center.cost_center_code,
          serviceCenterName: center.cost_center_name,
          serviceCentersCodeAndName: '[' + center.cost_center_code + ']' + ' | ' + center.cost_center_name,
          siteCode: center.site_code,
          siteId: center.site_id
        }));

        setOptions((prevOptions) => ({
          ...prevOptions,
          serviceCenter: serviceCenters,
        }));

      } else {
        setError("Failed to fetch service centers.");
      }
    } catch (error) {
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
        const jobTypes = response.data.map((job: any) => ({
          lov_code: job.lov_code,
          lov_name: job.lov1,
        }));

        setOptions((prevOptions) => ({
          ...prevOptions,
          jobType: jobTypes,
        }));
      } else {
        setError("Failed to fetch job types.");
      }
    } catch (error) {
      console.error("Error fetching job types:", error);
      setError("An error occurred while fetching job types.");
    }
  };

  const fetchBudgetCodes = async () => {
    console.log('Call : fetchBudgetCodes', moment().format('HH:mm:ss:SSS'));
    try {
      const dataset = {
        //"cost_center_id": defaultValues.costCenterId
      };

      const response = await _POST(dataset, "/api_trr_mes/MasterData/Budget_Get");

      if (response && response.status === "success") {
        //console.log(response, 'Budget_Get');

        // กำหนดประเภทสำหรับ budgetCodes
        const budgetCodes: { budgetId: string; budgetCode: string; jobType: string }[] = response.data.map((budget: any) => ({
          budgetId: budget.id,
          costCenterId: budget.cost_center_id,
          budgetCode: budget.budget_code,
          jobType: budget.job_type,
          budgetCodeAndJobType: '[' + budget.budget_code + ']' + ' | ' + budget.description
        }));

        setOptions((prevOptions) => ({
          ...prevOptions,
          budgetCode: budgetCodes,
        }));

        // ส่ง jobType ไปยัง fetchJobTypes
        //fetchJobTypes(budgetCodes.map((b: { jobType: string }) => b.jobType));

      } else {
        setError("Failed to fetch budget codes.");
      }
    } catch (error) {
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
      //"cost_center_id": defaultValues.costCenterId
    };

    try {
      const response = await _POST(dataset, "/api_trr_mes/MasterData/Fixed_Asset_Get");

      if (response && response.status === "success") {
        console.log('Fixed_Asset_Get', response);
        const fixedAssetCodes = response.data.map((asset: any) => ({
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
      } else {
        setError("Failed to fetch fixed asset codes.");
      }
    } catch (error) {
      console.error("Error fetching fixed asset codes:", error);
      setError("An error occurred while fetching fixed asset codes.");
    }
  };

  const fetchRevision = async () => {
    console.log('Call : fetchRevision', defaultValues.requestId, moment().format('HH:mm:ss:SSS'));

    const dataset = {
      // "req_id": defaultValues.requestId
    };

    try {
      const response = await _POST(dataset, "/api_trr_mes/MasterData/Revision_Get");

      if (response && response.status === "success") {
        //console.log('Revision_Get', response);
        const revision = response.data.map((revision: any) => ({
          revisionId: revision.id,
          reqId: revision.req_id,
          revisionNo: String(revision.revision_no),
          revisionDate: revision.revision_date,
          createBy: revision.create_by,
          createDate: revision.create_date,
          updateBy: revision.update_by,
          updateDate: revision.update_date,
          recordStatus: revision.record_status


        }));

        setOptions((prevOptions) => ({
          ...prevOptions,
          revision: revision,
        }));

        //console.log(options, 'options');
      } else {
        setError("Failed to fetch revision.");
      }
    } catch (error) {
      console.error("Error fetching revision:", error);
      setError("An error occurred while fetching revision.");
    }
  };

  const fetchServiceStaff = async () => {
    console.log('Call : fetchServiceStaff', defaultValues.siteId, "costCenterId", costCenterId, moment().format('HH:mm:ss:SSS'));

    const dataset = {
      //"user_ad": currentUser.employee_username,

    };

    try {
      const response = await _POST(dataset, "/api_trr_mes/MasterData/Service_Staff_Get");

      if (response && response.status === "success") {
        console.log('Service_Staff_Get', response);
        const technician = response.data.map((technician: any) => ({
          userAd: technician.user_ad || "",
          tecEmpName: technician.tec_emp_name || "",
          costCenterName: technician.cost_center_name || "",
          siteCode: technician.site_code || "",
          siteId: technician.site_id || "",
          costCenterId: technician.cost_center_id || "",
          serviceCenterFlag: technician.service_center_flag || ""

        }));

        setOptions((prevOptions) => ({
          ...prevOptions,
          technician: technician,
        }));

      } else {
        setError("Failed to fetch technician.");
      }
    } catch (error) {
      console.error("Error fetching technician:", error);
      setError("An error occurred while fetching technician.");
    }
  };

  // const fetchTechnician = async () => {
  //   console.log('Call : fetchTechnician', defaultValues.siteId, "costCenterId", costCenterId, moment().format('HH:mm:ss:SSS'));

  //   const dataset = {
  //     //"user_ad": currentUser.employee_username,
  //     "site_id": siteId,
  //     "cost_center_id": costCenterId
  //   };

  //   try {
  //     const response = await _POST(dataset, "/api_trr_mes/MasterData/Technician_Get");

  //     if (response && response.status === "success") {
  //       console.log('Technician_Get', response);
  //       const technician = response.data.map((technician: any) => ({
  //         userAd: technician.user_ad || "",
  //         userName: technician.user_name || "",
  //         costCenterName: technician.cost_center_name || "",
  //         siteCode: technician.site_code || "",
  //         siteId: technician.site_id || "",
  //         serviceCenterFlag: technician.service_center_flag || ""

  //       }));

  //       setOptions((prevOptions) => ({
  //         ...prevOptions,
  //         technician: technician,
  //       }));

  //     } else {
  //       setError("Failed to fetch technician.");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching technician:", error);
  //     setError("An error occurred while fetching technician.");
  //   }
  // };

  // const fetchWorkHour = async () => {
  //   console.log('Call : fetchWorkHour', moment().format('HH:mm:ss:SSS'));
  //   try {

  //     const dataset = {
  //       "lov_type": "work_hour"
  //     };

  //     const response = await _POST(dataset, "/api_trr_mes/LovData/Lov_Data_Get");

  //     if (response && response.status === "success") {
  //       //console.log(response, 'Success fetch Work Hour');
  //       const workHour = response.data.map((job: any) => ({
  //         lov_code: job.lov_code,
  //       }));
  //       // console.log(workHour, 'Work Hour');


  //       setOptions((prevOptions) => ({
  //         ...prevOptions,
  //         workHour: workHour,
  //       }));
  //     } else {
  //       setError("Failed to fetch Work Hour.");
  //     }
  //   } catch (error) {
  //     console.error("Error fetch Work Hour:", error);
  //     setError("An error occurred while fetch Work Hour.");
  //   }
  // };

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

  // Use useEffect to call dataTableServiceTimeSheet_GET only on specific action
  useEffect(() => {
    if (actionType) {
      dataTableServiceTimeSheet_GET();
      setActionType(null); // Reset actionType after fetching data
    }
  }, [actionType]);
  /*หน้า ServiceTimeSheetBody*/
  const readData = (data: any) => {
    console.log('Call : readData', data, moment().format('HH:mm:ss:SSS'));
    setDefaultValues({
      ...defaultValues,
      requestNo: data?.req_no || '',
      requestDate: data?.req_date || '',
      requestId: data?.id || '',
      costCenterId: data?.cost_center_id || '',
      costCenterName: data?.cost_center_name || '',
      reqUser: data?.req_user || '',
      appReqUser: data?.app_user || '',
      costCenterCode: data?.cost_center_code || '',
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

    })
  };

  const handleClickView = (data: any) => {
    //console.log(data, 'ตอนกดปุ่ม View : ข้อมูล data');

    setOpenView(true);
    readData(data)

  };

  const handleClickAcceptJob = (data: any) => {
    //console.log('data', data);
    setOpenAcceptJob(true);
    readData(data)
    fetchUserData(); // เรียกใช้ฟังก์ชันเพื่อดึงงข้อมูล User   

  };

  const handleClickTimeSheet = (data: any) => {
    setOpenTimeSheet(true);
    readData(data)
    fetchUserData(); // เรียกใช้ฟังก์ชันเพื่อดึงงข้อมูล User  
  };

  const handleClickJobDone = (data: any) => {
    setOpenJobDone(true);
    readData(data)

  };


  const handleClose = () => {
    setOpenView(false);
    setOpenAdd(false);
    setOpenEdit(false);
    setOpenDelete(false);
    setOpenAcceptJob(false);
    setOpenTimeSheet(false)
    setOpenJobDone(false)
    setDefaultValues(defaultVal);
    readData(null);
    fetchUserData(); // เรียกใช้ฟังก์ชันเพื่อดึงงข้อมูล User ใหม่หลังเคลียร์  
    dataTableServiceTimeSheet_GET(); // เรียกใช้ฟังก์ชันเพื่อดึงงข้อมูล serviceRequest ใหม่หลังเคลียร์ 
    setOpenReject(false); //ปิด Modal Reject Reason     
    setIsValidate(null);  //เคลี่ยร์ Validate

  };

  const handleDataChange = (data: any) => {
    setDraftData(data); // Store draft data
  };

  //================================================================================================
  //ตรวจสอบว่ามี User ไหม ?
  const fetchUserData = async () => {
    console.log('Call : fetchUserData', moment().format('HH:mm:ss:SSS'));

    if (!employeeUsername) return;

    const dataset = {
      user_ad: employeeUsername || null
    };

    try {
      const response = await _POST(dataset, "/api_trr_mes/MasterData/User_Get");

      if (response && response.status === "success") {
        if (response.data && Array.isArray(response.data) && response.data.length > 0) {
          const userData = response.data[0];
          if (userData.user_ad === employeeUsername || userData.app_req_user === employeeUsername) {
            setSiteId(userData.site_id);
            setCostCenterId(userData.cost_center_id);

          } else {
            setErrorMessage("ข้อมูล User ไม่ตรงกับข้อมูลปัจจุบัน");
          }
        } else {
          setErrorMessage("ไม่มีข้อมูล User ที่ตรงกับเงื่อนไข");
        }
      } else {
        setErrorMessage("ไม่สามารถดึงข้อมูล User ได้");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setErrorMessage("เกิดข้อผิดพลาดในการดึงข้อมูล User");
    }
  };

  //Get ดึงข้อมูลใส่ ตาราง
  const dataTableServiceTimeSheet_GET = async () => {
    console.log('Call : dataTableServiceTimeSheet_GET', moment().format('HH:mm:ss:SSS'));

    if (!currentUser) return;

    const dataset = {
      "user_ad": employeeUsername,
      "service_center_id": selectedServiceCenter?.serviceCenterId,
      "req_no": requestNo?.toString(),
      "job_type": selectedJobType?.lov_code,
      "fixed_asset_id": selectedAssetCode?.assetCodeId,
      "req_status": status
    };
    try {
      const response = await _POST(dataset, "/api_trr_mes/ServiceTimeSheet/Service_Time_Sheet_Get");

      if (response && response.status === "success") {
        const { data: result } = response;

        setAppReqUser(result.app_user);
        const newData: any = []

        Array.isArray(result) && result.forEach((el) => {
          el.req_date = dateFormatTimeEN(el.req_date, "DD/MM/YYYY HH:mm:ss")
          el.status_update = dateFormatTimeEN(el.status_update, "DD/MM/YYYY HH:mm:ss")
          el.cost_center_label = "[" + el.cost_center_code + "]" + " | " + el.cost_center_name
          el.service_center_label = "[" + el.service_center_code + "]" + " | " + el.service_center_name

          setDefaultValues(prevValues => ({
            ...prevValues,
            costCenterId: el.cost_center_id || prevValues.costCenterId,
            siteId: el.site_id || prevValues.siteId,
            requestId: el.id || prevValues.requestId
          }));

          el.ACTION = null
          el.ACTION = (
            <ActionManageCell
              onClick={(name) => {
                if (name == 'View') {
                  handleClickView(el)
                } else if (name == 'Accept Job') {
                  handleClickAcceptJob(el)
                } else if (name == 'Time Sheet') {
                  handleClickTimeSheet(el)
                } else if (name == 'Job Done') {
                  handleClickJobDone(el)
                }
              }}
              reqStatus={el.req_status}
            />
          )
          if (el.req_status === "Draft") {
            el.req_status_label = <BasicChips
              label={`${el.req_status}`}
              backgroundColor="#B3B3B3"
              borderColor="#B3B3B3"
            >
            </BasicChips>
          } else if (el.req_status === "Submit") {
            el.req_status_label = <BasicChips
              label={`${el.req_status}`}
              backgroundColor="#BDE3FF"
              borderColor="#BDE3FF"
            >
            </BasicChips>
          } else if (el.req_status === "Approved") {
            el.req_status_label = <BasicChips
              label={`${el.req_status}`}
              backgroundColor="#E4CCFF"
              borderColor="#E4CCFF"
            >
            </BasicChips>
          } else if (el.req_status === "Start") {
            el.req_status_label = <BasicChips
              label={`${el.req_status}`}
              backgroundColor="#FFE8A3"
              borderColor="#FFE8A3"
            >
            </BasicChips>
          } else if (el.req_status === "On process") {
            el.req_status_label = <BasicChips
              label={`${el.req_status}`}
              backgroundColor="#FFA629"
              borderColor="#FFA629"
            >
            </BasicChips>
          } else if (el.req_status === "Job Done") {
            el.req_status_label = <BasicChips
              label={`${el.req_status}`}
              backgroundColor="#AFF4C6"
              borderColor="#AFF4C6"
            >
            </BasicChips>
          } else if (el.req_status === "Close") {
            el.req_status_label = <BasicChips
              label={`${el.req_status}`}
              backgroundColor="#1E1E1E"
              borderColor="#1E1E1E"
              textColor="#FFFFFF"
            >
            </BasicChips>
          }
          newData.push(el)
        })

        console.log(newData, 'ค่าที่ดึงจาก ตาราง');

        setDataList(newData);
      }
    } catch (e) {
      console.error("Error fetching service requests:", e);
    }
  };

  //Start Data ไปลง Database
  const serviceTimeSheetStart = async () => {
    console.log('Call : serviceTimeSheetStart', moment().format('HH:mm:ss:SSS'));
    confirmModal.createModal("ยืนยันที่จะบันทึกหรือไม่", "info", async () => {
      if (draftData) {
        console.log("Start Data:", draftData);

        // สร้างข้อมูลที่จะส่ง
        const payload = {
          changeStatusModel: {
            id: draftData.requestId,
            new_status: "Start",
            app_user: ""
          },
          currentAccessModel: {
            user_id: currentUser.employee_username || "" // ใช้ค่า user_id จาก currentUser หรือค่าเริ่มต้น
          }
        };

        try {
          // ใช้ _POST เพื่อส่งข้อมูล
          const response = await _POST(payload, "/api_trr_mes/ChangeStatus/Change_Status");

          if (response && response.status === "success") {
            console.log('Submit successfully:', response);
            // เพิ่มโค้ดที่ต้องการเมื่อบันทึกสำเร็จ
            Massengmodal.createModal(
              <div className="text-center p-4">
                <p className="text-xl font-semibold mb-2 text-green-600">Success</p>
                {/* <p className="text-lg text-gray-800">
                  <span className="font-semibold text-gray-900">Request No:</span>
                  <span className="font-bold text-indigo-600 ml-1">{response.req_no}</span>
                </p> */}
              </div>,
              'success', () => {

                handleClose();
              });
          } else {
            console.error('Failed toApprove:', response);
            // เพิ่มโค้ดที่ต้องการเมื่อเกิดข้อผิดพลาด
          }
        } catch (error) {
          console.error('ErrorApprove:', error);
          // เพิ่มโค้ดที่ต้องการเมื่อเกิดข้อผิดพลาดในการส่งข้อมูล
        }
      }
    });
  };

  //Reject Data ไปลง Database
  const serviceRequestReject = async () => {
    console.log('Call : serviceRequestReject', draftData, moment().format('HH:mm:ss:SSS'));
    console.log('Call : rejectReason', rejectReason, moment().format('HH:mm:ss:SSS'));

    const dataForValidate = {
      rejectReason: rejectReason || null,
    }

    console.log(dataForValidate,'dataForValidate');
    
    const isValidate = checkValidate(dataForValidate, []);
    const isValidateAll = isCheckValidateAll(isValidate);
  
    if (Object.keys(isValidateAll).length > 0 && isValidationEnabled) {
      //console.log(isValidateAll,'sasasasa');
      setIsValidate(isValidate);
      return;
    }
    setIsValidate(null);

    //confirmModal.createModal("Reject Data ?", "info", async () => {
    if (draftData && rejectReason) {
      console.log(" Reject Data:", draftData);

      // สร้างข้อมูลที่จะส่ง
      const payload = {
        rejectActionModel: {
          req_id: draftData.requestId,
          req_status: "Reject Approved",
          reject_reason: rejectReason
        },
        currentAccessModel: {
          user_id: currentUser.employee_username || "" // ใช้ค่า user_id จาก currentUser หรือค่าเริ่มต้น
        }
      };

      try {

        // ใช้ _POST เพื่อส่งข้อมูล
        const response = await _POST(payload, "/api_trr_mes/RejectAction/Reject_Action");

        if (response && response.status === "success") {
          console.log('Reject successfully:', response);
          // เพิ่มโค้ดที่ต้องการเมื่อบันทึกสำเร็จ
          Massengmodal.createModal(
            <div className="text-center p-4">
              <p className="text-xl font-semibold mb-2 text-green-600">Success</p>
              {/* <p className="text-lg text-gray-800">
                  <span className="font-semibold text-gray-900">Request No:</span>
                  <span className="font-bold text-indigo-600 ml-1">{response.req_no}</span>
                </p> */}
            </div>,
            'success', () => {

              handleClose();
            });
        } else {
          console.error('Failed to Reject:', response);
          // เพิ่มโค้ดที่ต้องการเมื่อเกิดข้อผิดพลาด
        }
      } catch (error) {
        console.error('Error Submit Reject:', error);
        // เพิ่มโค้ดที่ต้องการเมื่อเกิดข้อผิดพลาดในการส่งข้อมูล
      }
    }
    //});
  };

  //Time Sheet Add Data ไปลง Database
  const serviceTimeSheetAdd = async () => {
    console.log('Call : serviceTimeSheetAdd', draftData, moment().format('HH:mm:ss:SSS'));
    console.log(" Time Sheet Data:", draftData.timeSheetData);

    if (draftData.timeSheetData.length === 0) {
      Massengmodal.createModal(
        <div className="text-center p-4">
          <p className="text-xl font-semibold mb-2 text-green-600">กรุณาระบุรายการชั่วโมงทำงาน</p>
          {/* <p className="text-lg text-gray-800">
            <span className="font-semibold text-gray-900">Request No:</span>
            <span className="font-bold text-indigo-600 ml-1">{response.req_no}</span>
          </p> */}
        </div>,
        'error',
        async () => {

        }
      );

    } else {

      confirmModal.createModal("ยืนยันที่จะบันทึกหรือไม่", "info", async () => {
        if (draftData) {
          const serviceTimeSheetModels = draftData.timeSheetData.map((item: any) => ({
            id: item.subTimeSheetId,
            req_id: draftData.requestId,
            revision_id: draftData.revisionCurrent.revisionId,
            time_sheet_no: String(item.no),
            work_start_date: DateToDB(item.work_start_date) || null, // ใช้ moment เพื่อแปลงวันที่, 
            work_end_date: DateToDB(item.work_end_date) || null, // ใช้ moment เพื่อแปลงวันที่, 
            work_hour: String(item.work_hour),
            technician: item.technician.tecEmpName || item.technician,
            description: item.description,
            delete_flag: item.delete_flag
          }));

          const payload = {
            serviceTimeSheetModels: serviceTimeSheetModels,
            currentAccessModel: {
              user_id: currentUser.employee_username || ""
            }
          };

          console.log("Payload:", payload);
          try {
            const response = await _POST(payload, "/api_trr_mes/ServiceTimeSheet/Service_Time_Sheet_Add");

            if (response && response.status === "success") {
              console.log('successfully:', response);
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
                  await changeStatus(draftData, currentUser.employee_username);
                  handleClose();
                }
              );
            } else {
              console.error('Failed to Time Sheet:', response);
            }
          } catch (error) {
            console.error('Error Submit Time Sheet:', error);
          }
        }
      });

    }

  };

  //Add Submit ไปลง Database
  const serviceTimeSheetJobDone = async () => {
    console.log('Call : serviceTimeSheetJobDone', draftData, moment().format('HH:mm:ss:SSS'));
    console.log(" Time Sheet Data:", draftData.timeSheetData);

    if (draftData.timeSheetData.length === 0) {
      Massengmodal.createModal(
        <div className="text-center p-4">
          <p className="text-xl font-semibold mb-2 text-green-600">กรุณาระบุรายการชั่วโมงทำงาน</p>
          {/* <p className="text-lg text-gray-800">
            <span className="font-semibold text-gray-900">Request No:</span>
            <span className="font-bold text-indigo-600 ml-1">{response.req_no}</span>
          </p> */}
        </div>,
        'error',
        async () => {

        }
      );

    } else {
      confirmModal.createModal("ยืนยันที่จะบันทึกหรือไม่ ?", "info", async () => {
        if (draftData) {
          console.log("JobDone Data:", draftData);

          // สร้างข้อมูลที่จะส่ง
          const payload = {
            changeStatusModel: {
              id: draftData.requestId,
              new_status: "Job Done",
              app_user: ""
            },
            currentAccessModel: {
              user_id: currentUser.employee_username || "" // ใช้ค่า user_id จาก currentUser หรือค่าเริ่มต้น
            }
          };

          try {
            console.log('JobDone model', payload);

            // ใช้ _POST เพื่อส่งข้อมูล
            const response = await _POST(payload, "/api_trr_mes/ChangeStatus/Change_Status");

            if (response && response.status === "success") {
              console.log('JobDone successfully:', response);
              // เพิ่มโค้ดที่ต้องการเมื่อบันทึกสำเร็จ
              Massengmodal.createModal(
                <div className="text-center p-4">
                  <p className="text-xl font-semibold mb-2 text-green-600">Success</p>
                  {/* <p className="text-lg text-gray-800">
                  <span className="font-semibold text-gray-900">Request No:</span>
                  <span className="font-bold text-indigo-600 ml-1">{response.req_no}</span>
                </p> */}
                </div>,
                'success', () => {

                  handleClose();
                });
            } else {
              console.error('Failed to JobDone:', response);
              // เพิ่มโค้ดที่ต้องการเมื่อเกิดข้อผิดพลาด
            }
          } catch (error) {
            console.error('Error JobDone:', error);
            // เพิ่มโค้ดที่ต้องการเมื่อเกิดข้อผิดพลาดในการส่งข้อมูล
          }
        }
      });
    }
  };


  const changeStatus = async (draftData: any, currentUser: any) => {
    console.log('Call : changeStatus', draftData, moment().format('HH:mm:ss:SSS'));

    if (draftData) {
      console.log("changeStatus Data:", draftData);

      // สร้างข้อมูลที่จะส่ง
      const payload = {
        changeStatusModel: {
          id: draftData.requestId,
          new_status: "On process",
          app_user: ""
        },
        currentAccessModel: {
          user_id: currentUser || "" // ใช้ค่า user_id จาก currentUser หรือค่าเริ่มต้น
        }
      };

      try {
        // ใช้ _POST เพื่อส่งข้อมูล
        const response = await _POST(payload, "/api_trr_mes/ChangeStatus/Change_Status");

        if (response && response.status === "success") {
          console.log('Change Status successfully:', response);
          // เพิ่มโค้ดที่ต้องการเมื่อบันทึกสำเร็จ

        } else {
          console.error('Failed to Change Status:', response);
          // เพิ่มโค้ดที่ต้องการเมื่อเกิดข้อผิดพลาด
        }
      } catch (error) {
        console.error('Error Change Status:', error);
        // เพิ่มโค้ดที่ต้องการเมื่อเกิดข้อผิดพลาดในการส่งข้อมูล
      }
    }
  };


  //================================================================================================


  return (
    <div>
      <div className="max-lg rounded overflow-hidden shadow-xl bg-white mt-5 mb-5">
        <div className="px-6 pt-4">
          <label className="text-2xl ml-2 mt-3 mb-5 sarabun-regular">ค้นหาข้อมูล</label>
        </div>
        <div className="row px-10 pt-0 pb-5">
          <div className="col-md-3 mb-2">
            <FullWidthTextField
              labelName={"เลขที่ใบคำขอ"}
              value={requestNo}
              onChange={(value) => setRequestNo(value)}
            />
          </div>
          {/* <div className="col-md-3 mb-2">
            <AutocompleteComboBox
              value={selectedServiceCenter}
              labelName={"Service Center"}
              options={optionsSearch.serviceCenter}
              column="costCenterCode"
              setvalue={handleAutocompleteChange(setSelectedServiceCenter)}
            />
          </div> */}
          <div className="col-md-3 mb-2">
            <AutocompleteComboBox
              value={selectedJobType}
              labelName={"ประเภทงาน"}
              options={optionsSearch.jobType}
              column="lov_name"
              setvalue={handleAutocompleteChange(setSelectedJobType)}
            />
          </div>
          <div className="col-md-3 mb-2">
            <AutocompleteComboBox
              value={selectedAssetCode}
              labelName={"Fixed Asset Code"}
              options={optionsSearch.fixedAssetCode}
              column="assetCode"
              setvalue={handleAutocompleteChange(setSelectedAssetCode)}
            />
          </div>
          <div className="col-md-3 mb-2">
            <FullWidthTextField
              labelName={"สถานะ"}
              value={status}
              onChange={(value) => setStatus(value)}
            />
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

      <div className="max-lg rounded overflow-hidden shadow-lg bg-white mb-5">
        <div>
          <EnhancedTable
            rows={dataList}
            headCells={Request_headCells}
            tableName={"บันทึกชั่วโมงการทำงาน"}
          />
        </div>
        <FuncDialog
          open={openView} // เปิด dialog ถ้า openAdd, openView, openEdit หรือ openDelete เป็น true
          dialogWidth="xl"
          openBottonHidden={true}
          titlename={'ดูข้อมูล'}
          handleClose={handleClose}
          colorBotton="success"
          actions={"Reade"}
          element={
            <ServiceTimeSheetBody
              onDataChange={handleDataChange}
              defaultValues={defaultValues}
              options={options} // ส่งข้อมูล Combobox ไปยัง ServiceTimeSheetBody
              actions={"Reade"}
              disableOnly
            />
          }
        />
        <FuncDialog
          open={openAcceptJob} // เปิด dialog ถ้า openAdd, openView, openEdit หรือ openDelete เป็น true
          dialogWidth="xl"
          openBottonHidden={true}
          titlename={"รับงาน"}
          handleClose={handleClose}
          handlefunction={serviceTimeSheetStart}
          handleRejectAction={() => setOpenReject(true)}
          colorBotton="success"
          actions={"AcceptJob"}
          element={
            <ServiceTimeSheetBody
              onDataChange={handleDataChange}
              defaultValues={defaultValues}
              options={options} // ส่งข้อมูล Combobox ไปยัง ServiceTimeSheetBody
              actions={"AcceptJob"}
              disableOnly
            />
          }
        />
        <FuncDialog
          open={openTimeSheet} // เปิด dialog ถ้า openAdd, openView, openEdit หรือ openDelete เป็น true
          dialogWidth="xl"
          openBottonHidden={true}
          titlename={"บันทึกชั่วโมงการทำงาน"}
          handleClose={handleClose}
          handlefunction={serviceTimeSheetAdd}
          colorBotton="success"
          actions={"TimeSheet"}
          element={
            <ServiceTimeSheetBody
              onDataChange={handleDataChange}
              defaultValues={defaultValues}
              options={options} // ส่งข้อมูล Combobox ไปยัง ServiceTimeSheetBody
              actions={"TimeSheet"}
              disableOnly
            />
          }
        />
        <FuncDialog
          open={openJobDone} // เปิด dialog ถ้า openAdd, openView, openEdit หรือ openDelete เป็น true
          dialogWidth="xl"
          openBottonHidden={true}
          titlename={"เสร็จงาน"}
          handleClose={handleClose}
          handlefunction={serviceTimeSheetJobDone}
          colorBotton="success"
          actions={"JobDone"}
          element={
            <ServiceTimeSheetBody
              onDataChange={handleDataChange}
              defaultValues={defaultValues}
              options={options} // ส่งข้อมูล Combobox ไปยัง ServiceTimeSheetBody
              actions={"JobDone"}
              disableOnly
            />
          }
        />
      </div>
      {/*Reject Reason*/}
      <FuncDialog
        open={openReject}
        dialogWidth='sm'
        openBottonHidden={true}
        titlename={'ไม่รับงาน'}
        handleClose={() => setOpenReject(false)}
        handlefunction={serviceRequestReject}
        actions="RejectReason"
        element={
          <FullWidthTextareaField
            required="*"
            labelName={"โปรดระบุเหตุผลที่ไม่รับงาน"}
            value={rejectReason}
            multiline={true}
            onChange={(value) => setRejectReason(value)}
            Validate={isValidate}
          />

        }
      />


      {/* Error Dialog */}
      <Dialog
        open={!!errorMessage}
        onClose={() => setErrorMessage(null)}
        aria-labelledby="error-dialog-title"
        aria-describedby="error-dialog-description"
      >
        <DialogTitle id="error-dialog-title">Error</DialogTitle>
        <DialogContent>
          <p id="error-dialog-description">{errorMessage}</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setErrorMessage(null)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
