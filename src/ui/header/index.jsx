import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { FaCogs, FaAngleRight, FaAngleLeft } from 'react-icons/fa';

import { CHANGE_CONFIG } from '../../core/config/action-types';
import { DATES_CHANGE_YEAR } from '../../core/dates/action-types';
import {
  getRemaining,
  getYear,
  getPlanned,
  getCurrentCO,
  getTotalAllowance,
} from '../../core/dates/selectors';
import { getIsLoggedIn } from '../../core/auth/selectors';

import './style.css';

export const Header = () => {
  const remaining = useSelector(getRemaining);
  const planned = useSelector(getPlanned);
  const carriedIn = useSelector(getCurrentCO);
  const totalAllowance = useSelector(getTotalAllowance);
  const currentYear = useSelector(getYear);
  const loggedIn = useSelector(getIsLoggedIn);

  const dispatch = useDispatch();
  const changeYear = useCallback((payload) => dispatch({
      type: DATES_CHANGE_YEAR,
      payload
  }), [dispatch]);
  const openConfig = useCallback(() => {
      dispatch({
          type: CHANGE_CONFIG,
      });
      document.body.classList.add('modal-open');
  }, [dispatch]);

  return (
  <header>
    { loggedIn ? (<span className="header-controls">
        <span className="settings">
            <button onClick={openConfig}><FaCogs color="white" size="2em" /></button>
        </span>
        <span className="year">
            <button label="previous year" onClick={changeYear.bind(null, -1)}><FaAngleLeft color="white" size="2em" /></button>
            <span className="currentYear">{currentYear} - {currentYear + 1}</span>
            <button label="next year" onClick={changeYear.bind(null, +1)}><FaAngleRight color="white" size="2em" /></button>
        </span>
        <div className="stats-group">
            <span className="stat stat--wide-only">
                <span className="stat-label">Carried in</span>
                <span className="stat-value">{carriedIn}</span>
            </span>
            <span className="stat stat--wide-only">
                <span className="stat-label">Total allowance</span>
                <span className="stat-value">{totalAllowance}</span>
            </span>
            <span className="stat stats-small">
                <span className="stat-label">Planned</span>
                <span className="stat-value">{planned}</span>
            </span>
            <span className="stat stats">
                <span className="stat-label">Left to plan</span>
                <span className="stat-value">{remaining}</span>
            </span>
        </div>
    </span>) : (
        <span className="header-controls">
            <span className="settings">Trackmyholidays.com</span>
        </span>
    )}
  </header>)
}
