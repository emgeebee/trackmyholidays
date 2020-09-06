import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import { CHANGE_CONFIG } from '../../core/config/action-types';
import { DATES_SELECT_START_MONTH } from '../../core/dates/action-types';
import { addNewBH, updateBH, updatePerYearAction, updateCarriedOverAction } from '../../core/dates/actions';
import { getIsConfig, getBankHolidayOptions } from '../../core/config/selectors';
import { getCurrentPY, getCurrentCO, getHolidayMapForYear, getBankHolidaysForYear } from '../../core/dates/selectors';

import 'react-tabs/style/react-tabs.css';
import './style.css';

const moment = require('moment');
moment().format();

export const Config = () => {
  const isConfig = useSelector(getIsConfig);
  let co = useSelector(getCurrentCO);
  let py = useSelector(getCurrentPY);
  const bhDates = useSelector(getBankHolidaysForYear);
  const holidayMap = useSelector(getHolidayMapForYear);
  const uiDates = bhDates.reduce((agg, date, key) => ({
      ...agg,
      [key]: {
          key,
          name: holidayMap[date].hol.name,
          start: holidayMap[date].hol.start,
      }
  }), {});
  const dispatch = useDispatch();
  const closeConfig = useCallback(() => {
      dispatch({
          type: CHANGE_CONFIG,
      });
      document.body.classList.remove('modal-open');
  }, [dispatch]);
  const chooseMonth = useCallback((month) => dispatch({
      type: DATES_SELECT_START_MONTH,
      payload: month
  }), [dispatch]);
  const updatePerYear = useCallback((newPy) => dispatch(updatePerYearAction(newPy)), [dispatch]);
  const updateCarriedOver = useCallback((newCo) => dispatch(updateCarriedOverAction(newCo)), [dispatch]);

  const updateBHDay = useCallback((event) => {
      const { target } = event;
      const { name, value } = target;
      event.persist();
      const newDate = {
          ...uiDates[name],
          start: target.type === 'text' ? uiDates[name].start : value,
          name: target.type === 'text' ? value : uiDates[name].name,
      };
      dispatch(updateBH(
          Object.values({ ...uiDates, [name]: newDate }).map(date => ({
              name: date.name,
              start: date.start.length === 10 ? date.start.slice(2) : date.start
          }))
      ))
  }, [dispatch, uiDates]);

  const addBHDate = useCallback((event) => {
      event.persist();
      dispatch(addNewBH());
  }, [dispatch]);

  const getDateControls = () => (
    <>
      <div className="control">
        <h4>Choose your holiday year start month:</h4>
        <button onClick={() => chooseMonth(0)}>Jan</button>
        <button onClick={() => chooseMonth(1)}>Feb</button>
        <button onClick={() => chooseMonth(2)}>Mar</button>
        <button onClick={() => chooseMonth(3)}>Apr</button>
        <button onClick={() => chooseMonth(4)}>May</button>
        <button onClick={() => chooseMonth(5)}>Jun</button>
        <button onClick={() => chooseMonth(6)}>Jul</button>
        <button onClick={() => chooseMonth(7)}>Aug</button>
        <button onClick={() => chooseMonth(8)}>Sept</button>
        <button onClick={() => chooseMonth(9)}>Oct</button>
        <button onClick={() => chooseMonth(10)}>Nov</button>
        <button onClick={() => chooseMonth(11)}>Dec</button>
      </div>
      <div className="control">
        <label htmlFor="py">Holidays per year: </label>
        <input id="py"  type="number" onChange={(event) => updatePerYear(event.target.value)} value={py} />
      </div>
      <div className="control">
        <label htmlFor="co">Carried Over: </label>
        <input id="co"  type="number" onChange={(event) => updateCarriedOver(event.target.value)} value={co} />
      </div>
    </>
  )

  const getBankHolidayControls = () => {
    return (

    <>
      <div className="control">
      <label for="reset-dates">Reset bank holiday dates to country:</label>
        <select id="reset-dates" value={'uk'} onChange={() => {}}>
          { getBankHolidayOptions().map((country) => (
            ( <option key={country.key} value={country.key} >{country.display}</option> )
          )) }
        </select>
        <button onClick={closeConfig}>Reset</button>
      </div>
        { Object.values(uiDates).map((date) => (
         <div key={date.key} className="control">
            <input type='date' name={date.key} value={moment(date.start, 'YY-MM-DD').format('YYYY-MM-DD')} onChange={updateBHDay} />
            <input type='text' name={date.key} value={date.name} onChange={updateBHDay} />
         </div>
        ))}
      <div className="control">
        <button onClick={addBHDate}>Add new date</button>
      </div>
    </>
  )}

  return (
  !isConfig ? null : <div className="modal">
    <div className="controls">
      <Tabs>
        <TabList>
          <Tab>Dates</Tab>
          <Tab>Bank Holidays</Tab>
          <Tab onClick={closeConfig}>Close</Tab>
        </TabList>
        <TabPanel>
          { getDateControls() }
        </TabPanel>
        <TabPanel className='bh'>
          { getBankHolidayControls() }
        </TabPanel>
        <TabPanel>
        </TabPanel>
      </Tabs>
    </div>
  </div>)
}
