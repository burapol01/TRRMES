import { createContext, FC, useContext, useState } from "react";
import { initialListView, ServiceRequestProps } from "./models";

type WithChildren = {
  children: React.ReactNode;
};

const ServiceRequestcontext =
  createContext<ServiceRequestProps>(initialListView);

const ServiceRequestProvider: FC<WithChildren> = ({ children }) => {
  const [isValidate, setIsValidate] = useState<[]>(initialListView.isValidate);
  const [isDuplicate, setIsDuplicate] = useState<[]>(initialListView.isDuplicate);


  return (
    <ServiceRequestcontext.Provider
      value={{
        isValidate,
        isDuplicate,
        setIsValidate,
        setIsDuplicate,
      }}
    >
      {children}
    </ServiceRequestcontext.Provider>
  );
};
 
const useListServiceRequest = () => useContext(ServiceRequestcontext);
 
export { ServiceRequestProvider, useListServiceRequest };