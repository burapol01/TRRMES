import axios from "axios";
import { Login } from "../../../types/user";

export async function login_auth_emp_get(datasend: Login) {
  const url = `${
    import.meta.env.VITE_APP_TRR_API_URL_LOGIN
  }/api_sys_auth/SysAuth/login_auth_emp_get`;
  const datasent = {
    ...datasend,
  };

  try {
    const res = await axios.post(url, datasent);
    const data = res.data;
    return data;
  } catch {
    return false;
  }
}

