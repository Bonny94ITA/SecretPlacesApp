import {AsyncStorage} from 'react-native';

export const AUTHENTICATE = 'AUTHENTICATE';
export const LOGOUT = 'LOGOUT';

let timer;

export const authenticate = (userId, token, expiryTime) => {
    return dispatch => {
        dispatch(setLogoutTimer(expiryTime));
        dispatch({type: AUTHENTICATE, userId: userId, token: token});
    };
};

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
    //Nelle prossime chiamate (in cui serve il token di sessione), si dovrà passare come parametro anche getState
    return async dispatch => {
        // any async code you want!
        //const response = await fetch('https://secret-places-test.firebaseio.com/testlogin.json', {
        const response = await fetch('http://82.55.6.38:8080/guests/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                pwd: password
            })
        });

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
    };
};

export const submitRegister = (email, password, username) => {
    return async dispatch => {
        // any async code you want!
        await fetch('http://82.55.6.38:8080/guests/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                pwd: password,
                name: username
            })
        });
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

