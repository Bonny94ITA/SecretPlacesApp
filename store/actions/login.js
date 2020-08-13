export const SUBMIT_LOGIN = 'SUBMIT_LOGIN';

export const submitLogin = (email, password) => {
    return async dispatch => {
        // any async code you want!
        const response = await fetch('https://secret-places-test.firebaseio.com/testlogin.json', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                password
            })
        });

        const resData = await response.json();

        dispatch({
            type: SUBMIT_LOGIN,
            loginInfo: {
                email, password
            }
        });
    };
};

