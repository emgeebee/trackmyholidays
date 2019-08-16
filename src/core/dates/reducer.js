// import { combineReducers } from 'redux';
import { handleActions } from 'redux-actions';

import {
  DATES_CHANGE_YEAR,
  DATES_SELECT_DAY,
  DATES_SELECT_HOLIDAY,
  DATES_SELECT_START_MONTH,
  DATES_DESELECT,
  DATES_UPDATE_CARRIED_OVER,
} from './action-types';

const defaultState = JSON.parse(localStorage.getItem('holidays')) || {
    startMonth: 9,
    currentYear: 2019,
    daysPerYear: 30,
    carriedOver: {
        2019: 5
    },
    startDay: '',
    selected: null,
    holidays: []
};
if ( typeof defaultState.carriedOver === 'number' ) {
    const co = defaultState.carriedOver
    defaultState.carriedOver = {};
    defaultState[defaultState.currentYear] = co;
}

export const dates = handleActions({
  [DATES_SELECT_DAY]: (state = defaultState, { payload }) => {
      let newHolidays;
      let newStartDay;
      let save = false;
      if (state.startDay === '') {
          newStartDay = payload;
          newHolidays = state.holidays;
      } else {
          save = true;
          newStartDay = '';
          newHolidays = [...state.holidays, {
              start: state.startDay,
              end: payload
          }];
      }
      const newState = {
        ...state,
        startDay: newStartDay,
        holidays: [ ...newHolidays ]
      };
      if (save) {
          localStorage.setItem('holidays', JSON.stringify({
              ...newState,
              selected: ''
          }));
      }
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
    localStorage.setItem('holidays', JSON.stringify({
        ...newState,
        selected: ''
    }));
    return newState;
  },
}, defaultState);
