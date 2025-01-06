import { SetStateAction, Dispatch } from "react";

export type Adds = undefined | null | boolean;

export type OptionsState = {
    id: any[];
    fixedAssetCodeData: any[];
    costCenter: any[];
    serviceCenter: any[];
    costAndServiceCenters: any[];
    fixedAssetStatus: any[];
}

const initialOptions: OptionsState = {
    id: [],
    fixedAssetCodeData: [],
    costCenter: [],
    serviceCenter: [],
    costAndServiceCenters: [],
    fixedAssetStatus: [],
};

export type FixedAssetProps = {
    options: OptionsState;
    setOptions: Dispatch<SetStateAction<OptionsState>>;
    optionsSearch: OptionsState;
    setOptionsSearch: Dispatch<SetStateAction<OptionsState>>;

    // search
    searchFixedAssetCode: any;
    setSearchFixedAssetCode: Dispatch<SetStateAction<any>>;
    searchDescription: any;
    setSearchDescription: Dispatch<SetStateAction<any>>;
    searchCostCenterId: any;
    setSearchCostcenterId: Dispatch<SetStateAction<any>>;
    searchFixedAssetStatus: any;
    setSearchFixedAssetStatus: Dispatch<SetStateAction<any>>;

    // CRUD
    id: any;
    setId: Dispatch<SetStateAction<any>>;
    fixedAssetCode: any;
    setFixedAssetCode: Dispatch<SetStateAction<any>>;
    description: any;
    setDescription: Dispatch<SetStateAction<any>>;
    costcenterId: any;
    setCostcenterId: Dispatch<SetStateAction<any>>;
    fixedAssetStatus: any;
    setFixedAssetStatus: Dispatch<SetStateAction<any>>;

    // validate
    isValidate?: any;
    setIsValidate: Dispatch<SetStateAction<any>>;
};

export const initialListView: FixedAssetProps = {
    options: initialOptions,
    setOptions: () => {},
    optionsSearch: initialOptions,
    setOptionsSearch: () => {},

    // search
    searchFixedAssetCode: "",
    setSearchFixedAssetCode: () => {},
    searchDescription: "",
    setSearchDescription: () => {},
    searchCostCenterId: "",
    setSearchCostcenterId: () => {},
    searchFixedAssetStatus: "",
    setSearchFixedAssetStatus: () => {},

    // CRUD
    id: "",
    setId: () => {},
    fixedAssetCode: "",
    setFixedAssetCode: () => {},
    description: "",
    setDescription: () => {},
    costcenterId: null,
    setCostcenterId: () => {},
    fixedAssetStatus: "",
    setFixedAssetStatus: () => {},

    // validate
    isValidate: null,
    setIsValidate: () => {},
}