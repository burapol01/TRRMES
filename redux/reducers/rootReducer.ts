import { combineReducers } from "redux";
import { loaddingScreenReducer } from "./loadingScreenReducer";
import { currentUser, userRoleFunc, userRoleMenu } from "./userReducer";
import { masGroupProduct, masSeason } from "./masterReducer";
import { roleMenuFunctionList, roleMenuFunction } from "./roleReducer";


export const rootReducer:any = combineReducers({
  loading_screen: loaddingScreenReducer,
  user:currentUser,
  user_menu: userRoleMenu,
  user_menu_func: userRoleFunc,
  masGroupProduct: masGroupProduct,
  masSeason:masSeason,
  // menu functions 
  menuFuncList: roleMenuFunctionList,
  MenuFunc: roleMenuFunction,
});
