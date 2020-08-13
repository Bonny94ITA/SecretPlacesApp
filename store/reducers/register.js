import {SUBMIT_REGISTER} from "../actions/register";

const initialState = {
    id: null,
    email: null,
    password: null,
    username: null
}

const registerReducer = (state = initialState, action) => {
    console.log(action);
    switch (action.type) {
        case SUBMIT_REGISTER:
            /*state.id = 1;
            state.email = action.loginInfo.email;
            state.password = action.loginInfo.password;*/
            return state;
        default:
            return state;
    }
}

export default registerReducer;
