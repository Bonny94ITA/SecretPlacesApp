import {AUTHENTICATE, LOGOUT, SET_LISTENER} from "../actions/auth";

const initialState = {
    id: null,
    token: null,
    tokenType: null,
    listener: null
}

const authReducer = (state = initialState, action) => {
    //console.log(action);
    switch (action.type) {
        case AUTHENTICATE:
            return {id: action.userId, token: action.token, tokenType: action.tokenType};
        case LOGOUT:
            if (state.listener != null)
                state.listener.remove();
            return initialState;
        case SET_LISTENER:
            const newState = Object.assign({}, state);
            newState.listener = action.subscription;
            return newState;
        default:
            return state;
    }
}

export default authReducer;
