import {AsyncStorage} from 'react-native';
import serverURL from '../../components/ServerInfo';
export const AUTHENTICATE = 'AUTHENTICATE';
export const LOGOUT = 'LOGOUT';

let timer;

export const authenticate = (userId, token, expiryTime) => {
    return dispatch => {
        dispatch(setLogoutTimer(expiryTime));
        dispatch({type: AUTHENTICATE, userId: userId, token: token});
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
                    parseInt(resData.token.ttl)));

            const expirationDate = new Date(
                new Date().getTime() + parseInt(resData.token.ttl)
            );

            saveDataToStorage(resData.token.idToken, resData.guest.id, expirationDate);
        }).catch(function(error) {
            throw new Error(error);
        });
    };
};

export const submitGoogleLogin = (info) => {
    return async dispatch => {

        console.log(info)
        await timeout(5000, fetch(serverURL + '/guests/socialLogin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                token_info: JSON.stringify({token: info.idToken, type: 1})
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
                    "3600000"));

            const expirationDate = new Date(
                new Date().getTime() + parseInt("3600000")
            );

            saveDataToStorage(info.idToken, resData, expirationDate);
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

const saveDataToStorage = (token, userId, expirationDate) => {
    AsyncStorage.setItem(
        'userData',
        JSON.stringify({
            token: token,
            userId: userId,
            expiryDate: expirationDate.toISOString()
        })
    );
};

