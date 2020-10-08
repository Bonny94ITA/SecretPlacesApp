import {SET_ALTERNATIVES, CLEAR} from "../actions/ns";

const initialState = {
    freeRooms: null
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