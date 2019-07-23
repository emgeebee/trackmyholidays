import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { DATES_CHANGE_DAYS_PER_YEAR, DATES_CHANGE_STARTMONTH } from '../../core/dates/action-types';
import { getIsConfig } from '../../core/config/selectors';

import './style.css';

export const Config = () => {
  const isConfig = useSelector(getIsConfig);
  const dispatch = useDispatch();
  const changeStartMonth = useCallback((payload) => console.log(payload) || dispatch({
      type: DATES_CHANGE_STARTMONTH,
      payload
  }), [dispatch]);
  const changeDaysPerYear = useCallback((event) => console.log(event) || dispatch({
      type: DATES_CHANGE_DAYS_PER_YEAR,
      payload: event.target.value
  }), [dispatch]);

          console.log(isConfig, "A")
  return (
  !isConfig ? null : <div className="modal">
    <div className="controls">
      <div className="control">
        <button onClick={changeStartMonth.bind(null, 0)}>Jan</button>
        <button onClick={changeStartMonth.bind(null, 1)}>Feb</button>
      </div>
      <div className="control">
        <button onChange={changeDaysPerYear}>Jan</button>
      </div>
      <div className="control">
      </div>
    </div>
  </div>)
}
