import { Routes, Route, Navigate } from 'react-router-dom'
import MasterLayout from '../layout/MasterLayout'
import Example from '../app/Example'
import Home from './../app/Home';
import ServiceRequest from '../app/service_request';
import ServiceTimeSheet from '../app/service_time_sheet';
import { useSelector } from 'react-redux';
import React from 'react';
import User from '../app/master/user';
export default function PrivateRoutes() {
    // const [urlName, setUrlName] = React.useState<string>("0")
    // const getUrl = async () => {
    //     if (!localStorage) {
    //         return
    //     }
    //     const lsValue = await localStorage.getItem(import.meta.env.VITE_APP_AUTH_LOCAL_STORAGE_KEY)
    //     if (!lsValue) {
    //         return
    //     }

    //     try {
    //         const auth = await JSON.parse(lsValue)
    //         if (auth) {
    //             const data = auth?.data?.auth_role_menu[0]
    //             if (data?.menu_url) {
    //                 setUrlName(data?.menu_url)
    //             } else {
    //                 setUrlName("Home")
    //             }
    //         }
    //     } catch (error) {
    //         console.error('AUTH LOCAL STORAGE PARSE ERROR', error)
    //     }
    // }
    // React.useEffect(() => {
    //     getUrl()
    // }, [])
    // React.useEffect(() => {
    //     //console.log(urlName, '5555555555555555555');

    // }, [urlName])

    return (

        <Routes>
            {/* {urlName != "0" && ( */}
                <Route element={<MasterLayout />}>
                    {/* Redirect to Dashboard after success login/registartion */}

                    <Route path='auth/*' element={<Navigate to={`home`} />} />
                    <Route path='home' element={<Home />} />
                    <Route path='service_request' element={<ServiceRequest />} />
                    <Route path='service_time_sheet' element={<ServiceTimeSheet />} />
                    <Route path='user' element={<User />} />
                    {/* Pages */}
                    {/* <Route path='dashboard' element={<DashboardWrapper />} />
                    <Route path='builder' element={<BuilderPageWrapper />} />
                    <Route path='menu-test' element={<MenuTestPage />} /> */}
                    {/* Lazy Modules */}
                    <Route
                        path="apps/*"
                        element={
                            <Example />
                        }
                    />
                    {/* <Route path='*' element={<Navigate to='/error/404' />} /> */}

                </Route>
            {/* )} */}
            {/* {urlName == "Home" && (
                <Route element={<MasterLayout />}>
                    <Route path='auth/*' element={<Navigate to={`/${urlName}`} />} />
                    <Route path='home' element={<Home />} />
                    
                    <Route path='*' element={<Navigate to='/error/404' />} />

                </Route>
            )} */}
        </Routes>
    )

}
