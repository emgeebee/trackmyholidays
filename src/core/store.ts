import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import logger from "redux-logger";
import { rootReducer } from "./reducer";

export const mainStore = () => {
  return createStore(rootReducer, applyMiddleware(thunk as any, logger as any));
};
