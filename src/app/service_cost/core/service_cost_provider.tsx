import { createContext, FC, useContext, useState } from "react";
import { initialListView, ServiceCostProps } from "./models";

type WithChildren = {
  children: React.ReactNode;
};

const ServiceCostContext =
  createContext<ServiceCostProps>(initialListView);

const ServiceCostProvider: FC<WithChildren> = ({ children }) => {
  const [isValidate, setIsValidate] = useState<[]>(initialListView.isValidate);
  const [cutOffMonthAndYear, setCutOffMonthAndYear] = useState<string>(initialListView.cutOffMonthAndYear);
  const [currentAccessModel, setCurrentAccessModel] = useState<any>(initialListView.currentAccessModel);
  const [defaultDataList, setDefaultDataList] = useState<any>(initialListView.defaultDataList);

  return (
    <ServiceCostContext.Provider
      value={{
        isValidate,
        setIsValidate,

         // เก็บข้อมูลจาก ตารางทั้งหมด
         defaultDataList,
         setDefaultDataList,

        //ประกาศ ตัวรับและส่ง
        cutOffMonthAndYear,
        setCutOffMonthAndYear,

        //เก็บ CurrentAccess ใช้ทุกที่
        currentAccessModel,
        setCurrentAccessModel,
      }}
    >
      {children}
    </ServiceCostContext.Provider>
  );
};

const useListServiceCost = () => useContext(ServiceCostContext);

export { ServiceCostProvider, useListServiceCost };