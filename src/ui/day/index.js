import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { DATES_SELECT_END_OF_CURRENT, DATES_SELECT_DAY, DATES_SELECT_HOLIDAY } from '../../core/dates/action-types';
import { getCurrentStartDay, getHolidaysForYear, getHolidayMapForYear, getProvisionalHolidaysForYear, isInSelectMode } from '../../core/dates/selectors';
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

  const provisionalHolidays = useSelector(getProvisionalHolidaysForYear);
  const isProvHoliday = provisionalHolidays.indexOf(formattedDay) > -1;
  const provHolidayClass = isProvHoliday ? 'provhol' : '';

  const iISM = useSelector(isInSelectMode);
  const selectClass = (iISM && !isWeekend) ? 'select-mode' : '';

  const isCurrentStartDate = useSelector(getCurrentStartDay) === formattedDay;
  const isCurrentStartDateClass = isCurrentStartDate ? 'start-of-hol' : '';

  let clickEvent = { type: DATES_SELECT_DAY, payload: formattedDay };
  if (isHoliday) {
      const holidayMeta = holidayMap[formattedDay];
      clickEvent = { type: DATES_SELECT_HOLIDAY, payload: holidayMeta };
  }
  if (isWeekend) {
      clickEvent = { type: 'NULL' };
  }
  const clickEventHandler = useCallback(
      () => dispatch(clickEvent),
      [ dispatch, clickEvent ]
  );
  let onHoverEvent = { type: 'NULL' };
  if (iISM) {
      onHoverEvent = { type: DATES_SELECT_END_OF_CURRENT, payload: formattedDay };
  };
  const hoverEventHandler = useCallback(
      () => dispatch(onHoverEvent),
      [ dispatch, onHoverEvent ]
  );

  return (
     <button className={`day day-${mday.format('d')} ${isCurrentStartDateClass} ${selectClass} ${provHolidayClass} ${holidayClass}`} onClick={clickEventHandler} onMouseOver={hoverEventHandler}>
        {mday.format('DD')}
     </button>
  )
}
