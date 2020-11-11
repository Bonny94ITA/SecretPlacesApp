export const SET_FREE_ROOMS = 'SET_FREE_ROOMS';
export const CLEAR_FREE_ROOMS = 'CLEAR_FREE_ROOMS';

export const setFreeRooms = (freeRooms) => {
    return {type: SET_FREE_ROOMS, fr: freeRooms};
};

export const clearFreeRooms = () => {
    return {type: CLEAR_FREE_ROOMS};
};