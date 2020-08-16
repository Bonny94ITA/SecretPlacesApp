import { AsyncStorage } from 'react-native';

// export const SIGNUP = 'SIGNUP';
// export const LOGIN = 'LOGIN';
export const AUTHENTICATE = 'AUTHENTICATE';
export const LOGOUT = 'LOGOUT';

let timer;

export const authenticate = (userId, token) => {
    return { type: AUTHENTICATE, userId: userId, token: token };
};

export const logout = () => {
    clearLogoutTimer();
    AsyncStorage.removeItem('userData');
    return { type: LOGOUT };
};

const clearLogoutTimer = () => {
    if (timer) {
        clearTimeout(timer);
    }
};

const setLogoutTimer = expirationTime => {
    return dispatch => {
        timer = setTimeout(() => {
            dispatch(logout());
        }, expirationTime);
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
        console.log(resData);

        dispatch(authenticate(resData.guest.id, resData.token.idToken));

        const expirationDate = new Date(
            new Date().getTime() + parseInt(resData.token.ttl) * 1000
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

