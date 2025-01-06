import React, { useEffect, useState } from 'react'
import moment from 'moment';
import SiteBody from './component/SiteBody';
import ActionManageCell from '../../../components/MUI/ActionManageCell';
import AutocompleteComboBox from '../../../components/MUI/AutocompleteComboBox';
import FullWidthTextField from '../../../components/MUI/FullWidthTextField';
import FullWidthButton from '../../../components/MUI/FullWidthButton';
import FuncDialog from '../../../components/MUI/FullDialog';
import EnhancedTable from '../../../components/MUI/DataTables';
import { useListSite } from './core/SiteProvider';
import { v4 as uuidv4 } from 'uuid';
import { _POST } from '../../../service';
import { Master_Site } from '../../../../libs/columnname';
import { confirmModal } from '../../../components/MUI/Comfirmmodal';
import { Massengmodal } from '../../../components/MUI/Massengmodal';
import { dateFormatTimeEN } from '../../../../libs/datacontrol';
import { getCurrentAccessObject, updateSessionStorageCurrentAccess } from '../../../service/initmain';
import { createFilterOptions } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { checkValidate, isCheckValidateAll } from '../../../../libs/validations';
import { endLoadScreen, startLoadScreen } from '../../../../redux/actions/loadingScreenAction';

const initialBudgetValues = {
  id: "",
  siteCode: "",
  siteName: "",
  domain: "",
};

export default function Site() {

  const {
    options,
    setOptions,
    optionsSearch,
    setOptionsSearch,
    searchSiteCode,
    setSearchSiteCode,
    searchSiteName,
    setSearchSiteName,
    searchDomain,
    setSearchDomain,
    id,
    setId,
    siteCode,
    setSiteCode,
    siteName,
    setSiteName,
    domain,
    setDomain,
    isValidate,
    setIsValidate,
  } = useListSite();

  const [dataSite, setDataSite] = useState<any[]>([]);

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
  const screenName = 'site';

  function cleanAccessData(key: string) {
    const storedAccessData = sessionStorage.getItem(key);
    if (storedAccessData) {
      try {
        return JSON.parse(storedAccessData);
      } catch (error) {
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
    console.log('Call : [1] FetchData for Site', moment().format('HH:mm:ss:SSS'));

    const fetchData = async () => {
      try {
        await fetchSite(null);
      } catch (error) {
        console.log('Error FetchData Site : ', error);
      }
    };
    fetchData();
  }, []);

  const fetchSite = async (dataset: any) => {
    console.log('Master Site : Master_Site_Get', moment().format('YYYY-MM-DD HH:mm'));

    try {
      const response = await _POST(dataset, "/api_trr_mes/MasterData/Master_Site_Get");

      if (response && response.status === "success") {
        const allBudget = response.data;
        const newData: any = [];

        Array.isArray(allBudget) && allBudget.forEach((site) => {
          site.site_code = site.site_code;
          site.site_name = site.site_name;
          site.fullname = `[${site.site_code}] ${site.site_name}`;

          site.create_date = dateFormatTimeEN(site.create_date, "DD/MM/YYYY HH:mm:ss");
          site.update_date = dateFormatTimeEN(site.update_date, "DD/MM/YYYY HH:mm:ss");

          site.ACTION = null
          site.ACTION = <ActionManageCell onClick={(name) => {
            if (name == 'View') {
              handleClickView(site);
            } else if (name == 'Edit') {
              handleClickEdit(site);
            } else if (name == 'Delete') {
              handleClickDelete(site);
            }
          }}
            Defauft={true}
          />
          newData.push(site);
        });

        setOptions((prevOptions) => ({
          ...prevOptions,
          siteData: newData,
        }));

        setOptionsSearch((prevOptions) => ({
          ...prevOptions,
          siteData: newData,
        }));

        setDataSite(newData);

      } else {
        setError("Failed to fetch master site.");
      }
    } catch (error) {
      console.error('Error Master Site Get :', error);
      setError("An error occurred while fetching master site.");
    }
  }

  const SiteAdd = async () => {
    console.log('Master Site : Master_Site_Add', moment().format('YYYY-MM-DD HH:mm'));

    updateSessionStorageCurrentAccess('event_name', 'Add/Master_Site_Add');

    const dataForValidate = {
      site_code: siteCode,
      site_name: siteName,
      domain: domain,
    }

    console.log("Data validation (Add):", dataForValidate);

    const isValidate = checkValidate(dataForValidate, ['Site']);
    const isValidateAll = isCheckValidateAll(isValidate);

    if (Object.keys(isValidateAll).length > 0 && isValidationEnabled) {
      console.log("Validation errors:", isValidateAll);
      setIsValidate(isValidate);
      return; // return ถ้า validate ไม่ผ่าน
    }
    setIsValidate(null); // ถ้า validate ผ่าน

    confirmModal.createModal("ยืนยันที่จะบันทึกหรือไม่ ?", "info", async () => {
      const payload = {
        SiteModel: [{
          id: uuidv4(),
          site_code: siteCode,
          site_name: siteName,
          domain: domain,
        }],
        currentAccessModel: getCurrentAccessObject(employeeUsername, employeeDomain, screenName)
      }

      console.log('payload SiteModel (Add) : ', payload);

      dispatch(startLoadScreen());
      setTimeout(async () => {
        try {
          console.log("payload model", payload);

          const response = await _POST(payload, "/api_trr_mes/MasterData/Master_Site_Add");

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
            console.error('Failed SiteAdd :', response);

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
          console.log('Error : Master Site Add', e);
          dispatch(endLoadScreen());
        }
      }, 0);
    });
  }

  const SiteEdit = async () => {
    console.log('Master Site : Master_Site_Edit', moment().format('YYYY-MM-DD HH:mm'));

    updateSessionStorageCurrentAccess('event_name', 'Edit/Master_Site_Edit');

    const dataForValidate = {
      site_code: siteCode,
      site_name: siteName,
      domain: domain,
    }

    console.log("Data validation (Edit):", dataForValidate);

    const isValidate = checkValidate(dataForValidate, ['Site']);
    const isValidateAll = isCheckValidateAll(isValidate);

    if (Object.keys(isValidateAll).length > 0 && isValidationEnabled) {
      console.log("Validation errors:", isValidateAll);
      setIsValidate(isValidate);
      return; // return ถ้า validate ไม่ผ่าน
    }
    setIsValidate(null); // ถ้า validate ผ่าน

    confirmModal.createModal("ยืนยันที่จะบันทึกหรือไม่ ?", "info", async () => {
      const payload = {
        SiteModel: [{
          id: id,
          site_code: siteCode,
          site_name: siteName,
          domain: domain,
        }],
        currentAccessModel: getCurrentAccessObject(employeeUsername, employeeDomain, screenName)
      }

      console.log('payload SiteModel (Edit) : ', payload);

      dispatch(startLoadScreen());
      setTimeout(async () => {
        try {
          console.log("payload model", payload);

          const response = await _POST(payload, "/api_trr_mes/MasterData/Master_Site_Edit");

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
            console.error('Failed SiteEdit :', response);

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
          console.log('Error : Master Site Edit', e);
          dispatch(endLoadScreen());
        }
      }, 0);
    });
  }

  const SiteDelete = async () => {
    console.log('Master Site : Master_Site_Delete', moment().format('YYYY-MM-DD HH:mm'));

    updateSessionStorageCurrentAccess('event_name', 'Delete/Master_Site_Delete');

    const dataForValidate = {
      site_code: siteCode,
      site_name: siteName,
      domain: domain,
    }

    console.log("Data validation (Delete):", dataForValidate);

    const isValidate = checkValidate(dataForValidate, ['Site']);
    const isValidateAll = isCheckValidateAll(isValidate);

    if (Object.keys(isValidateAll).length > 0 && isValidationEnabled) {
      console.log("Validation errors:", isValidateAll);
      setIsValidate(isValidate);
      return; // return ถ้า validate ไม่ผ่าน
    }
    setIsValidate(null); // ถ้า validate ผ่าน

    confirmModal.createModal("ยืนยันที่จะบันทึกหรือไม่ ?", "info", async () => {
      const payload = {
        SiteModel: [{
          id: id,
        }],
        currentAccessModel: getCurrentAccessObject(employeeUsername, employeeDomain, screenName)
      }

      console.log('payload SiteModel (Delete) : ', payload);

      dispatch(startLoadScreen());
      setTimeout(async () => {
        try {
          console.log("payload model", payload);

          const response = await _POST(payload, "/api_trr_mes/MasterData/Master_Site_Delete");

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
            console.error('Failed SiteEdit :', response);

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
          console.log('Error : Master Site Delete', e);
          dispatch(endLoadScreen());
        }
      }, 0);
    });
  }

  const handleSearch = () => {
    const dataset = {
      site_code: searchSiteCode?.site_code ? searchSiteCode?.site_code : null,
      site_name: searchSiteName ? searchSiteName : null,
      domain: searchDomain ? searchDomain : null,
    };
    console.log('Call : [3] Dataset : Search', dataset, moment().format('HH:mm:ss:SSS'));
    fetchSite(dataset);
  }

  const handleReset = () => {
    console.log('Call : [4] Dataset : Reset', moment().format('HH:mm:ss:SSS'));
    setSearchSiteCode(null);
    setSearchSiteName("");
    setSearchDomain("");
    fetchSite(null);
  };

  const handleClose = () => {
    setOpenView(false);
    setOpenAdd(false);
    setOpenEdit(false);
    setOpenDelete(false);
    setSiteCode("");
    setSiteName("");
    setDomain("");
    setIsValidate(null);
    fetchSite(null);
  };

  const handleClickAdd = () => {
    console.log('ตอนกดปุ่ม Add : เพิ่มข้อมูล data');
    setOpenAdd(true);
  };

  const handleClickView = (data: any) => {
    console.log('ตอนกดปุ่ม View : ข้อมูล data', data);
    setOpenView(true);

    setSiteCode(data?.site_code);
    setSiteName(data?.site_name);
    setDomain(data?.domain);
  };

  const handleClickEdit = (data: any) => {
    console.log('ตอนกดปุ่ม Edit : ข้อมูล data', data);
    setOpenEdit(true);

    setId(data?.id);
    setSiteCode(data?.site_code);
    setSiteName(data?.site_name);
    setDomain(data?.domain);
  };

  const handleClickDelete = (data: any) => {
    console.log('ตอนกดปุ่ม Delete : ข้อมูล data', data);
    setOpenDelete(true);

    setId(data?.id);
    setSiteCode(data?.site_code);
    setSiteName(data?.site_name);
    setDomain(data?.domain);
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
              filterOptions={filterOptions}
              labelName={"Site"}
              column="fullname"
              value={searchSiteCode}
              options={optionsSearch?.siteData}
              setvalue={handleAutocompleteChange(setSearchSiteCode)}
            />
          </div>
          <div className="col-md-3 mb-2">
            <FullWidthTextField
              labelName={"โรงงาน"}
              value={searchSiteName}
              onChange={(value) => setSearchSiteName(value)}
            />
          </div>
          <div className="col-md-3 mb-2">
            <FullWidthTextField
              labelName={"Domain"}
              value={searchDomain}
              onChange={(value) => setSearchDomain(value)}
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
            rows={dataSite}
            buttonLabal_1={showButton ? "เพิ่มข้อมูล" : ""}
            buttonColor_1="info"
            headCells={Master_Site}
            tableName='บันทึกข้อมูลตั้งค่าโรงงาน'
            handleonClick_1={handleClickAdd}
            roleName={currentUser?.role_name}
          />
        </div>
        <FuncDialog
          open={openAdd}
          dialogWidth="lg"
          openBottonHidden={true}
          handleClose={handleClose}
          titlename="เพิ่มข้อมูล"
          handlefunction={SiteAdd}
          colorBotton="success"
          actions={"Create"}
          element={
            <SiteBody
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
            <SiteBody
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
          handlefunction={SiteEdit}
          colorBotton="success"
          actions={"Update"}
          element={
            <SiteBody
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
          handlefunction={SiteDelete}
          colorBotton="success"
          actions={"Delete"}
          element={
            <SiteBody
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
