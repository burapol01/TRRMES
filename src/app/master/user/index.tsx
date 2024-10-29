import React, { useEffect, useState } from 'react'
import FullWidthTextField from '../../../components/MUI/FullWidthTextField'
import AutocompleteComboBox from '../../../components/MUI/AutocompleteComboBox'
import FullWidthButton from '../../../components/MUI/FullWidthButton'
import moment from 'moment';
import { _POST } from '../../../service/mas';
import EnhancedTable from '../../../components/MUI/DataTables';
import { useDispatch, useSelector } from 'react-redux';
import { MasterUser_headCells } from '../../../../libs/columnname';
import ActionManageCell from '../../../components/MUI/ActionManageCell';
import { dateFormatTimeEN } from '../../../../libs/datacontrol';
import { createFilterOptions } from '@mui/material';
import CustomizedSwitches from '../../../components/MUI/MaterialUISwitch';
import FuncDialog from '../../../components/MUI/FullDialog';
import UserBody from './component/UserBody';
import { result } from 'lodash';
import { checkValidate, isCheckValidateAll } from '../../../../libs/validations';
import { useListUser } from './core/user_provider';
import { confirmModal } from '../../../components/MUI/Comfirmmodal';
import { Massengmodal } from '../../../components/MUI/Massengmodal';
import { endLoadScreen, startLoadScreen } from '../../../../redux/actions/loadingScreenAction';
import { v4 as uuidv4 } from 'uuid';
import { updateSessionStorageCurrentAccess } from '../../../service/initmain';

//======================== OptionsState ข้อมูล Drop Down ==========================
/*
    - ให้สร้าง interface options state เพื่อระบุประเภท(Type)
*/
interface OptionsState {
  costCenter: any[];
  serviceCenter: any[];
  costAndServiceCenters: any[];
}

const initialOptions: OptionsState = {
  costCenter: [],
  serviceCenter: [],
  costAndServiceCenters: [],
};
//=================================== set ข้อมูล  ==================================
//ประกาศค่าเริ่มต้น
const initialUserValues = { //-----สร้างหน้าใหม่ให้เปลี่ยนแค่ชื่อ
  userId: "",
  userAd: "",
  userName: "",
  costCenterId: "",
};


export default function User() {

  //========================= useState ช่องค้นหาข้อมูล ==============================================
  const [userAd, setUserAd] = useState("");
  const [userName, setUserName] = useState("");
  const [selectedCostCenter, setSelectedCostCenter] = useState<any>(null);
  const [selectedServiceCenter, setSelectedServiceCenter] = useState<any>(null);
  const [optionsSearch, setOptionsSearch] = useState<OptionsState>(initialOptions); // State for combobox options
  const [options, setOptions] = useState<OptionsState>(initialOptions); // State for combobox options
  const handleAutocompleteChange = (setter: React.Dispatch<React.SetStateAction<any>>) => (value: any) => {
    setter(value);
  };
  const [actionType, setActionType] = useState<string | null>(null); // Corrected type
  const [error, setError] = useState<string | null>(null); // สถานะสำหรับข้อผิดพลาด 

  //============================== useState ข้อมูลเริ่มต้น / ข้อมูลตาราง ================================
  const [dataList, setDataList] = useState<any[]>([]);
  const menuFuncList = useSelector((state: any) => state?.menuFuncList);
  const [openAdd, setOpenAdd] = useState(false);
  const [openView, setOpenView] = useState<any>(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const currentUser = useSelector((state: any) => state?.user?.user);

  // State to store default values รับและส่ง
  const [defaultValues, setDefaultValues] = useState(initialUserValues);
  const [resultData, setResultData] = useState<any>(null); // State to store draft data  

  //ตัวแปร ใช้ทุกที่ : ไว้จัดการสิทธิ์ให้ปุ่ม "เพิ่ม" แสดง และ ไม่แสดง
  const employeeUsername = currentUser?.employee_username.toLowerCase()
  const showButton = (menuFuncList || []).some((menuFunc: any) => menuFunc.func_name === "Add");
  const isValidationEnabled = import.meta.env.VITE_APP_ENABLE_VALIDATION === 'true'; // ตรวจสอบว่าเปิดการตรวจสอบหรือไม่
  const roleName = currentUser?.role_name;
  const dispatch = useDispatch()

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
  const currentAccessObject = cleanAccessData('current_access');
  updateSessionStorageCurrentAccess('screen_name', 'User');
  //console.log(currentAccessObject);


  //console.log(currentAccessData, 'current_access'); // แสดงค่าที่ถูกเก็บใน session storage

  //Revision
  const [revisionMaximum, setRevisionMaximum] = useState<any>(null);

  //==================================== useState Validate  =====================================
  const { isValidate, setIsValidate } = useListUser()

  //============================= เริ่มการทำงาน หน้าค้นหาข้อมูล =========================================
  useEffect(() => {
    console.log('Call : 🟢[1] Search fetch Master Data', moment().format('HH:mm:ss:SSS'));
    const initFetch = async () => {
      try {
        await searchFetchCostCentersAndServicerCenter(); // เรียกใช้ฟังก์ชันเมื่อ component ถูกเรนเดอร์ครั้งแรก
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

  // Use useEffect to call dataTableMasterUser_GET only on specific action
  useEffect(() => {

    if (actionType) {
      dataTableMasterUser_GET(); // ดึงข้อมูลใส่ตารางใหม่
      setActionType(null); // Reset actionType after fetching data
    }
  }, [actionType]);

  const searchFetchCostCentersAndServicerCenter = async () => {
    console.log('Call : searchFetchCostCenters', moment().format('HH:mm:ss:SSS'));

    const dataset = {

    };

    try {
      const response = await _POST(dataset, "/api_trr_mes/MasterData/Master_Cost_Center_Get");

      if (response && response.status === "success") {
        // ดึงข้อมูล Cost Center ทั้งหมด
        const allCenters = response.data;

        // กรองข้อมูลเฉพาะที่ไม่ใช่ Service Center (service_center_flag = false)
        const costCenters = allCenters
          .filter((center: any) => !center.service_center_flag) // กรองจาก service_center_flag = false
          .map((center: any) => ({
            costCenterId: center.id,
            costCenterCode: center.cost_center_code,
            costCenterName: center.cost_center_name,
            costCentersCodeAndName: "[" + center.site_code + "] " + center.cost_center_name + ' [' + center.cost_center_code + ']'
          }));

        // กรองข้อมูลเฉพาะที่เป็น Service Center
        const serviceCenters = allCenters
          .filter((center: any) => center.service_center_flag) // กรองจาก service_center_flag
          .map((center: any) => ({
            serviceCenterId: center.id,
            serviceCenterCode: center.cost_center_code,
            serviceCenterName: center.cost_center_name,
            serviceCentersCodeAndName: "[" + center.site_code + "] " + center.cost_center_name + ' [' + center.cost_center_code + ']'
          }));

        // อัพเดตค่าใน setOptionsSearch
        setOptionsSearch((prevOptions) => ({
          ...prevOptions,
          costCenter: costCenters,     // ข้อมูล Cost Center
          serviceCenter: serviceCenters // ข้อมูล Service Center
        }));

        console.log(costCenters, 'Cost Center');
        console.log(serviceCenters, 'Service Center');
      } else {
        setError("Failed to fetch cost centers.");
      }
    } catch (error) {
      console.error("Error fetching cost centers:", error);
      setError("An error occurred while fetching cost centers.");
    }
  };

  //============================= เริ่มการทำงาน handleClick =============================================
  //------------------- ค้นหาข้อมูล
  const handleSearch = () => {
    setActionType('search');
  };

  //------------------- รีเซ็ตข้อมูล
  const handleReset = () => {
    setUserName("");
    setUserAd("");
    setSelectedCostCenter(null);
    setSelectedServiceCenter(null);
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
    dataTableMasterUser_GET(); // เรียกใช้ฟังก์ชันเพื่อดึงงข้อมูล User ใหม่หลังเคลียร์ 

  };

  //------------------- เพิ่มข้อมูล
  const handleClickAdd = () => {
    setOpenAdd(true);
  };

  //------------------- SetData Reade สำหรับดึงข้อมูลกลับมาแสดง
  const readData = async (data: any) => {
    console.log('Call : readData', data, moment().format('HH:mm:ss:SSS'));
    await setDefaultValues({
      ...defaultValues,
      userId: data?.id || '',
      userAd: data?.user_ad || '',
      userName: data?.user_name || '',
      costCenterId: data?.cost_center_id || '',

    })
  };

  //------------------- ดูข้อมูล
  const handleClickView = (data: any) => {
    //console.log(data, 'ตอนกดปุ่ม View : ข้อมูล data');

    setOpenView(true);
    readData(data)

  };

  //------------------- แก้ไขข้อมูล
  const handleClickEdit = (data: any) => {
    setOpenEdit(true);;
    readData(data)

  };

  //------------------- ลบข้อมูล
  const handleClickDelete = (data: any) => {
    setOpenDelete(true);;
    readData(data)

  };

  //------------------- ดึงข้อมูลจาก Modals
  const handleDataChange = (data: any) => {
    setResultData(data); // ผลรับที่ได้จาก Models
  };

  //===================================== เริ่มการทำงาน หลัก ===============================================
  //------------------- เรียกใช้ตาราง User Get 
  useEffect(() => {
    console.log('Call : 🟢[2] fetch Data TableMasterUser GET', moment().format('HH:mm:ss:SSS'));
    if (!currentUser) return;
    dataTableMasterUser_GET();
    FetchMasterDataCostCentersAndServivcCenter();

  }, [currentUser]);

  //-------------------- Get ดึงข้อมูล MasterData Cost Centers & Servivc Center
  const FetchMasterDataCostCentersAndServivcCenter = async () => {
    console.log('Call : FetchMasterDataCostCenters', moment().format('HH:mm:ss:SSS'));

    if (!currentUser) return;
    const dataset = {

    };

    try {
      const response = await _POST(dataset, "/api_trr_mes/MasterData/Master_Cost_Center_Get");

      if (response && response.status === "success") {
        // ดึงข้อมูล Cost Center ทั้งหมด
        const allCenters = response.data;

        // แยกข้อมูล Cost Center
        const costAndServiceCenters = allCenters.map((center: any) => ({
          costCenterId: center.id,
          costCenterCode: center.cost_center_code,
          costCenterName: center.cost_center_name,
          costCentersCodeAndName: "[" + center.site_code + "] " + center.cost_center_name + ' [' + center.cost_center_code + ']' + (center.service_center_flag === true ? ' (Service Center)' : ''),
          appReqUser: center.app_req_user,
          costCentersSiteCode: center.site_code
        }));

        // อัพเดตค่าใน setOptionsSearch
        setOptions((prevOptions) => ({
          ...prevOptions,
          costAndServiceCenters: costAndServiceCenters,     // ข้อมูล Cost Center
        }));

        console.log(allCenters, 'Master Data allCenters');
      } else {
        setError("Failed to fetch cost centers.");
      }
    } catch (error) {
      console.error("Error fetching cost centers:", error);
      setError("An error occurred while fetching cost centers.");
    }
  };

  //-------------------- Get ดึงข้อมูลใส่ ตาราง
  const dataTableMasterUser_GET = async () => {
    console.log('Call : dataTableMasterUser_GET', moment().format('HH:mm:ss:SSS'));

    if (!currentUser) return;

    const dataset = {
      user_ad: userAd,
      user_name: userName,
      cost_center_id: selectedCostCenter?.costCenterId,
      service_center_id: selectedServiceCenter?.serviceCenterId
    };

    try {
      const response = await _POST(dataset, "/api_trr_mes/MasterData/Master_User_Get");

      if (response && response.status === "success") {
        const { data: result } = response;

        const newData: any = []

        Array.isArray(result) && result.forEach((el) => {
          //console.log(el, "😊😊😊");

          el.create_date = dateFormatTimeEN(el.create_date, "DD/MM/YYYY HH:mm:ss")
          el.update_date = dateFormatTimeEN(el.update_date, "DD/MM/YYYY HH:mm:ss")
          el.cost_center_label = el.service_center_flag === false ? "[" + el.cost_center_code + "]" + " | " + el.cost_center_name : "";
          el.service_center_label = el.service_center_flag === true ? "[" + el.cost_center_code + "]" + " | " + el.cost_center_name : "";

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
                }
              }}
              Defauft={true} //กรณีที่เป็นโหมดธรรมดาไม่มีเงื่อนไขซับซ้อน
            />
          )
          newData.push(el)
        })
        console.log(newData, 'ค่าที่ดึงจาก ตาราง');

        setDataList(newData);
      }
    } catch (e) {
      console.error("Error fetching cost requests:", e);
    }
  };

  //-------------------- Add Data ไปลง Database
  const UserAdd = async () => {
    console.log('Call : UserAdd', resultData, moment().format('HH:mm:ss:SSS'));

     // เรียกใช้งานฟังก์ชัน  Update Current Access Event Name
     updateSessionStorageCurrentAccess('event_name', 'Add/Master_User_Add');

     // ดึงข้อมูล currentAccessObject ใหม่จาก sessionStorage หลังการอัปเดต
     const storedAccessData = sessionStorage.getItem('current_access');
     const currentAccessObject = storedAccessData ? JSON.parse(storedAccessData) : {};
     console.log(currentAccessObject, 'currentAccessObject');

    const dataForValidate = {
      costCenter: resultData.costCenter,
      userAd: resultData.userAd,
      userName: resultData.userName,
    }
    const isValidate = checkValidate(dataForValidate, ['costCenter']);
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

        // สร้างข้อมูลที่จะส่ง
        const payload = {
          UserModel: {
            id: uuidv4(),
            user_ad: resultData.userAd,
            user_name: resultData.userName,
            cost_center_id: resultData.costCenter?.costCenterId,

          },
          currentAccessModel: currentAccessObject
        };


        dispatch(startLoadScreen());
        setTimeout(async () => {
          try {
            console.log('payload model', payload);

            // ใช้ _POST เพื่อส่งข้อมูล
            const response = await _POST(payload, "/api_trr_mes/MasterData/Master_User_Add");

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
                  dispatch(endLoadScreen());
                  handleClose();
                });
            } else {
              console.error('Failed to JobDone:', response);
              dispatch(endLoadScreen());
              Massengmodal.createModal(
                <div className="text-center p-4">
                  <p className="text-xl font-semibold mb-2 text-green-600">{response.data[0].errorMessage}</p>
                  {/* <p className="text-lg text-gray-800">
                <span className="font-semibold text-gray-900">Request No:</span>
                <span className="font-bold text-indigo-600 ml-1">{response.req_no}</span>
              </p> */}
                </div>,
                'error', () => {
                  dispatch(endLoadScreen());
                });
              // เพิ่มโค้ดที่ต้องการเมื่อเกิดข้อผิดพลาด
            }
          } catch (error) {
            console.error('Error JobDone:', error);
            dispatch(endLoadScreen());
            // เพิ่มโค้ดที่ต้องการเมื่อเกิดข้อผิดพลาดในการส่งข้อมูล
          }

        }, 2000);
      }
    });

  };

  //-------------------- Edit Data ไปลง Database
  const UserEdit = async () => {
    console.log('Call : UserEdit', resultData, moment().format('HH:mm:ss:SSS'));

    // เรียกใช้งานฟังก์ชัน  Update Current Access Event Name
    updateSessionStorageCurrentAccess('event_name', 'Edit/Master_User_Edit');

    // ดึงข้อมูล currentAccessObject ใหม่จาก sessionStorage หลังการอัปเดต
    const storedAccessData = sessionStorage.getItem('current_access');
    const currentAccessObject = storedAccessData ? JSON.parse(storedAccessData) : {};
    console.log(currentAccessObject, 'currentAccessObject');

    const dataForValidate = {
      costCenter: resultData.costCenter,
      userAd: resultData.userAd,
      userName: resultData.userName,
    }
    const isValidate = checkValidate(dataForValidate, ['costCenter']);
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

        // สร้างข้อมูลที่จะส่ง
        const payload = {
          UserModel: {
            id: resultData.userId,
            user_ad: resultData.userAd,
            user_name: resultData.userName,
            cost_center_id: resultData.costCenter?.costCenterId,

          },
          currentAccessModel: currentAccessObject
        };


        dispatch(startLoadScreen());
        setTimeout(async () => {
          try {
            console.log('payload model', payload);

            // ใช้ _POST เพื่อส่งข้อมูล
            const response = await _POST(payload, "/api_trr_mes/MasterData/Master_User_Edit");

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
                  dispatch(endLoadScreen());
                  handleClose();
                });
            } else {
              console.error('Failed to Edit:', response);
              dispatch(endLoadScreen());
              // เพิ่มโค้ดที่ต้องการเมื่อเกิดข้อผิดพลาด
            }
          } catch (error) {
            console.error('Error Edit:', error);
            dispatch(endLoadScreen());
            // เพิ่มโค้ดที่ต้องการเมื่อเกิดข้อผิดพลาดในการส่งข้อมูล
          }

        }, 2000);
      }
    });

  };

  //-------------------- Delete Data ไปลง Database
  const UserDelete = async () => {
    console.log('Call : UserDelete', resultData, moment().format('HH:mm:ss:SSS'));

    // เรียกใช้งานฟังก์ชัน  Update Current Access Event Name
    updateSessionStorageCurrentAccess('event_name', 'Delete/Master_User_Delete');

    // ดึงข้อมูล currentAccessObject ใหม่จาก sessionStorage หลังการอัปเดต
    const storedAccessData = sessionStorage.getItem('current_access');
    const currentAccessObject = storedAccessData ? JSON.parse(storedAccessData) : {};
    console.log(currentAccessObject, 'currentAccessObject');

    const dataForValidate = {
      costCenter: resultData.costCenter,
      userAd: resultData.userAd,
      userName: resultData.userName,
    }
    const isValidate = checkValidate(dataForValidate, ['costCenter']);
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

        // สร้างข้อมูลที่จะส่ง
        const payload = {
          UserModel: {
            id: resultData.userId,
          },
          currentAccessModel: currentAccessObject
        };


        dispatch(startLoadScreen());
        setTimeout(async () => {
          try {
            console.log('payload model', payload);

            // ใช้ _POST เพื่อส่งข้อมูล
            const response = await _POST(payload, "/api_trr_mes/MasterData/Master_User_Delete");

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
                  dispatch(endLoadScreen());
                  handleClose();
                });
            } else {
              console.error('Failed to Delete:', response);
              dispatch(endLoadScreen());
              // เพิ่มโค้ดที่ต้องการเมื่อเกิดข้อผิดพลาด
            }
          } catch (error) {
            console.error('Error Delete:', error);
            dispatch(endLoadScreen());
            // เพิ่มโค้ดที่ต้องการเมื่อเกิดข้อผิดพลาดในการส่งข้อมูล
          }

        }, 2000);
      }
    });

  };

  return (
    <div>
      <div className="max-lg rounded overflow-hidden shadow-xl bg-white mt-5 mb-5">
        <div className="px-6 pt-4">
          <label className="text-2xl ml-2 mt-3 mb-5 sarabun-regular">ค้นหาข้อมูล</label>
        </div>
        <div className="row px-10 pt-0 pb-5">
          <div className="col-md-3 mb-2">
            <FullWidthTextField
              labelName={"User Ad"}
              value={userAd}
              onChange={(value) => setUserAd(value)}
            />
          </div>
          <div className="col-md-3 mb-2">
            <FullWidthTextField
              labelName={"ชื่อผู้ใช้งาน"}
              value={userName}
              onChange={(value) => setUserName(value)}
            />
          </div>
          <div className="col-md-3 mb-2">
            <AutocompleteComboBox
              filterOptions={filterOptions}
              value={selectedCostCenter}
              labelName={"Cost Center"}
              options={optionsSearch.costCenter}
              column="costCentersCodeAndName"
              setvalue={handleAutocompleteChange(setSelectedCostCenter)}
            />
          </div>
          <div className="col-md-3 mb-2">
            <AutocompleteComboBox
              filterOptions={filterOptions}
              value={selectedServiceCenter}
              labelName={"Service Center"}
              options={optionsSearch.serviceCenter}
              column="serviceCentersCodeAndName"
              setvalue={handleAutocompleteChange(setSelectedServiceCenter)}
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
            buttonLabal_1={showButton ? "เพิ่มข้อมูล" : ""} // Show button label only if "Add" is found
            buttonColor_1="info"
            headCells={MasterUser_headCells}
            tableName={"บันทึกข้อมูลผู้ขอใช้บริการ"}
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
          handlefunction={UserAdd}
          colorBotton="success"
          actions={"Create"}
          element={
            <UserBody
              onDataChange={handleDataChange}
              defaultValues={defaultValues}
              options={options} // ส่งข้อมูล Combobox ไปยัง UserBody   
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
            <UserBody
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
          handlefunction={UserEdit}
          colorBotton="success"
          actions={"Update"}
          element={
            <UserBody
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
          handlefunction={UserDelete} // service
          colorBotton="success"
          actions={"Delete"}
          element={
            <UserBody
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
