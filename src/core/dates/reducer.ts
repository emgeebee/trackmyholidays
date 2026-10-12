import { createReducer } from "../action-helpers";
import { filterOutCurrentYear } from "./selectors";
import { defaultState } from "./constants";
import {
  Holiday,
  HolidayMapEntry,
  HolidayState,
  NamedDay,
  SelectedDay,
  ServerData,
} from "../../types/holiday";

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
  UPDATE_BANK_HOLIDAYS,
  DATES_HALF_DAY,
  DATES_RENAME_HOLIDAY,
  DATES_RENAME_BANK_HOLIDAY,
  DATES_CONVERT_TO_BANK_HOLIDAY,
  DATES_REMOVE_BANK_HOLIDAY,
} from "./action-types";

if (typeof defaultState.carriedOver === "number") {
  const co = defaultState.carriedOver;
  defaultState.carriedOver = {};
  defaultState.carriedOver[defaultState.currentYear] = co;
}

const withName = (hol: Holiday, name: string): Holiday => {
  const { name: _previous, ...rest } = hol;
  return name ? { ...rest, name } : rest;
};

type DatesPayloads = {
  [FETCH_DATES_FROM_SERVER]: void;
  [DATES_RENAME_HOLIDAY]: NamedDay;
  [DATES_RENAME_BANK_HOLIDAY]: NamedDay;
  [DATES_CONVERT_TO_BANK_HOLIDAY]: NamedDay;
  [DATES_REMOVE_BANK_HOLIDAY]: string;
  [UPDATE_BANK_HOLIDAYS]: Holiday[];
  [LOAD_DATES_FROM_SERVER]: ServerData;
  [DATES_SELECT_DAY]: HolidayState;
  [DATES_SELECT_END_OF_CURRENT]: string;
  [DATES_UPDATE_PER_YEAR]: string;
  [DATES_UPDATE_CARRIED_OVER]: string;
  [DATES_SELECT_START_MONTH]: number;
  [DATES_SELECT_HOLIDAY]: SelectedDay;
  [DATES_CHANGE_YEAR]: number;
  [DATES_DESELECT]: HolidayMapEntry;
  [DATES_HALF_DAY]: HolidayMapEntry;
};

export const dates = createReducer<HolidayState, DatesPayloads>(
  defaultState,
  {
    [FETCH_DATES_FROM_SERVER]: (state) => ({
      ...state,
      loading: true,
    }),
    [DATES_RENAME_HOLIDAY]: (state, { payload }) => ({
      ...state,
      holidays: state.holidays.map((hol) =>
        hol.start === payload.start ? withName(hol, payload.name) : hol
      ),
    }),
    [DATES_RENAME_BANK_HOLIDAY]: (state, { payload }) => ({
      ...state,
      bankHolidays: state.bankHolidays.map((bh) =>
        bh.start === payload.start ? withName(bh, payload.name) : bh
      ),
    }),
    [DATES_CONVERT_TO_BANK_HOLIDAY]: (state, { payload }) => ({
      ...state,
      holidays: state.holidays.filter((hol) => hol.start !== payload.start),
      bankHolidays: [
        ...state.bankHolidays,
        { start: payload.start, name: payload.name },
      ],
    }),
    [DATES_REMOVE_BANK_HOLIDAY]: (state, { payload }) => ({
      ...state,
      bankHolidays: state.bankHolidays.filter((bh) => bh.start !== payload),
      selected: null,
    }),
    [UPDATE_BANK_HOLIDAYS]: (state, { payload }) => {
      const others = state.bankHolidays.filter(
        filterOutCurrentYear(state.currentYear, state.startMonth)
      );
      return {
        ...state,
        bankHolidays: [...others, ...payload],
      };
    },
    [LOAD_DATES_FROM_SERVER]: (state, { payload }) => {
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
    [DATES_SELECT_DAY]: (_state, { payload }) => {
      return payload;
    },
    [DATES_SELECT_END_OF_CURRENT]: (state, { payload }) => ({
      ...state,
      endOfCurrent: payload,
    }),
    [DATES_UPDATE_PER_YEAR]: (state, { payload }) => {
      const newState = {
        ...state,
        daysPerYear: parseInt(payload),
      };
      return newState;
    },
    [DATES_UPDATE_CARRIED_OVER]: (state, { payload }) => {
      const newState = {
        ...state,
        carriedOver: {
          ...state.carriedOver,
          [state.currentYear]: parseInt(payload),
        },
      };
      return newState;
    },
    [DATES_SELECT_START_MONTH]: (state, { payload }) => ({
      ...state,
      startMonth: payload,
    }),
    [DATES_SELECT_HOLIDAY]: (state, { payload }) => ({
      ...state,
      selected: payload === state.selected ? null : payload,
    }),
    [DATES_CHANGE_YEAR]: (state, { payload }) => ({
      ...state,
      currentYear: state.currentYear + payload,
      startDay: "",
    }),
    [DATES_DESELECT]: (state, { payload }) => {
      const newState = {
        ...state,
        holidays: state.holidays.filter(
          (hol) => hol.start !== payload.hol.start
        ),
      };
      return newState;
    },
    [DATES_HALF_DAY]: (state, { payload }): HolidayState => {
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
  }
);
