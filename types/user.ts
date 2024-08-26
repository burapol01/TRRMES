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
  role_id: number,
  application_id: number,
  menu_id: number,
  menu_name: string,
  menu_url: string,
  menu_sequence: number,
  menu_sub: number,
  menu_icon: string
}
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

