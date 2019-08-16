import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { DATES_SELECT_DAY, DATES_SELECT_HOLIDAY } from '../../core/dates/action-types';
import { getHolidaysForYear, getHolidayMapForYear, isInSelectMode } from '../../core/dates/selectors';
import './style.css';

const moment = require('moment');

export const Day = ({day}) => {
  const mday = moment(day);
  const formattedDay = mday.format('YY-MM-DD');
  const isWeekend = mday.format('d') === '0' || mday.format('d') === '6';

  const dispatch = useDispatch();

  const holidayMap = useSelector(getHolidayMapForYear);
  const dates = useSelector(getHolidaysForYear);
  const isHoliday = dates.indexOf(formattedDay) > -1;
  const holidayClass = isHoliday ? 'hol' : '';

  const selectClass = (useSelector(isInSelectMode) && !isWeekend) ? 'select-mode' : '';

  let eventType = { type: DATES_SELECT_DAY, payload: formattedDay };
  if (isHoliday) {
      const holidayMeta = holidayMap[formattedDay];
      eventType = { type: DATES_SELECT_HOLIDAY, payload: holidayMeta };
  }
  if (isWeekend) {
      eventType = { type: 'NULL' };
  }
  const selectDay = useCallback(
      () => dispatch(eventType),
      [ dispatch, eventType ]
  );

  return (
     <button className={`day day-${mday.format('d')} ${selectClass} ${holidayClass}`} onClick={selectDay}>
        {mday.format('DD')}
     </button>
  )
}
