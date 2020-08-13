export const SUBMIT_REGISTER = 'SUBMIT_REGISTER';

export const submitRegister = (email, password, username) => {
    return async dispatch => {
        // any async code you want!
        const response = await fetch('https://secret-places-test.firebaseio.com/testRegister.json', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                password,
                username
            })
        });

        const resData = await response.json();

        dispatch({
            type: SUBMIT_REGISTER,
            loginInfo: {
                id: resData.id, email, password, username
            }
        });
    };
};

