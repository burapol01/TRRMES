import * as React from "react";
import { useEffect, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import DatePickerBasic from "../../../components/MUI/DetePickerBasic"; // Your DatePickerBasic component
import { debounce } from "lodash"; // Ensure lodash is installed and imported
import FullWidthTextareaField from "../../../components/MUI/FullWidthTextareaField";
import { dateFormatTimeEN } from "../../../../libs/datacontrol";
import moment from "moment";
import { _POST } from "../../../service";
import { log } from "console";
import { useListServiceTimeSheet } from "../core/service_time_sheet_provider";

interface ManagePendingStatusBodyProps {
    onDataChange?: (data: any) => void;
    defaultValues?: {
        requestId?: string;
        reqUser?: string;
        Reason?: string;
        status?: string;
    };
    disableOnly?: boolean;
    actions?: string;
}

export default function ManagePendingStatusBody({
    onDataChange,
    defaultValues,
    disableOnly,
    actions,
}: ManagePendingStatusBodyProps) {
    const [pendingStartDate, setPendingStartDate] = useState<Dayjs | null>(dayjs());
    const [pendingEndDate, setPendingEndDate] = useState<Dayjs | null>(null);
    const [reason, setReason] = useState<string>("");
    const [requestId, setRequestId] = useState(defaultValues?.requestId || "");
    const [status, setStatus] = useState(defaultValues?.status);
    const [pendingId, setPendingId] = useState("");
    const { isValidate, setIsValidate } = useListServiceTimeSheet()

    const managePendingGet = async () => {
        console.log('Call : managePendingGet', moment().format('HH:mm:ss:SSS'));

        const payload = {
            req_id: requestId,
            req_status: status
        };

        try {
            const response = await _POST(payload, "/api_trr_mes/PendingManage/Manage_Pending_Get");

            if (response && response.status === "success") {
                console.log('Manage_Pending_Get successfully:', response);
                const { id, pending_s_date, pending_e_date, reason } = response.data[0];

                console.log(response.data);

                setPendingId(id || "");
                setPendingStartDate(dayjs(pending_s_date));
                setPendingEndDate(dayjs(pending_e_date));
                setReason(reason || "");
            } else {
                console.error('Failed to Manage_Pending_Get:', response);
            }
        } catch (error) {
            console.error('Error Manage_Pending_Get:', error);
        }
    };

    const debouncedOnDataChange = debounce((data: any) => {
        if (typeof onDataChange === "function") {
            onDataChange(data);
        }
    }, 300);

    useEffect(() => {
        if (actions === "UnPending") {
            managePendingGet();
        }
    }, [actions, requestId]);

    useEffect(() => {
        const data = {
            pendingId,
            requestId,
            pendingStartDate: pendingStartDate ? dateFormatTimeEN(pendingStartDate, "DD/MM/YYYY") + moment().format('HH:mm:ss:SSS') : null,
            pendingEndDate: pendingEndDate ? dateFormatTimeEN(pendingEndDate, "DD/MM/YYYY") + moment().format('HH:mm:ss:SSS') : null,
            reason,
            status,
        };
        debouncedOnDataChange(data);
    }, [pendingId, requestId, pendingStartDate, pendingEndDate, reason, status, onDataChange]);

    return (
        <div>
            <div className="row justify-start">
                <div className="col-12 mb-2">
                    <div className="flex flex-col md:flex-row items-start space-y-2 md:space-y-0 md:space-x-2">
                        <div className="w-full md:w-1/2">
                            <DatePickerBasic
                                required="required"
                                labelname="วันที่เริ่มรอดำเนินการ"
                                valueStart={pendingStartDate}
                                onchangeStart={(value) => {
                                    setPendingStartDate(value);
                                    setPendingEndDate(null);
                                }}
                                disabled={disableOnly}
                                checkValidateMonth={true}
                            />
                        </div>
                        <label className="pt-5 mt-5 md:pt-0 md:mt-0">ถึง</label>
                        <div className="w-full md:w-1/2">
                            <DatePickerBasic
                                required="required"
                                labelname="วันที่คาดว่าจะดำเนินการ"
                                valueStart={pendingEndDate}
                                disabled={actions === "UnPending" ? disableOnly : false}
                                onchangeStart={setPendingEndDate}
                                checkValidateMonth={true}
                                disablePast
                                validate={isValidate?.pendingEndDate}
                            />
                        </div>
                    </div>
                </div>
                <div className="col-12 mb-2">
                    <FullWidthTextareaField
                        required="required"
                        labelName="หมายเหตุ"
                        value={reason}
                        multiline={true}
                        disabled={actions === "UnPending" ? disableOnly : false}
                        onChange={(value) => setReason(value)}
                        Validate={isValidate?.reason}
                    />
                </div>
            </div>
        </div>

    );
}
