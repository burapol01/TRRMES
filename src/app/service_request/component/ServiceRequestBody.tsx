import React, { useState, useEffect } from "react";
import FullWidthTextField from "../../../components/MUI/FullWidthTextField";
import AutocompleteComboBox from "../../../components/MUI/AutocompleteComboBox";
import FullWidthTextareaField from "../../../components/MUI/FullWidthTextareaField";
import debounce from 'lodash/debounce';
import { setValueList, setValueMas } from "../../../../libs/setvaluecallback"

interface ServiceRequestBodyProps {
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
    rejectSubmitReason?: string,
    rejectStartReason?: string,
  };
  options?: {
    costCenter: any[];
    serviceCenter: any[];
    jobType: any[];
    budgetCode: any[];
    fixedAssetCode: any[];
  };
  disableOnly?: boolean;
  actions?: string;
}

export default function ServiceRequestBody({
  onDataChange,
  defaultValues,
  options,
  disableOnly,
  actions
}: ServiceRequestBodyProps) {
  const [optionBudgetCode, setOptionBudgetCode] = useState<any>(options?.budgetCode || []);
  const [optionFixedAssetCode, setOptionFixedAssetCode] = useState<any>(options?.fixedAssetCode || []);
  const [requestNo, setRequestNo] = useState(defaultValues?.requestNo || "");
  const [requestDate, setRequestDate] = useState(defaultValues?.requestDate || "");
  const [requestId, setRequestId] = useState(defaultValues?.requestId || "");
  const [reqUser, setEmployee] = useState(defaultValues?.reqUser || "");
  const [appReqUser, setheadUser] = useState(defaultValues?.appReqUser || "");
  const [costCenterId, setCostCenterId] = useState(defaultValues?.costCenterId || "");
  const [costCenterCode, setCostCenterCode] = useState(defaultValues?.costCenterCode || "");
  const [costCenterName, setCostCenterName] = useState(defaultValues?.costCenterName || "");
  const [status, setStatus] = useState(defaultValues?.status || "Draft");
  const [serviceCenterId, setServiceCenterId] = useState(defaultValues?.serviceCenterId || "");
  const [costCenter, setCostCenter] = useState<any>(null);
  const [serviceCenter, setServiceCenter] = useState<any>(null);
  const [serviceName, setServiceName] = useState("");
  const [site, setSite] = useState(defaultValues?.site || "");
  const [jobType, setJobType] = useState<any>(null);
  const [budgetCode, setBudgetCode] = useState<any>(null);
  const [description, setDescription] = useState("");
  const [fixedAssetCode, setFixedAssetCode] = useState<any>(null);
  const [fixedAssetDescription, setFixedAssetDescription] = useState("");
  const [countRevision, setCountRevision] = useState(defaultValues?.countRevision || "1");

  const [rejectSubmitReason, setRejectSubmitReason] = useState(defaultValues?.rejectSubmitReason || "");
  const [rejectStartReason, setRejectStartReason] = useState(defaultValues?.rejectStartReason || "");


  // Function to handle data change with debounce
  const debouncedOnDataChange = debounce((data: any) => {
    if (typeof onDataChange === 'function') {
      onDataChange(data);
    }
  }, 300); // Adjust debounce delay as needed

  // useEffect to send data change to parent component
  useEffect(() => {
    const data = {
      requestId,
      requestNo,
      requestDate,
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
      countRevision
    };
    // Call debounced function
    debouncedOnDataChange(data);
  }, [
    requestId, requestNo, requestDate, reqUser, appReqUser, costCenterId, costCenterCode, costCenterName,
    status, serviceCenterId, costCenter, serviceCenter, serviceName, site, jobType, budgetCode, description,
    fixedAssetCode, fixedAssetDescription,
    countRevision, onDataChange,
  ]);

  React.useEffect(() => {

    if (actions != "Create") {

      console.log(options?.costCenter, 'dd')
      console.log(defaultValues?.costCenterId, 'costCenterId')

      if (defaultValues?.costCenterId != "") {
        const mapCostCenterData = setValueMas(options?.costCenter, defaultValues?.costCenterId, 'costCenterId')
        //console.log(mapCostCenterData, 'mapCostCenterData')
        setCostCenter(mapCostCenterData)
      }

      if (defaultValues?.serviceCenterId != "") {
        const mapCostCenterData = setValueMas(options?.serviceCenter, defaultValues?.serviceCenterId, 'serviceCenterId')
        // console.log(mapCostCenterData, 'mapCostCenterData')
        setServiceCenter(mapCostCenterData)
        setServiceName(mapCostCenterData?.serviceCenterName)
      }

      if (defaultValues?.jobType != "") {
        const mapJobTypeData = setValueMas(options?.jobType, defaultValues?.jobType, 'lov_code')
        //console.log(mapJobTypeData, 'mapJobTypeData')
        setJobType(mapJobTypeData)
      }

      if (defaultValues?.budgetCode != "") {
        const mapBudgetData = setValueMas(options?.budgetCode, defaultValues?.budgetCode, 'budgetId')
        //console.log(mapBudgetData, 'mapBudgetData')
        setBudgetCode(mapBudgetData)


      }

      if (defaultValues?.status != "") {
        setStatus(defaultValues?.status || "")
      }

      if (defaultValues?.countRevision != "") {
        setCountRevision(defaultValues?.countRevision || "")

      }
      if (defaultValues?.description != "") {
        setDescription(defaultValues?.description || "")

      }

      if (defaultValues?.fixedAssetId != "") {
        const mapfixedAssetData = setValueMas(options?.fixedAssetCode, defaultValues?.fixedAssetId, 'assetCodeId')
        //console.log(defaultValues?.fixedAssetId, 'mapfixedAssetData')
        setFixedAssetCode(mapfixedAssetData)
        setFixedAssetDescription(mapfixedAssetData?.assetDescription)

      }

      if (defaultValues?.appReqUser != "") {
        //console.log(defaultValues?.appReqUser, 'appReqUser')
        setheadUser(defaultValues?.appReqUser || "");
      }

    }


  }, [defaultValues])


  //วิธี กรองข้อมูลแบบ เชื่อมความสัมพันธ์
  React.useEffect(() => {
    const filteredData = options?.budgetCode.filter((item: any) =>
      (!costCenter?.costCenterId || item.costCenterId
        .toString()
        .includes(costCenter?.costCenterId)) &&
      (!jobType?.lov_code || item.jobType
        .toString()
        .includes(jobType?.lov_code))

    );
console.log(filteredData, 'filteredData');
    //ใส่ useState ใหม่ 
    setOptionBudgetCode(filteredData);

    const filterFixedAssetCode = options?.fixedAssetCode.filter((item: any) =>
    (!costCenter?.costCenterId || item.costCenterId
      .toString()
      .includes(costCenter?.costCenterId || costCenter))
    );

    //ใส่ useState ใหม่ 
    setOptionFixedAssetCode(filterFixedAssetCode)
    //console.log(filterFixedAssetCode, 'filterFixedAssetCode');
  }, [costCenter, jobType])



  return (
    <div>
      <div className="row justify-start">
        <div className="col-md-3 mb-2">
          <FullWidthTextField
            labelName={"Request No."}
            value={requestNo}
            onChange={(value) => setRequestNo(value)}
            disabled={actions === "Create" || actions === "Update" ? true : disableOnly}
            hidden={actions === "Create" ? true : false}
          />
        </div>
        {actions !== "Create" && (
          <div className="col-md-3 mb-2">
            <FullWidthTextField
              labelName={"Date"}
              value={requestDate}
              onChange={(value) => setRequestDate(value)}
              disabled={actions === "Create" || actions === "Update" ? true : disableOnly}
              hidden={actions === "Create" ? true : false}
            />
          </div>
        )}
      </div>
      <div className="row justify-start">

        <div className="col-md-3 mb-2">
          <FullWidthTextField
            labelName={"Employee"}
            value={reqUser}
            onChange={(value) => setEmployee(value)}
            disabled={actions === "Create" || actions === "Update" ? true : disableOnly}
          />
        </div>
        <div className="col-md-3 mb-2">
          <AutocompleteComboBox
            required={"required"}
            labelName={"Cost center"}
            column="costCentersCodeAndName"
            value={costCenter}
            disabled={disableOnly}
            setvalue={(data) => {
              setCostCenter(data);
              setJobType(null)
              setBudgetCode(null)
              setFixedAssetCode(null)
            }}
            options={options?.costCenter || []}
          />
          {/* <FullWidthTextField
            labelName={"Cost center"}
            value={costCenterName + " [" + costCenterCode + "]"}
            onChange={(value) => setCostCenter(value)}
            disabled={actions === "Create" || actions === "Update" ? true : disableOnly}

          /> */}
        </div>
        <div className="col-md-3 mb-2">
          <FullWidthTextField
            labelName={"Site"}
            value={site}
            disabled={actions === "Create" || actions === "Update" ? true : disableOnly}
            onChange={(value) => setSite(value)}
          />
        </div>
        <div className="col-md-3 mb-2">
          <FullWidthTextField
            labelName={"Status"}
            value={status}
            disabled={actions === "Create" || actions === "Update" ? true : disableOnly}
            onChange={(value) => setStatus(value)}
          />
        </div>
        <div className="col-md-3 mb-2">
          <FullWidthTextField
            labelName={"CountRevision"}
            value={countRevision}
            onChange={(value) => setCountRevision(value)}
            hidden={true}
            disabled={disableOnly}
          />
        </div>
      </div>
      <div className="row justify-start">
        <div className="col-md-3 mb-2">
          <AutocompleteComboBox
            required={"required"}
            labelName={"Service Center"}
            column="serviceCentersCodeAndName"
            value={serviceCenter}
            disabled={disableOnly}
            setvalue={(data) => {
              setServiceCenter(data);
              setServiceName(data?.serviceCenterName || ""); // Clear serviceName if data is null
            }}
            options={options?.serviceCenter || []}
          />
        </div>
        <div className="col-md-3 mb-2">
          <FullWidthTextField
            labelName={"Service Name"}
            value={serviceName}
            disabled={actions === "Create" || actions === "Update" ? true : disableOnly}
            onChange={(value) => setServiceName(value)}
          />
        </div>
        <div className="col-md-3 mb-2">
          <AutocompleteComboBox
            required={"required"}
            labelName={"Jobtype"}
            column="lov_name"
            value={jobType}
            setvalue={(data) => {
              //console.log(data, "job");
              setJobType(data)
              setBudgetCode(null)
            }}
            disabled={disableOnly}
            options={options?.jobType || []}
          />
        </div>
        <div className="col-md-3 mb-2">
          <AutocompleteComboBox
            required={"required"}
            labelName={"Budget Code"}
            column="budgetCodeAndJobType"
            value={budgetCode}
            setvalue={setBudgetCode}
            disabled={disableOnly}
            options={optionBudgetCode}
          />
        </div>
      </div>
      <div className="row justify-start">
        <div className="col-md-3 mb-2">
          <AutocompleteComboBox
            required={"required"}
            labelName={"Fixed Asset Code"}
            column="assetCode"
            value={fixedAssetCode}
            disabled={disableOnly}
            setvalue={(data) => {
              // console.log(data,'data');
              setFixedAssetCode(data);
              setFixedAssetDescription(data?.assetDescription || "");
            }}
            options={optionFixedAssetCode || []}
          />
        </div>
        <div className="col-md-9 mb-2">
          <FullWidthTextareaField
            labelName={"Fixed Asset Description"}
            value={fixedAssetDescription}
            disabled={actions === "Create" || actions === "Update" ? true : disableOnly}
            multiline={false}
            onChange={(value) => setFixedAssetDescription(value)}
          />
        </div>
      </div>
      <div className="row justify-start">
        <div className="col-md-12 mb-2">
          <FullWidthTextareaField
            labelName={"Description"}
            value={description}
            disabled={disableOnly}
            multiline={true}
            onChange={(value) => setDescription(value)}
          />
        </div>
      </div>
      {/* ช่อง เหตุผล Reject ================================================ */}
      {rejectSubmitReason !== "" && (
        <div className="row justify-start">
          <div className="col-md-12 mb-2">
            <FullWidthTextareaField
              labelName={"Reject Submit Reason"}
              value={rejectSubmitReason}
              disabled={actions === "Create" || actions === "Update" ? true : disableOnly}
              multiline={true}
              onChange={(value) => setRejectSubmitReason(value)}
            />
          </div>
        </div>
      )}
      {rejectStartReason !== "" && (
        <div className="row justify-start">
          <div className="col-md-12 mb-2">
            <FullWidthTextareaField
              labelName={"Reject Start Reason"}
              value={rejectStartReason}
              disabled={actions === "Create" || actions === "Update" ? true : disableOnly}
              multiline={true}
              onChange={(value) => setRejectStartReason(value)}
            />
          </div>
        </div>
      )}
    </div>

  );
}
