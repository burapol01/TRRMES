import React from "react";
import { useEffect, useState } from "react";
import FullWidthTextField from "../../../components/MUI/FullWidthTextField";
import { debounce } from "lodash";
import { ImageList } from "@mui/material";
import { setValueMas } from "../../../../libs/setvaluecallback";
import { daDK } from "@mui/x-date-pickers";
import FullWidthButton from "../../../components/MUI/FullWidthButton";
import * as TableApproveList from "./TableApproveList";
import AutocompleteComboBox from "../../../components/MUI/AutocompleteComboBox";
import { createFilterOptions } from "@mui/material";
import { _GET, _POST } from "../../../service";
import moment from "moment";
import CostCenter from "../../master/cost_center";
import EnhancedTable from "../../../components/MUI/DataTables";
import { Request_headCells } from "../../../../libs/columnname";
import { useSelector } from "react-redux";
import ConfirmModalDialog from "../../../components/MUI/Comfirmmodal";

interface OptionsState {
  costCenterForCreate: any[];
  costCenter: any[];
  serviceCenter: any[];
  jobType: any[];
  budgetCode: any[];
  fixedAssetCode: any[];
  requestStatus: any[];
}

const initialOptions: OptionsState = {
  costCenterForCreate: [],
  costCenter: [],
  serviceCenter: [],
  jobType: [],
  budgetCode: [],
  fixedAssetCode: [],
  requestStatus: [],
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
  requestAttachFileList: [],
};

interface ApprovedListBodyProps {
  onDataChange?: (data: any) => void;
  defaultValues?: {
    requestNo: string;
    requestDate: string;
    requestId?: string;
    reqUser?: string;
    appReqUser?: string;
    costCenterId?: string;
    costCenterCode?: string;
    costCenterName?: string;
    status?: string;
    site?: string;
    countRevision?: string;
    serviceCenterId?: string;
    jobType?: string;
    budgetCode?: string;
    description?: string;
    fixedAssetId?: string;
    fixedAssetDescription?: string;
    rejectSubmitReason?: string;
    rejectStartReason?: string;
    requestAttachFileList?: any[];
  };
  options?: {
    costCenterForCreate: any[];
    costCenter: any[];
    serviceCenter: any[];
    jobType: any[];
    budgetCode: any[];
    fixedAssetCode: any[];
  };
  disableOnly?: boolean;
  actions?: string;
  optionCostCenter?: any[];
  optionServiceCenter?: any[];
  optionFixedAssetCodes?: any[];
  optionRequestStatus?: any[];
  optionJobType?: any[];
  dataList?: any[];
}

export default function ApprovedListBody({
  optionCostCenter,
  optionServiceCenter,
  optionFixedAssetCodes,
  optionRequestStatus,
  
  onDataChange,
  defaultValues,
  dataList,
  disableOnly,
  actions,
}: ApprovedListBodyProps) {
  const [selectedRequestStatus, setSelectedRequestStatus] = useState<any>(null);
  const [selectedAssetCode, setSelectedAssetCode] = useState<any>(null);
  const [selectedJobType, setSelectedJobType] = useState<any>(null);
  const currentUser = useSelector((state: any) => state?.user?.user);
  const [options, setOptions] = useState<OptionsState>(initialOptions);
  // const { isValidate, setIsValidate, isDuplicate, setIsDuplicate } = useListServiceRequest()
  const [optionBudgetCode, setOptionBudgetCode] = useState<any>(
    options?.budgetCode || []
  );
  const [optionFixedAssetCode, setOptionFixedAssetCode] = useState<any>(
    options?.fixedAssetCode || []
  );
  const [requestNo, setRequestNo] = useState(defaultValues?.requestNo || "");
  const [requestDate, setRequestDate] = useState(
    defaultValues?.requestDate || ""
  );
  const [requestId, setRequestId] = useState(defaultValues?.requestId || "");
  const [reqUser, setEmployee] = useState(defaultValues?.reqUser || "");
  const [appReqUser, setheadUser] = useState(defaultValues?.appReqUser || "");
  const [costCenterId, setCostCenterId] = useState(
    defaultValues?.costCenterId || ""
  );
  const [costCenterCode, setCostCenterCode] = useState(
    defaultValues?.costCenterCode || ""
  );
  const [costCenterName, setCostCenterName] = useState(
    defaultValues?.costCenterName || ""
  );
  const [status, setStatus] = useState(defaultValues?.status || "Draft");
  const [serviceCenterId, setServiceCenterId] = useState(
    defaultValues?.serviceCenterId || ""
  );
  const [costCenter, setCostCenter] = useState<any>(null);
  const [serviceCenter, setServiceCenter] = useState<any>(null);
  const [serviceName, setServiceName] = useState("");
  const [site, setSite] = useState(defaultValues?.site || "");
  const [jobType, setJobType] = useState<any>(null);
  const [budgetCode, setBudgetCode] = useState<any>(null);
  const [description, setDescription] = useState("");
  const [fixedAssetCode, setFixedAssetCode] = useState<any>(null);
  const [fixedAssetDescription, setFixedAssetDescription] = useState("");
  const [countRevision, setCountRevision] = useState(
    defaultValues?.countRevision || "1"
  );
  const [actionType, setActionType] = useState<string | null>(null); // Corrected type
  //Test
  const [error, setError] = useState<string | null>(null); // สถานะสำหรับข้อผิดพลาด
  const [optionsSearch, setOptionsSearch] =
    useState<OptionsState>(initialOptions); // State for combobox options
  //const [dataList, setDataList] = useState<any[]>([]);
  const [revisionMaximum, setRevisionMaximum] = useState<any>(null);
  const handleAutocompleteChange =
    (setter: React.Dispatch<React.SetStateAction<any>>) => (value: any) => {
      setter(value);
    };

  useEffect(() => {
    console.log(
      "Call: ✨[1] Search fetch Master Data", moment().format("HH:mm:ss:SSS"));
    const fetchData = async () => {
      await Promise.all([
        searchFetchRequestStatus(), // เรียกใช้ฟังก์ชั่นเพื่อดึงข้อมูล Status จาก LOV
        // fetchRevisionMaximum(),

        //Main หลัก
        fetchCostCenters(),
        // fetchServiceCenters(),
        // fetchJobTypes(),
        // fetchBudgetCodes(), // เรียกใช้ฟังก์ชันเพื่อดึงข้อมูล budget codes
        // fetchFixedAssetCodes(),
      ]);
    };
    fetchData();
  }, []);

  React.useEffect(() => {
    console.log(
      optionCostCenter,
      "optionCostCenteroptionCostCenteroptionCostCenteroptionCostCenteroptionCostCenteroptionCostCenter"
    );

    console.log(
      optionServiceCenter,
      "optionServiceCenteroptionServiceCenteroptionServiceCenter"
    );
  }, []);

  const searchFetchRequestStatus = async () => {
    console.log(
      "Call : searchFetchRequestStatus",
      moment().format("HH:mm:ss:SSS")
    );
    try {
      const dataset = {
        lov_type: "request_status",
      };

      const response = await _POST(
        dataset,
        "/api_trr_mes/LovData/Lov_Data_Get"
      );

      if (response && response.status === "success") {
        // console.log(response, 'Success fetch Request Status');
        const requestStatus = response.data.map((data: any) => ({
          lov_code: data.lov_code,
          lov_name: data.lov1,
          labelRequestStatus: data.lov_code + " (" + data.lov1 + ")",
        }));
        //console.log(requestStatus, 'requestStatus');

        setOptionsSearch((prevOptions) => ({
          ...prevOptions,
          requestStatus: requestStatus,
        }));
      } else {
        setError("Failed to fetch job types.");
      }
    } catch (error) {
      console.error("Error fetching job types:", error);
      setError("An error occurred while fetching job types.");
    }
  };

  const fetchCostCenters = async () => {
    try {
      const response = await _POST(
        CostCenter,
        "/api_trr_mes/MasterData/Cost_Center_Get"
      );
      console.log(response.CostCenter, "response");
      if (response && response.status === "success") {
        const costCenters = response.data.map((CostCenter: any) => ({
          costCenterId: CostCenter.id,
          userAd: CostCenter.user_ad,
          appReqUser: CostCenter.app_req_user,
          costCenterCode: CostCenter.cost_center_code,
          costCenterName: CostCenter.cost_center_name,
          serviceCenterFlag: CostCenter.service_center_flag,
          siteCode: CostCenter.site_code,
          costCenterCodeAndName:
            "[" +
            CostCenter.site_id +
            "]" +
            "[" +
            CostCenter.cost_center_code +
            "]" +
            CostCenter.cost_center_name,
        }));

        setOptions((prevOptions) => ({
          ...prevOptions,
          costCenter: costCenters,
        }));

        setOptionsSearch((prevOptions) => ({
          ...prevOptions,
          costCenter: costCenters,
        }));
      } else {
        setError("Failed to get Cost Centers.");
      }
    } catch (error) {
      console.error("Error getting Cost Centers:", error);
      setError("An error occurred while getting Cost Centers.");
    }
  };

  // ค้นหาข้อมูล
  const handleSearch = () => {
    setActionType("search");
  };

  // รีเซ็ต
  const debouncedOnDataChange = debounce((data: any) => {
    if (typeof onDataChange === "function") {
      onDataChange(data);
    }
  }, 300);

  useEffect(() => {
    const data = {
      requestId,
      requestNo,
      reqUser,
      appReqUser,
      costCenterId,
      costCenterCode,
      costCenterName,
      status,
      serviceCenterId,
      costCenter,
      serviceCenter,
      serviceName,
      site,
      jobType,
      budgetCode,
      description,
      fixedAssetCode,
      fixedAssetDescription,
      countRevision,
    };

    debouncedOnDataChange(data);
  }, [
    requestId,
    requestNo,
    requestDate,
    reqUser,
    costCenterId,
    costCenterCode,
    costCenterName,
    status,
    serviceCenterId,
    costCenter,
    serviceCenter,
    serviceName,
    site,
    jobType,
    budgetCode,
    description,
    fixedAssetCode,
    fixedAssetDescription,
    countRevision,
    onDataChange,
  ]);

  //   React.useEffect(() => {
  //     console.log(defaultValues, "defaultValues");
  //     if (actions != "Create") {
  //       // console.log(options?.costCenter, 'dd')

  //       if (defaultValues?.costCenterId != "") {
  //         const mapCostCenterData = setValueMas(
  //           options?.costCenter,
  //           defaultValues?.costCenterId,
  //           "costCenterId"
  //         );
  //         // console.log(mapCostCenterData, 'mapCostCenterData')
  //         setCostCenter(mapCostCenterData);
  //       }

  //       if (defaultValues?.serviceCenterId != "") {
  //         const mapCostCenterData = setValueMas(
  //           options?.serviceCenter,
  //           defaultValues?.serviceCenterId,
  //           "costCenterId"
  //         );
  //         // console.log(mapCostCenterData, )
  //       }
  //       if (defaultValues?.jobType != "") {
  //         const mapJobTypeData = setValueMas(
  //           options?.jobType,
  //           defaultValues?.jobType,
  //           "lov_code"
  //         );
  //         //console.log(mapJobTypeData, 'mapJobTypeData')
  //         setJobType(mapJobTypeData);
  //       }

  //       if (defaultValues?.budgetCode != "") {
  //         const mapBudgetData = setValueMas(
  //           options?.budgetCode,
  //           defaultValues?.budgetCode,
  //           "budgetId"
  //         );
  //         //console.log(mapBudgetData, 'mapBudgetData')
  //         setBudgetCode(mapBudgetData);
  //       }

  //       if (defaultValues?.status != "") {
  //         setStatus(defaultValues?.status || "");
  //       }

  //       if (defaultValues?.countRevision != "") {
  //         setCountRevision(defaultValues?.countRevision || "");
  //       }

  //       if (defaultValues?.description != "") {
  //         setDescription(defaultValues?.description || "");
  //       }

  //       if (defaultValues?.fixedAssetId != "") {
  //         const mapfixedAssetData = setValueMas(
  //           options?.fixedAssetCode,
  //           defaultValues?.fixedAssetId,
  //           "assetCodeId"
  //         );
  //         //console.log(defaultValues?.fixedAssetId, 'mapfixedAssetData')
  //         setFixedAssetCode(mapfixedAssetData);
  //       }

  //       if (defaultValues?.appReqUser != "") {
  //         //console.log(defaultValues?.fixedAssetId, 'mapfixedAssetData')
  //         setheadUser(defaultValues?.appReqUser || "");
  //       }
  //     }
  //   }, [defaultValues, options?.fixedAssetCode]);
  return (
    <div>
      <div className="max-lg rounded overflow-hidden shadow-s bg-white mt-5 mb-5">
        <div className="px-6 pt-4">
          <label className="text-2xl ml-2 mt-3 mb-5 sarabun-regular">
            ค้นหาข้อมูล
          </label>
        </div>
        <div className="row px-10 pt-0 pb-5">
          <div className="col-md-3 mb-2">
            <FullWidthTextField
              labelName={"เลขที่ใบคำขอ"}
              value={requestNo}
              onChange={(value) => setRequestNo(value)}
            />
          </div>
          <div className="col-md-3 mb-2">
            <AutocompleteComboBox
              //filterOptions={filterOptions}
              required={""}
              labelName={"Cost Center"}
              column="costCentersCodeAndName"
              value={costCenter}
              setvalue={handleAutocompleteChange(setCostCenter)}
              options={optionCostCenter}
            />
          </div>
          <div className="col-md-3 mb-2">
            <AutocompleteComboBox
              //filterOptions={filterOptions}
              required={""}
              labelName={"Service Center"}
              column="serviceCentersCodeAndName"
              value={serviceCenter}
              setvalue={handleAutocompleteChange(setServiceCenter)}
              options={optionServiceCenter}
            />
          </div>
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
              //filterOptions={filterOptions}
              value={selectedAssetCode}
              labelName={"Fixed Asset Code"}
              options={optionFixedAssetCodes}
              column="assetCodeAndDescription"
              setvalue={handleAutocompleteChange(setSelectedAssetCode)}
            />
          </div>
          <div className="col-md-3 mb-2">
            <AutocompleteComboBox
              value={selectedRequestStatus}
              labelName={"สถานะ"}
              // options={optionsSearch?.requestStatus}
              options={optionRequestStatus}
              column="labelRequestStatus"
              setvalue={handleAutocompleteChange(setSelectedRequestStatus)}
            />
          </div>
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
              handleonClick={handleSearch}
              variant_text="contained"
              colorname={"inherit"}
            />
          </div>
        </div>
      </div>
      <div className="flex justify-end pt-2">
        <EnhancedTable
          rows={dataList}
          buttonLabal_1={""} // Show button label only if "Add" is found
          buttonColor_1="info"
          headCells={Request_headCells}
          tableName={"บันทึกขอใช้บริการ"}
          handleonClick_1={() => ({})}
          buttonLabal_2={""} // Show button label only if "Add" is found
          buttonColor_2="info"
          handleonClick_2={() => ({})}
          roleName={currentUser?.role_name}
          setDataSelect={() => {}}
        />
      </div>
    </div>
  );
}
