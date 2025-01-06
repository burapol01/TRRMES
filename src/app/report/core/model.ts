import { SetStateAction, Dispatch } from "react";

export type Adds = undefined | null | boolean;



export type ListReportContextProps = {
    Report_code?: string
    Report_name?: string
    Report_group?: any,
    selectorgReportData?: any[];

    setReport_code: Dispatch<SetStateAction<string>>;
    setReport_name: Dispatch<SetStateAction<string>>
    setReport_group: Dispatch<SetStateAction<any>>
    setSelectorgReportData: Dispatch<SetStateAction<any[]>>;

};

export const initialListReport: ListReportContextProps = {

    Report_group: "",
    selectorgReportData: [],

    setReport_code: () => { },
    setReport_name: () => { },
    setReport_group: () => { },
    setSelectorgReportData: () => { },


};