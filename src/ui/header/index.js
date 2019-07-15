import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { DATES_CHANGE_YEAR } from '../../core/dates/action-types';
import { getRemaining } from '../../core/dates/selectors';

import './style.css';

export const Header = ({}) => {
  const remaining = useSelector(getRemaining);
  const dispatch = useDispatch();
  const changeYear = useCallback((payload) => console.log(payload) || dispatch({
      type: DATES_CHANGE_YEAR,
      payload
  }));

  return (
  <header>
    <span className="controls">
        <button onClick={changeYear.bind(null, -1)}>Prev</button>
        <button onClick={changeYear.bind(null, +1)}>Next</button>
    </span>
    <span className="stats">
        {remaining}
    </span>
  </header>)
}
