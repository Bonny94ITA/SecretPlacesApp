import {SET_FREE_ROOMS, CLEAR_FREE_ROOMS} from "../actions/ns";

const initialState = {
    freeRooms: null
}

const ns = (state = initialState, action) => {
    //console.log(action);
    switch (action.type) {
        case SET_FREE_ROOMS:
            return {freeRooms: action.fr};
        case CLEAR_FREE_ROOMS:
            return initialState;
        default:
            return state;
    }
}

export default ns;