import React, { useEffect, useState } from 'react'
import FullWidthTextField from '../../../components/MUI/FullWidthTextField'
import AutocompleteComboBox from '../../../components/MUI/AutocompleteComboBox'
import FullWidthButton from '../../../components/MUI/FullWidthButton'
import moment from 'moment';
import { _POST } from '../../../service/mas';
import EnhancedTable from '../../../components/MUI/DataTables';
import { useSelector } from 'react-redux';
import { MasterUser_headCells } from '../../../../libs/columnname';
import ActionManageCell from '../../../components/MUI/ActionManageCell';
import { dateFormatTimeEN } from '../../../../libs/datacontrol';

//======================== OptionsState ข้อมูล Drop Down ==========================
/*
    - ให้สร้าง interface options state เพื่อระบุประเภท(Type)
*/
interface OptionsState {
  costCenter: any[];
  serviceCenter: any[];
}

const initialOptions: OptionsState = {
  costCenter: [],
  serviceCenter: [],
};



export default function User() {

  //========================= useState ช่องค้นหาข้อมูล =============================
  const [userAd, setUserAd] = useState("");
  const [userName, setUserName] = useState("");
  const [selectedCostCenter, setSelectedCostCenter] = useState<any>(null);
  const [optionsSearch, setOptionsSearch] = useState<OptionsState>(initialOptions); // State for combobox options
  const [selectedServiceCenter, setSelectedServiceCenter] = useState<any>(null);
  const handleAutocompleteChange = (setter: React.Dispatch<React.SetStateAction<any>>) => (value: any) => {
    setter(value);
  };
  const [actionType, setActionType] = useState<string | null>(null); // Corrected type
  const [error, setError] = useState<string | null>(null); // สถานะสำหรับข้อผิดพลาด 

  //============================= หน้า ค้นหาข้อมูล ===================================
  useEffect(() => {
    console.log('Call : 🟢[1] Search fetch Master Data', moment().format('HH:mm:ss:SSS'));
    const initFetch = async () => {
      try {
        await searchFetchServiceCenters(); // เรียกใช้ฟังก์ชันเมื่อ component ถูกเรนเดอร์ครั้งแรก
      } catch (error) {
        console.error('Error in initFetch:', error);
      }
    };

    initFetch();
  }, []); // [] หมายถึงการรันแค่ครั้งเดียวตอนคอมโพเนนต์ถูก mount

  /*หน้า ค้นหาข้อมูล*/
  const handleSearch = () => {
    setActionType('search');
  };

  const handleReset = () => {
    setUserName("");
    setUserAd("");
    setSelectedCostCenter(null);
    setActionType('reset');
  };

  // Use useEffect to call dataTableMasterUser_GET only on specific action
  useEffect(() => {
    if (actionType) {
      dataTableMasterUser_GET(); // ดึงข้อมูลใส่ตารางใหม่
      setActionType(null); // Reset actionType after fetching data
    }
  }, [actionType]);

  const searchFetchServiceCenters = async () => {
    console.log('Call : searchFetchServiceCenters', moment().format('HH:mm:ss:SSS'));

    const dataset = {

    };

    try {
      const response = await _POST(dataset, "/api_trr_mes/MasterData/Cost_Center_Get");

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


  //============================== useState ข้อมูลเริ่มต้น / ข้อมูลตาราง ================================
  const [dataList, setDataList] = useState<any[]>([]);
  const menuFuncList = useSelector((state: any) => state?.menuFuncList);
  const [openAdd, setOpenAdd] = useState(false);
  const currentUser = useSelector((state: any) => state?.user?.user);

  //ตัวแปร ใช้ทุกที่ : ไว้จัดการสิทธิ์ให้ปุ่ม "เพิ่ม" แสดง และ ไม่แสดง
  const showButton = (menuFuncList || []).some((menuFunc: any) => menuFunc.func_name === "Add");
  const roleName = currentUser?.role_name;

  const handleClickAdd = () => {
    setOpenAdd(true);
  };

  //เรียกใช้ตาราง User Get 
  useEffect(() => {
    console.log('Call : 🟢[2] fetch Data TableMasterUser GET', moment().format('HH:mm:ss:SSS'));
    if (!currentUser) return;
    dataTableMasterUser_GET();

  }, [currentUser]);

  //Get ดึงข้อมูลใส่ ตาราง
  const dataTableMasterUser_GET = async () => {
    console.log('Call : dataTableMasterUser_GET', moment().format('HH:mm:ss:SSS'));

    if (!currentUser) return;

    const dataset = {
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
          el.cost_center_label = "[" + el.cost_center_code + "]" + " | " + el.cost_center_name

          el.ACTION = null
          el.ACTION = (
            <ActionManageCell
              onClick={(name) => {
                if (name == 'View') {
                  //handleClickView(el)
                } else if (name == 'Edit') {
                  //handleClickEdit(el)
                } else if (name == 'Delete') {
                  //handleClickDelete(el)
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
      console.error("Error fetching service requests:", e);
    }
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
              labelName={"User Name"}
              value={userName}
              onChange={(value) => setUserName(value)}
            />
          </div>
          <div className="col-md-3 mb-2">
            <AutocompleteComboBox
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
      </div>
    </div>


  )
}
