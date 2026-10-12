import { createAction } from "redux-actions";

import { storeInstance } from "../..";
import { fetchDates } from "../dates/actions";

import { LOGIN, LOGIN_AND_LOAD_DATA, LOGOUT } from "./action-types";
import { clearAuth, saveAuth } from "./storage";

export const LoginAction = createAction(
  LOGIN_AND_LOAD_DATA,
  async (payload: { credential?: string | undefined }) => {
    saveAuth(payload);
    await storeInstance.dispatch({
      type: LOGIN,
      payload,
    });
    storeInstance.dispatch(fetchDates() as any);
  }
);

export const logout = () => {
  clearAuth();
  return { type: LOGOUT };
};
