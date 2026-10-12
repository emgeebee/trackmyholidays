import { handleActions } from "redux-actions";
import { CHANGE_CONFIG, LOAD_CONFIG, CONFIG_LOADED } from "./action-types";
import { ConfigState } from "../../types/holiday";

const defaultState: ConfigState = {
  configIsOpen: false,
  loading: false,
  data: {} as ConfigState["data"],
};

export const config = handleActions<ConfigState, any>(
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
