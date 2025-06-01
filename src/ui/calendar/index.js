import React, { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GoogleLogin } from "react-google-login";

import { getDays, getIsLoading } from "../../core/dates/selectors";
import { getIsConfigLoading, getConfigData } from "../../core/config/selectors";
import { getIsLoggedIn } from "../../core/auth/selectors";
// import { DATES_SELECT_DAY } from '../../core/dates/action-types';
import { LoginAction } from "../../core/auth/actions";
import { fetchConfig } from "../../core/config/actions";
import { Controls, Header, Month } from "..";

import "./style.css";

export const Calendar = () => {
  const dates = useSelector(getDays);
  const loggedIn = useSelector(getIsLoggedIn);
  const loading = useSelector(getIsLoading);
  const configLoading = useSelector(getIsConfigLoading);

  const configData = useSelector(getConfigData);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchConfig());
  }, [dispatch]);

  const responseGoogle = useCallback(
    (payload) => dispatch(LoginAction(payload)),
    [dispatch]
  );

  return (
    <>
      <Header />
      <div className="container">
        {loading || configLoading ? (
          <div className="loader"></div>
        ) : loggedIn ? (
          dates.map((month) => <Month key={month} month={month} />)
        ) : (
          <div className="welcome">
            <p>Welcome to the new trackmyholidays.com</p>
            <p>
              Here your can track you holidays in one yearly view, making it
              easy to see how many days you have left to plan
            </p>
            <p>
              Please log in with your google account, so we can sync your
              holidays and allow you to access them on any device
            </p>

            <GoogleLogin
              clientId={configData.google_account}
              render={(renderProps) => (
                <button
                  onClick={renderProps.onClick}
                  disabled={renderProps.disabled}
                >
                  Login with Google
                </button>
              )}
              buttonText="Login"
              onSuccess={responseGoogle}
              onFailure={responseGoogle}
              cookiePolicy={"single_host_origin"}
            />
          </div>
        )}
      </div>
      <Controls />
    </>
  );
};
