import { SetStateAction, Dispatch } from "react";
 
export type Adds = undefined | null | boolean;
 
export type UserProps = {
  isValidate?: any;
  setIsValidate: Dispatch<SetStateAction<any>>;
};
 
export const initialListView: UserProps = {
  isValidate: null,
  setIsValidate: () => {}
 
};
 