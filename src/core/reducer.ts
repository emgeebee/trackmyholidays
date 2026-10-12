import { combineReducers, ReducersMapObject } from "redux";

import { auth } from "./auth/reducer";
import { config } from "./config/reducer";
import { dates } from "./dates/reducer";
import { RootState } from "../types/holiday";

const reducers: ReducersMapObject<RootState, any> = {
  auth,
  config,
  dates,
};

export const rootReducer = combineReducers(reducers);
