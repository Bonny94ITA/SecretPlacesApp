import {SET_ALTERNATIVES, CLEAR} from "../actions/ss";

const initialState = {
    alternatives: null
}

const ss = (state = initialState, action) => {
    //console.log(action);
    switch (action.type) {
        case SET_ALTERNATIVES:
            return {alternatives: action.alts};
        case CLEAR:
            return initialState;
        default:
            return state;
    }
}

export default ss;