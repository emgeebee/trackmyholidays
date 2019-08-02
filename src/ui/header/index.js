import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { GoogleLogin } from 'react-google-login';
import { FaCogs } from 'react-icons/fa';

import { CHANGE_CONFIG } from '../../core/config/action-types';
import { DATES_CHANGE_YEAR } from '../../core/dates/action-types';
import { getRemaining, getYear } from '../../core/dates/selectors';

import './style.css';

export const Header = () => {
  const remaining = useSelector(getRemaining);
  const currentYear = useSelector(getYear);
  const dispatch = useDispatch();
  const changeYear = useCallback((payload) => dispatch({
      type: DATES_CHANGE_YEAR,
      payload
  }), [dispatch]);
  const openConfig = useCallback(() => dispatch({
      type: CHANGE_CONFIG,
  }), [dispatch]);
  const responseGoogle = (response) => {
      console.log(response);
  }

  return (
  <header>
    <span className="header-controls">
        <span className="settings">
            <span>
                Trackmyholidays
            </span>
            <GoogleLogin
              clientId="195751140228-9tkaoajmqv2ghuh0p1gs0a974aufffuo.apps.googleusercontent.com"
              buttonText="Login"
              onSuccess={responseGoogle}
              onFailure={responseGoogle}
              cookiePolicy={'single_host_origin'}
            />
            <button onClick={openConfig}><FaCogs /> Config</button>
        </span>
        <span className="year">
            <button onClick={changeYear.bind(null, -1)}>Prev</button>
            <span className="currentYear">{currentYear} - {currentYear + 1}</span>
            <button onClick={changeYear.bind(null, +1)}>Next</button>
        </span>
        <span className="stats">
            Days left to plan: {remaining}
        </span>
    </span>
  </header>)
}
