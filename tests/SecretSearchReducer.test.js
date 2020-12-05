import serverURL from "../components/ServerInfo";
const fetch = require("node-fetch");
import {CLEAR_ALTERNATIVES, clearAlternatives, SET_ALTERNATIVES, setAlternatives} from "../store/actions/ss";
import * as authActions from "../store/actions/auth";

function timeout(milliseconds, promise) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            reject(new Error("Timeout exceeded."))
        }, milliseconds);
        promise.then(resolve, reject);
    });
}

async function secretSearch(cities, maxBudget, numPeople, onlyRegion, onlyNotRegion,
                            maxStars, minStars, tourismTypes, arrival, departure) {
    let alternatives = null;

    await timeout(5000, fetch (serverURL + '/hotels/secretSearch', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            cities: cities,
            maxBudget: maxBudget,
            people: numPeople,
            onlyRegion: onlyRegion,
            onlyNotRegion: onlyNotRegion,
            maxStars: maxStars,
            minStars: minStars,
            tourismTypes: tourismTypes,
            arrival: arrival,
            departure: departure
        })
    })).then(async function (response) {
        alternatives = await response.json();
    }, function (error) {
        console.log(error);
    }).catch(function (error) {
        console.log(error);
    });

    return alternatives;
}

const initialState = {
    alternatives: null
}

const secretSearchReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_ALTERNATIVES:
            return {alternatives: action.alts};
        case CLEAR_ALTERNATIVES:
            return initialState;
        default:
            return state;
    }
}

describe('<SecretSearchScreen />', () => {
    it('set alternatives', async () => {
        const alternatives = await secretSearch(
            [{region: 'Sardegna', city: 'Nuoro'}, {region: 'Sardegna', city: 'Cagliari'}], 500, 3, 'Cagliari', 'Sicilia',
            4, 2, ['balneare', 'lacustre', 'naturalistico'], "28/11/2020", "5/12/2020");

        const formattedAlternatives = [];
        alternatives.forEach((element, index) => {
            const formattedSojourns = [];
            element.sojourns.forEach((sojourn, sojIndex) => {
                formattedSojourns.push({
                    id: sojIndex,
                    arrival: sojourn.arrival,
                    departure: sojourn.departure,
                    hotelName: sojourn.room.hotel.name,
                    address: sojourn.room.hotel.address,
                    hotelCity: sojourn.room.hotel.city.name,
                    idRoom: sojourn.room.id,
                    stars: sojourn.room.hotel.stars,
                    numPlaces: sojourn.room.numPlaces,
                    pricePerNight: sojourn.room.pricePerNight,
                    totalPrice: sojourn.totalPrice
                });
            });
            formattedAlternatives.push({
                id: index,
                days: element.days,
                sojourns: formattedSojourns,
                totalPrice: element.totalPrice
            });
        });

        expect(secretSearchReducer(initialState, setAlternatives(formattedAlternatives))).toEqual({
            alternatives: formattedAlternatives
        });
    });
    it('reset alternatives', async () => {
        expect(secretSearchReducer(initialState, clearAlternatives())).toEqual({
            alternatives: null
        });
    });
});