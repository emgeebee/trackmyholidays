// import { combineReducers } from 'redux';
import { handleActions } from "redux-actions";
import { filterOutCurrentYear } from "./selectors";
import { defaultState } from "./constants";
import { HolidayState, Action } from "../../types/holiday";

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
  DATES_HALF_DAY,
} from "./action-types";

if (typeof defaultState.carriedOver === "number") {
  const co = defaultState.carriedOver;
  defaultState.carriedOver = {};
  defaultState.carriedOver[defaultState.currentYear] = co;
}

export const dates = handleActions<HolidayState, any>(
  {
    [FETCH_DATES_FROM_SERVER]: (state: HolidayState) => ({
      ...state,
      loading: true,
    }),
    [ADD_NEW_BANK_HOLIDAY]: (state: HolidayState) => ({
      ...state,
      bankHolidays: [
        ...state.bankHolidays,
        {
          start: `${String(state.currentYear).slice(2, 4)}-${
            state.startMonth + 1
          }-01`,
          name: "a",
        },
      ],
    }),
    [UPDATE_BANK_HOLIDAYS]: (state, { payload }: Action) => {
      const others = state.bankHolidays.filter(
        filterOutCurrentYear(state.currentYear, state.startMonth)
      );
      return {
        ...state,
        bankHolidays: [...others, ...payload],
      };
    },
    [LOAD_DATES_FROM_SERVER]: (state, { payload }: Action) => {
      const data = payload.text;
      return {
        ...state,
        startMonth: data.startMonth,
        currentYear: data.currentYear,
        daysPerYear: data.daysPerYear,
        carriedOver: data.carriedOver,
        holidays: data.holidays,
        bankHolidays: data.bankHolidays,
        loading: false,
      };
    },
    [DATES_SELECT_DAY]: (_state: HolidayState, { payload }: Action) => {
      return payload;
    },
    [DATES_SELECT_END_OF_CURRENT]: (
      state: HolidayState,
      { payload }: Action
    ) => ({
      ...state,
      endOfCurrent: payload,
    }),
    [DATES_UPDATE_PER_YEAR]: (state: HolidayState, { payload }: Action) => {
      const newState = {
        ...state,
        daysPerYear: parseInt(payload),
      };
      return newState;
    },
    [DATES_UPDATE_CARRIED_OVER]: (state: HolidayState, { payload }: Action) => {
      const newState = {
        ...state,
        carriedOver: {
          ...state.carriedOver,
          [state.currentYear]: parseInt(payload),
        },
      };
      return newState;
    },
    [DATES_SELECT_START_MONTH]: (state: HolidayState, { payload }: Action) => ({
      ...state,
      startMonth: payload,
    }),
    [DATES_SELECT_HOLIDAY]: (state: HolidayState, { payload }: Action) => ({
      ...state,
      selected: payload === state.selected ? null : payload,
    }),
    [DATES_CHANGE_YEAR]: (state: HolidayState, { payload }: Action) => ({
      ...state,
      currentYear: state.currentYear + payload,
      startDay: "",
    }),
    [DATES_DESELECT]: (state: HolidayState, { payload }: Action) => {
      const newState = {
        ...state,
        holidays: state.holidays.filter(
          (hol) => hol.start !== payload.hol.start
        ),
      };
      return newState;
    },
    [DATES_HALF_DAY]: (
      state: HolidayState,
      { payload }: Action
    ): HolidayState => {
      const newState = {
        ...state,
        holidays: state.holidays.map((hol) => {
          if (hol.start === payload.hol.start) {
            // If already a half day, cycle through: full -> first half -> last half -> full
            const currentHalf = hol.half;
            let newHalf;
            if (!currentHalf) {
              newHalf = "first" as "first";
            } else if (currentHalf === "first") {
              newHalf = "last" as "last";
            } else {
              newHalf = null as null;
            }
            return {
              ...hol,
              half: newHalf,
            };
          }
          return hol;
        }),
      };
      return newState;
    },
  },
  defaultState
);
