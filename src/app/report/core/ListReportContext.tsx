import React, { createContext, FC, useContext, useState } from "react";
import { initialListReport, ListReportContextProps } from "./model";
type WithChildren = {
    children: React.ReactNode
}
const ListReportContext = createContext<ListReportContextProps>(initialListReport);
const ListReportProvider: FC<WithChildren> = ({ children }) => {

    const [Report_code, setReport_code] = useState<any>(initialListReport.Report_code);
    const [Report_name, setReport_name] = useState<any>(initialListReport.Report_name);
    const [Report_group, setReport_group] = useState<any>(initialListReport.Report_group);
    const [selectorgReportData, setSelectorgReportData] = useState<any[]>(initialListReport.selectorgReportData || []);


    return (
        <ListReportContext.Provider
            value={{

                Report_code,
                Report_name,
                Report_group,
                selectorgReportData,

                setReport_code,
                setReport_name,
                setReport_group,
                setSelectorgReportData

            }}
        >
            {children}
        </ListReportContext.Provider>
    );
};

const useListReport = () => useContext(ListReportContext);
export { ListReportProvider, useListReport };