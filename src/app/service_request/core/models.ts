import { SetStateAction, Dispatch } from "react";
 
export type Adds = undefined | null | boolean;
 
export type ServiceRequestProps = {
  isValidate?: any;
  setIsValidate: Dispatch<SetStateAction<any>>;
  isDuplicate?: any;
  setIsDuplicate: Dispatch<SetStateAction<any>>;
};
 
export const initialListView: ServiceRequestProps = {
  isValidate: null,
  setIsValidate: () => {},
  isDuplicate: null,
  setIsDuplicate: () => {},
 
};
 