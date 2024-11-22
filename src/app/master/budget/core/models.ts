import { SetStateAction, Dispatch } from "react";

export type Adds = undefined | null | boolean;

// ======================== OptionsState ข้อมูล Drop Down ==========================
/* --------- ให้สร้าง interface optionsState เพื่อระบุประเภท (Type) --------- */
export type OptionsState = {
    id: any[];
    budgetData: any[];
    costCenter: any[];
    serviceCenter: any[];
    costAndServiceCenters: any[];
    jobType: any[];
}

const initialOptions: OptionsState = {
    id: [],
    budgetData: [],
    costCenter: [],
    serviceCenter: [],
    costAndServiceCenters: [],
    jobType: [],
};

export type BudgetProps = {
    options: OptionsState;
    setOptions: Dispatch<SetStateAction<OptionsState>>;
    optionsSearch: OptionsState;
    setOptionsSearch: Dispatch<SetStateAction<OptionsState>>;

    // search
    searchBudgetCode: any;
    setSearchBudgetCode: Dispatch<SetStateAction<any>>;
    searchDescription: any;
    setSearchDescription: Dispatch<SetStateAction<any>>;
    searchCostCenterId: any;
    setSearchCostcenterId: Dispatch<SetStateAction<any>>;
    searchJobType: any;
    setSearchJobType: Dispatch<SetStateAction<any>>;

    // CRUD
    id: any;
    setId: Dispatch<SetStateAction<any>>;
    budgetCode: any;
    setBudgetCode: Dispatch<SetStateAction<any>>;
    description: any;
    setDescription: Dispatch<SetStateAction<any>>;
    costcenterId: any;
    setCostcenterId: Dispatch<SetStateAction<any>>;
    jobType: any;
    setJobtype: Dispatch<SetStateAction<any>>;
    budgetStartDate: any;
    setBudgetStartDate: Dispatch<SetStateAction<any>>;
    budgetEndDate: any;
    setBudgetEndDate: Dispatch<SetStateAction<any>>;

    // validate
    isValidate?: any;
    setIsValidate: Dispatch<SetStateAction<any>>;

    dataList: any;
    setDataList: Dispatch<SetStateAction<any>>;
};

export const initialListView: BudgetProps = {
    options: initialOptions,
    setOptions: () => {},
    optionsSearch: initialOptions,
    setOptionsSearch: () => {},

    // search
    searchBudgetCode: "",
    setSearchBudgetCode: () => {},
    searchDescription: "",
    setSearchDescription: () => {},
    searchCostCenterId: "",
    setSearchCostcenterId: () => {},
    searchJobType: "",
    setSearchJobType: () => {},

    // CRUD
    id: "",
    setId: () => {},
    budgetCode: "",
    setBudgetCode: () => {},
    description: "",
    setDescription: () => {},
    costcenterId: null,
    setCostcenterId: () => {},
    jobType: null,
    setJobtype: () => {},
    budgetStartDate: "",
    setBudgetStartDate: () => {},
    budgetEndDate: "",
    setBudgetEndDate: () => {},

    // validate
    isValidate: null,
    setIsValidate: () => {},

    dataList: [],
    setDataList: () => {},
}