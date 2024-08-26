import { ADD_ROLE_MENU_FUNC } from "../actions/roleAction";
import { ADD_ROLE_MENU } from "../actions/roleAction";



const initialStateList = null

export function roleMenuFunctionList(state = initialStateList, action: any) {
  switch (action.type) {
    case ADD_ROLE_MENU:
      return action.payload;
    default:
      return state;
  }
}

const initialState = null

export function roleMenuFunction(state = initialState, action: any) {
  switch (action.type) {
    case ADD_ROLE_MENU_FUNC:
      return action.payload;
    default:
      return state;
  }
}

