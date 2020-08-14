export const SUBMIT_LOGIN = 'SUBMIT_LOGIN';

export const submitLogin = (email, password) => {
    return async dispatch => {
        // any async code you want!
        //const response = await fetch('https://secret-places-test.firebaseio.com/testlogin.json', {
        const response = await fetch('https://79.45.210.230:443/guests/login', {
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

        dispatch({
            type: SUBMIT_LOGIN,
            loginInfo: {
                id: resData.id, email, password
            }
        });
    };
};

