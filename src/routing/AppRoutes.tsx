import React from "react";
import App from "../App";
import { Routes, BrowserRouter, Route, Navigate } from "react-router-dom";
import PrivateRoutes from "./PrivateRoutes";
import { useSelector } from "react-redux";
/**
 * Base URL of the website.
 *
 * @see https://facebook.github.io/create-react-app/docs/using-the-public-folder
 */
const { BASE_URL } = import.meta.env;

import { ErrorsPage } from "../errors";
import { Logout } from "../auth/Logout";
import AuthPage from "../auth/AuthPage";


const AppRoutes = () => {
  const [checkLogin, setCheckLogin] = React.useState(true);
  const currentuser = useSelector((state: any) => state?.user?.user);
  React.useEffect(() => {
    if (currentuser) {
      setCheckLogin(currentuser);
    } else {
      setCheckLogin(false);
    }
  }, [currentuser]);

  //console.log(currentuser,'55555555555');

  return (
    <BrowserRouter basename={BASE_URL}>
      <Routes>
        <Route element={<App />}>
          <Route path="error/*" element={<ErrorsPage />} />
          <Route path="logout" element={<Logout />} />
          {checkLogin ? (
            <>
              <Route path="/*" element={<PrivateRoutes />} />
              <Route index element={<Navigate to="/Home" />} />
            </>
          ) : (
            <>
              <Route path="auth/*" element={<AuthPage />} />
              <Route path="*" element={<Navigate to="/auth" />} />
            </>
           )} 
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default  AppRoutes ;
