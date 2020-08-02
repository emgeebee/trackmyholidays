import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GoogleLogin } from 'react-google-login';

import { getDays, getIsLoading } from '../../core/dates/selectors';
import { getIsLoggedIn } from '../../core/auth/selectors';
// import { DATES_SELECT_DAY } from '../../core/dates/action-types';
import { LoginAction } from '../../core/auth/actions';
import { Controls, Header, Month } from '..';

import './style.css';

export const Calendar = () => {
  const dates = useSelector(getDays);
  const loggedIn = useSelector(getIsLoggedIn);
  const loading = useSelector(getIsLoading);

  const dispatch = useDispatch();
  const responseGoogle = useCallback((payload) => dispatch(LoginAction(payload)), [dispatch]);

  return (
  <>
    <Header />
    <div className="container">
        {
            loading ? (<div className='loader'></div>) :
            loggedIn ?
                dates.map((month) => (<Month key={month} month={month} />)) :
                (<GoogleLogin
                 clientId="195751140228-9tkaoajmqv2ghuh0p1gs0a974aufffuo.apps.googleusercontent.com"
                 render={renderProps => (
                     <button onClick={renderProps.onClick} disabled={renderProps.disabled}>Login with Google</button>
                 )}
                 buttonText="Login"
                 onSuccess={responseGoogle}
                 onFailure={responseGoogle}
                 cookiePolicy={'single_host_origin'}
                 />)
        }
    </div>
    <Controls />
  </>)
}
