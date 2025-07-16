import { Action, createAction } from "redux-actions";
import { getToken } from "../auth/selectors";
import { base, defaultState } from "./constants";

type GetState = () => RootState;
type Dispatch = (action: Action<any>) => void;

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
import { RootState } from "../../types/holiday";

export const deselectAction = createAction(DATES_DESELECT);

export const halfDayToggleAction = createAction(DATES_HALF_DAY);

export const fetchDatesAction = createAction(FETCH_DATES_FROM_SERVER);

export const loadDatesAction = createAction(LOAD_DATES_FROM_SERVER);

export const addNewBH = createAction(ADD_NEW_BANK_HOLIDAY);

export const updateBH = createAction(UPDATE_BANK_HOLIDAYS);

export const selectHoliday = createAction(DATES_SELECT_HOLIDAY);

export const updatePerYearAction = createAction(
  DATES_UPDATE_PER_YEAR,
  (co: number) => co
);

export const updateCarriedOverAction = createAction(DATES_UPDATE_CARRIED_OVER);

export const deselectDay = (payload: string) => {
  return async (dispatch: Dispatch, getState: GetState) => {
    await dispatch(deselectAction(payload));
    const state = getState();
    dispatch(
      saveDates(
        JSON.stringify({
          ...state.dates,
          selected: "",
        }),
        state
      ) as any
    );
  };
};

export const halfDayToggle = (payload: string) => {
  return async (dispatch: Dispatch, getState: GetState) => {
    await dispatch(halfDayToggleAction(payload));
    const state = getState();
    dispatch(
      saveDates(
        JSON.stringify({
          ...state.dates,
          selected: "",
        }),
        state
      ) as any
    );
  };
};

export const selectDay = (payload: string) => {
  return async (dispatch: Dispatch, getState: GetState) => {
    const fullState = getState();
    const state = fullState.dates;
    let newHolidays;
    let newStartDay;
    if (state.startDay === "") {
      newStartDay = payload;
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
    const newState = {
      ...state,
      selected:
        state.selected?.formattedDay === payload || payload === null
          ? null
          : state.selected,
      startDay: newStartDay,
      holidays: [...newHolidays],
      endOfCurrent: "",
    };
    await dispatch({
      type: DATES_SELECT_DAY,
      payload: newState,
    });
    if (state.startDay !== "") {
      dispatch(selectHoliday({ formattedDay: payload, isBankHoliday: false }));
      dispatch(
        saveDates(
          JSON.stringify({
            ...newState,
            selected: "",
          }),
          fullState
        ) as any
      );
    }
  };
};

export const fetchDates = () => {
  return (dispatch: Dispatch, getState: GetState) => {
    const token = getToken(getState());
    dispatch(fetchDatesAction());
    return fetch(`${base}/holidays`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((json) => dispatch(loadDatesAction(json)))
      .catch((e) => {
        console.log(e);
        dispatch(loadDatesAction({ text: defaultState }));
      });
  };
};

export const saveDates = (data: string, state: RootState) => {
  return () => {
    const token = getToken(state);
    return fetch(`${base}/holidays`, {
      method: "POST",
      body: data,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
  };
};
