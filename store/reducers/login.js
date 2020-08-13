import {SUBMIT_LOGIN} from "../actions/login";

const initialState = {
    id: null,
    email: null,
    password: null
}

const loginReducer = (state = initialState, action) => {
    console.log(action);
    switch(action.type) {
        case SUBMIT_LOGIN:
            state.id = 1;
            state.email = action.loginInfo.email;
            state.password = action.loginInfo.password;
            return state;
        default:
            return state;
    }
}

export default loginReducer;
