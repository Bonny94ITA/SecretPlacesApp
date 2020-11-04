import {SET_CITIES, CLEAR} from "../actions/cities";

const initialState = {
    cities: null
}

const cities = (state = initialState, action) => {
    //console.log(action);
    switch (action.type) {
        case SET_CITIES:
            return {cities: action.cities};
        case CLEAR:
            return initialState;
        default:
            return state;
    }
}

export default cities;