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
  getCurrentPY,
  getTotalAllowance,
} from '../../core/dates/selectors';
import { saveCarriedOver, saveDaysPerYear } from '../../core/dates/actions';
import { getIsLoggedIn } from '../../core/auth/selectors';
import { EditableStat } from './editable-stat';

import './style.css';

export const Header = () => {
  const remaining = useSelector(getRemaining);
  const planned = useSelector(getPlanned);
  const carriedIn = useSelector(getCurrentCO);
  const totalAllowance = useSelector(getTotalAllowance);
  const perYear = useSelector(getCurrentPY);
  const currentYear = useSelector(getYear);
  const loggedIn = useSelector(getIsLoggedIn);

  const dispatch = useDispatch();
  const changeYear = useCallback((payload) => dispatch({
      type: DATES_CHANGE_YEAR,
      payload
  }), [dispatch]);
  const saveCO = useCallback((value) => dispatch(saveCarriedOver(value)), [dispatch]);
  const savePY = useCallback((value) => dispatch(saveDaysPerYear(value)), [dispatch]);
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
            <EditableStat
                label="Carried in"
                value={carriedIn}
                inputLabel="Days carried in from last year"
                initialInputValue={carriedIn}
                onSave={saveCO}
                renderHint={(co) => `${perYear} per year + ${co} carried in = ${perYear + co} total`}
            />
            <EditableStat
                label="Total allowance"
                value={totalAllowance}
                inputLabel="Holidays per year"
                initialInputValue={perYear}
                onSave={savePY}
                renderHint={(py) => `${py} per year + ${carriedIn} carried in = ${py + carriedIn} total`}
            />
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
