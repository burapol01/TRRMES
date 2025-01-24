import React, { useMemo } from "react";
import { useEffect, useState } from "react";
import FullWidthTextField from "../../../components/MUI/FullWidthTextField";
import { debounce } from "lodash";
import FullWidthButton from "../../../components/MUI/FullWidthButton";
import AutocompleteComboBox from "../../../components/MUI/AutocompleteComboBox";
import { _GET, _POST } from "../../../service";
import EnhancedTable from "../../../components/MUI/DataTables";
import { RequestApprovedListAll_headCells } from "../../../../libs/columnname";
import { useSelector } from "react-redux";
import moment from "moment";
import { createFilterOptions } from "@mui/material";

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


interface ApprovedListBodyProps {
  onDataChange?: (data: any) => void;
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
  dataList?: any[];
}

export default function ApprovedListBody({
  onDataChange,
  options,
  dataList,
  disableOnly,
  actions,
}: ApprovedListBodyProps) {

  //Drop Down ที่ต้องใช้
  const [optionFixedAssetCode, setOptionFixedAssetCode] = useState<any>(options?.fixedAssetCode || []);
  const [optionBudgetCode, setOptionBudgetCode] = useState<any>([]);
  const [optionsSearch, setOptionsSearch] = useState<OptionsState>(initialOptions); // State for combobox options

  //Parameter values 
  const [requestNo, setRequestNo] = useState("");
  const [costCenter, setCostCenter] = useState<any>(null);
  const [serviceCenter, setServiceCenter] = useState<any>(null);
  const [jobType, setJobType] = useState<any>(null);
  const [budgetCode, setBudgetCode] = useState<any>(null);
  const [fixedAssetCode, setFixedAssetCode] = useState<any>(null);
  const filteredDefaultData = useMemo(
    () => dataList?.filter((item) => item.req_status === "Submit") || [],
    [dataList]
  );
  const [filteredNewData, setFilteredNewData] = useState<any>(filteredDefaultData);
  

  //System properties
  const currentUser = useSelector((state: any) => state?.user?.user);
  const [actionType, setActionType] = useState<string | null>(null); // Corrected type
  const [error, setError] = useState<string | null>(null); // สถานะสำหรับข้อผิดพลาด 
  const handleAutocompleteChange = (setter: React.Dispatch<React.SetStateAction<any>>) => (value: any) => { setter(value); };
  const [dataSelect, setDataSelect] = React.useState([]);

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


  //Master Data Cost Center And Service Center
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

  const OPTIONS_LIMIT = 100;
  const defaultFilterOptions = createFilterOptions();

  const filterOptions = (optionsSearch: any[], state: any) => {
    //console.log(defaultFilterOptions(optionsSearch, state).slice(0, OPTIONS_LIMIT),'test');

    return defaultFilterOptions(optionsSearch, state).slice(0, OPTIONS_LIMIT);
  };

  // ค้นหาข้อมูล
  const handleSearch = () => {
    setActionType("search");
  
    if (!dataList || !Array.isArray(dataList)) {
      console.warn("⚠️ dataList is empty or invalid.");
      return;
    }
  
    console.log("🔍 Searching with:", { requestNo, costCenter, serviceCenter, jobType, fixedAssetCode });
  
    const filtered = dataList.filter((item: any) =>
      item.req_status === "Submit" &&
      (!requestNo || String(item.req_no).includes(requestNo)) &&
      (!costCenter || item.cost_center_id === costCenter?.costCenterId) &&
      (!serviceCenter || item.service_center_id === serviceCenter?.serviceCenterId) &&
      (!jobType || item.job_type === jobType?.lov_code) &&
      (!fixedAssetCode || item.fixed_asset_id === fixedAssetCode?.assetCodeId)
    );
  
    console.log("✅ Filtered Data:", filtered);
    setFilteredNewData(filtered);
  };
  
  
  

  // รีเซ็ต
  const handleReset = () => {
    setRequestNo("");
    setCostCenter(null);
    setServiceCenter(null);
    setJobType(null);
    setBudgetCode(null);
    setFixedAssetCode(null);
    setFilteredNewData(filteredDefaultData);
  
    console.log("🔄 Reset filters");
  };
  
  const debouncedOnDataChange = debounce((data: any) => {
    if (typeof onDataChange === "function") {
      onDataChange(data);
    }
  }, 300);

  useEffect(() => {
    const data = {
      dataSelect
    };

    debouncedOnDataChange(data);
  }, [
    dataSelect,
    onDataChange,
  ]);

  useEffect(() => {

    console.log(dataSelect, 'dataSelect');
  }, [dataSelect]);


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
              required={"required"}
              labelName={"Cost Center"}
              column="costCentersCodeAndName"
              value={costCenter}
              setvalue={handleAutocompleteChange(setCostCenter)}
              options={optionsSearch?.costCenter}
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
              options={optionsSearch?.serviceCenter}
            />
          </div>
          <div className="col-md-3 mb-2">
            <AutocompleteComboBox
              value={jobType}
              labelName={"ประเภทงาน"}
              options={options?.jobType}
              column="lov_name"
              setvalue={handleAutocompleteChange(setJobType)}
            />
          </div>
          <div className="col-md-3 mb-2">
            <AutocompleteComboBox
              filterOptions={filterOptions}
              //required={"required"}
              labelName={"Fixed Asset Code"}
              column="assetCodeAndDescription"
              disabled={disableOnly}
              setvalue={(data) => {
                // console.log(data,'data');
                setFixedAssetCode(data);
                //setFixedAssetDescription(data?.assetDescription || "");
              }}
              value={fixedAssetCode}
              options={optionFixedAssetCode || []} //ตัวนี้คือผูกความสัมพันธ์กับ Cost Center
            //options={options?.fixedAssetCode || []}
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
              handleonClick={handleReset}
              variant_text="contained"
              colorname={"inherit"}
            />
          </div>
        </div>
      </div>
      <div className="flex justify-end pt-2">
        <EnhancedTable
          rows={filteredNewData}
          buttonColor_1="info"
          headCells={RequestApprovedListAll_headCells}
          tableName={"บันทึกขอใช้บริการ"}
          roleName={currentUser?.role_name}
          setDataSelect={setDataSelect}
        />
      </div>
    </div>
  );
}
