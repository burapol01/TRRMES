import { createContext, FC, useContext, useState } from "react";
import { initialListView, CostCentersProps } from "./models";

type WithChildren = {
  children: React.ReactNode;
};

const CostCentercontext = createContext<CostCentersProps>(initialListView);

const ConstCenterProvider: FC<WithChildren> = ({ children }) => {
  // const [siteCode, setSiteCode] = useState<any[]>(initialListView.siteCode); // Site 
  // const [dataCostCenter, setDataCostCenter] = useState<any[]>(initialListView.dataCostCenter);
  // const [costcentercodeOptions, setCostCenterCodeOptions] = useState<any[]>(initialListView.costcentercodeOptions); // Cost Center Code
  // const [costcenternameOptions, setCostCenterNameOptions] = useState<any[]>(initialListView.costcenternameOptions); // ชื่อ Cost Center
  // const [requserOptions, setReqUserOptions] = useState<any[]>(initialListView.requserOptions); // ผู้อนุมัติ
  const [isValidate, setIsValidate] = useState<[]>(initialListView.isValidate); // Validate

  return (
    <CostCentercontext.Provider
      value={{
        // // Site 
        // siteCode,
        // setSiteCode,

        // dataCostCenter,
        // setDataCostCenter,
        
        // // Cost Center Code
        // costcentercodeOptions,
        // setCostCenterCodeOptions,

        // // ชื่อ Cost Center
        // costcenternameOptions,
        // setCostCenterNameOptions,

        // // ผู้อนุมัติ
        // requserOptions,
        // setReqUserOptions,

        // Validate
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