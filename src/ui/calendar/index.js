import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getDays } from '../../core/dates/selectors';
import { DATES_SELECT_DAY } from '../../core/dates/action-types';
import { Month } from '..';

import './style.css';

export const Calendar = ({}) => {
  const dates = useSelector(getDays);

  return (<div className="container">
    { dates.map((month) => (<Month month={month} />)) }
  </div>)
}
