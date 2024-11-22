import { createContext, FC, useContext, useState } from "react";
import { initialListView, BudgetProps, OptionsState } from "./models";
import { Dayjs } from "dayjs";

type WithChildren = {
    children: React.ReactNode;
};

const Budgetcontext = createContext<BudgetProps>(initialListView);

const BudgetProvider: FC<WithChildren> = ({ children }) => {
    const [options, setOptions] = useState<OptionsState>(initialListView.options); // State for combobox options
    const [optionsSearch, setOptionsSearch] = useState<OptionsState>(initialListView.optionsSearch); // State for combobox options
    
    // serarch
    const [searchBudgetCode, setSearchBudgetCode] = useState<any[]>(initialListView.budgetCode);
    const [searchDescription, setSearchDescription] = useState<any[]>(initialListView.description);
    const [searchCostCenterId, setSearchCostcenterId] = useState<any[]>(initialListView.costcenterId);
    const [searchJobType, setSearchJobType] = useState<any[]>(initialListView.jobType);

    // CRUD
    const [id, setId] = useState<any[]>(initialListView.id);
    const [budgetCode, setBudgetCode] = useState<any[]>(initialListView.budgetCode);
    const [description, setDescription] = useState<any[]>(initialListView.description);
    const [costcenterId, setCostcenterId] = useState<any[]>(initialListView.costcenterId);
    const [jobType, setJobtype] = useState<any[]>(initialListView.jobType);
    const [budgetStartDate, setBudgetStartDate] = useState<Dayjs | null>(initialListView.budgetStartDate);
    const [budgetEndDate, setBudgetEndDate] = useState<Dayjs | null>(initialListView.budgetEndDate);

    const [dataList, setDataList] = useState<any[]>(initialListView.dataList);

    // Validate
    const [isValidate, setIsValidate] = useState<[]>(initialListView.isValidate);
    
    return (
        <Budgetcontext.Provider
            value={{
                options,
                setOptions,
                optionsSearch,
                setOptionsSearch,
                searchBudgetCode,
                setSearchBudgetCode,
                searchDescription,
                setSearchDescription,
                searchCostCenterId,
                setSearchCostcenterId,
                searchJobType,
                setSearchJobType,
                id,
                setId,
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
                setIsValidate,
                
                dataList,
                setDataList,
            }}
        >
            {children}
        </Budgetcontext.Provider>
    );
};

const useListBudget = () => useContext(Budgetcontext);

export { BudgetProvider, useListBudget };
