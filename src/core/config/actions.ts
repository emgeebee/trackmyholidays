import { createAction } from "redux-actions";
import { CHANGE_CONFIG, LOAD_CONFIG, CONFIG_LOADED } from "./action-types";
import { Dispatch } from "redux";

export const changeConfig = createAction(CHANGE_CONFIG);
export const loadConfig = createAction(LOAD_CONFIG);
export const configLoaded = createAction(CONFIG_LOADED);

export const fetchConfig = () => {
  return async (dispatch: Dispatch) => {
    dispatch(loadConfig());
    try {
      const response = await fetch("/env.json");
      const config = await response.json();
      dispatch(configLoaded(config));
    } catch (error) {
      console.error("Failed to load config:", error);
      dispatch(configLoaded({}));
    }
  };
};
