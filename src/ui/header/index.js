import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { FaCogs, FaAngleRight, FaAngleLeft } from 'react-icons/fa';

import { CHANGE_CONFIG } from '../../core/config/action-types';
import { DATES_CHANGE_YEAR } from '../../core/dates/action-types';
import { getRemaining, getYear } from '../../core/dates/selectors';
import { getIsLoggedIn, getName } from '../../core/auth/selectors';

import './style.css';

export const Header = () => {
  const remaining = useSelector(getRemaining);
  const currentYear = useSelector(getYear);
  const username = useSelector(getName);
  const loggedIn = useSelector(getIsLoggedIn);

  const dispatch = useDispatch();
  const changeYear = useCallback((payload) => dispatch({
      type: DATES_CHANGE_YEAR,
      payload
  }), [dispatch]);
  const openConfig = useCallback(() => dispatch({
      type: CHANGE_CONFIG,
  }), [dispatch]);

  return (
  <header>
    <span className="header-controls">
        <span className="settings">
            <span>
                Trackmyholidays{username ? ', ' : ''}
            </span>
            <span>
            {username}
            </span>
            { loggedIn ? (<button onClick={openConfig}><FaCogs color="white" size="2em" /></button>) : null}
        </span>
        { loggedIn ? (<span className="year">
            <button label="previous year" onClick={changeYear.bind(null, -1)}><FaAngleLeft color="white" size="2em" /></button>
            <span className="currentYear">{currentYear} - {currentYear + 1}</span>
            <button label="next year" onClick={changeYear.bind(null, +1)}><FaAngleRight color="white" size="2em" /></button>
        </span>) : null}
        { loggedIn ? (<span className="stats">
            Days left to plan: {remaining}
        </span>): null }
    </span>
  </header>)
}
