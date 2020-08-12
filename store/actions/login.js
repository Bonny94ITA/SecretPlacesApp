export const SUBMIT_LOGIN = 'SUBMIT_LOGIN';

// export const submitLogin = () => {
//     return {type: SUBMIT_LOGIN};
// }

export const submitLogin = (email, password) => {
    return async dispatch => {
        //Codice asincrono!
        const response = await fetch('https://secret-places-test.firebaseio.com/testlogin.json', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                pwd: password
            })
        });

        const resData = await response.json();
        console.log(resData);

        dispatch({
            type: SUBMIT_LOGIN,
            loginInfo: {id: resData.id, email, password}
        });
    };
};
