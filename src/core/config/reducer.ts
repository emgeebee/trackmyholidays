import { createReducer } from "../action-helpers";
import { CHANGE_CONFIG, LOAD_CONFIG, CONFIG_LOADED } from "./action-types";
import { ConfigState } from "../../types/holiday";

type ConfigPayloads = {
  [CHANGE_CONFIG]: number | undefined;
  [LOAD_CONFIG]: void;
  [CONFIG_LOADED]: ConfigState["data"];
};

const defaultState: ConfigState = {
  configIsOpen: false,
  configTab: 0,
  loading: false,
  data: {},
};

export const config = createReducer<ConfigState, ConfigPayloads>(
  defaultState,
  {
    [CHANGE_CONFIG]: (state, { payload }) => ({
      ...state,
      configIsOpen: !state.configIsOpen,
      configTab: typeof payload === "number" ? payload : 0,
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
