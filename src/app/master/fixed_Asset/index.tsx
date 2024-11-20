import React, { useEffect, useState } from 'react'
import moment from 'moment';
import ActionManageCell from '../../../components/MUI/ActionManageCell';
import FuncDialog from '../../../components/MUI/FullDialog';
import FullWidthTextField from '../../../components/MUI/FullWidthTextField';
import AutocompleteComboBox from '../../../components/MUI/AutocompleteComboBox';
import FullWidthButton from '../../../components/MUI/FullWidthButton';
import EnhancedTable from '../../../components/MUI/DataTables';
import FixedAssetBody from './component/FixedAssetBody';
import { useListFixedAsset } from './core/FixedAssetProvider';
import { v4 as uuidv4 } from 'uuid';
import { _POST } from '../../../service';
import { setValueMas } from '../../../../libs/setvaluecallback';
import { confirmModal } from '../../../components/MUI/Comfirmmodal';
import { Massengmodal } from '../../../components/MUI/Massengmodal';
import { dateFormatTimeEN } from '../../../../libs/datacontrol';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentAccessObject, updateSessionStorageCurrentAccess } from '../../../service/initmain';
import { createFilterOptions } from '@mui/material';
import { Master_Fixed_Asset } from '../../../../libs/columnname';
import { checkValidate, isCheckValidateAll } from '../../../../libs/validations';
import { endLoadScreen, startLoadScreen } from '../../../../redux/actions/loadingScreenAction';

const initialBudgetValues = {
  id: "",
  fixedAssetCode: "",
  description: "",
  costCenterId: "",
  fixedAssetStatus: "",
};

export default function FixedAsset() {

  const {
    options,
    setOptions,
    optionsSearch,
    setOptionsSearch,
    id,
    setId,
    fixedAssetCode,
    setFixedAssetCode,
    description,
    setDescription,
    costcenterId,
    setCostcenterId,
    fixedAssetStatus,
    setFixedAssetStatus,
    searchFixedAssetCode,
    setSearchFixedAssetCode,
    searchDescription,
    setSearchDescription,
    searchCostCenterId,
    setSearchCostcenterId,
    searchFixedAssetStatus,
    setSearchFixedAssetStatus,
    isValidate,
    setIsValidate,
  } = useListFixedAsset();

  const [dataFixedAsset, setDataFixedAsset] = useState<any[]>([]);

  const handleAutocompleteChange = (setter: React.Dispatch<React.SetStateAction<any>>) => (value: any) => { setter(value) };
  const [error, setError] = useState<string | null>(null);

  const menuFuncList = useSelector((state: any) => state?.menuFuncList);
  const currentUser = useSelector((state: any) => state?.user?.user);
  const [openAdd, setOpenAdd] = useState(false);
  const [openView, setOpenView] = useState<any>(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  // ตัวแปร ใช้ทุกที่ : ไว้จัดการสิทธิ์ให้ปุ่ม "เพิ่ม" แสดง และ ไม่แสดง
  const employeeUsername = currentUser?.employee_username.toLowerCase()
  const showButton = (menuFuncList || []).some((menuFunc: any) => menuFunc.func_name === "Add");
  const isValidationEnabled = import.meta.env.VITE_APP_ENABLE_VALIDATION === 'true';
  const roleName = currentUser?.role_name;
  const dispatch = useDispatch();
  const employeeDomain = currentUser?.employee_domain;
  const screenName = 'fixedasset';

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

  cleanAccessData('current_access');
  updateSessionStorageCurrentAccess('screen_name', screenName);

  const OPTIONS_LIMIT = 100;
  const defaultFilterOptions = createFilterOptions();
  const filterOptions = (optionsSearch: any[], state: any) => {
    return defaultFilterOptions(optionsSearch, state).slice(0, OPTIONS_LIMIT);
  };   

  useEffect(() => {
    console.log('Call : 🟢[1] FetchData for Cost Center', moment().format('HH:mm:ss:SSS'));
    const fetchData = async () => {
      try {
        await fetchCostCenter();
      } catch (error) {
        console.log('Error FetchData Fixed Asset : ', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    console.log('Call : 🟢[2] FetchData for Fixed Asset', moment().format('HH:mm:ss:SSS'));
    if (options?.costAndServiceCenters) {
      fetchFixedAsset(null);
    }
  }, [options?.costAndServiceCenters]);

  const fetchCostCenter = async () => {
    console.log('🌐 Master Cost Center : Master_Cost_Center_Get', moment().format('YYYY-MM-DD HH:mm'));

    const dataset = {};

    try {
      const response = await _POST(dataset, "/api_trr_mes/MasterData/Master_Cost_Center_Get");

      if (response && response.status === "success") {
        const allCostCenter = response.data;
        const newData: any = []
        const costCenterCode: any = []

        Array.isArray(allCostCenter) && allCostCenter.forEach((center) => {
          if (!costCenterCode.includes(center.cost_center_code)) {
            costCenterCode.push(center.cost_center_code)
            center.costCenterId = center.id,
              center.costCenterCode = center.cost_center_code,
              center.costCenterName = center.cost_center_name,
              center.costCentersCodeAndName = "[" + center.site_code + "] " + center.cost_center_name + ' [' + center.cost_center_code + ']' + (center.service_center_flag === true ? ' (Service Center)' : '')
            newData.push(center);
          }
        });

        setOptions((prevOptions) => ({
          ...prevOptions,
          costAndServiceCenters: newData,
        }));

        setOptionsSearch((prevOptions) => ({
          ...prevOptions,
          costAndServiceCenters: newData,
        }));

        console.log('Master Data allCenters : ', allCostCenter);

      } else {
        setError("Failed to fetch master cost center.");
      }
    } catch (e) {
      console.error("Error fetching master cost center:", e);
      setError("An error occurred while fetching master cost centers.");
    }
  }

  const fetchFixedAsset = async (dataset: any) => {
    console.log('🌐 Master Fixed Asset : Master_Fixed_Asset_Get', moment().format('YYYY-MM-DD HH:mm'));

    try {
      const response = await _POST(dataset, "/api_trr_mes/MasterData/Master_Fixed_Asset_Get");

      if (response && response.status === "success") {
        const allBudget = response.data;
        const newData: any = [];

        Array.isArray(allBudget) && allBudget.forEach((fixedasset) => {
          fixedasset.create_date = dateFormatTimeEN(fixedasset.create_date, "DD/MM/YYYY HH:mm:ss");
          fixedasset.update_date = dateFormatTimeEN(fixedasset.update_date, "DD/MM/YYYY HH:mm:ss");

          fixedasset.cost_center_label = "[" + fixedasset.cost_center_code + "]" + " | " + fixedasset.cost_center_name;

          fixedasset.ACTION = null
          fixedasset.ACTION = <ActionManageCell onClick={(name) => {
            if (name == 'View') {
              handleClickView(fixedasset);
            } else if (name == 'Edit') {
              handleClickEdit(fixedasset);
            } else if (name == 'Delete') {
              handleClickDelete(fixedasset);
            }
          }}
            Defauft={true}
          />
          newData.push(fixedasset);
        });

        setDataFixedAsset(newData);

      } else {
        setError("Failed to fetch master fixedasset.");
      }
    } catch (error) {
      console.error('Error Master fixedasset Get :', error);
      setError("An error occurred while fetching master fixedasset.");
    }
  }

  const FixedAssetAdd = async () => {
    console.log('🌐 Master Fixed Asset : Master_Fixed_Asset_Add', moment().format('YYYY-MM-DD HH:mm'));

    updateSessionStorageCurrentAccess('event_name', 'Add/Master_Fixed_Asset_Add');

    const dataForValidate = {
      fixed_asset_code: fixedAssetCode,
      description: description,
      cost_center_id: costcenterId?.id,
      fixed_asset_status: fixedAssetStatus,
    }

    console.log("Data validation (Add):", dataForValidate);

    const isValidate = checkValidate(dataForValidate, ['Budget']);
    const isValidateAll = isCheckValidateAll(isValidate);

    if (Object.keys(isValidateAll).length > 0 && isValidationEnabled) {
      console.log("Validation errors:", isValidateAll);
      setIsValidate(isValidate);
      return; // return ถ้า validate ไม่ผ่าน
    }
    setIsValidate(null); // ถ้า validate ผ่าน

    confirmModal.createModal("ยืนยันที่จะบันทึกหรือไม่ ?", "info", async () => {
      const payload = {
        FixedAssetModel: [{
          id: uuidv4(),
          fixed_asset_code: fixedAssetCode,
          description: description,
          cost_center_id: costcenterId?.id,
          fixed_asset_status: fixedAssetStatus,
        }],
        currentAccessModel: getCurrentAccessObject(employeeUsername, employeeDomain, screenName)
      }

      console.log('🟢 payload FixedAssetModel (Add) : ', payload);

      dispatch(startLoadScreen());
      setTimeout(async () => {
        try {
          console.log("payload model", payload);

          const response = await _POST(payload, "/api_trr_mes/MasterData/Master_Fixed_Asset_Add");

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
            console.error('Failed FixedAssetAdd :', response);

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
          console.log('Error : Master Fixed Asset Add', e);
          dispatch(endLoadScreen());
        }
      }, 0);
    });
  }

  const FixedAssetEdit = async () => {
    console.log('🌐 Master Fixed Asset : Master_Fixed_Asset_Edit', moment().format('YYYY-MM-DD HH:mm'));

    updateSessionStorageCurrentAccess('event_name', 'Edit/Master_Fixed_Asset_Edit');

    const dataForValidate = {
      fixed_asset_code: fixedAssetCode,
      description: description,
      cost_center_id: costcenterId?.id,
      fixed_asset_status: fixedAssetStatus,
    }

    console.log("Data validation (Edit):", dataForValidate);

    const isValidate = checkValidate(dataForValidate, ['Budget']);
    const isValidateAll = isCheckValidateAll(isValidate);

    if (Object.keys(isValidateAll).length > 0 && isValidationEnabled) {
      console.log("Validation errors:", isValidateAll);
      setIsValidate(isValidate);
      return; // return ถ้า validate ไม่ผ่าน
    }
    setIsValidate(null); // ถ้า validate ผ่าน

    confirmModal.createModal("ยืนยันที่จะบันทึกหรือไม่ ?", "info", async () => {
      const payload = {
        FixedAssetModel: [{
          id: id,
          fixed_asset_code: fixedAssetCode,
          description: description,
          cost_center_id: costcenterId?.id,
          fixed_asset_status: fixedAssetStatus,
        }],
        currentAccessModel: getCurrentAccessObject(employeeUsername, employeeDomain, screenName)
      }

      console.log('🟢 payload FixedAssetModel (Edit) : ', payload);

      dispatch(startLoadScreen());
      setTimeout(async () => {
        try {
          console.log("payload model", payload);

          const response = await _POST(payload, "/api_trr_mes/MasterData/Master_Fixed_Asset_Edit");

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
            console.error('Failed FixedAssetAdd :', response);

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
          console.log('Error : Master Fixed Asset Edit', e);
          dispatch(endLoadScreen());
        }
      }, 0);
    });
  }

  const FixedAssetDelete = async () => {
    console.log('🌐 Master Fixed Asset : Master_Fixed_Asset_Delete', moment().format('YYYY-MM-DD HH:mm'));

    updateSessionStorageCurrentAccess('event_name', 'Delete/Master_Fixed_Asset_Delete');

    const dataForValidate = {
      fixed_asset_code: fixedAssetCode,
      description: description,
      cost_center_id: costcenterId?.id,
      fixed_asset_status: fixedAssetStatus,
    }

    console.log("Data validation (Delete):", dataForValidate);

    const isValidate = checkValidate(dataForValidate, ['Budget']);
    const isValidateAll = isCheckValidateAll(isValidate);

    if (Object.keys(isValidateAll).length > 0 && isValidationEnabled) {
      console.log("Validation errors:", isValidateAll);
      setIsValidate(isValidate);
      return; // return ถ้า validate ไม่ผ่าน
    }
    setIsValidate(null); // ถ้า validate ผ่าน

    confirmModal.createModal("ยืนยันที่จะบันทึกหรือไม่ ?", "info", async () => {
      const payload = {
        FixedAssetModel: [{
          id: id,
        }],
        currentAccessModel: getCurrentAccessObject(employeeUsername, employeeDomain, screenName)
      }

      console.log('🟢 payload FixedAssetModel (Delete) : ', payload);

      dispatch(startLoadScreen());
      setTimeout(async () => {
        try {
          console.log("payload model", payload);

          const response = await _POST(payload, "/api_trr_mes/MasterData/Master_Fixed_Asset_Delete");

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
            console.error('Failed FixedAssetAdd :', response);

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
          console.log('Error : Master Fixed Asset Delete', e);
          dispatch(endLoadScreen());
        }
      }, 0);
    });
  }

  const handleSearch = () => {
    const dataset = {
      fixed_asset_code: searchFixedAssetCode ? searchFixedAssetCode : null,
      description: searchDescription ? searchDescription : null,
      cost_center_id: searchCostCenterId?.id ? searchCostCenterId?.id : null,
      fixed_asset_status: searchFixedAssetStatus ? searchFixedAssetStatus : null,
    };
    console.log('Call : 🟢[3] Dataset : Search', dataset, moment().format('HH:mm:ss:SSS'));
    fetchFixedAsset(dataset);
  }

  const handleReset = () => {
    console.log('Call : 🟢[4] Dataset : Reset', moment().format('HH:mm:ss:SSS'));
    setSearchFixedAssetCode("");
    setSearchDescription("");
    setSearchCostcenterId(null);
    setSearchFixedAssetStatus("");
    fetchFixedAsset(null);
  };

  const handleClose = () => {
    setOpenView(false);
    setOpenAdd(false);
    setOpenEdit(false);
    setOpenDelete(false);
    setFixedAssetCode("");
    setDescription("");
    setCostcenterId(null);
    setFixedAssetStatus(null);
    setIsValidate(null);
    fetchFixedAsset(null);
  };

  const handleClickAdd = () => {
    console.log('ตอนกดปุ่ม Add : เพิ่มข้อมูล data');
    setOpenAdd(true);
  };

  const handleClickView = (data: any) => {
    console.log('ตอนกดปุ่ม View : ข้อมูล data', data);
    setOpenView(true);

    setFixedAssetCode(data?.fixed_asset_code);
    setDescription(data?.description);
    setCostcenterId(setValueMas(options?.costAndServiceCenters, data?.cost_center_id, "id"));
    setFixedAssetStatus(data?.fixed_asset_status); // setFixedAssetStatus(setValueMas(optionsSearch.fixedAssetStatus, data?.fixed_asset_status, "fixed_asset_status"));
  };

  const handleClickEdit = (data: any) => {
    console.log('ตอนกดปุ่ม Edit : ข้อมูล data', data);
    setOpenEdit(true);

    setId(data?.id)
    setFixedAssetCode(data?.fixed_asset_code);
    setDescription(data?.description);
    setCostcenterId(setValueMas(options?.costAndServiceCenters, data?.cost_center_id, "id"));
    setFixedAssetStatus(data?.fixed_asset_status); // setFixedAssetStatus(setValueMas(optionsSearch.fixedAssetStatus, data?.fixed_asset_status, "fixed_asset_status"));
  };

  const handleClickDelete = (data: any) => {
    console.log('ตอนกดปุ่ม Delete : ข้อมูล data', data);
    setOpenDelete(true);

    setId(data?.id)
    setFixedAssetCode(data?.fixed_asset_code);
    setDescription(data?.description);
    setCostcenterId(setValueMas(options?.costAndServiceCenters, data?.cost_center_id, "id"));
    setFixedAssetStatus(data?.fixed_asset_status); // setFixedAssetStatus(setValueMas(optionsSearch.fixedAssetStatus, data?.fixed_asset_status, "fixed_asset_status"));
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
              labelName={"Fixed Asset Code"}
              value={searchFixedAssetCode}
              onChange={(value) => setSearchFixedAssetCode(value)}
            />
          </div>
          <div className="col-md-3 mb-2">
            <FullWidthTextField
              labelName={"รายละเอียด"}
              value={searchDescription}
              onChange={(value) => setSearchDescription(value)}
            />
          </div>
          <div className="col-md-3 mb-2">
            <AutocompleteComboBox
              filterOptions={filterOptions}
              labelName={"Cost Center & Service Center"}
              value={searchCostCenterId}
              options={optionsSearch?.costAndServiceCenters}
              column="costCentersCodeAndName"
              setvalue={handleAutocompleteChange(setSearchCostcenterId)}
            />
          </div>
          <div className="col-md-3 mb-2">
            <FullWidthTextField
              labelName={"สถานะ"}
              value={searchFixedAssetStatus}
              onChange={(value) => setSearchFixedAssetStatus(value)}
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
            rows={dataFixedAsset}
            buttonLabal_1={showButton ? "เพิ่มข้อมูล" : ""}
            buttonColor_1="info"
            headCells={Master_Fixed_Asset}
            tableName={"บันทึกข้อมูลสินทรัพย์ถาวร"}
            handleonClick_1={handleClickAdd}
            roleName={currentUser?.role_name}
          />
        </div>
        <FuncDialog
          open={openAdd}
          dialogWidth="lg"
          openBottonHidden={true}
          titlename={'เพิ่มข้อมูล'}
          handleClose={handleClose}
          handlefunction={FixedAssetAdd}
          colorBotton="success"
          actions={"Create"}
          element={
            <FixedAssetBody
              options={options}
              actions={"Create"}
            />
          }
        />
        <FuncDialog
          open={openView}
          dialogWidth="lg"
          openBottonHidden={true}
          titlename={'ดูข้อมูล'}
          handleClose={handleClose}
          colorBotton="success"
          actions={"Reade"}
          element={
            <FixedAssetBody
              options={options}
              disableOnly
              actions={"Reade"}
            />
          }
        />
        <FuncDialog
          open={openEdit}
          dialogWidth="lg"
          openBottonHidden={true}
          titlename={'แก้ไขข้อมูล'}
          handleClose={handleClose}
          handlefunction={FixedAssetEdit}
          colorBotton="success"
          actions={"Update"}
          element={
            <FixedAssetBody
              options={options}
              actions={"Update"}
            />
          }
        />
        <FuncDialog
          open={openDelete}
          dialogWidth="lg"
          openBottonHidden={true}
          titlename={'ลบข้อมูล'}
          handleClose={handleClose}
          handlefunction={FixedAssetDelete}
          colorBotton="success"
          actions={"Delete"}
          element={
            <FixedAssetBody
              options={options}
              disableOnly
              actions={"Reade"}
            />
          }
        />
      </div>
    </div>
  )
}
