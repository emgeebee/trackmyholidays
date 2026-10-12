import { createReducer } from "../action-helpers";
import { LOGIN, LOGOUT } from "./action-types";
import { loadAuth } from "./storage";

export type AuthState = {
  credential?: string;
  Qt?: {
    Bd?: string;
  };
};

type AuthPayloads = {
  [LOGIN]: AuthState;
  [LOGOUT]: void;
};

const defaultState: {
  ww: AuthState;
} = {
  ww: loadAuth(),
};

export const auth = createReducer<{ ww: AuthState }, AuthPayloads>(
  defaultState,
  {
    [LOGIN]: (state, { payload }) => ({
      ...state,
      ww: payload,
    }),
    [LOGOUT]: (state) => ({
      ...state,
      ww: {},
    }),
  }
);
