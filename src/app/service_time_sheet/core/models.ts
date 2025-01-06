import { SetStateAction, Dispatch } from "react";
 
export type Adds = undefined | null | boolean;
 
export type ServiceTimeSheetProps = {
  isValidate?: any;
  setIsValidate: Dispatch<SetStateAction<any>>;
};
 
export const initialListView: ServiceTimeSheetProps = {
  isValidate: null,
  setIsValidate: () => {}
 
};
 