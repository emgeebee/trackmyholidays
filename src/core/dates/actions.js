import { createAction } from 'redux-actions';
import { getToken } from '../auth/selectors';
import { defaultState } from './constants';

import {
  DATES_DESELECT,
  DATES_SELECT_HOLIDAY,
  DATES_SELECT_DAY,
  FETCH_DATES_FROM_SERVER,
  LOAD_DATES_FROM_SERVER,
  ADD_NEW_BANK_HOLIDAY,
  UPDATE_BANK_HOLIDAYS,
} from './action-types';

export const deselectAction = createAction(DATES_DESELECT);

export const fetchDatesAction = createAction(FETCH_DATES_FROM_SERVER);

export const loadDatesAction = createAction(LOAD_DATES_FROM_SERVER);

export const addNewBH = createAction(ADD_NEW_BANK_HOLIDAY);

export const updateBH = createAction(UPDATE_BANK_HOLIDAYS);

export const selectHoliday = createAction(DATES_SELECT_HOLIDAY);

export const deselectDay = (payload) => {
    return async (dispatch, getState) => {
        await dispatch(deselectAction(payload));
        const state = getState();
        dispatch(saveDates(JSON.stringify({
            ...state.dates,
            selected: ''
        }), state));
    }
}

export const selectDay = (payload) => {
    return async (dispatch, getState) => {
        const fullState = getState();
        const state = fullState.dates;
        let newHolidays;
        let newStartDay;
        if (state.startDay === '') {
            newStartDay = payload;
            newHolidays = state.holidays;
        } else {
            newStartDay = '';
            newHolidays = [...state.holidays, {
                start: state.startDay,
                end: payload
            }];
        }
        const newState = {
            ...state,
            startDay: newStartDay,
            holidays: [ ...newHolidays ],
            endOfCurrent: ''
        };
        await dispatch({
            type: DATES_SELECT_DAY,
            payload: newState
        })
        if (state.startDay !== '') {
            dispatch(saveDates(JSON.stringify({
                ...newState,
                selected: ''
            }), fullState));
        }
    }
}

export const fetchDates = () => {
    return (dispatch, getState) => {
        const token = getToken(getState());
        dispatch(fetchDatesAction())
        return fetch(`https://78b76ebpsj.execute-api.us-west-2.amazonaws.com/dev/holidays`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        })
        .then(response => response.json())
        .then(json => dispatch(loadDatesAction(json)))
        .catch(e => dispatch(loadDatesAction({text: defaultState})))
    }
}

export const saveDates = (data, state) => {
    return (dispatch) => {
        console.log(state);
        const token = getToken(state);
        return fetch(`https://78b76ebpsj.execute-api.us-west-2.amazonaws.com/dev/holidays`, {
            method: 'POST',
            body: data,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        })

    }
}
