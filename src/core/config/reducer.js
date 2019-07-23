import { handleActions } from 'redux-actions';

import {
  CHANGE_CONFIG,
} from './action-types';

const defaultState = {
    configIsOpen: false
};

export const config = handleActions({
  [CHANGE_CONFIG]: (state = defaultState, { payload }) => {
      return {
        ...state,
        configIsOpen: !state.configIsOpen
      };
  },
}, defaultState);
