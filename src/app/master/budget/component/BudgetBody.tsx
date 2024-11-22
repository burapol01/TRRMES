import React, { useEffect, useState } from 'react'
import moment from 'moment';
import { useListBudget } from '../core/BudgetProvider';
import { debounce } from 'lodash';
import FullWidthTextField from '../../../../components/MUI/FullWidthTextField';
import AutocompleteComboBox from '../../../../components/MUI/AutocompleteComboBox';
import DatePickerBasic from '../../../../components/MUI/DetePickerBasic';

interface BudgetBodyProps {
    onDataChange?: (data: any) => void;
    defaultValues?: {
        id: string;
        budgetCode?: string;
        description?: string;
        costCenterId: string;
        jobType?: string;
    };
    options?: {
        costCenter: any[];
        serviceCenter: any[];
        costAndServiceCenters: any[];
        jobType: any[];
    };
    disableOnly?: boolean;
    actions?: string;
}

export default function BudgetBody({
    onDataChange,
    disableOnly,
    actions
}: BudgetBodyProps) {

    const {
        options,
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
        isValidate,
    } = useListBudget();

    const debouncedOnDataChange = debounce((data: any) => {
        if (typeof onDataChange === 'function') {
            onDataChange(data);
        }
    }, 300);

    return (
        <div>
            <div className='row justify-start'>
                <div className='col-md-6 mb-2'>
                    <FullWidthTextField
                        required={"required"}
                        labelName={"รหัส"} // รหัสงบประมาณ
                        value={budgetCode}
                        disabled={actions === "Update" ? true : disableOnly}
                        onChange={(value) => setBudgetCode(value)}
                        Validate={isValidate?.budget_code}
                    />
                </div>
                <div className='col-md-6 mb-2'>
                    <FullWidthTextField
                        required={"required"}
                        labelName={"รายละเอียด"}
                        value={description}
                        disabled={actions === "Create" || actions === "Update" ? false : disableOnly}
                        onChange={(value) => setDescription(value)}
                        Validate={isValidate?.description}
                    />
                </div>
                <div className='col-md-6 mb-2'>
                    <AutocompleteComboBox
                        required={"required"}
                        labelName={"Cost Center & Service Center"}
                        description={"กรุณาพิมพ์คำว่า Service Center หากต้องการค้นหา."}
                        value={costcenterId}
                        disabled={actions === "Create" || actions === "Update" ? false : disableOnly}
                        setvalue={(data) => {
                            setCostcenterId(data);
                        }}
                        options={options?.costAndServiceCenters || []}
                        column="costCentersCodeAndName"
                        Validate={isValidate?.cost_center_id}
                    />
                </div>
                <div className='col-md-6 mb-2'>
                    <AutocompleteComboBox
                        required={"required"}
                        labelName={"ประเภทงาน"}
                        value={jobType}
                        disabled={actions === "Create" || actions === "Update" ? false : disableOnly}
                        setvalue={(data) => {
                            setJobtype(data);
                        }}
                        options={options?.jobType || []}
                        column="lov_name"
                        Validate={isValidate?.job_type}
                    />
                </div>

                <div className="col-12 mb-2">
                    <div className="flex flex-col md:flex-row items-start space-y-2 md:space-y-0 md:space-x-2">
                        <div className="w-full md:w-1/2">
                            <DatePickerBasic
                                required="required"
                                labelname="วันที่เริ่มรอดำเนินการ"
                                valueStart={budgetStartDate}
                                onchangeStart={(value) => {
                                    setBudgetStartDate(value);
                                    setBudgetEndDate(null);
                                }}
                                disabled={disableOnly}
                                checkValidateMonth={true}
                            />
                        </div>
                        <label className="pt-5 mt-5 md:pt-0 md:mt-0"> ถึง </label>
                        <div className="w-full md:w-1/2">
                            <DatePickerBasic
                                required="required"
                                labelname="วันที่คาดว่าจะดำเนินการ"
                                startDate={budgetStartDate}
                                valueStart={budgetEndDate}
                                disabled={disableOnly}
                                onchangeStart={setBudgetEndDate}
                                // disablePast={true}
                                // checkValidateMonth={true}
                                validate={isValidate?.budget_e_date}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}