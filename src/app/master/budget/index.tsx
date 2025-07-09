import React, { useEffect, useState } from 'react'
import moment from 'moment'
import FullWidthButton from '../../../components/MUI/FullWidthButton';
import FullWidthTextField from '../../../components/MUI/FullWidthTextField';
import AutocompleteComboBox from '../../../components/MUI/AutocompleteComboBox';
import ActionManageCell from '../../../components/MUI/ActionManageCell';
import FuncDialog from '../../../components/MUI/FullDialog';
import EnhancedTable from '../../../components/MUI/DataTables'
import BudgetBody from './component/BudgetBody';
import { useDispatch, useSelector } from 'react-redux';
import { useListBudget } from './core/BudgetProvider';
import { v4 as uuidv4 } from 'uuid';
import { _POST, _GET } from '../../../service';
import { getCurrentAccessObject, updateSessionStorageCurrentAccess } from '../../../service/initmain';
import { confirmModal } from '../../../components/MUI/Comfirmmodal';
import { endLoadScreen, startLoadScreen } from '../../../../redux/actions/loadingScreenAction';
import { Master_Budget } from '../../../../libs/columnname';
import { Massengmodal } from '../../../components/MUI/Massengmodal';
import { dateFormatSlashReturnMUI, dateFormatTime, dateFormatTimeEN, DateToDB } from '../../../../libs/datacontrol';
import { createFilterOptions } from '@mui/material';
import { checkValidate, isCheckValidateAll } from '../../../../libs/validations';
import { setValueMas } from '../../../../libs/setvaluecallback';

const initialBudgetValues = {
  id: "",
  budgetCode: "",
  description: "",
  costCenterId: "",
  jobType: "",
  budgetStartDate: "",
  budgetEndDate: "",
};

export default function Budget() {

  const {
    options,
    setOptions,
    optionsSearch,
    setOptionsSearch,
    id,
    setId,
    budgetCode,
    setBudgetCode,
    description,
    setDescription,
    costcenterId,
    setCostcenterId,
    jobType,
    setJobtype,
    budgetStartDate,
    setBudgetStartDate,
    budgetEndDate,
    setBudgetEndDate,
    searchBudgetCode,
    setSearchBudgetCode,
    searchDescription,
    setSearchDescription,
    searchCostCenterId,
    setSearchCostcenterId,
    searchJobType,
    setSearchJobType,
    isValidate,
    setIsValidate,


    dataList,
    setDataList,
  } = useListBudget();

  const [dataBudget, setDataBudget] = useState<any[]>([]);
  const handleAutocompleteChange = (setter: React.Dispatch<React.SetStateAction<any>>) => (value: any) => { setter(value) };
  const [error, setError] = useState<string | null>(null);

  const menuFuncList = useSelector((state: any) => state?.menuFuncList);
  const currentUser = useSelector((state: any) => state?.user?.user);
  const [openAdd, setOpenAdd] = useState(false);
  const [openView, setOpenView] = useState<any>(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const employeeUsername = currentUser?.employee_username.toLowerCase()
  const showButton = (menuFuncList || []).some((menuFunc: any) => menuFunc.func_name === "Add");
  const isValidationEnabled = import.meta.env.VITE_APP_ENABLE_VALIDATION === 'true';
  const roleName = currentUser?.role_name;
  const dispatch = useDispatch();
  const employeeDomain = currentUser?.employee_domain;
  const screenName = 'Budget';

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
    console.log('Call : [1] fetchData for Cost Center - Job Types', moment().format('HH:mm:ss:SSS'));

    const fetchData = async () => {
      try {
        await fetchCostCenter();
        await fetchJobTypes();
      } catch (error) {
        console.log('Error FetchData : ', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    console.log('Call : [2] FetchData for Budget', moment().format('HH:mm:ss:SSS'));
    if (optionsSearch?.costAndServiceCenters && optionsSearch?.jobType) {
      fetchBudget(null);
    }
  }, []);



  //==========================================================================================================================
  const fetchCostCenter = async () => {
    console.log('Master Cost Center : Master_Cost_Center_Get', moment().format('YYYY-MM-DD HH:mm'));

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
      } else {
        setError("Failed to fetch master cost centers.");
      }
    } catch (e) {
      console.error("Error fetching master cost centers:", e);
      setError("An error occurred while fetching master cost centers.");
    }
  }

  const fetchJobTypes = async () => {
    console.log('Lov Data : Lov_Data_Get', moment().format('YYYY-MM-DD HH:mm'));

    try {
      const dataset = {
        "lov_type": "job_type"
      };

      const response = await _POST(dataset, "/api_trr_mes/LovData/Lov_Data_Get");

      if (response && response.status === "success") {
        const jobTypes = response.data.map((job: any) => ({
          lov_code: job.lov_code,
          lov_name: job.lov1,
        }));

        setOptions((prevOptions) => ({
          ...prevOptions,
          jobType: jobTypes,
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
  }

  const fetchBudget = async (dataset: any) => {
    console.log('Master Budget : Master_Budget_Get', moment().format('YYYY-MM-DD HH:mm'));

    try {
      const response = await _POST(dataset, "/api_trr_mes/MasterData/Master_Budget_Get");

      if (response && response.status === "success") {
        const allBudget = response.data;
        const newData: any = [];

        Array.isArray(allBudget) && allBudget.forEach((budget) => {
          budget.budget_s_date = dateFormatTimeEN(budget.budget_s_date, "DD/MM/YYYY");
          budget.budget_e_date = dateFormatTimeEN(budget.budget_e_date, "DD/MM/YYYY");

          budget.create_date = dateFormatTimeEN(budget.create_date, "DD/MM/YYYY HH:mm:ss");
          budget.update_date = dateFormatTimeEN(budget.update_date, "DD/MM/YYYY HH:mm:ss");

          budget.cost_center_label = "[" + budget.cost_center_code + "]" + " | " + budget.cost_center_name;

          budget.ACTION = null
          budget.ACTION = <ActionManageCell onClick={(name) => {
            if (name == 'View') {
              handleClickView(budget);
            } else if (name == 'Edit') {
              handleClickEdit(budget);
            } else if (name == 'Delete') {
              handleClickDelete(budget);
            }
          }}
            Defauft={true}
          />
          newData.push(budget);
        });
        setDataBudget(newData);
      } else {
        setError("Failed to fetch master budget.");
      }
    } catch (error) {
      console.error('Error Master Budget Get :', error);
      setError("An error occurred while fetching master budget.");
    }
  }

  const BudgetAdd = async () => {
    console.log(' Master Budget : Master_Budget_Add', moment().format('YYYY-MM-DD HH:mm'));

    updateSessionStorageCurrentAccess('event_name', 'Add/Master_Budget_Add');

    const dataForValidate = {
      budget_code: budgetCode,
      description: description,
      cost_center_id: costcenterId?.id,
      job_type: jobType?.lov_code,
      budget_s_date: (DateToDB(dateFormatTime(budgetStartDate, "DD/MM/YYYY"))),
      budget_e_date: (DateToDB(dateFormatTime(budgetEndDate, "DD/MM/YYYY"))),
    };

    console.log("Data validation:", dataForValidate);

    const isValidate = checkValidate(dataForValidate, ['budget_code', 'description', 'cost_center_id', 'job_type', 'budget_s_date', 'budget_e_date']);
    const isValidateAll = isCheckValidateAll(isValidate);

    if (Object.keys(isValidateAll).length > 0 && isValidationEnabled) {
      console.log("Validation errors:", isValidateAll);
      setIsValidate(isValidate);
      return; // return ถ้า validate ไม่ผ่าน
    }
    setIsValidate(null); // ถ้า validate ผ่าน

    confirmModal.createModal("ยืนยันที่จะบันทึกหรือไม่ ?", "info", async () => {
      const payload = {
        BudgetModel: [{
          id: uuidv4(),
          budget_code: budgetCode,
          description: description,
          cost_center_id: costcenterId?.id,
          job_type: jobType?.lov_code,
          budget_s_date: (DateToDB(dateFormatTime(budgetStartDate, "DD/MM/YYYY"))),
          budget_e_date: (DateToDB(dateFormatTime(budgetEndDate, "DD/MM/YYYY"))),
        }],
        currentAccessModel: getCurrentAccessObject(employeeUsername, employeeDomain, screenName)
      }

      console.log('payload BudgetModel (Add) : ', payload);

      dispatch(startLoadScreen());
      setTimeout(async () => {
        try {
          const response = await _POST(payload, "/api_trr_mes/MasterData/Master_Budget_Add");

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
            console.error('Failed BudgetAdd :', response);

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
          console.log('Error : Master budget Add', e);
          dispatch(endLoadScreen());
        }
      }, 0);
    });
  }

  const BudgetEdit = async () => {
    console.log(' Master Budget : Master_Budget_Edit', moment().format('YYYY-MM-DD HH:mm'));

    updateSessionStorageCurrentAccess('event_name', 'Edit/Master_Budget_Edit');

    const dataForValidate = {
      budget_code: budgetCode,
      description: description,
      cost_center_id: costcenterId?.id,
      job_type: jobType?.lov_code,
      budget_s_date: (DateToDB(dateFormatTime(budgetStartDate, "DD/MM/YYYY"))),
      budget_e_date: (DateToDB(dateFormatTime(budgetEndDate, "DD/MM/YYYY"))),
    };

    console.log("Data validation:", dataForValidate);

    const isValidate = checkValidate(dataForValidate, ['budget_code', 'description', 'cost_center_id', 'job_type', 'budget_s_date', 'budget_e_date']);
    const isValidateAll = isCheckValidateAll(isValidate);

    if (Object.keys(isValidateAll).length > 0 && isValidationEnabled) {
      console.log("Validation errors:", isValidateAll);
      setIsValidate(isValidate);
      return; // return ถ้า validate ไม่ผ่าน
    }
    setIsValidate(null); // ถ้า validate ผ่าน

    confirmModal.createModal("ยืนยันที่จะบันทึกหรือไม่ ?", "info", async () => {
      const payload = {
        BudgetModel: [{
          id: id,
          budget_code: budgetCode,
          description: description,
          cost_center_id: costcenterId?.id,
          job_type: jobType?.lov_code,
          budget_s_date: (DateToDB(dateFormatTime(budgetStartDate, "DD/MM/YYYY"))),
          budget_e_date: (DateToDB(dateFormatTime(budgetEndDate, "DD/MM/YYYY"))),
        }],
        currentAccessModel: getCurrentAccessObject(employeeUsername, employeeDomain, screenName)
      };

      console.log('payload BudgetModel (Edit) : ', payload);

      dispatch(startLoadScreen());
      setTimeout(async () => {
        try {
          const response = await _POST(payload, "/api_trr_mes/MasterData/Master_Budget_Edit")

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
    });
  }

  const BudgetDelete = async () => {
    console.log(' Master Budget : Master_Budget_Delete', moment().format('YYYY-MM-DD HH:mm'));

    updateSessionStorageCurrentAccess('event_name', 'Delete/Master_Budget_Delete');

    const dataForValidate = {
      budget_code: budgetCode,
      description: description,
      cost_center_id: costcenterId?.id,
      job_type: jobType?.lov_code,
      budget_s_date: (DateToDB(dateFormatTime(budgetStartDate, "DD/MM/YYYY"))),
      budget_e_date: (DateToDB(dateFormatTime(budgetEndDate, "DD/MM/YYYY"))),
    }

    console.log("Data validation:", dataForValidate);

    const isValidate = checkValidate(dataForValidate, ['budget_code', 'description', 'cost_center_id', 'job_type', 'budget_s_date', 'budget_e_date']);
    const isValidateAll = isCheckValidateAll(isValidate);

    if (Object.keys(isValidateAll).length > 0 && isValidationEnabled) {
      console.log("Validation errors:", isValidateAll);
      setIsValidate(isValidate);
      return; // return ถ้า validate ไม่ผ่าน
    }
    setIsValidate(null); // ถ้า validate ผ่าน

    confirmModal.createModal("ยืนยันที่จะบันทึกหรือไม่ ?", "info", async () => {
      const payload = {
        BudgetModel: [{
          id: id,
        }],
        currentAccessModel: getCurrentAccessObject(employeeUsername, employeeDomain, screenName) // ใช้ค่า user_id จาก currentUser หรือค่าเริ่มต้น
      };

      console.log('payload BudgetModel (Delete) : ', payload);

      dispatch(startLoadScreen());
      setTimeout(async () => {
        try {
          const response = await _POST(payload, "/api_trr_mes/MasterData/Master_Budget_Delete")

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
    });
  }

  const handleSearch = () => {
    const dataset = {
      budget_code: searchBudgetCode ? searchBudgetCode : null,
      description: searchDescription ? searchDescription : null,
      cost_center_id: searchCostCenterId?.id ? searchCostCenterId?.id : null,
      job_type: searchJobType?.lov_code ? searchJobType?.lov_code : null,
    };
    console.log('Call : 🟢[3] Dataset : Search', dataset, moment().format('HH:mm:ss:SSS'));
    fetchBudget(dataset);
  }

  const handleReset = () => {
    console.log('Call : 🟢[4] Dataset : Reset', moment().format('HH:mm:ss:SSS'));
    setSearchBudgetCode("");
    setSearchDescription("");
    setSearchCostcenterId(null);
    setSearchJobType(null);
    fetchBudget(null);
  };

  const handleClose = () => {
    setOpenView(false);
    setOpenAdd(false);
    setOpenEdit(false);
    setOpenDelete(false);
    setBudgetCode("");
    setDescription("");
    setCostcenterId(null);
    setJobtype(null);
    setBudgetStartDate("");
    setBudgetEndDate("");
    setIsValidate(null);
    fetchBudget(null);
  };

  const handleClickAdd = () => {
    console.log('ตอนกดปุ่ม Add : เพิ่มข้อมูล data');
    setOpenAdd(true);
  };

  const handleClickView = (data: any) => {
    console.log('ตอนกดปุ่ม View : ข้อมูล data', data);

    setDataList(data);
    setOpenView(true);

    setBudgetCode(data?.budget_code);
    setDescription(data?.description);
    // setCostcenterId(setValueMas(options?.costAndServiceCenters, data?.cost_center_id, "id"));
    // setJobtype(setValueMas(options.jobType, data?.job_type, "lov_code"));
    setBudgetStartDate(dateFormatSlashReturnMUI(data?.budget_s_date, "DD/MM/YYYY"));
    setBudgetEndDate(dateFormatSlashReturnMUI(data?.budget_e_date, "DD/MM/YYYY"));
  };

  const handleClickEdit = (data: any) => {
    console.log('ตอนกดปุ่ม Edit : ข้อมูล data', data);

    setDataList(data);
    setOpenEdit(true);

    setId(data?.id);
    setBudgetCode(data?.budget_code);
    setDescription(data?.description);
    // setCostcenterId(setValueMas(optionsSearch?.costAndServiceCenters, data?.cost_center_id, "id"));
    // setJobtype(setValueMas(optionsSearch.jobType, data?.job_type, "lov_code"));
    setBudgetStartDate(dateFormatSlashReturnMUI(data?.budget_s_date, "DD/MM/YYYY"));
    setBudgetEndDate(dateFormatSlashReturnMUI(data?.budget_e_date, "DD/MM/YYYY"));
  };

  const handleClickDelete = (data: any) => {
    console.log('ตอนกดปุ่ม Delete : ข้อมูล data', data);

    setDataList(data);
    setOpenDelete(true);

    setId(data?.id);
    setBudgetCode(data?.budget_code);
    setDescription(data?.description);
    // setCostcenterId(setValueMas(optionsSearch?.costAndServiceCenters, data?.cost_center_id, "id"));
    // setJobtype(setValueMas(optionsSearch.jobType, data?.job_type, "lov_code"));
    setBudgetStartDate(dateFormatSlashReturnMUI(data?.budget_s_date, "DD/MM/YYYY"));
    setBudgetEndDate(dateFormatSlashReturnMUI(data?.budget_e_date, "DD/MM/YYYY"));
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
              labelName={"รหัสงบประมาณ"}
              value={searchBudgetCode}
              onChange={(value) => setSearchBudgetCode(value)}
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
            <AutocompleteComboBox
              labelName={"ประเภทงาน"}
              value={searchJobType}
              options={optionsSearch?.jobType}
              column="lov_name"
              setvalue={handleAutocompleteChange(setSearchJobType)}
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
            rows={dataBudget}
            buttonLabal_1={showButton ? "เพิ่มข้อมูล" : ""} // Show button label only if "Add" is found
            buttonColor_1="info"
            headCells={Master_Budget}
            tableName={"บันทึกข้อมูลงบประมาณ"}
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
          handlefunction={BudgetAdd}
          colorBotton="success"
          actions={"Create"}
          element={
            <BudgetBody
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
            <BudgetBody
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
          handlefunction={BudgetEdit}
          colorBotton="success"
          actions={"Update"}
          element={
            <BudgetBody
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
          handlefunction={BudgetDelete}
          colorBotton="success"
          actions={"Delete"}
          element={
            <BudgetBody
              options={options}
              disableOnly
              actions={"Reade"}
            />
          }
        />
      </div>
    </div>
  );
}