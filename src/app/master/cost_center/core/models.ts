import { SetStateAction, Dispatch } from "react";

export type Adds = undefined | null | boolean;
 
export type CostCentersProps = {
  // // Site
  // siteCode: any;
  // setSiteCode: Dispatch<SetStateAction<any>>;
  // dataCostCenter: any;
  // setDataCostCenter: Dispatch<SetStateAction<any>>;
  // // Cost Center Code
  // costcentercodeOptions: any;
  // setCostCenterCodeOptions:  Dispatch<SetStateAction<any>>;
  // // ชื่อ Cost Center
  // costcenternameOptions: any;
  // setCostCenterNameOptions:  Dispatch<SetStateAction<any>>;
  // // ผู้อนุมัติ
  // requserOptions: any;
  // setReqUserOptions: Dispatch<SetStateAction<any>>;

  // Validate
  isValidate?: any;
  setIsValidate: Dispatch<SetStateAction<any>>;
};
 
export const initialListView: CostCentersProps = {
  // // Site
  // siteCode: [],
  // setSiteCode: () => {},
  // dataCostCenter: [],
  // setDataCostCenter: () => {},
  // // Cost Center Code
  // costcentercodeOptions: [],
  // setCostCenterCodeOptions: () => {},
  // // ชื่อ Cost Center 
  // costcenternameOptions: [],
  // setCostCenterNameOptions: () => {},
  // // ผู้อนุมัติ
  // requserOptions: [],
  // setReqUserOptions: () => {},
  
  // Validate
  isValidate: null,
  setIsValidate: () => {},
};
 
