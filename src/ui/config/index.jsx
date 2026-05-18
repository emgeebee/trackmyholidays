import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";

import { CHANGE_CONFIG } from "../../core/config/action-types";
import { DATES_SELECT_START_MONTH } from "../../core/dates/action-types";
import {
  addNewBH,
  updateBH,
  updatePerYearAction,
  updateCarriedOverAction,
} from "../../core/dates/actions";
import {
  getIsConfig,
  getBankHolidayOptions,
} from "../../core/config/selectors";
import {
  getCurrentPY,
  getCurrentCO,
  getHolidayMapForYear,
  getBankHolidaysForYear,
} from "../../core/dates/selectors";
import { bankHolidayCountries } from "../../config";

import "./style.css";

import moment from "moment";

const MONTHS = [
  { label: "Jan", value: 0 },
  { label: "Feb", value: 1 },
  { label: "Mar", value: 2 },
  { label: "Apr", value: 3 },
  { label: "May", value: 4 },
  { label: "Jun", value: 5 },
  { label: "Jul", value: 6 },
  { label: "Aug", value: 7 },
  { label: "Sept", value: 8 },
  { label: "Oct", value: 9 },
  { label: "Nov", value: 10 },
  { label: "Dec", value: 11 },
];

export const Config = () => {
  const [selectedCountry, setSelectedCountry] = useState("uk");
  const isConfig = useSelector(getIsConfig);
  const startMonth = useSelector((state) => state.dates.startMonth);
  let co = useSelector(getCurrentCO);
  let py = useSelector(getCurrentPY);
  const bhDates = useSelector(getBankHolidaysForYear);
  const holidayMap = useSelector(getHolidayMapForYear);
  const uiDates = bhDates.reduce(
    (agg, date, key) => ({
      ...agg,
      [key]: {
        key,
        name: holidayMap[date].hol.name,
        start: holidayMap[date].hol.start,
      },
    }),
    {}
  );
  const dispatch = useDispatch();
  const closeConfig = useCallback(() => {
    dispatch({
      type: CHANGE_CONFIG,
    });
    document.body.classList.remove("modal-open");
  }, [dispatch]);
  const chooseMonth = useCallback(
    (month) =>
      dispatch({
        type: DATES_SELECT_START_MONTH,
        payload: month,
      }),
    [dispatch]
  );
  const updatePerYear = useCallback(
    (newPy) => dispatch(updatePerYearAction(newPy)),
    [dispatch]
  );
  const updateCarriedOver = useCallback(
    (newCo) => dispatch(updateCarriedOverAction(newCo)),
    [dispatch]
  );

  const updateBHDay = useCallback(
    (event) => {
      const { target } = event;
      const { name, value } = target;
      event.persist();
      const newDate = {
        ...uiDates[name],
        start: target.type === "text" ? uiDates[name].start : value,
        name: target.type === "text" ? value : uiDates[name].name,
      };
      dispatch(
        updateBH(
          Object.values({ ...uiDates, [name]: newDate }).map((date) => ({
            name: date.name,
            start: date.start.length === 10 ? date.start.slice(2) : date.start,
          }))
        )
      );
    },
    [dispatch, uiDates]
  );

  const addBHDate = useCallback(
    (event) => {
      event.persist();
      dispatch(addNewBH());
    },
    [dispatch]
  );

  const resetBankHolidays = useCallback(() => {
    const holidays = bankHolidayCountries[selectedCountry].dates;
    dispatch(updateBH(holidays));
  }, [dispatch, selectedCountry]);

  const getDateControls = () => (
    <div className="config-panel">
      <section className="config-section">
        <h4 className="config-section__title">
          Holiday year start month
        </h4>
        <p className="config-section__hint">
          The calendar view begins in the month you select.
        </p>
        <div className="month-grid">
          {MONTHS.map(({ label, value }) => (
            <button
              key={value}
              type="button"
              className={`month-grid__btn${
                startMonth === value ? " month-grid__btn--active" : ""
              }`}
              onClick={() => chooseMonth(value)}
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      <section className="config-section">
        <h4 className="config-section__title">Allowance</h4>
        <div className="field-row">
          <label className="field-row__label" htmlFor="py">
            Holidays per year
          </label>
          <input
            id="py"
            className="field-row__input"
            type="number"
            min="0"
            onChange={(event) => updatePerYear(event.target.value)}
            value={py}
          />
        </div>
        <div className="field-row">
          <label className="field-row__label" htmlFor="co">
            Carried over
          </label>
          <input
            id="co"
            className="field-row__input"
            type="number"
            min="0"
            onChange={(event) => updateCarriedOver(event.target.value)}
            value={co}
          />
        </div>
      </section>
    </div>
  );

  const getBankHolidayControls = () => (
    <div className="config-panel">
      <section className="config-section">
        <h4 className="config-section__title">Country presets</h4>
        <p className="config-section__hint">
          Replace your bank holidays with the default set for a country.
        </p>
        <div className="field-row field-row--stacked">
          <label className="field-row__label" htmlFor="reset-dates">
            Country
          </label>
          <select
            id="reset-dates"
            className="field-row__input field-row__input--grow"
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
          >
            {getBankHolidayOptions().map((country) => (
              <option key={country.key} value={country.key}>
                {country.display}
              </option>
            ))}
          </select>
        </div>
        <button
          type="button"
          className="btn btn--primary btn--block"
          onClick={resetBankHolidays}
        >
          Reset bank holidays
        </button>
      </section>

      <section className="config-section">
        <h4 className="config-section__title">Your bank holidays</h4>
        <ul className="bh-list">
          {Object.values(uiDates).map((date) => (
            <li key={date.key} className="bh-list__item">
              <input
                className="field-row__input"
                type="date"
                name={date.key}
                value={moment(date.start, "YY-MM-DD").format("YYYY-MM-DD")}
                onChange={updateBHDay}
                aria-label={`Date for ${date.name}`}
              />
              <input
                className="field-row__input field-row__input--grow"
                type="text"
                name={date.key}
                value={date.name}
                onChange={updateBHDay}
                placeholder="Holiday name"
                aria-label="Holiday name"
              />
            </li>
          ))}
        </ul>
        <button
          type="button"
          className="btn btn--secondary btn--block"
          onClick={addBHDate}
        >
          Add bank holiday
        </button>
      </section>
    </div>
  );

  return !isConfig ? null : (
    <div
      className="modal"
      role="dialog"
      aria-modal="true"
      aria-label="Settings"
      onClick={(e) => e.target === e.currentTarget && closeConfig()}
    >
      <div className="controls">
        <div className="config-sheet__header">
          <h2 className="config-sheet__title">Settings</h2>
          <button
            type="button"
            className="config-sheet__close"
            onClick={closeConfig}
            aria-label="Close settings"
          >
            ×
          </button>
        </div>
        <Tabs className="config-tabs">
          <TabList className="config-tabs__list">
            <Tab className="config-tabs__tab">Dates</Tab>
            <Tab className="config-tabs__tab">Bank holidays</Tab>
          </TabList>
          <TabPanel className="config-tabs__panel">
            {getDateControls()}
          </TabPanel>
          <TabPanel className="config-tabs__panel config-tabs__panel--bh">
            {getBankHolidayControls()}
          </TabPanel>
        </Tabs>
      </div>
    </div>
  );
};
