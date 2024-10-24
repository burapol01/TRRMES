import { createContext, FC, useContext, useState } from "react";
import { initialListView, UserProps } from "./models";

type WithChildren = {
  children: React.ReactNode;
};

const Usercontext =
  createContext<UserProps>(initialListView);

const UserProvider: FC<WithChildren> = ({ children }) => {
  const [isValidate, setIsValidate] = useState<[]>(initialListView.isValidate);


  return (
    <Usercontext.Provider
      value={{
        isValidate,
        setIsValidate,
      }}
    >
      {children}
    </Usercontext.Provider>
  );
};
 
const useListUser = () => useContext(Usercontext);
 
export { UserProvider, useListUser };