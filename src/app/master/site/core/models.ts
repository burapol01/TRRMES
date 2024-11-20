import { SetStateAction, Dispatch } from "react";

export type Adds = undefined | null | boolean;

export type OptionsState = {
    id: any[];
    siteData: any[];
    siteCode: any[];
    siteName: any[];
    domain: any[];
}

const initialOptions: OptionsState = {
    id: [],
    siteData: [],
    siteCode: [],
    siteName: [],
    domain: [],
};

export type SiteProps = {
    options: OptionsState;
    setOptions: Dispatch<SetStateAction<OptionsState>>;
    optionsSearch: OptionsState;
    setOptionsSearch: Dispatch<SetStateAction<OptionsState>>;
    searchSiteCode: any;
    setSearchSiteCode: Dispatch<SetStateAction<any>>;
    searchSiteName: any;
    setSearchSiteName: Dispatch<SetStateAction<any>>;
    searchDomain: any;
    setSearchDomain: Dispatch<SetStateAction<any>>;
    id: any;
    setId: Dispatch<SetStateAction<any>>;
    siteCode: any;
    setSiteCode: Dispatch<SetStateAction<any>>;
    siteName: any;
    setSiteName: Dispatch<SetStateAction<any>>;
    domain: any;
    setDomain: Dispatch<SetStateAction<any>>;
    isValidate?: any;
    setIsValidate: Dispatch<SetStateAction<any>>;
}

export const initialListView: SiteProps = {
    options: initialOptions,
    setOptions: () => {},
    optionsSearch: initialOptions,
    setOptionsSearch: () => {},
    searchSiteCode: "",
    setSearchSiteCode: () => {},
    searchSiteName: "",
    setSearchSiteName: () => {},
    searchDomain: "",
    setSearchDomain: () => {},
    id: "",
    setId: () => {},
    siteCode: "",
    setSiteCode: () => {},
    siteName: "",
    setSiteName: () => {},
    domain: "",
    setDomain: () => {},
    isValidate: null,
    setIsValidate: () => {},
}