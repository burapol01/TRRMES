import { createContext, FC, useContext, useState } from "react";
import { initialListView, FixedAssetProps, OptionsState } from "./models";

type WithChildren = {
    children: React.ReactNode;
};

const FixedAssetcontext = createContext<FixedAssetProps>(initialListView);

const FixedAssetProvider: FC<WithChildren> = ({ children }) => {
    const [options, setOptions] = useState<OptionsState>(initialListView.options); // State for combobox options
    const [optionsSearch, setOptionsSearch] = useState<OptionsState>(initialListView.optionsSearch); // State for combobox options
    
    // serarch
    const [searchFixedAssetCode, setSearchFixedAssetCode] = useState<any[]>(initialListView.fixedAssetCode);
    const [searchDescription, setSearchDescription] = useState<any[]>(initialListView.description);
    const [searchCostCenterId, setSearchCostcenterId] = useState<any[]>(initialListView.costcenterId);
    const [searchFixedAssetStatus, setSearchFixedAssetStatus] = useState<any[]>(initialListView.fixedAssetStatus);

    // CRUD
    const [id, setId] = useState<any[]>(initialListView.id);
    const [fixedAssetCode, setFixedAssetCode] = useState<any[]>(initialListView.fixedAssetCode);
    const [description, setDescription] = useState<any[]>(initialListView.description);
    const [costcenterId, setCostcenterId] = useState<any[]>(initialListView.costcenterId);
    const [fixedAssetStatus, setFixedAssetStatus] = useState<any[]>(initialListView.fixedAssetStatus);

    // Validate
    const [isValidate, setIsValidate] = useState<[]>(initialListView.isValidate);
    
    return (
        <FixedAssetcontext.Provider
            value={{
                options,
                setOptions,
                optionsSearch,
                setOptionsSearch,

                // serarch
                searchFixedAssetCode,
                setSearchFixedAssetCode,
                searchDescription,
                setSearchDescription,
                searchCostCenterId,
                setSearchCostcenterId,
                searchFixedAssetStatus,
                setSearchFixedAssetStatus,

                // CRUD
                id,
                setId,
                fixedAssetCode,
                setFixedAssetCode,
                description,
                setDescription,
                costcenterId,
                setCostcenterId,
                fixedAssetStatus,
                setFixedAssetStatus,

                // validate
                isValidate,
                setIsValidate,
            }}
        >
            {children}
        </FixedAssetcontext.Provider>
    );
};

const useListFixedAsset = () => useContext(FixedAssetcontext);

export { FixedAssetProvider, useListFixedAsset };
