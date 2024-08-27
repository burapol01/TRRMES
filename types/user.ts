export interface Login {
  application_code: string;
  employee_username: string;
  password: string;
  client_ip: string;
  access_type: string;
  browser: string;
  version_no: string;
  checkAD: boolean;
  token_id: string;
}
export interface AuthModel {
  data: {
    auth_app_info: any;
    auth_role_menu: any;
    auth_role_menu_func: any;
    auth_role_profile: any;
  };
  api_token: string;
  refreshToken?: string;
}
export type Menu = {
  application_id: number;
  func_id: string;
  func_name: string;
  func_name_th: string;
  funct_oth: string;
  menu_id: number;
  permission: string;
  role_id: number;
  role_menu_func_id: number;
};
export type MenuFunc = {
  application_id: number,
  role_id: number,
  role_menu_func_id: number,
  menu_id: number,
  func_id: string,
  func_name: string,
  funct_oth: string,
  permission: string
}

