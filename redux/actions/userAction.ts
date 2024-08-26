export const ADD_CUR_USER = "ADD_CUR_USER";
export const ADD_CUR_USER_ROLE_MENU = "ADD_CUR_USER_ROLE_MENU";
export const ADD_CUR_USER_ROLE_FUNC = "ADD_CUR_USER_ROLE_FUNC";

export function addCurrentUser(add: any) {
  return {
    type: ADD_CUR_USER,
    payload: add,
  };
}
export function addUserRoleMenu(add: any) {
  return {
    type: ADD_CUR_USER_ROLE_MENU,
    payload: add,
  };
}
export function addUserRoleMenuFunc(add: any) {
  return {
    type: ADD_CUR_USER_ROLE_FUNC,
    payload: add,
  };
}
