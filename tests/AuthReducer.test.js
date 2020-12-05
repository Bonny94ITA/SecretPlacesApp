import serverURL from "../components/ServerInfo";
import {AUTHENTICATE, LOGOUT, SET_LISTENER} from "../store/actions/auth";
import {sha256} from "js-sha256";

const fetch = require("node-fetch");

function timeout(milliseconds, promise) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            reject(new Error("Timeout exceeded."))
        }, milliseconds);
        promise.then(resolve, reject);
    });
}

const login = async (email, password) => {
    let res = null;

    await timeout(5000, fetch(serverURL + '/guests/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: email,
            pwd: sha256(password)
        })
    })).then(function (response) {
        res = response.json();
    });

    return res;
}

const initialState = {
    id: null,
    token: null,
    tokenType: null,
    listener: null
}

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case AUTHENTICATE:
            return {id: action.userId, token: action.token, tokenType: action.tokenType};
        case LOGOUT:
            if (state.listener != null)
                state.listener.remove();
            return initialState;
        case SET_LISTENER:
            const newState = Object.assign({}, state);
            newState.listener = action.subscription;
            return newState;
        default:
            return state;
    }
}

const authenticate = (userId, token, tokenType, expiryTime) => {
    return {type: AUTHENTICATE, userId: userId, token: token, tokenType: tokenType}
};

describe('<LoginScreen />', () => {
    it('auth reducer', async () => {
        const resData = await login("f@f.com", "ciao");
        expect(authReducer(initialState, authenticate(resData.guest.id, resData.token.idToken, 0, parseInt(resData.token.ttl)))).toEqual({
            id: resData.guest.id,
            token: resData.token.idToken,
            tokenType: 0
        });
    });
});