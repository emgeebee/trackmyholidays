// import { combineReducers } from 'redux';
import { handleActions } from 'redux-actions';
import { filterOutCurrentYear } from './selectors';
import { defaultState } from './constants';

import {
  DATES_CHANGE_YEAR,
  DATES_SELECT_DAY,
  DATES_SELECT_HOLIDAY,
  DATES_SELECT_END_OF_CURRENT,
  DATES_SELECT_START_MONTH,
  DATES_DESELECT,
  DATES_UPDATE_CARRIED_OVER,
  DATES_UPDATE_PER_YEAR,
  LOAD_DATES_FROM_SERVER,
  FETCH_DATES_FROM_SERVER,
  ADD_NEW_BANK_HOLIDAY,
  UPDATE_BANK_HOLIDAYS,
  DATES_HALF_DAY
} from './action-types';

if ( typeof defaultState.carriedOver === 'number' ) {
    const co = defaultState.carriedOver
    defaultState.carriedOver = {};
    defaultState[defaultState.currentYear] = co;
}

export const dates = handleActions({
    [FETCH_DATES_FROM_SERVER]: (state, {payload}) => ({
        ...state,
        loading: true
    }),
    [ADD_NEW_BANK_HOLIDAY]: (state) => ({
        ...state,
        bankHolidays: [...state.bankHolidays, {
            start: `${String(state.currentYear).slice(2,4)}-${state.startMonth+1}-01`,
            name: 'a'
        }]
    }),
    [UPDATE_BANK_HOLIDAYS]: (state, {payload}) => {
        const others = state.bankHolidays.filter(filterOutCurrentYear(state.currentYear, state.startMonth));
        return {
            ...state,
            bankHolidays: [
                ...others,
                ...payload
            ]
        }
    },
    [LOAD_DATES_FROM_SERVER]: (state, {payload}) => {
        const data = payload.text;
        return {
            ...state,
            startMonth: data.startMonth,
            currentYear: data.currentYear,
            daysPerYear: data.daysPerYear,
            carriedOver: data.carriedOver,
            holidays: data.holidays,
            bankHolidays: data.bankHolidays,
            loading: false
        }
    },
    [DATES_SELECT_DAY]: (state = defaultState, { payload }) => {
        return payload;
    },
    [DATES_SELECT_END_OF_CURRENT]: (state, {payload}) => ({
        ...state,
        endOfCurrent: payload,
    }),
    [DATES_UPDATE_PER_YEAR]: (state, {payload}) => {
        const newState = {
            ...state,
            daysPerYear: parseInt(payload)
        };
        return newState;
    },
    [DATES_UPDATE_CARRIED_OVER]: (state, {payload}) => {
        const newState = {
            ...state,
            carriedOver: {
                ...state.carriedOver,
                [state.currentYear]: parseInt(payload)
            }
        };
        return newState;
    },
    [DATES_SELECT_START_MONTH]: (state, {payload}) => ({
        ...state,
        startMonth: payload
    }),
    [DATES_SELECT_HOLIDAY]: (state, {payload}) => ({
        ...state,
        selected: payload
    }),
    [DATES_CHANGE_YEAR]: (state, {payload}) => ({
        ...state,
        currentYear: state.currentYear + payload,
        startDay: ''
    }),
    [DATES_DESELECT]: (state, {payload}) => {
        const newState = {
            ...state,
            holidays: state.holidays.filter(hol => hol.start !== payload.hol.start)
        };
        return newState;
    },
    [DATES_HALF_DAY]: (state, {payload}) => {
        const newState = {
            ...state,
            holidays: state.holidays.map(hol => {
                if (hol.start === payload.hol.start) {
                    return {
                        ...hol,
                        half: !hol.half
                    }
                }
                return hol
            })
        };
        return newState;
    },}, defaultState);
