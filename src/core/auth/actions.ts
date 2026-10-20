import { createAction } from "../action-helpers";
import { fetchDates } from "../dates/actions";
import { fetchTeams, fetchTeamInvites } from "../teams/actions";
import type { AppThunk } from "../../types/holiday";

import { LOGIN, LOGOUT } from "./action-types";
import type { AuthState } from "./reducer";
import { clearAuth, saveAuth } from "./storage";

export const loginAction = createAction<AuthState>(LOGIN);
export const logoutAction = createAction(LOGOUT);

export const login =
  (payload: AuthState): AppThunk<Promise<void>> =>
  async (dispatch) => {
    saveAuth(payload);
    dispatch(loginAction(payload));
    await dispatch(fetchDates());
    await dispatch(fetchTeams());
    await dispatch(fetchTeamInvites());
  };

export const logout = (): AppThunk => (dispatch) => {
  clearAuth();
  dispatch(logoutAction());
};
