import { createAction } from 'redux-actions';

import {
  DATES_DESELECT,
} from './action-types';

export const deselectAction = createAction(DATES_DESELECT, payload => payload);
