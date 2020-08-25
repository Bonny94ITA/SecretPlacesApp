import {AUTHENTICATE} from "./auth";

export const SET_FREE_ROOMS = 'SET_FREE_ROOMS';
export const CLEAR = 'CLEAR';

export const setFreeRooms = (freeRooms) => {
    return {type: SET_FREE_ROOMS, fr: freeRooms};
};