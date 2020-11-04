export const SET_CITIES = 'SET_CITIES';
export const CLEAR = 'CLEAR';

export const setCities = (cities) => {
    return {type: SET_CITIES, cities: cities};
};

export const clearCities = () => {
    return {type: CLEAR};
};