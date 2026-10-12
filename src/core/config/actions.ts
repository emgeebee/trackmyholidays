import { createAction } from "../action-helpers";
import { CHANGE_CONFIG, LOAD_CONFIG, CONFIG_LOADED } from "./action-types";
import type { AppThunk, ConfigState } from "../../types/holiday";

export const changeConfig = createAction(CHANGE_CONFIG);
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
