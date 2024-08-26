import { ADD_MAS_GROUP_PPRODUCT, ADD_MAS_SEASON } from "../actions/masterAction";

const initialState = {
    product: null,
    season: null
}

export function masGroupProduct(state = initialState, action: any) {
    switch (action.type) {
        case ADD_MAS_GROUP_PPRODUCT:
            return {
                product : action.payload,
            };

        default:
            return state;
    }
}

export function masSeason(state = initialState, action: any) {
    switch (action.type) {
        case ADD_MAS_SEASON:
            return {
                season : action.payload,
            };

        default:
            return state;
    }
}