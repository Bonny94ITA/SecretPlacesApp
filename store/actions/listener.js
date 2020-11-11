export const SET_LISTENER = 'SET_LISTENER';
export const REMOVE_SUBSCRIPTION = 'REMOVE_SUBSCRIPTION';

export const setListener = (listener) => {
    return {type: SET_LISTENER, subscription: listener};
};

export const removeListener = () => {
    return {type: REMOVE_SUBSCRIPTION};
};