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
  UPDATE_BANK_HOLIDAYS,
  DATES_RENAME_HOLIDAY,
  DATES_RENAME_BANK_HOLIDAY,
  DATES_CONVERT_TO_BANK_HOLIDAY,
  DATES_REMOVE_BANK_HOLIDAY,
  DATES_UPDATE_CARRIED_OVER,
  DATES_UPDATE_PER_YEAR,
  DATES_HALF_DAY,
  DATES_UPSERT_MEMORABLE_CALENDAR,
  DATES_REMOVE_MEMORABLE_CALENDAR,
  DATES_UPSERT_MEMORABLE_DATE,
  DATES_REMOVE_MEMORABLE_DATE,
} from "./action-types";
import type {
  AppThunk,
  Holiday,
  HolidayMapEntry,
  HolidayState,
  MemorableCalendar,
  MemorableDate,
  NamedDay,
  RootState,
  SelectedDay,
  ServerData,
} from "../../types/holiday";

export const deselectAction = createAction<HolidayMapEntry>(DATES_DESELECT);

export const halfDayToggleAction = createAction<HolidayMapEntry>(DATES_HALF_DAY);

export const fetchDatesAction = createAction(FETCH_DATES_FROM_SERVER);

export const loadDatesAction = createAction<ServerData>(LOAD_DATES_FROM_SERVER);

export const updateBH = createAction<Holiday[]>(UPDATE_BANK_HOLIDAYS);

export const renameHolidayAction = createAction<NamedDay>(DATES_RENAME_HOLIDAY);

export const renameBankHolidayAction = createAction<NamedDay>(
  DATES_RENAME_BANK_HOLIDAY
);

export const convertToBankHolidayAction = createAction<NamedDay>(
  DATES_CONVERT_TO_BANK_HOLIDAY
);

export const removeBankHolidayAction = createAction<string>(
  DATES_REMOVE_BANK_HOLIDAY
);

export const selectHoliday = createAction<SelectedDay>(DATES_SELECT_HOLIDAY);

export const selectDayAction = createAction<HolidayState>(DATES_SELECT_DAY);

export const updatePerYearAction = createAction<string>(DATES_UPDATE_PER_YEAR);

export const updateCarriedOverAction = createAction<string>(
  DATES_UPDATE_CARRIED_OVER
);

export const upsertMemorableCalendarAction = createAction<MemorableCalendar>(
  DATES_UPSERT_MEMORABLE_CALENDAR
);

export const removeMemorableCalendarAction = createAction<string>(
  DATES_REMOVE_MEMORABLE_CALENDAR
);

export const upsertMemorableDateAction = createAction<MemorableDate>(
  DATES_UPSERT_MEMORABLE_DATE
);

export const removeMemorableDateAction = createAction<string>(
  DATES_REMOVE_MEMORABLE_DATE
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

export const renameHoliday =
  (day: NamedDay): AppThunk =>
  (dispatch) => {
    dispatch(renameHolidayAction(day));
    dispatch(saveCurrentDates());
  };

export const renameBankHoliday =
  (day: NamedDay): AppThunk =>
  (dispatch) => {
    dispatch(renameBankHolidayAction(day));
    dispatch(saveCurrentDates());
  };

export const convertToBankHoliday =
  (day: NamedDay): AppThunk =>
  (dispatch) => {
    dispatch(convertToBankHolidayAction(day));
    dispatch(saveCurrentDates());
  };

export const removeBankHoliday =
  (start: string): AppThunk =>
  (dispatch) => {
    dispatch(removeBankHolidayAction(start));
    dispatch(saveCurrentDates());
  };

/** Replaces the bank holidays for the current holiday year. */
export const saveBankHolidays =
  (bankHolidays: Holiday[]): AppThunk =>
  (dispatch) => {
    dispatch(updateBH(bankHolidays));
    dispatch(saveCurrentDates());
  };

export const saveMemorableCalendar =
  (calendar: MemorableCalendar): AppThunk =>
  (dispatch) => {
    dispatch(upsertMemorableCalendarAction(calendar));
    dispatch(saveCurrentDates());
  };

/** Removes a calendar together with every memorable date in it. */
export const removeMemorableCalendar =
  (id: string): AppThunk =>
  (dispatch) => {
    dispatch(removeMemorableCalendarAction(id));
    dispatch(saveCurrentDates());
  };

export const saveMemorableDate =
  (date: MemorableDate): AppThunk =>
  (dispatch) => {
    dispatch(upsertMemorableDateAction(date));
    dispatch(saveCurrentDates());
  };

export const removeMemorableDate =
  (id: string): AppThunk =>
  (dispatch) => {
    dispatch(removeMemorableDateAction(id));
    dispatch(saveCurrentDates());
  };

/** Opens the footer details for the memorable dates falling on `formattedDay`. */
export const selectMemorableDay = (formattedDay: string) =>
  selectHoliday({ formattedDay, isMemorable: true });

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
