import { handleActions } from "redux-actions";
import "./actions";

import { LOGIN } from "./action-types";
import { Action } from "../../types/holiday";

export type AuthState = {
  credential?: string;
  Qt?: {
    Bd?: string;
  };
};

const defaultState: {
  ww: AuthState;
} = {
  ww: {},
};

export const auth = handleActions<{ ww: AuthState }, any>(
  {
    [LOGIN]: (state = defaultState, { payload }: Action) => {
      return {
        ...state,
        ww: payload,
      };
    },
  },
  defaultState
);
