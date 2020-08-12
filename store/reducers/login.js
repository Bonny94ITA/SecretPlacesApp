import {SUBMIT_LOGIN} from "../actions/login";

const initialState = {
    id: null,
    email: null,
    password: null
}

const loginReducer = (state = initialState, action) => {
    switch(action.type) {
        case SUBMIT_LOGIN:
            state.id = action.loginInfo.id;
            state.email = action.loginInfo.email;
            state.password = action.loginInfo.password;
            return state;
        default:
            return state;
    }
}

export default loginReducer;
