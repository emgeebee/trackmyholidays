import { combineReducers } from 'redux';
import { handleActions } from 'redux-actions';

import {
  DATES_CHANGE_YEAR,
  DATES_SELECT_DAY,
} from './action-types';

const defaultState = {
    startMonth: 9,
    currentYear: 2019,
    daysPerYear: 30,
    carriedOver: 5,
    startDay: '',
    holidays: []
};

export const dates = handleActions({
  [DATES_SELECT_DAY]: (state = defaultState, { payload }) => {
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
      return {
        ...state,
        startDay: newStartDay,
        holidays: [ ...newHolidays ]
      };
  },
  [DATES_CHANGE_YEAR]: (state, {payload}) => ({
    ...state,
    currentYear: state.currentYear + payload,
    startDay: ''
  })
}, defaultState);
