import {AsyncStorage, Platform} from 'react-native';
import serverURL from '../../components/ServerInfo';
export const SET_LISTENER = 'SET_LISTENER';
export const AUTHENTICATE = 'AUTHENTICATE';
export const LOGOUT = 'LOGOUT';

let timer;

export const setListener = (listener) => {
    return {type: SET_LISTENER, subscription: listener};
};

export const authenticate = (userId, token, tokenType, expiryTime) => {
    return dispatch => {
        dispatch(setLogoutTimer(expiryTime));
        dispatch({type: AUTHENTICATE, userId: userId, token: token, tokenType: tokenType});
    };
};

function timeout(milliseconds, promise) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            reject(new Error("Timeout exceeded."))
        }, milliseconds);
        promise.then(resolve, reject);
    });
}

export const submitLogout = () => {
    clearLogoutTimer();
    AsyncStorage.removeItem('userData');
    return {type: LOGOUT};
};

const clearLogoutTimer = () => {
    if (timer) {
        clearTimeout(timer);
    }
};

const setLogoutTimer = expirationTime => {
    return dispatch => {
        timer = setTimeout(() => {
            dispatch(submitLogout());
        }, (6000000)); // ogni minuto effettuo il refresh del token
    };
};

export const submitLogin = (email, password) => {
    return async dispatch => {
        await timeout(5000, fetch(serverURL + '/guests/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                pwd: password
            })
        })).then(async function(response) {
            const resData = await response.json();

            dispatch(
                authenticate(
                    resData.guest.id,
                    resData.token.idToken,
                    0,
                    parseInt(resData.token.ttl)));

            const expirationDate = new Date(
                new Date().getTime() + parseInt(resData.token.ttl)
            );

            saveDataToStorage(resData.token.idToken, 0, resData.guest.id, expirationDate);
        }).catch(function(error) {
            throw new Error(error);
        });
    };
};

export const submitFacebookLogin = (info) => {
    return async dispatch => {
        await timeout(5000, fetch(serverURL + '/guests/socialLogin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                token_info: JSON.stringify({token: info.token, type: 2})
            },
            body: JSON.stringify({
                email: info.email,
                pwd: "",
                name: "",
                social_auth: ""
            })
        })).then(async function(response) {
            const resData = await response.json();

            dispatch(
                authenticate(
                    resData,
                    info.token,
                    2,
                    parseInt("3600000")));

            const expirationDate = new Date(
                new Date().getTime() + parseInt("3600000")
            );

            saveDataToStorage(info.token, 2, resData, expirationDate);
        }).catch(function(error) {
            throw new Error(error);
        });
    };
}

export const submitGoogleLogin = (info) => {
    return async dispatch => {
        let type;
        if (Platform.OS === 'ios')
            type = 11;
        else if (Platform.OS === 'android')
            type = 12;

        await timeout(5000, fetch(serverURL + '/guests/socialLogin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                token_info: JSON.stringify({token: info.idToken, type: type})
            },
            body: JSON.stringify({
                email: info.user.email,
                pwd: "",
                name: "",
                social_auth: ""
            })
        })).then(async function(response) {
            const resData = await response.json();
            console.log(resData)

            dispatch(
                authenticate(
                    resData,
                    info.idToken,
                    type,
                    parseInt("3600000")));

            const expirationDate = new Date(
                new Date().getTime() + parseInt("3600000")
            );

            saveDataToStorage(info.idToken, type, resData, expirationDate);
        }).catch(function(error) {
            throw new Error(error);
        });
    };
};

export const submitRegister = (email, password, username) => {
    return async dispatch => {
        await timeout(5000, fetch(serverURL + '/guests/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                pwd: password,
                name: username
            })
        })).catch(function(error) {
            throw new Error(error);
        })
    };
};

const saveDataToStorage = (token, tt, userId, expirationDate) => {
    AsyncStorage.setItem(
        'userData',
        JSON.stringify({
            token: token,
            tokenType: tt,
            userId: userId,
            expiryDate: expirationDate.toISOString()
        })
    );
};

