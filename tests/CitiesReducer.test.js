import {SET_CITIES, CLEAR, setCities, clearCities} from "../store/actions/cities";
import serverURL from "../components/ServerInfo";
import {clearAlternatives} from "../store/actions/ss";
import {AUTHENTICATE} from "../store/actions/auth";
const fetch = require("node-fetch");

function timeout(milliseconds, promise) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            reject(new Error("Timeout exceeded."))
        }, milliseconds);
        promise.then(resolve, reject);
    });
}

async function getCities() {
    let cities = null;

    await timeout(5000, fetch(serverURL + '/hotels/cities'))
        .then(async function (response) {
            cities = await response.json();
        }, function (error) {
            console.log(error);
        }).catch(function (error) {
            console.log(error);
        });

    return cities;
}

const initialState = {
    cities: null
}

const citiesReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_CITIES:
            return {cities: action.cities};
        case CLEAR:
            return initialState;
        default:
            return state;
    }
}

describe('<HomepageScreen />', () => {
    it('set cities', async () => {
        const cities = await getCities();
        expect(citiesReducer(initialState, setCities(cities))).toEqual({
            cities: cities
        });
    });
    it('reset cities', async () => {
        expect(citiesReducer(initialState, clearCities())).toEqual({
            cities: null
        });
    });
});