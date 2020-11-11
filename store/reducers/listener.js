import {SET_LISTENER, REMOVE_SUBSCRIPTION} from "../actions/listener";

const initialState = {
    listener: null
}

const listener = (state = initialState, action) => {
    //console.log(action);
    switch (action.type) {
        case SET_LISTENER:
            return {listener: action.subscription};
        case REMOVE_SUBSCRIPTION:
            state.listener.remove();
            return initialState;
        default:
            return state;
    }
}

export default listener;