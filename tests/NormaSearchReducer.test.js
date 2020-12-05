import serverURL from "../components/ServerInfo";
const fetch = require("node-fetch");
import {CLEAR_FREE_ROOMS, clearFreeRooms, SET_FREE_ROOMS, setFreeRooms} from "../store/actions/ns";
import {clearAlternatives} from "../store/actions/ss";

function timeout(milliseconds, promise) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            reject(new Error("Timeout exceeded."))
        }, milliseconds);
        promise.then(resolve, reject);
    });
}

async function normalSearch(city, arrival, departure) {
    let freeRooms = null;

    await timeout(5000, fetch(serverURL + '/hotels/freeRooms', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            city: city,
            arrival: arrival,
            departure: departure
        })
    })).then(async function (response) {
        freeRooms = await response.json();
    }, function (error) {
        console.log(error);
    }).catch(function (error) {
        console.log(error);
    });

    return freeRooms;
}

const initialState = {
    freeRooms: null
}

const normalSearchReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_FREE_ROOMS:
            return {freeRooms: action.fr};
        case CLEAR_FREE_ROOMS:
            return initialState;
        default:
            return state;
    }
}

describe('<NormalSearchScreen />', () => {
    it('set freeRooms', async () => {
        const freeRooms = await normalSearch("Cagliari", "28/11/2020", "5/12/2020");

        const formattedFreeRooms = []
        freeRooms.forEach(element => {
            formattedFreeRooms.push({
                hotelName: element.hotel.name,
                hotelStars: element.hotel.stars,
                cityName: element.hotel.city.name,
                address: element.hotel.address,
                idRoom: element.id,
                numPlaces: element.numPlaces,
                ppn: element.pricePerNight,
                arrival: "28/11/2020",
                departure: "5/12/2020"
            });
        });

        expect(normalSearchReducer(initialState, setFreeRooms(formattedFreeRooms))).toEqual({
            freeRooms: formattedFreeRooms
        });
    });
    it('reset freeRooms', async () => {
        expect(normalSearchReducer(initialState, clearFreeRooms())).toEqual({
            freeRooms: null
        });
    });
});