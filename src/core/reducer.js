import { combineReducers } from 'redux';

import { auth } from './auth/reducer';
import { config } from './config/reducer';
import { dates } from './dates/reducer';

export const rootReducer = combineReducers({
    auth,
    config,
    dates
});
