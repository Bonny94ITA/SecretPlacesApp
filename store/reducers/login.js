import {SUBMIT_LOGIN} from "../actions/login";

const initialState = {
    id: null,
    email: null,
    password: null
}

const loginReducer = (state = initialState, action) => {
    switch(action.type) {
        case SUBMIT_LOGIN:
            return state;
        default:
            return state;
    }
}

export default loginReducer;
