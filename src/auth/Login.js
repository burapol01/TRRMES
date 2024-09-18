import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { useDispatch } from "react-redux";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { addCurrentUser, addUserRoleMenu, addUserRoleMenuFunc, } from "../../redux/actions/userAction";
import { EndLoadScreen, startLoadScreen, } from "../../redux/actions/loadingScreenAction";
import { login_auth_emp_get } from "../service/login";
function Copyright() {
    return (_jsx(Typography, { variant: "body2", color: "text.secondary", align: "center", sx: { mt: 5 }, children: import.meta.env.VITE_COPYRIGHT }));
}
// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();
export default function Login() {
    const dispatch = useDispatch();
    const [errorMessage, setErrorMessage] = React.useState("");
    const handleSubmit = (event) => {
        dispatch(startLoadScreen());
        const configLogin = import.meta.env.VITE_APP_TRR_API_CONFIG_LOGIN;
        const jsonString = "{" + configLogin + "}";
        const obj = Function("return " + jsonString)();
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        Login({
            ...obj,
            employee_username: data.get("username"),
            password: data.get("password"),
        });
    };
    const Login = async (datasend) => {
        try {
            setTimeout(async () => {
                const reponse = await login_auth_emp_get(datasend);
                if (reponse && reponse.status == "Success") {
                    dispatch(addCurrentUser(reponse?.data?.auth_role_profile[0]));
                    dispatch(addUserRoleMenu(reponse?.data?.auth_role_menu));
                    dispatch(addUserRoleMenuFunc(reponse?.data?.auth_role_menu_func));
                    const lsValue = JSON.stringify(reponse);
                    sessionStorage.setItem(import.meta.env.VITE_APP_AUTH_LOCAL_STORAGE_KEY, lsValue);
                    dispatch(EndLoadScreen());
                }
                if (reponse && reponse.status == "Error") {
                    console.log(reponse);
                    dispatch(EndLoadScreen());
                    await setErrorMessage(reponse?.error_message);
                }
            }, 4000);
        }
        catch (e) {
            dispatch(EndLoadScreen());
            console.log(e);
        }
    };
    return (_jsx(ThemeProvider, { theme: defaultTheme, children: _jsxs(Grid, { container: true, component: "main", sx: { height: "100vh" }, children: [_jsx(CssBaseline, {}), _jsx(Grid, { item: true, xs: false, sm: 4, md: 7, sx: {
                        backgroundImage: `url(./media/slider/image.png)`,
                        backgroundRepeat: "no-repeat",
                        backgroundColor: (t) => t.palette.mode === "light"
                            ? t.palette.grey[50]
                            : t.palette.grey[900],
                        // backgroundSize: 'cover',
                        backgroundPosition: "center",
                    } }), _jsx(Grid, { item: true, xs: 12, sm: 8, md: 5, component: Paper, elevation: 6, square: true, children: _jsxs(Box, { sx: {
                            my: 8,
                            mx: 4,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                        }, children: [_jsx(Avatar, { sx: { m: 1, bgcolor: "secondary.main" }, children: _jsx(LockOutlinedIcon, {}) }), _jsx(Typography, { component: "h1", variant: "h5", children: "Sign in" }), _jsxs(Box, { component: "form", noValidate: true, onSubmit: handleSubmit, sx: { mt: 1 }, children: [_jsx(TextField, { margin: "normal", required: true, fullWidth: true, id: "username", label: "User name", name: "username", autoComplete: "current-user", autoFocus: true, error: errorMessage != "" }), _jsx(TextField, { margin: "normal", required: true, fullWidth: true, name: "password", label: "Password", type: "password", id: "password", autoComplete: "current-password", error: errorMessage != "" }), _jsx("label", { className: "text-red-500 font-bold", children: `${errorMessage}` }), _jsx(Button, { type: "submit", fullWidth: true, variant: "contained", sx: { mt: 3, mb: 2 }, children: "Sign In" }), _jsx(Copyright, {})] })] }) })] }) }));
}
