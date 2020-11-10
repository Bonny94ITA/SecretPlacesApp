export const SET_ALTERNATIVES = 'SET_ALTERNATIVES';
export const CLEAR = 'CLEAR';

export const setAlternatives = (alternatives) => {
    return {type: SET_ALTERNATIVES, alts: alternatives};
};

export const clearAlternatives = () => {
    return {type: CLEAR};
};