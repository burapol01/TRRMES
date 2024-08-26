import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { useDispatch } from "react-redux";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  addCurrentUser,
  addUserRoleMenu,
  addUserRoleMenuFunc,
} from "../../redux/actions/userAction";
import {
  EndLoadScreen,
  startLoadScreen,
} from "../../redux/actions/loadingScreenAction";
import { login_auth_emp_get } from "../service/login";

function Copyright() {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      sx={{ mt: 5 }}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Rodbenz Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

export default function Login() {
  const dispatch = useDispatch();
  const [errorMessage, setErrorMessage] = React.useState("");

  const handleSubmit = (event: any) => {
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

  const Login = async (datasend: any) => {
    try {
      setTimeout(async () => {
        const reponse = await login_auth_emp_get(datasend);
        if (reponse && reponse.status == "Success") {
          dispatch(addCurrentUser(reponse?.data?.auth_role_profile[0]));
          dispatch(addUserRoleMenu(reponse?.data?.auth_role_menu));
          dispatch(addUserRoleMenuFunc(reponse?.data?.auth_role_menu_func));
          const lsValue = JSON.stringify(reponse);
          localStorage.setItem(
            import.meta.env.VITE_APP_AUTH_LOCAL_STORAGE_KEY,
            lsValue
          );
          dispatch(EndLoadScreen());
        }
        if (reponse && reponse.status == "Error") {
          console.log(reponse);
          dispatch(EndLoadScreen());
          await setErrorMessage(reponse?.error_message);
        }
      }, 4000);
    } catch (e) {
      dispatch(EndLoadScreen());
      console.log(e);
    }
  };
  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: `url(./public/media/slider/image.png)`,
            backgroundRepeat: "no-repeat",
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            // backgroundSize: 'cover',
            backgroundPosition: "center",
          }}
        ></Grid>
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="User name"
                name="username"
                autoComplete="current-user"
                autoFocus
                error={errorMessage != ""}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                error={errorMessage != ""}
              />
              <label className="text-red-500 font-bold">{`${errorMessage}`}</label>
              {/* <FormControlLabel
                                control={<Checkbox value="remember" color="primary" />}
                                label="Remember me"
                            /> */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link href="#" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <Link href="#" variant="body2">
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
              <Copyright />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
