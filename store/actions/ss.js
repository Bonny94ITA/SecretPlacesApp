export const SET_ALTERNATIVES = 'SET_ALTERNATIVES';
export const CLEAR_ALTERNATIVES = 'CLEAR_ALTERNATIVES';

export const setAlternatives = (alternatives) => {
    return {type: SET_ALTERNATIVES, alts: alternatives};
};

export const clearAlternatives = () => {
    return {type: CLEAR_ALTERNATIVES};
};