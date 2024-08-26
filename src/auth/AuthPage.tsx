import {Routes, Route} from 'react-router-dom'
import AuthLayout from './AuthLayout'
import Login from './Login'
export default function AuthPage() {
    return (
        <Routes>
            <Route element={<AuthLayout />}>
                <Route path='login' element={<Login />} />
                {/* <Route path='registration' element={<Registration />} />
                <Route path='forgot-password' element={<ForgotPassword />} /> */}
                <Route index element={<Login />} />
            </Route>
        </Routes>
    )
}
