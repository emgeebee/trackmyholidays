import { createAction } from 'redux-actions';

import { storeInstance } from '../..';
import { fetchDates } from '../dates/actions';

import {
  LOGIN,
  LOGIN_AND_LOAD_DATA
} from './action-types';

export const LoginAction = createAction(LOGIN_AND_LOAD_DATA, async (payload) => {
    await storeInstance.dispatch({
        type: LOGIN,
        payload
    });
    storeInstance.dispatch(fetchDates(payload.tokenObj.id_token))
});
