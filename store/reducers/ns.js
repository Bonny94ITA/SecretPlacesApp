import {SET_FREE_ROOMS, CLEAR} from "../actions/ns";

const initialState = {
    freeRooms: null
}

const ns = (state = initialState, action) => {
    console.log(action);
    switch (action.type) {
        case SET_FREE_ROOMS:
            return {freeRooms: action.fr};
        case CLEAR:
            return initialState;
        default:
            return state;
    }
}

export default ns;