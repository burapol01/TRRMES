import { SetStateAction, Dispatch } from "react";

export type Adds = undefined | null | boolean;

export type ListReportContextProps = {
    Report_code?: string
    Report_name?: string







    setReport_code: Dispatch<SetStateAction<string>>;
    setReport_name: Dispatch<SetStateAction<string>>

};

export const initialListReport: ListReportContextProps = {
    setReport_code:() => {},
    setReport_name:() => {},


};