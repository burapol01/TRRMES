import { createContext, FC, useContext, useState } from "react";
import { initialListView, SiteProps, OptionsState } from "./models";

type WithChildren = {
    children: React.ReactNode;
};

const Sitecontext = createContext<SiteProps>(initialListView);

const SiteProvider: FC<WithChildren> = ({ children }) => {
    const [options, setOptions] = useState<OptionsState>(initialListView.options); // State for combobox options
    const [optionsSearch, setOptionsSearch] = useState<OptionsState>(initialListView.optionsSearch); // State for combobox options
    const [searchSiteCode, setSearchSiteCode] = useState<any[]>(initialListView.searchSiteCode);
    const [searchSiteName, setSearchSiteName] = useState<any[]>(initialListView.searchSiteName);
    const [searchDomain, setSearchDomain] = useState<any[]>(initialListView.searchDomain);
    const [id, setId] = useState<any[]>(initialListView.id);
    const [siteCode, setSiteCode] = useState<any[]>(initialListView.siteCode);
    const [siteName, setSiteName] = useState<any[]>(initialListView.siteName);
    const [domain, setDomain] = useState<any[]>(initialListView.domain);
    const [isValidate, setIsValidate] = useState<any[]>(initialListView.isValidate);

    return (
        <Sitecontext.Provider
            value={{
                options,
                setOptions,
                optionsSearch,
                setOptionsSearch,
                searchSiteCode,
                setSearchSiteCode,
                searchSiteName,
                setSearchSiteName,
                searchDomain,
                setSearchDomain,
                id,
                setId,
                siteCode,
                setSiteCode,
                siteName,
                setSiteName,
                domain,
                setDomain,
                isValidate,
                setIsValidate,
            }}
        >
            {children}
        </Sitecontext.Provider>
    );
}

const useListSite = () => useContext(Sitecontext);

export { SiteProvider, useListSite };