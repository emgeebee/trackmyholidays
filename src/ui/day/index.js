import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { DATES_SELECT_DAY } from '../../core/dates/action-types';
import { isInSelectMode } from '../../core/dates/selectors';
import './style.css';

const moment = require('moment');

export const Day = ({day}) => {
  const mday = moment(day);
  const isWeekend = mday.format('d') === '0' || mday.format('d') === '6';

  const dispatch = useDispatch();
  const selectClass = (useSelector(isInSelectMode) && !isWeekend) ? 'select-mode' : '';

  const selectDay = useCallback(
      () => dispatch(isWeekend ? null : { type: DATES_SELECT_DAY, payload: mday.format('YY-MM-DD') }),
      [dispatch]
  );

  return (
     <button className={`day day-${mday.format('d')} ${selectClass}`} onClick={selectDay}>
        {mday.format('DD')}
     </button>
  )
}
