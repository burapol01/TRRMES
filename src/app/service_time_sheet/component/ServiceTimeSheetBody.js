import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useState, useEffect } from "react";
import FullWidthTextField from "../../../components/MUI/FullWidthTextField";
import AutocompleteComboBox from "../../../components/MUI/AutocompleteComboBox";
import FullWidthTextareaField from "../../../components/MUI/FullWidthTextareaField";
import debounce from 'lodash/debounce';
import { setValueList, setValueMas } from "../../../../libs/setvaluecallback";
import TimeSheetBody from "./TimeSheetBody";
export default function ServiceTimeSheetBody({ onDataChange, defaultValues, options, disableOnly, actions }) {
    const [optionServiceCenter, setOptionServiceCenter] = useState(options?.serviceCenter || []);
    const [optionBudgetCode, setOptionBudgetCode] = useState(options?.budgetCode || []);
    const [optionFixedAssetCode, setOptionFixedAssetCode] = useState(options?.fixedAssetCode || []);
    const [optionRevision, setOptionRevision] = useState(options?.revision || []);
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
    const [costCenter, setCostCenter] = useState(null);
    const [serviceCenter, setServiceCenter] = useState(null);
    const [serviceName, setServiceName] = useState("");
    const [site, setSite] = useState(defaultValues?.site || "");
    const [jobType, setJobType] = useState(null);
    const [budgetCode, setBudgetCode] = useState(null);
    const [description, setDescription] = useState("");
    const [fixedAssetCode, setFixedAssetCode] = useState(null);
    const [fixedAssetDescription, setFixedAssetDescription] = useState("");
    const [countRevision, setCountRevision] = useState(defaultValues?.countRevision || "1");
    const [revisionCurrent, setRevisionCurrent] = useState(null);
    const [timeSheetData, settimeSheetData] = useState(null); // State to store draft data  
    const [rejectSubmitReason, setRejectSubmitReason] = useState(defaultValues?.rejectSubmitReason || "");
    const [rejectStartReason, setRejectStartReason] = useState(defaultValues?.rejectStartReason || "");
    const handleDataChange = (data) => {
        settimeSheetData(data); // Store draft data
    };
    // Function to handle data change with debounce
    const debouncedOnDataChange = debounce((data) => {
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
            countRevision,
            revisionCurrent,
            timeSheetData
        };
        // Call debounced function
        debouncedOnDataChange(data);
    }, [
        requestId, requestNo, requestDate, reqUser, appReqUser, costCenterId, costCenterCode, costCenterName,
        status, serviceCenterId, costCenter, serviceCenter, serviceName, site, jobType, budgetCode, description,
        fixedAssetCode, fixedAssetDescription,
        countRevision, revisionCurrent, timeSheetData, onDataChange,
    ]);
    React.useEffect(() => {
        if (actions != "Create") {
            console.log(options?.costCenter, 'dd');
            console.log(defaultValues?.costCenterId, 'costCenterId');
            if (defaultValues?.costCenterId != "") {
                const mapCostCenterData = setValueMas(options?.costCenter, defaultValues?.costCenterId, 'costCenterId');
                //console.log(mapCostCenterData, 'mapCostCenterData')
                setCostCenter(mapCostCenterData);
            }
            if (defaultValues?.serviceCenterId != "") {
                const mapCostCenterData = setValueMas(options?.serviceCenter, defaultValues?.serviceCenterId, 'serviceCenterId');
                // console.log(mapCostCenterData, 'mapCostCenterData')
                setServiceCenter(mapCostCenterData);
                setServiceName(mapCostCenterData?.serviceCenterName);
            }
            if (defaultValues?.jobType != "") {
                const mapJobTypeData = setValueMas(options?.jobType, defaultValues?.jobType, 'lov_code');
                //console.log(mapJobTypeData, 'mapJobTypeData')
                setJobType(mapJobTypeData);
            }
            if (defaultValues?.budgetCode != "") {
                const mapBudgetData = setValueMas(options?.budgetCode, defaultValues?.budgetCode, 'budgetId');
                //console.log(mapBudgetData, 'mapBudgetData')
                setBudgetCode(mapBudgetData);
            }
            if (defaultValues?.status != "") {
                setStatus(defaultValues?.status || "");
            }
            if (defaultValues?.countRevision != "") {
                setCountRevision(defaultValues?.countRevision || "");
            }
            if (defaultValues?.description != "") {
                setDescription(defaultValues?.description || "");
            }
            if (defaultValues?.fixedAssetId != "") {
                const mapfixedAssetData = setValueMas(options?.fixedAssetCode, defaultValues?.fixedAssetId, 'assetCodeId');
                //console.log(defaultValues?.fixedAssetId, 'mapfixedAssetData')
                setFixedAssetCode(mapfixedAssetData);
                //setFixedAssetDescription(mapfixedAssetData?.assetDescription)
            }
            if (defaultValues?.appReqUser != "") {
                //console.log(defaultValues?.appReqUser, 'appReqUser')
                setheadUser(defaultValues?.appReqUser || "");
            }
            if (defaultValues?.requestId != "") {
                //console.log(options?.revision, 'revision')
                console.log(defaultValues?.requestId, 'requestId');
                const mapRevisionData = setValueList(options?.revision, defaultValues?.requestId, 'reqId');
                //console.log(mapRevisionData, 'mapRevisionData')
                if (mapRevisionData.length > 0) {
                    setOptionRevision(mapRevisionData);
                    setRevisionCurrent(mapRevisionData[0]);
                    // console.log(revisionCurrent, "revisionCurrent");
                }
                else {
                    setOptionRevision([]);
                }
            }
        }
    }, [defaultValues]);
    //วิธี กรองข้อมูลแบบ เชื่อมความสัมพันธ์
    React.useEffect(() => {
        const filteredData = options?.budgetCode.filter((item) => (!costCenter?.costCenterId || item.costCenterId
            .toString()
            .includes(costCenter?.costCenterId)) &&
            (!jobType?.lov_code || item.jobType
                .toString()
                .includes(jobType?.lov_code)));
        //console.log(filteredData, 'filteredData');
        //ใส่ useState ใหม่ 
        setOptionBudgetCode(filteredData);
        const filterFixedAssetCode = options?.fixedAssetCode.filter((item) => (!costCenter?.costCenterId || item.costCenterId
            .toString()
            .includes(costCenter?.costCenterId || costCenter)));
        //ใส่ useState ใหม่ 
        setOptionFixedAssetCode(filterFixedAssetCode);
        //console.log(filterFixedAssetCode, 'filterFixedAssetCode');
        const filterServiceCenter = options?.serviceCenter.filter((item) => (!costCenter?.siteCode || item.siteCode
            .toString()
            .includes(costCenter?.siteCode || costCenter)));
        setOptionServiceCenter(filterServiceCenter);
    }, [costCenter, jobType]);
    return (_jsxs("div", { children: [_jsxs("div", { className: "row justify-start", children: [_jsx("div", { className: "col-md-3 mb-2", children: _jsx(FullWidthTextField, { labelName: "เลขที่ใบคำขอ", value: requestNo, onChange: (value) => setRequestNo(value), disabled: actions === "Create" || actions === "Update" ? true : disableOnly, hidden: actions === "Create" ? true : false }) }), actions !== "Create" && (_jsx("div", { className: "col-md-3 mb-2", children: _jsx(FullWidthTextField, { labelName: "วันที่สร้างใบคำขอ", value: requestDate, onChange: (value) => setRequestDate(value), disabled: actions === "Create" || actions === "Update" ? true : disableOnly, hidden: actions === "Create" ? true : false }) }))] }), _jsxs("div", { className: "row justify-start", children: [_jsx("div", { className: "col-md-3 mb-2", children: _jsx(FullWidthTextField, { labelName: "พนักงาน", value: reqUser, onChange: (value) => setEmployee(value), disabled: actions === "Create" || actions === "Update" ? true : disableOnly }) }), _jsx("div", { className: "col-md-3 mb-2", children: _jsx(AutocompleteComboBox, { required: "required", labelName: "Cost center", column: "costCentersCodeAndName", value: costCenter, disabled: disableOnly, setvalue: (data) => {
                                setCostCenter(data);
                                setSite(data?.siteCode || "");
                                setServiceCenter(null);
                                setServiceName("");
                                setJobType(null);
                                setBudgetCode(null);
                                setFixedAssetCode(null);
                                //setFixedAssetDescription("")
                            }, options: options?.costCenter || [] }) }), _jsx("div", { className: "col-md-3 mb-2", children: _jsx(FullWidthTextField, { labelName: "Site", value: site, disabled: actions === "Create" || actions === "Update" ? true : disableOnly, onChange: (value) => setSite(value) }) }), _jsx("div", { className: "col-md-3 mb-2", children: _jsx(FullWidthTextField, { labelName: "สถานะ", value: status, disabled: actions === "Create" || actions === "Update" ? true : disableOnly, onChange: (value) => setStatus(value) }) }), _jsx("div", { className: "col-md-3 mb-2", children: _jsx(FullWidthTextField, { labelName: "CountRevision", value: countRevision, onChange: (value) => setCountRevision(value), hidden: true, disabled: disableOnly }) })] }), _jsxs("div", { className: "row justify-start", children: [_jsx("div", { className: "col-md-12 mb-2", children: _jsx(AutocompleteComboBox, { required: "required", labelName: "Service Center", column: "serviceCentersCodeAndName", value: serviceCenter, disabled: disableOnly, setvalue: (data) => {
                                setServiceCenter(data);
                                //setServiceName(data?.serviceCenterName || ""); // Clear serviceName if data is null
                            }, options: optionServiceCenter || [] }) }), _jsx("div", { className: "col-md-2 mb-2", children: _jsx(AutocompleteComboBox, { required: "required", labelName: "ประเภทงาน", column: "lov_name", value: jobType, setvalue: (data) => {
                                //console.log(data, "job");
                                setJobType(data);
                                setBudgetCode(null);
                            }, disabled: disableOnly, options: options?.jobType || [] }) }), _jsx("div", { className: "col-md-10 mb-2", children: _jsx(AutocompleteComboBox, { required: "required", labelName: "Budget Code", column: "budgetCodeAndJobType", value: budgetCode, setvalue: setBudgetCode, disabled: disableOnly, options: optionBudgetCode }) })] }), _jsx("div", { className: "row justify-start", children: _jsx("div", { className: "col-md-12 mb-2", children: _jsx(AutocompleteComboBox, { required: "required", labelName: "Fixed Asset Code", column: "assetCodeAndDescription", value: fixedAssetCode, disabled: disableOnly, setvalue: (data) => {
                            // console.log(data,'data');              
                            setFixedAssetCode(data);
                            //setFixedAssetDescription(data?.assetDescription || "");
                        }, options: optionFixedAssetCode || [] }) }) }), _jsxs("div", { className: "row justify-start", children: [_jsx("div", { className: "col-md-12 mb-2", children: _jsx(FullWidthTextareaField, { labelName: "รายละเอียด", value: description, disabled: disableOnly, multiline: true, onChange: (value) => setDescription(value) }) }), rejectSubmitReason !== "" && (_jsx("div", { className: "row justify-start", children: _jsx("div", { className: "col-md-12 mb-2", children: _jsx(FullWidthTextareaField, { labelName: "เหตุผลปฎิเสธการส่งข้อมูล", value: rejectSubmitReason, disabled: disableOnly, multiline: true, onChange: (value) => setRejectSubmitReason(value) }) }) })), rejectStartReason !== "" && (_jsx("div", { className: "row justify-start", children: _jsx("div", { className: "col-md-12 mb-2", children: _jsx(FullWidthTextareaField, { labelName: "เหตุผลในการปฎิเสธเริ่มงาน", value: rejectStartReason, disabled: disableOnly, multiline: true, onChange: (value) => setRejectStartReason(value) }) }) })), actions != "AcceptJob" && (_jsxs(_Fragment, { children: [_jsx("div", { className: "col-md-3 mb-2", children: _jsx(AutocompleteComboBox, { labelName: "Revision", column: "revisionNo", value: revisionCurrent, setvalue: setRevisionCurrent, disabled: actions === "Reade" ? false : disableOnly, options: optionRevision || [], orchange: (value) => setRevisionCurrent(value) }) }), _jsx("div", { className: "col-md-12 mb-2", children: _jsx(TimeSheetBody, { onDataChange: handleDataChange, options: options, costCenter: costCenter, revisionCurrent: revisionCurrent, actions: actions }) })] }))] })] }));
}
