import React from 'react';
import { useEffect, useState } from 'react';
import FullWidthTextField from '../../../components/MUI/FullWidthTextField';
import { debounce } from 'lodash';
import { ImageList } from '@mui/material';
import { setValueMas } from '../../../../libs/setvaluecallback';
import { daDK } from '@mui/x-date-pickers';
import FullWidthButton from '../../../components/MUI/FullWidthButton';
import * as TableApproveList from './TableApproveList';
import AutocompleteComboBox from '../../../components/MUI/AutocompleteComboBox';
import { createFilterOptions } from '@mui/material';

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
        rejectSubmitReason?: string,
        rejectStartReason?: string,
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
}



export default function ApprovedListBody({
    onDataChange,
    defaultValues,
    options,
    disableOnly,
    actions
}: ApprovedListBodyProps) {
    // const { isValidate, setIsValidate, isDuplicate, setIsDuplicate } = useListServiceRequest()
    const [optionCostCenter, setOptionCostCenter] = useState<any>(options?.costCenter || []);
    const [optionServiceCenter, setOptionServiceCenter] = useState<any>(options?.serviceCenter || []);
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
    const [actionType, setActionType] = useState<string | null>(null); // Corrected type
    //Test

    


    // function dropdown ของ cost center
    const handleCostCenterChange = (event: any, newValue: any) => {
        if (newValue) {
            setCostCenter(newValue);
            setCostCenterId(newValue.costCenterId);
            setCostCenterCode(newValue.costCenterCode);
            setCostCenterName(newValue.costCenterName);
        }
    };

    // function สำหรับ filter จากการ search
    const OPTIONS_LIMIT = 100;
    const defaultFilterOptions = createFilterOptions();
    
    const filterOptions = (options: any[], state: any) => {
        return defaultFilterOptions(options, state).slice(0, OPTIONS_LIMIT);
    };


    

    // ค้นหาข้อมูล
    const handleSearch = () => {
      setActionType('search');
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
        requestId, requestNo, requestDate, reqUser, costCenterId, costCenterCode, costCenterName,
        status, serviceCenterId, costCenter, serviceCenter, serviceName, site, jobType, budgetCode, description, 
        fixedAssetCode, fixedAssetDescription,
        countRevision, onDataChange,
    ]);

    React.useEffect(() => {
        console.log(defaultValues, "defaultValues")
        if (actions != "Create") {

            // console.log(options?.costCenter, 'dd')

            if (defaultValues?.costCenterId != "") {
                const mapCostCenterData = setValueMas(options?.costCenter, defaultValues?.costCenterId, 'costCenterId')
                // console.log(mapCostCenterData, 'mapCostCenterData')
                setCostCenter(mapCostCenterData)
            }

            if (defaultValues?.serviceCenterId != "") {
                const mapCostCenterData = setValueMas(options?.serviceCenter, defaultValues?.serviceCenterId, 'costCenterId')
                // console.log(mapCostCenterData, )
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
            }

            if (defaultValues?.appReqUser != "") {                 
                //console.log(defaultValues?.fixedAssetId, 'mapfixedAssetData')
                setheadUser(defaultValues?.appReqUser || "");
            }
        }

    }, [defaultValues, options?.fixedAssetCode])
    return (
        <div>
            <div className="max-lg rounded overflow-hidden shadow-s bg-white mt-5 mb-5">
                <div className="px-6 pt-4">
                    <label className="text-2xl ml-2 mt-3 mb-5 sarabun-regular">ค้นหาข้อมูล</label>
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
                    <FullWidthTextField
                    labelName={"Cost Center"}
                    value={costCenterCode}
                    onChange={(value) => setRequestNo(value)}
                    />
                </div>
                <div className="col-md-3 mb-2">
                    <FullWidthTextField
                    labelName={"Service Center"}
                    value={requestNo}
                    onChange={(value) => setRequestNo(value)}
                    />
                </div>
                <div className="col-md-3 mb-2">
                    <FullWidthTextField
                    labelName={"ประเภทงาน"}
                    value={requestNo}
                    onChange={(value) => setRequestNo(value)}
                    />
                </div>
                <div className="col-md-3 mb-2">
                    <FullWidthTextField
                    labelName={"Fixed Asset Code"}
                    value={requestNo}
                    onChange={(value) => setRequestNo(value)}
                    />
                </div>
                <div className="col-md-3 mb-2">
                    <FullWidthTextField
                    labelName={"สถานะ"}
                    value={requestNo}
                    onChange={(value) => setRequestNo(value)}
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
                <TableApproveList.default />
            </div>

        </div>
    )
}
