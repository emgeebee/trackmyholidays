import { handleActions } from "redux-actions";
import { CHANGE_CONFIG, LOAD_CONFIG, CONFIG_LOADED } from "./action-types";

const defaultState = {
  configIsOpen: false,
  loading: false,
  data: {},
};

export const config = handleActions(
  {
    [CHANGE_CONFIG]: (state) => ({
      ...state,
      configIsOpen: !state.configIsOpen,
    }),
    [LOAD_CONFIG]: (state) => ({
      ...state,
      loading: true,
    }),
    [CONFIG_LOADED]: (state, { payload }) => ({
      ...state,
      loading: false,
      data: payload,
    }),
  },
  defaultState
);
