import React from 'react';
import { useSelector } from 'react-redux';

import { getDays } from '../../core/dates/selectors';
// import { DATES_SELECT_DAY } from '../../core/dates/action-types';
import { Controls, Header, Month } from '..';

import './style.css';

export const Calendar = () => {
  const dates = useSelector(getDays);

  return (
  <>
    <Header />
    <div className="container">
        { dates.map((month) => (<Month key={month} month={month} />)) }
    </div>
    <Controls />
  </>)
}
