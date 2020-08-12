import {SUBMIT_LOGIN} from "../actions/login";

const initialState = {
    id: null,
    email: null,
    password: null
}

const loginReducer = (state = initialState, action) => {
    switch(action.type) {
        case SUBMIT_LOGIN:
            return { id: 1, email: 'markoff@maicol.com', password: 'MirkoMarkoModel' };
        default:
            return state;
    }
}

export default loginReducer;