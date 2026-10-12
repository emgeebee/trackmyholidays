import { createReducer } from "../action-helpers";
import { CHANGE_CONFIG, LOAD_CONFIG, CONFIG_LOADED } from "./action-types";
import { ConfigState } from "../../types/holiday";

type ConfigPayloads = {
  [CHANGE_CONFIG]: void;
  [LOAD_CONFIG]: void;
  [CONFIG_LOADED]: ConfigState["data"];
};

const defaultState: ConfigState = {
  configIsOpen: false,
  loading: false,
  data: {},
};

export const config = createReducer<ConfigState, ConfigPayloads>(
  defaultState,
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
  }
);
