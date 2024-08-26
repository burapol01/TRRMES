//import {startFetch,endFetch,errorFetch} from '../actions/statusAction'
import { START_LOAD, END_LOAD } from "../actions/loadingScreenAction";

const initialState = {
  loading: false,
  error: "",
};

export function loaddingScreenReducer(state = initialState, action: any) {
  switch (action.type) {
    case START_LOAD:
      return {
        ...state,
        loading: true,
      };

    case END_LOAD:
      return {
        ...state,
        loading: false,
      };
    default:
      return state;
  }
}
