import { createAction } from "../action-helpers";
import { getToken } from "../auth/selectors";
import { LOGOUT } from "../auth/action-types";
import { clearAuth } from "../auth/storage";
import { getHolidaysApiBase } from "./api-base";
import { defaultState } from "./constants";

import {
  DATES_DESELECT,
  DATES_SELECT_HOLIDAY,
  DATES_SELECT_DAY,
  FETCH_DATES_FROM_SERVER,
  LOAD_DATES_FROM_SERVER,
  ADD_NEW_BANK_HOLIDAY,
  UPDATE_BANK_HOLIDAYS,
  DATES_UPDATE_CARRIED_OVER,
  DATES_UPDATE_PER_YEAR,
  DATES_HALF_DAY,
} from "./action-types";
import type {
  AppThunk,
  Holiday,
  HolidayMapEntry,
  HolidayState,
  RootState,
  SelectedDay,
  ServerData,
} from "../../types/holiday";

export const deselectAction = createAction<HolidayMapEntry>(DATES_DESELECT);

export const halfDayToggleAction = createAction<HolidayMapEntry>(DATES_HALF_DAY);

export const fetchDatesAction = createAction(FETCH_DATES_FROM_SERVER);

export const loadDatesAction = createAction<ServerData>(LOAD_DATES_FROM_SERVER);

export const addNewBH = createAction(ADD_NEW_BANK_HOLIDAY);

export const updateBH = createAction<Holiday[]>(UPDATE_BANK_HOLIDAYS);

export const selectHoliday = createAction<SelectedDay>(DATES_SELECT_HOLIDAY);

export const selectDayAction = createAction<HolidayState>(DATES_SELECT_DAY);

export const updatePerYearAction = createAction<string>(DATES_UPDATE_PER_YEAR);

export const updateCarriedOverAction = createAction<string>(
  DATES_UPDATE_CARRIED_OVER
);

const saveCurrentDates = (): AppThunk => (dispatch, getState) => {
  const state = getState();
  dispatch(
    saveDates(
      JSON.stringify({
        ...state.dates,
        selected: "",
      }),
      state
    )
  );
};

export const saveDaysPerYear =
  (value: string): AppThunk =>
  (dispatch) => {
    dispatch(updatePerYearAction(value));
    dispatch(saveCurrentDates());
  };

export const saveCarriedOver =
  (value: string): AppThunk =>
  (dispatch) => {
    dispatch(updateCarriedOverAction(value));
    dispatch(saveCurrentDates());
  };

export const deselectDay =
  (payload: HolidayMapEntry): AppThunk =>
  (dispatch, getState) => {
    dispatch(deselectAction(payload));
    const state = getState();
    dispatch(
      saveDates(
        JSON.stringify({
          ...state.dates,
          selected: "",
        }),
        state
      )
    );
  };

export const halfDayToggle =
  (payload: HolidayMapEntry): AppThunk =>
  (dispatch, getState) => {
    dispatch(halfDayToggleAction(payload));
    const state = getState();
    dispatch(
      saveDates(
        JSON.stringify({
          ...state.dates,
          selected: "",
        }),
        state
      )
    );
  };

export const selectDay =
  (payload: string | null): AppThunk =>
  (dispatch, getState) => {
    const fullState = getState();
    const state = fullState.dates;
    let newHolidays: Holiday[];
    let newStartDay: string;
    if (state.startDay === "" || payload === null) {
      newStartDay = state.startDay === "" && payload !== null ? payload : "";
      newHolidays = state.holidays;
    } else {
      newStartDay = "";
      newHolidays = [
        ...state.holidays,
        {
          start: state.startDay,
          end: payload,
        },
      ];
    }
    const newState: HolidayState = {
      ...state,
      selected:
        state.selected?.formattedDay === payload || payload === null
          ? null
          : state.selected,
      startDay: newStartDay,
      holidays: [...newHolidays],
      endOfCurrent: "",
    };
    dispatch(selectDayAction(newState));
    if (state.startDay !== "" && payload !== null) {
      dispatch(selectHoliday({ formattedDay: payload, isBHoliday: false }));
      dispatch(
        saveDates(
          JSON.stringify({
            ...newState,
            selected: "",
          }),
          fullState
        )
      );
    }
  };

export const fetchDates =
  (): AppThunk<Promise<void>> => async (dispatch, getState) => {
    const state = getState();
    const token = getToken(state);
    const apiBase = getHolidaysApiBase(state);
    dispatch(fetchDatesAction());
    try {
      const response = await fetch(`${apiBase}/holidays`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (response.status === 401) {
        clearAuth();
        dispatch({ type: LOGOUT });
        dispatch(loadDatesAction({ text: defaultState }));
        return;
      }
      const json: ServerData = await response.json();
      dispatch(loadDatesAction(json));
    } catch (e) {
      console.log(e);
      dispatch(loadDatesAction({ text: defaultState }));
    }
  };

export const saveDates =
  (data: string, state: RootState): AppThunk<Promise<Response>> =>
  () => {
    const token = getToken(state);
    const apiBase = getHolidaysApiBase(state);
    return fetch(`${apiBase}/holidays`, {
      method: "POST",
      body: data,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
  };
