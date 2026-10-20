import { combineReducers } from "redux";

import { auth } from "./auth/reducer";
import { config } from "./config/reducer";
import { dates } from "./dates/reducer";
import { teams } from "./teams/reducer";

export const rootReducer = combineReducers({
  auth,
  config,
  dates,
  teams,
});
