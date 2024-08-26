export const ADD_MAS_GROUP_PPRODUCT = "ADD_MAS_GROUP_PPRODUCT";
export const ADD_MAS_SEASON = "ADD_MAS_SEASON";

export function add_mas_groupproduct(add: any) {
  return {
    type: ADD_MAS_GROUP_PPRODUCT,
    payload: add,
  };
}

export function add_mas_season(add: any) {
  return {
    type: ADD_MAS_SEASON,
    payload: add,
  };
}