import { handleActions } from 'redux-actions';
import './actions';

import {
  LOGIN,
} from './action-types';

const defaultState = {
    ww: {}
};

export const auth = handleActions({
  [LOGIN]: (state = defaultState, { payload }) => {
      return {
        ...state,
        ww: payload
      };
  },
}, defaultState);
