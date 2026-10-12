import { handleActions } from "redux-actions";
import "./actions";

import { LOGIN, LOGOUT } from "./action-types";
import { Action } from "../../types/holiday";
import { loadAuth } from "./storage";

export type AuthState = {
  credential?: string;
  Qt?: {
    Bd?: string;
  };
};

const defaultState: {
  ww: AuthState;
} = {
  ww: loadAuth(),
};

export const auth = handleActions<{ ww: AuthState }, any>(
  {
    [LOGIN]: (state = defaultState, { payload }: Action) => {
      return {
        ...state,
        ww: payload,
      };
    },
    [LOGOUT]: (state = defaultState) => {
      return {
        ...state,
        ww: {},
      };
    },
  },
  defaultState
);
