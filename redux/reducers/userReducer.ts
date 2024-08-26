import {
  ADD_CUR_USER,
  ADD_CUR_USER_ROLE_FUNC,
  ADD_CUR_USER_ROLE_MENU,
} from "../actions/userAction";

const initialState = {
  user: undefined,
};

export function currentUser(state = initialState, action: any) {
  switch (action.type) {
    case ADD_CUR_USER:
      return {
        user: action.payload,
      };

    default:
      return state;
  }
}
const initialStateMenu = {
  user_menu: null,
};

export function userRoleMenu(state = initialStateMenu, action: any) {
  switch (action.type) {
    case ADD_CUR_USER_ROLE_MENU:
      return {
        user_menu: action.payload,
      };

    default:
      return state;
  }
}
const initialStateFunc = null

export function userRoleFunc(state = initialStateFunc, action: any) {
  switch (action.type) {
    case ADD_CUR_USER_ROLE_FUNC:
      return action.payload;
    default:
      return state;
  }
}
