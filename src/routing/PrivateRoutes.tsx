import { Routes, Route, Navigate } from 'react-router-dom'
import MasterLayout from '../layout/MasterLayout'
import Example from '../app/Example'
import Home from './../app/Home';
import ServiceRequest from '../app/service_request';
import ServiceTimeSheet from '../app/service_time_sheet';
export default function PrivateRoutes() {
    return (
        <Routes>
            <Route element={<MasterLayout />}>
                {/* Redirect to Dashboard after success login/registartion */}
                <Route path='auth/*' element={<Navigate to='/service_request' />} />
                <Route path='home' element={<Home />} />
                <Route path='service_request' element={<ServiceRequest />} />
                <Route path='service_time_sheet' element={<ServiceTimeSheet />} />
                {/* Pages */}
                {/* <Route path='dashboard' element={<DashboardWrapper />} />
                    <Route path='builder' element={<BuilderPageWrapper />} />
                    <Route path='menu-test' element={<MenuTestPage />} /> */}
                {/* Lazy Modules */}
                <Route
                    path="apps/*"
                    element={
                       <Example/>
                    }
                />

                <Route path='*' element={<Navigate to='/error/404' />} />
            </Route>
        </Routes>
    )
}
