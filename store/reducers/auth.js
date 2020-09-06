import {AUTHENTICATE, LOGOUT} from "../actions/auth";

const initialState = {
    id: null,
    token: null
}

const authReducer = (state = initialState, action) => {
    //console.log(action);
    switch (action.type) {
        case AUTHENTICATE:
            return {id: action.userId, token: action.token};
        case LOGOUT:
            return initialState;
        default:
            return state;
    }
}

export default authReducer;
