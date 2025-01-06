import { SetStateAction, Dispatch } from "react";
 
export type Adds = undefined | null | boolean;
 
export type ServiceCostProps = {
  isValidate?: any;
  setIsValidate: Dispatch<SetStateAction<any>>;

  defaultDataList : any;
  setDefaultDataList: Dispatch<SetStateAction<any>>;

  cutOffMonthAndYear : string;
  setCutOffMonthAndYear: Dispatch<SetStateAction<string>>;

  currentAccessModel: any;
  setCurrentAccessModel: Dispatch<SetStateAction<any>>; 

};
 
export const initialListView: ServiceCostProps = {
  isValidate: null,
  setIsValidate: () => {},
  // เก็บข้อมูลจาก ตารางทั้งหมด
  defaultDataList: [],
  setDefaultDataList: () => {},

  // ค่าที่ดึงจาก Database
  cutOffMonthAndYear: "",
  setCutOffMonthAndYear: () => {},

  //เก็บค่า currentAccess 
  currentAccessModel: [],
  setCurrentAccessModel: () => [],
 
};
 