import { createAction } from "../action-helpers";
import { CHANGE_CONFIG, LOAD_CONFIG, CONFIG_LOADED } from "./action-types";
import type { AppThunk, ConfigState } from "../../types/holiday";

/** Toggles the settings sheet; pass a tab index to open on that tab. */
export const changeConfig = createAction<number | undefined>(CHANGE_CONFIG);

export const SETTINGS_TAB = {
  dates: 0,
  bankHolidays: 1,
  memorableDates: 2,
  appearance: 3,
} as const;

export const openSettings =
  (tab: number = SETTINGS_TAB.dates): AppThunk =>
  (dispatch, getState) => {
    if (getState().config.configIsOpen) return;
    dispatch(changeConfig(tab));
    document.body.classList.add("modal-open");
  };
export const loadConfig = createAction(LOAD_CONFIG);
export const configLoaded = createAction<ConfigState["data"]>(CONFIG_LOADED);

export const fetchConfig = (): AppThunk<Promise<void>> => async (dispatch) => {
  dispatch(loadConfig());
  try {
    const response = await fetch(`${import.meta.env.BASE_URL}env.json`);
    const config: ConfigState["data"] = await response.json();
    dispatch(configLoaded(config));
  } catch (error) {
    console.error("Failed to load config:", error);
    dispatch(configLoaded({}));
  }
};
