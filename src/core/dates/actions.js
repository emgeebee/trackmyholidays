import { createAction } from 'redux-actions';

import {
  DATES_DESELECT,
  DATES_SELECT_START_MONTH
} from './action-types';

export const deselectAction = createAction(DATES_DESELECT, payload => payload);
