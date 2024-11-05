import { createContext, FC, useContext, useState } from "react";
import { initialListView, CostCentersProps } from "./models";

type WithChildren = {
  children: React.ReactNode;
};

const CostCentercontext = createContext<CostCentersProps>(initialListView);

const ConstCenterProvider: FC<WithChildren> = ({ children }) => {
  const [siteCode, setSiteCode] = useState<any[]>(initialListView.siteCode);
  const [dataCostCenter, setDataCostCenter] = useState<any[]>(initialListView.dataCostCenter);
  const [costcentercodeOptions, setCostCenterCodeOptions] = useState<any[]>(initialListView.costcentercodeOptions);
  const [costcenternameOptions, setCostCenterNameOptions] = useState<any[]>(initialListView.costcenternameOptions);
  const [requserOptions, setReqUserOptions] = useState<any[]>(initialListView.requserOptions);
  const [isValidate, setIsValidate] = useState<[]>(initialListView.isValidate);

  return (
    <CostCentercontext.Provider
      value={{
        siteCode,
        setSiteCode,
        dataCostCenter,
        setDataCostCenter,
        costcentercodeOptions,
        setCostCenterCodeOptions,
        costcenternameOptions,
        setCostCenterNameOptions,
        requserOptions,
        setReqUserOptions,
        isValidate,
        setIsValidate,
      }}
    >
      {children}
    </CostCentercontext.Provider>
  );
};

const useListConCenter = () => useContext(CostCentercontext);

export { ConstCenterProvider, useListConCenter };