import { createSelector } from "reselect";
import { RootState } from "../../types/holiday";
import { AuthState } from "./reducer";

export const authSelector: (state: RootState) => AuthState = (
  state: RootState
) => state.auth.ww;

export const getIsLoggedIn = createSelector(authSelector, (ww: AuthState) =>
  ww && ww.credential ? true : false
);

export const getName = createSelector(authSelector, (ww: AuthState) =>
  ww && ww.Qt ? ww.Qt.Bd : ""
);

export const getToken = createSelector(authSelector, (ww: AuthState) =>
  ww && ww.credential ? ww.credential : ""
);
