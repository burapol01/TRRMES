import { Routes, Route, Navigate } from 'react-router-dom'
import MasterLayout from '../layout/MasterLayout'
import Example from '../app/Example'
import Home from './../app/Home';
import ServiceRequestPage from '../app/service_request/service_request_page';
import ServiceTimeSheetPage from '../app/service_time_sheet/service_time_sheet_page';
import ServiceCost from '../app/service_cost';
import BorderedTreeView from '../app/report';
import UserPage from '../app/master/user/user_page';
import CostCenterPage from '../app/master/cost_center/CostCenterPage';
import BudgetPage from '../app/master/budget/BudgetPage';
import SitePage from '../app/master/site/SitePage';
import ServiceCostPage from '../app/service_cost/service_cost_page';
import FixedAssetPage from '../app/master/fixed_Asset/FixedAssetPage';
export default function PrivateRoutes() {
    // const [urlName, setUrlName] = React.useState<string>("0")
    // const getUrl = async () => {
    //     if (!sessionStorage) {
    //         return
    //     }
    //     const lsValue = await sessionStorage.getItem(import.meta.env.VITE_APP_AUTH_LOCAL_STORAGE_KEY)
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

                    <Route path='auth/*' element={<Navigate to={`/home`} />} />
                    <Route path='home' element={<Home />} />
                    <Route path='service_request' element={<ServiceRequestPage />} />
                    <Route path='service_time_sheet' element={<ServiceTimeSheetPage />} />
                    <Route path='service_cost' element={<ServiceCostPage />} />
                    <Route path='user' element={<UserPage />} />
                    <Route path='report' element={<BorderedTreeView />} />
                    <Route path='cost_center' element={<CostCenterPage />} />
                    <Route path='budget' element={<BudgetPage />} />
                    <Route path='fixed_asset' element={<FixedAssetPage />} />
                    <Route path='site' element={<SitePage />} />
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
