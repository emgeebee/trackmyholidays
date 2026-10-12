import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";

import { CHANGE_CONFIG } from "../../core/config/action-types";
import { DATES_SELECT_START_MONTH } from "../../core/dates/action-types";
import {
  updatePerYearAction,
  updateCarriedOverAction,
} from "../../core/dates/actions";
import { getConfigTab, getIsConfig } from "../../core/config/selectors";
import { getCurrentPY, getCurrentCO } from "../../core/dates/selectors";
import { BankHolidaySettings } from "./bank-holidays";
import { MemorableDateSettings } from "./memorable-dates";
import { AppearanceSettings } from "./appearance";

import "./style.css";

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
  const isConfig = useSelector(getIsConfig);
  const initialTab = useSelector(getConfigTab);
  const startMonth = useSelector((state) => state.dates.startMonth);
  let co = useSelector(getCurrentCO);
  let py = useSelector(getCurrentPY);
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
        <Tabs className="config-tabs" defaultIndex={initialTab}>
          <TabList className="config-tabs__list">
            <Tab className="config-tabs__tab">Dates</Tab>
            <Tab className="config-tabs__tab">Bank holidays</Tab>
            <Tab className="config-tabs__tab">Memorable</Tab>
            <Tab className="config-tabs__tab">Appearance</Tab>
          </TabList>
          <TabPanel className="config-tabs__panel">
            {getDateControls()}
          </TabPanel>
          <TabPanel className="config-tabs__panel config-tabs__panel--bh">
            <BankHolidaySettings />
          </TabPanel>
          <TabPanel className="config-tabs__panel">
            <MemorableDateSettings />
          </TabPanel>
          <TabPanel className="config-tabs__panel">
            <AppearanceSettings />
          </TabPanel>
        </Tabs>
      </div>
    </div>
  );
};
