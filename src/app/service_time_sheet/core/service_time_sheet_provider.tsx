import { createContext, FC, useContext, useState } from "react";
import { initialListView, ServiceTimeSheetProps } from "./models";

type WithChildren = {
  children: React.ReactNode;
};

const ServiceTimeSheetContext =
  createContext<ServiceTimeSheetProps>(initialListView);

const ServiceTimeSheetProvider: FC<WithChildren> = ({ children }) => {
  const [isValidate, setIsValidate] = useState<[]>(initialListView.isValidate);

  return (
    <ServiceTimeSheetContext.Provider
      value={{
        isValidate,
        setIsValidate
      }}
    >
      {children}
    </ServiceTimeSheetContext.Provider>
  );
};
 
const useListServiceTimeSheet = () => useContext(ServiceTimeSheetContext);
 
export { ServiceTimeSheetProvider, useListServiceTimeSheet };