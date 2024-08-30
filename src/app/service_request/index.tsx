import React, { useState, useEffect } from "react";
import FullWidthTextField from "../../components/MUI/FullWidthTextField";
import { _GET, _POST } from "../../service/mas";
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
import MenuListComposition from "../../components/MUI/MenuListComposition";
import BasicChips from "../../components/MUI/BasicChips";

interface OptionsState {
  serviceCenter: any[];
  jobType: any[];
  budgetCode: any[];
  fixedAssetCode: any[];
}

const initialOptions: OptionsState = {
  serviceCenter: [],
  jobType: [],
  budgetCode: [],
  fixedAssetCode: [],
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
  headUser: "",
  costCenterId: "",
  costCenterCode: "",
  costCenterName:"",
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
}

export default function ServiceRequest() {
  const [requestNo, setRequestNo] = useState("");
  const [status, setStatus] = useState("");
  const currentUser = useSelector((state: any) => state?.user?.user);
  const [headUser, setHeadUser] = useState<string>("");
  const [textValue, setTextValue] = useState<string>("");
  const [statusValue, setStatusValue] = useState<string>("");
  const [selectedServiceCenter, setSelectedServiceCenter] = useState<any>(null);
  const [selectedJobType, setSelectedJobType] = useState<any>(null);
  const [selectedAssetCode, setSelectedAssetCode] = useState<any>(null);
  const [openAdd, setOpenAdd] = useState(false);
  const [openView, setOpenView] = useState<any>(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openSubmit, setOpenSubmit] = useState(false);
  const [openApproved, setOpenApproved] = useState(false);
  const [openClose, setOpenClose] = useState(false);
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
  }, []);

  //ดึงข้อมูลจาก User มาตรวจสอบก่อนว่ามีอยู่ในระบบหรือไม่
  useEffect(() => {
    console.log('Call : 🟢[2] fetch UserData&serviceRequest', moment().format('HH:mm:ss:SSS'));
    if (currentUser?.employee_username) {
      fetchUserData(); // เรียกใช้ฟังก์ชันเพื่อดึงงข้อมูล User   
      dataTableServiceRequest_GET();

    }
  }, [currentUser?.employee_username]);

  //ดึงข้อมูลจาก Master Data ไว้สำหรับหน้า ServiceRequestBody
  useEffect(() => {
    console.log('Call : 🟢[3] Fetch Master Data', moment().format('HH:mm:ss:SSS'));
    if (defaultValues.siteId != "")
      fetchServiceCenters();
    if (defaultValues.costCenterId != "") {
      fetchFixedAssetCodes(); // เรียกใช้ฟังก์ชันเพื่อดึงข้อมูล fixed asset codes     
      fetchBudgetCodes(); // เรียกใช้ฟังก์ชันเพื่อดึงข้อมูล budget codes 

    }
    fetchJobTypes();

  }, [defaultValues]);


  // หน้าค้นหา Search ========================================================================================================= 
  
  const searchFetchServiceCenters = async () => {
    console.log('Call : searchFetchServiceCenters', moment().format('HH:mm:ss:SSS'));

    try {
      const response = await _POST({}, "/api_rab/MasterData/Cost_Center_Get");

      if (response && response.status === "success") {
        const serviceCenters = response.data.map((center: any) => ({

          costCenterId: center.id,
          costCenterCode: center.cost_center_code,
          costCenterName: center.cost_center_name
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

      const response = await _POST(dataset, "/api_rab/LovData/Lov_Data_Get");

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

    try {
      const response = await _POST({}, "/api_rab/MasterData/Fixed_Asset_Get");

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

  const fetchServiceCenters = async () => {
    console.log('Call : fetchServiceCenters', moment().format('HH:mm:ss:SSS'));

    const dataset = {
      "site_id": defaultValues.siteId,
      "service_center_flag" : true
    };

    try {
      const response = await _POST(dataset, "/api_rab/MasterData/Cost_Center_Get");

      if (response && response.status === "success") {
        //console.log('Cost_Center_Get', response)
        const serviceCenters = response.data.map((center: any) => ({

          serviceCenterId: center.id,
          serviceCenterCode: center.cost_center_code,
          serviceCenterName: center.cost_center_name,
          serviceCentersCodeAndName:  center.cost_center_name + ' [' + center.cost_center_code + ']'
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

  const fetchBudgetCodes = async () => {
    console.log('Call : fetchBudgetCodes', moment().format('HH:mm:ss:SSS'));
    try {
      const dataset = {
        "cost_center_id": defaultValues.costCenterId
      };

      const response = await _POST(dataset, "/api_rab/MasterData/Budget_Get");

      if (response && response.status === "success") {
        //console.log(response, 'Budget_Get');

        // กำหนดประเภทสำหรับ budgetCodes
        const budgetCodes: { budgetId: string; budgetCode: string; jobType: string }[] = response.data.map((budget: any) => ({
          budgetId: budget.id,
          budgetCode: budget.budget_code,
          jobType: budget.job_type,
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

  const fetchJobTypes = async () => {
    console.log('Call : fetchJobTypes', moment().format('HH:mm:ss:SSS'));
    try {

      const dataset = {
        "lov_type": "job_type"
      };

      const response = await _POST(dataset, "/api_rab/LovData/Lov_Data_Get");

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

  //BackUp budget
  /*-----------------------------------------------------------------------------------------------------------------
  // const fetchJobTypes = async (jobTypesFromBudget: string[]) => {
  //   console.log('Call : fetchJobTypes', moment().format('HH:mm:ss:SSS'));
  //   try {
  //     const dataset = {
  //       "lov_type": "job_type"
  //     };

  //     const response = await _POST(dataset, "/api_rab/LovData/Lov_Data_Get");

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
      "cost_center_id": defaultValues.costCenterId
    };

    try {
      const response = await _POST(dataset, "/api_rab/MasterData/Fixed_Asset_Get");

      if (response && response.status === "success") {
        //console.log('Fixed_Asset_Get', response);
        const fixedAssetCodes = response.data.map((asset: any) => ({
          assetCodeId: asset.id,
          assetCode: asset.fixed_asset_code,
          assetDescription: asset.description

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
  const readData = async (data: any) => {
    console.log('Call : readData', data, moment().format('HH:mm:ss:SSS'));
    await setDefaultValues({
      ...defaultValues,
      requestNo: data?.req_no || '',
      requestDate: moment(data?.req_date).format('yyyy-MM-DD') || '',
      requestId: data?.id || '',
      costCenterId: data?.cost_center_id || '',
      costCenterName: data?.cost_center_name || '',
      reqUser: data?.req_user || '',
      headUser: headUser || '',
      costCenterCode: data?.cost_center_id || '',
      status: data?.req_status || '',
      countRevision: data?.count_revision || '',
      serviceCenterId: data?.service_center_id || '',
      site: data?.site_code || '',
      jobType: data?.job_type || '',
      budgetCode: data?.budget_id || '',
      description: data?.description || '',
      fixedAssetId: data?.fixed_asset_id || '',
      fixedAssetDescription: data?.fixed_asset_description || ''

    })
  };

  const handleClickView = (data: any) => {
    //console.log(data, 'ตอนกดปุ่ม View : ข้อมูล data');

    setOpenView(true);
    readData(data)

  };

  const handleClickAdd = () => {
    setOpenAdd(true);
  };

  const handleClickEdit = (data: any) => {
    setOpenEdit(true);
    console.log(data, 'datadatadatadatadata');
    readData(data)

  };

  const handleClickDelete = (data: any) => {
    setOpenDelete(true);
    readData(data)

  };

  const handleClickSubmit = (data: any) => {
    console.log('defaultValues', defaultValues);
    setOpenSubmit(true);
    readData(data)
    fetchUserData(); // เรียกใช้ฟังก์ชันเพื่อดึงงข้อมูล User   

  };

  const handleClickApproved = (data: any) => {
    setOpenApproved(true);
    readData(data)
    fetchUserData(); // เรียกใช้ฟังก์ชันเพื่อดึงงข้อมูล User   

  };

  const handleClickClose = (data: any) => {
    setOpenClose(true);
    readData(data)
    fetchUserData(); // เรียกใช้ฟังก์ชันเพื่อดึงงข้อมูล User   

  };

  const handleClose = () => {

    setOpenView(false);
    setOpenAdd(false);
    setOpenEdit(false);
    setOpenDelete(false);
    setOpenSubmit(false)
    setOpenApproved(false);
    setOpenClose(false);
    setDefaultValues(defaultVal);
    readData(null);
    fetchUserData(); // เรียกใช้ฟังก์ชันเพื่อดึงงข้อมูล User ใหม่หลังเคลียร์  
    dataTableServiceRequest_GET(); // เรียกใช้ฟังก์ชันเพื่อดึงงข้อมูล serviceRequest ใหม่หลังเคลียร์ 

  };

  const handleDataChange = (data: any) => {
    setDraftData(data); // Store draft data
  };

  //================================================================================================
  //ตรวจสอบว่ามี User ไหม ?
  const fetchUserData = async () => {
    console.log('Call : fetchUserData', moment().format('HH:mm:ss:SSS'));

    if (!currentUser?.employee_username) return;

    const dataset = {
      user_ad: currentUser.employee_username || null,
      head_user: currentUser.employee_username,
    };

    try {
      const response = await _POST(dataset, "/api_rab/MasterData/User_Get");

      if (response && response.status === "success") {
        if (response.data && Array.isArray(response.data) && response.data.length > 0) {
          const userData = response.data[0];
          if (userData.user_ad === currentUser.employee_username || userData.head_user === currentUser.employee_username) {
            //console.log(userData,"userData");
            

            setHeadUser(userData.head_user);

            setDefaultValues(prevValues => ({
              ...prevValues,
              reqUser: userData.user_ad || prevValues.reqUser, // เพิ่มค่า user_ad ใน reqUser
              headUser: userData.head_user || prevValues.headUser,
              costCenterId: userData.cost_center_id || prevValues.costCenterId,
              costCenterCode: userData.cost_center_code || prevValues.costCenterCode,
              costCenterName: userData.cost_center_name || prevValues.costCenterName,
              site: userData.site_code || prevValues.site,
              siteId: userData.site_id || prevValues.siteId
            }));
            //console.log(response, 'UserGet');

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
  const dataTableServiceRequest_GET = async () => {
    console.log('Call : dataTableServiceRequest_GET', moment().format('HH:mm:ss:SSS'));

    if (!currentUser) return;

    const dataset = {
      "req_user": currentUser.employee_username,
      "app_user": currentUser.employee_username,
      "service_center_id": selectedServiceCenter?.costCenterId,
      "req_no": requestNo?.toString(),
      "job_type": selectedJobType?.lov_code,
      "fixed_asset_id": selectedAssetCode?.assetCodeId,
      "req_status": status
    };

    try {
      const response = await _POST(dataset, "/api_rab/ServiceRequest/Service_Request_Get");

      if (response && response.status === "success") {
        const { data: result } = response;

        const newData: any = []

        Array.isArray(result) && result.forEach((el) => {
          //console.log(el, "😊😊😊");

          el.ACTION = null
          el.ACTION = (
            <ActionManageCell
              onClick={(name) => {
                if (name == 'View') {
                  handleClickView(el)
                } else if (name == 'Edit') {
                  handleClickEdit(el)
                } else if (name == 'Delete') {
                  handleClickDelete(el)
                } else if (name == 'Submit') {
                  handleClickSubmit(el)
                } else if (name == 'Approved') {
                  handleClickApproved(el)
                } else if (name == 'Close') {
                  handleClickClose(el)
                }
              }}
              reqStatus={el.req_status}

            />
          )
          if (el.req_status === "Draft") {
            el.req_status_ = <BasicChips
              label={`${el.req_status}`}
              backgroundColor="#B3B3B3"
              borderColor="#B3B3B3"
            >
            </BasicChips>
          } else if (el.req_status === "Submit") {
            el.req_status_ = <BasicChips
              label={`${el.req_status}`}
              backgroundColor="#BDE3FF"
              borderColor="#BDE3FF"
            >
            </BasicChips>
          } else if (el.req_status === "Approved") {
            el.req_status_ = <BasicChips
              label={`${el.req_status}`}
              backgroundColor="#E4CCFF"
              borderColor="#E4CCFF"
            >
            </BasicChips>
          } else if (el.req_status === "Start") {
            el.req_status_ = <BasicChips
              label={`${el.req_status}`}
              backgroundColor="#FFE8A3"
              borderColor="#FFE8A3"
            >
            </BasicChips>
          } else if (el.req_status === "On process") {
            el.req_status_ = <BasicChips
              label={`${el.req_status}`}
              backgroundColor="#FFA629"
              borderColor="#FFA629"
            >
            </BasicChips>
          } else if (el.req_status === "Job Done") {
            el.req_status_ = <BasicChips
              label={`${el.req_status}`}
              backgroundColor="#AFF4C6"
              borderColor="#AFF4C6"
            >
            </BasicChips>
          } else if (el.req_status === "Close") {
            el.req_status_ = <BasicChips
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

  //Add Data ไปลง Database
  const serviceRequestDraftAdd = async () => {
    console.log('Call : serviceRequestDraftAdd', draftData, moment().format('HH:mm:ss:SSS'));
    confirmModal.createModal("Confirm Save Data ?", "info", async () => {
      if (draftData) {
        console.log("Saving draft data:", draftData);

        // สร้างข้อมูลที่จะส่ง
        const payload = {
          serviceRequestModel: {
            req_date: new Date().toISOString(), // ใช้วันที่ปัจจุบัน
            req_user: draftData.reqUser || "",
            app_user: null,
            cost_center_id: draftData.costCenterId || "",
            service_center_id: draftData.serviceCenter?.serviceCenterId || "",
            description: draftData.description || "",
            req_status: draftData.status || "",
            count_revision: draftData.countRevision || 0,
            status_update: new Date().toISOString(), // ใช้วันที่ปัจจุบัน
            fixed_asset_id: draftData.fixedAssetCode.assetCodeId || "",
            budget_id: draftData.budgetCode.budgetId || "",
            job_type: draftData.jobType.lov_code || "",
          },
          currentAccessModel: {
            user_id: currentUser.employee_username || "" // ใช้ค่า user_id จาก currentUser หรือค่าเริ่มต้น
          },
          documentRunningModel: {
            code_group: draftData.site,
            code_type: "RQ",
            trans_date: new Date().toISOString(), // ใช้วันที่ปัจจุบัน
          }
        };

        try {
          console.log('Running model', payload);

          // ใช้ _POST เพื่อส่งข้อมูล
          const response = await _POST(payload, "/api_rab/ServiceRequest/Service_Request_Draft_Add");

          if (response && response.status === "success") {
            console.log('Draft saved successfully:', response);
            // เพิ่มโค้ดที่ต้องการเมื่อบันทึกสำเร็จ
            Massengmodal.createModal(
              <div className="text-center p-4">
                <p className="text-xl font-semibold mb-2 text-green-600">Save Draft</p>
                <p className="text-lg text-gray-800">
                  <span className="font-semibold text-gray-900">Request No:</span>
                  <span className="font-bold text-indigo-600 ml-1">{response.req_no}</span>
                </p>
              </div>,
              'success', () => {
                handleClose();
              });
          } else {
            console.error('Failed to save draft:', response);
            // เพิ่มโค้ดที่ต้องการเมื่อเกิดข้อผิดพลาด
          }
        } catch (error) {
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
            req_date: draftData.requestDate, // ใช้วันที่ปัจจุบัน
            req_user: draftData.reqUser || "",
            app_user: "",
            req_status: draftData.status || "",
            count_revision: draftData.countRevision || 0,
            status_update: new Date().toISOString(), // ใช้วันที่ปัจจุบัน
            cost_center_id: draftData.costCenterId || "",
            service_center_id: draftData.serviceCenter.serviceCenterId || "",
            description: draftData.description || "",
            fixed_asset_id: draftData.fixedAssetCode.assetCodeId || "",
            budget_id: draftData.budgetCode.budgetId || "",
            job_type: draftData.jobType.lov_code || "",
          },
          currentAccessModel: {
            user_id: currentUser.employee_username || "" // ใช้ค่า user_id จาก currentUser หรือค่าเริ่มต้น
          }
        };

        console.log(payload, 'payload');


        try {

          // ใช้ _POST เพื่อส่งข้อมูล
          const response = await _POST(payload, "/api_rab/ServiceRequest/Service_Request_Draft_Edit");

          if (response && response.status === "success") {
            console.log('Draft saved successfully:', response);
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
            console.error('Failed to save draft:', response);
            // เพิ่มโค้ดที่ต้องการเมื่อเกิดข้อผิดพลาด
          }
        } catch (error) {
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
            user_id: currentUser.employee_username || "" // ใช้ค่า user_id จาก currentUser หรือค่าเริ่มต้น
          }
        };

        try {

          // ใช้ _POST เพื่อส่งข้อมูล
          const response = await _POST(payload, "/api_rab/ServiceRequest/Service_Request_Draft_Delete");

          if (response && response.status === "success") {
            console.log('Draft delete successfully:', response);
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
            console.error('Failed to save draft:', response);
            // เพิ่มโค้ดที่ต้องการเมื่อเกิดข้อผิดพลาด
          }
        } catch (error) {
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
            app_user: headUser
          },
          currentAccessModel: {
            user_id: currentUser.employee_username || "" // ใช้ค่า user_id จาก currentUser หรือค่าเริ่มต้น
          }
        };

        try {
          console.log('Running model', payload);

          // ใช้ _POST เพื่อส่งข้อมูล
          const response = await _POST(payload, "/api_rab/ChangeStatus/Change_Status");

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
            console.error('Failed to Submit:', response);
            // เพิ่มโค้ดที่ต้องการเมื่อเกิดข้อผิดพลาด
          }
        } catch (error) {
          console.error('Error Submit:', error);
          // เพิ่มโค้ดที่ต้องการเมื่อเกิดข้อผิดพลาดในการส่งข้อมูล
        }
      }
    });
  };

  //Add Approved ไปลง Database
  const serviceRequestApproved = async () => {
    console.log('Call : serviceRequestApproved', draftData, moment().format('HH:mm:ss:SSS'));
    confirmModal.createModal("Confirm Approved Data ?", "info", async () => {
      if (draftData) {
        console.log("Approved Data:", draftData);

        // สร้างข้อมูลที่จะส่ง
        const payload = {
          changeStatusModel: {
            id: draftData.requestId,
            new_status: "Approved",
            app_user: draftData.headUser
          },
          currentAccessModel: {
            user_id: currentUser.employee_username || "" // ใช้ค่า user_id จาก currentUser หรือค่าเริ่มต้น
          }
        };

        try {
          // ใช้ _POST เพื่อส่งข้อมูล
          const response = await _POST(payload, "/api_rab/ChangeStatus/Change_Status");

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
            console.error('Failed to Approved:', response);
            // เพิ่มโค้ดที่ต้องการเมื่อเกิดข้อผิดพลาด
          }
        } catch (error) {
          console.error('Error Approved:', error);
          // เพิ่มโค้ดที่ต้องการเมื่อเกิดข้อผิดพลาดในการส่งข้อมูล
        }
      }
    });
  };

  //Add SubmitReject ไปลง Database
  const serviceRequestSubmitReject = async () => {
    console.log('Call : serviceRequestSubmitReject', draftData, moment().format('HH:mm:ss:SSS'));
    confirmModal.createModal("Submit Reject Data ?", "info", async () => {
      if (draftData) {
        console.log("Submit Reject Data:", draftData);

        // สร้างข้อมูลที่จะส่ง
        const payload = {
          rejectActionModel: {
            id: draftData.requestId,
            req_status: "Submit Reject"
          },
          currentAccessModel: {
            user_id: currentUser.employee_username || "" // ใช้ค่า user_id จาก currentUser หรือค่าเริ่มต้น
          }
        };

        try {

          // ใช้ _POST เพื่อส่งข้อมูล
          const response = await _POST(payload, "/api_rab/RejectAction/Reject_Action");

          if (response && response.status === "success") {
            console.log('Submit Reject successfully:', response);
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
            console.error('Failed to Submit Reject:', response);
            // เพิ่มโค้ดที่ต้องการเมื่อเกิดข้อผิดพลาด
          }
        } catch (error) {
          console.error('Error Submit Reject:', error);
          // เพิ่มโค้ดที่ต้องการเมื่อเกิดข้อผิดพลาดในการส่งข้อมูล
        }
      }
    });
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
            app_user: draftData.headUser
          },
          currentAccessModel: {
            user_id: currentUser.employee_username || "" // ใช้ค่า user_id จาก currentUser หรือค่าเริ่มต้น
          }
        };

        try {
          console.log('Running model', payload);

          // ใช้ _POST เพื่อส่งข้อมูล
          const response = await _POST(payload, "/api_rab/ChangeStatus/Change_Status");

          if (response && response.status === "success") {
            console.log('Close successfully:', response);
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
            console.error('Failed to Close:', response);
            // เพิ่มโค้ดที่ต้องการเมื่อเกิดข้อผิดพลาด
          }
        } catch (error) {
          console.error('Error Close:', error);
          // เพิ่มโค้ดที่ต้องการเมื่อเกิดข้อผิดพลาดในการส่งข้อมูล
        }
      }
    });
  };

  //Add RejectJob ไปลง Database
  const serviceRequestRejectJob = async () => {
    console.log('Call : serviceRequestRejectJob', draftData, moment().format('HH:mm:ss:SSS'));
    confirmModal.createModal("Reject Job Reject Data ?", "info", async () => {
      if (draftData) {
        console.log("Reject Job Reject Data:", draftData);

        // สร้างข้อมูลที่จะส่ง
        const payload = {
          rejectActionModel: {
            id: draftData.requestId,
            req_status: "Reject Job"
          },
          currentAccessModel: {
            user_id: currentUser.employee_username || "" // ใช้ค่า user_id จาก currentUser หรือค่าเริ่มต้น
          }
        };

        try {

          // ใช้ _POST เพื่อส่งข้อมูล
          const response = await _POST(payload, "/api_rab/RejectAction/Reject_Action");

          if (response && response.status === "success") {
            console.log('Reject Job Reject successfully:', response);
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
            console.error('Failed to Reject Job Reject:', response);
            // เพิ่มโค้ดที่ต้องการเมื่อเกิดข้อผิดพลาด
          }
        } catch (error) {
          console.error('Error Reject Job Reject:', error);
          // เพิ่มโค้ดที่ต้องการเมื่อเกิดข้อผิดพลาดในการส่งข้อมูล
        }
      }
    });
  };

  //================================================================================================

  return (
    <div>
      <div className="max-lg rounded overflow-hidden shadow-xl bg-white mt-5 mb-5">
        <div className="px-6 pt-4">
          <label className="text-2xl ml-2 mt-3 mb-5 sarabun-regular">ค้นหา</label>
        </div>
        <div className="row px-10 pt-0 pb-5">
          <div className="col-md-3 mb-2">
            <FullWidthTextField
              labelName={"Request No."}
              value={requestNo}
              onChange={(value) => setRequestNo(value)}
            />
          </div>
          <div className="col-md-3 mb-2">
            <AutocompleteComboBox
              value={selectedServiceCenter}
              labelName={"Service Center"}
              options={optionsSearch.serviceCenter}
              column="costCenterCode"
              setvalue={handleAutocompleteChange(setSelectedServiceCenter)}
            />
          </div>
          <div className="col-md-3 mb-2">
            <AutocompleteComboBox
              value={selectedJobType}
              labelName={"Jobtype"}
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
              labelName={"Status"}
              value={status}
              onChange={(value) => setStatus(value)}
            />
          </div>
          <div className="flex justify-end">
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
                labelName={"รีเซท"}
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
            buttonLabal_1="Draft"
            buttonColor_1="info"
            headCells={Request_headCells}
            tableName={"Service Request"}
            handleonClick_1={handleClickAdd}
          />
        </div>
        <FuncDialog
          open={openAdd} // เปิด dialog ถ้า openAdd, openView, openEdit หรือ openDelete เป็น true
          dialogWidth="md"
          openBottonHidden={true}
          titlename={'Draft'}
          handleClose={handleClose}
          handlefunction={serviceRequestDraftAdd}
          colorBotton="success"
          actions={"Draft"}
          element={
            <ServiceRequestBody
              onDataChange={handleDataChange}
              defaultValues={defaultValues}
              options={options} // ส่งข้อมูล Combobox ไปยัง ServiceRequestBody   
              actions={"Create"}

            />
          }
        />
        <FuncDialog
          open={openView} // เปิด dialog ถ้า openAdd, openView, openEdit หรือ openDelete เป็น true
          dialogWidth="md"
          openBottonHidden={true}
          titlename={'View'}
          handleClose={handleClose}
          colorBotton="success"
          actions={"Reade"}
          element={
            <ServiceRequestBody
              onDataChange={handleDataChange}
              defaultValues={defaultValues}
              options={options} // ส่งข้อมูล Combobox ไปยัง ServiceRequestBody     
              disableOnly
            />
          }
        />
        <FuncDialog
          open={openEdit} // เปิด dialog ถ้า openAdd, openView, openEdit หรือ openDelete เป็น true
          dialogWidth="md"
          openBottonHidden={true}
          titlename={'Edit'}
          handleClose={handleClose}
          handlefunction={serviceRequestDraftEdit}
          colorBotton="success"
          actions={"Update"}
          element={
            <ServiceRequestBody
              onDataChange={handleDataChange}
              defaultValues={defaultValues}
              options={options} // ส่งข้อมูล Combobox ไปยัง ServiceRequestBody 
              actions={"Update"}

            />
          }
        />
        <FuncDialog
          open={openDelete} // เปิด dialog ถ้า openAdd, openView, openEdit หรือ openDelete เป็น true
          dialogWidth="md"
          openBottonHidden={true}
          titlename={'Delete'}
          handleClose={handleClose}
          handlefunction={serviceRequestDraftDelete} // service
          colorBotton="success"
          actions={"Delete"}
          element={
            <ServiceRequestBody
              onDataChange={handleDataChange}
              defaultValues={defaultValues}
              options={options} // ส่งข้อมูล Combobox ไปยัง ServiceRequestBody
              disableOnly

            />
          }
        />

        <FuncDialog
          open={openSubmit} // เปิด dialog ถ้า openAdd, openView, openEdit หรือ openDelete เป็น true
          dialogWidth="md"
          openBottonHidden={true}
          titlename={'Submit'}
          handleClose={handleClose}
          handlefunction={serviceRequestDraftSubmit} // service
          colorBotton="success"
          actions={"Submit"}
          element={
            <ServiceRequestBody
              onDataChange={handleDataChange}
              defaultValues={defaultValues}
              options={options} // ส่งข้อมูล Combobox ไปยัง ServiceRequestBody
              disableOnly

            />
          }
        />
        <FuncDialog
          open={openApproved} // เปิด dialog ถ้า openAdd, openView, openEdit หรือ openDelete เป็น true
          dialogWidth="md"
          openBottonHidden={true}
          titlename={'Approved'}
          handleClose={handleClose}
          handlefunction={serviceRequestApproved} // service
          handleRejectAction={serviceRequestSubmitReject}
          colorBotton="success"
          actions={"Approved"}
          element={
            <ServiceRequestBody
              onDataChange={handleDataChange}
              defaultValues={defaultValues}
              options={options} // ส่งข้อมูล Combobox ไปยัง ServiceRequestBody
              disableOnly

            />
          }
        />
        <FuncDialog
          open={openClose} // เปิด dialog ถ้า openAdd, openView, openEdit หรือ openDelete เป็น true
          dialogWidth="md"
          openBottonHidden={true}
          titlename={'Close'}
          handleClose={handleClose}
          handlefunction={serviceRequestClose} // service
          handleRejectAction={serviceRequestRejectJob}
          colorBotton="success"
          actions={"Close"}
          element={
            <ServiceRequestBody
              onDataChange={handleDataChange}
              defaultValues={defaultValues}
              options={options} // ส่งข้อมูล Combobox ไปยัง ServiceRequestBody     
              disableOnly
            />
          }
        />
      </div>
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
