import { useState } from "react";
import { useSelector } from "react-redux";
import moment from "moment";
import { FaPlus, FaTimes } from "react-icons/fa";

import { bankHolidayCountries } from "../../config";
import { getBankHolidayOptions } from "../../core/config/selectors";
import { saveBankHolidays } from "../../core/dates/actions";
import {
  filterToCurrentYear,
  getBankHolidayEntriesForYear,
} from "../../core/dates/selectors";
import { useAppDispatch } from "../../core/hooks";
import { CommitInput } from "../commit-input";
import type { Holiday, RootState } from "../../types/holiday";

type CountryKey = Extract<keyof typeof bankHolidayCountries, string>;

const toInputDate = (start: string) =>
  moment(start, "YY-MM-DD").format("YYYY-MM-DD");
const fromInputDate = (value: string) =>
  moment(value, "YYYY-MM-DD").format("YY-MM-DD");

export const BankHolidaySettings = () => {
  const dispatch = useAppDispatch();
  const bankHolidays = useSelector(getBankHolidayEntriesForYear);
  const currentYear = useSelector((state: RootState) => state.dates.currentYear);
  const startMonth = useSelector((state: RootState) => state.dates.startMonth);
  const [country, setCountry] = useState<CountryKey>("uk");
  const [newDate, setNewDate] = useState("");
  const [newName, setNewName] = useState("");

  const save = (list: Holiday[]) => dispatch(saveBankHolidays(list));
  const update = (index: number, changes: Partial<Holiday>) =>
    save(bankHolidays.map((bh, i) => (i === index ? { ...bh, ...changes } : bh)));
  const remove = (index: number) =>
    save(bankHolidays.filter((_, i) => i !== index));

  const applyPreset = () =>
    save(
      bankHolidayCountries[country].dates.filter(
        filterToCurrentYear(currentYear, startMonth)
      )
    );

  const add = () => {
    if (!newDate) return;
    save([
      ...bankHolidays,
      { start: fromInputDate(newDate), name: newName.trim() || "Bank holiday" },
    ]);
    setNewDate("");
    setNewName("");
  };

  return (
    <div className="config-panel">
      <section className="config-section">
        <div className="bh-preset">
          <label className="bh-preset__label" htmlFor="bh-country">
            Preset
          </label>
          <select
            id="bh-country"
            className="bh-input bh-preset__select"
            value={country}
            onChange={(event) => setCountry(event.target.value as CountryKey)}
          >
            {getBankHolidayOptions().map((option) => (
              <option key={option.key} value={option.key}>
                {option.display}
              </option>
            ))}
          </select>
          <button
            type="button"
            className="btn btn--secondary btn--compact"
            onClick={applyPreset}
            title="Replace this year's bank holidays with the preset"
          >
            Apply
          </button>
        </div>
        <p className="config-section__hint bh-preset__hint">
          Applying a preset replaces the bank holidays for {currentYear}–
          {currentYear + 1}.
        </p>
      </section>

      <section className="config-section">
        <h4 className="config-section__title">
          Bank holidays{" "}
          <span className="bh-count">{bankHolidays.length}</span>
        </h4>
        {bankHolidays.length === 0 ? (
          <p className="config-section__hint">No bank holidays this year.</p>
        ) : (
          <ul className="bh-list">
            {bankHolidays.map((bh, index) => (
              <li key={`${bh.start}-${index}`} className="bh-row">
                <span className="bh-row__dow">
                  {moment(bh.start, "YY-MM-DD").format("ddd")}
                </span>
                <input
                  className="bh-input bh-row__date"
                  type="date"
                  value={toInputDate(bh.start)}
                  onChange={(event) =>
                    event.target.value &&
                    update(index, { start: fromInputDate(event.target.value) })
                  }
                  aria-label={`Date for ${bh.name ?? "bank holiday"}`}
                />
                <CommitInput
                  className="bh-input bh-row__name"
                  value={bh.name ?? ""}
                  placeholder="Name"
                  aria-label="Bank holiday name"
                  onCommit={(name) => update(index, { name })}
                />
                <button
                  type="button"
                  className="bh-row__remove"
                  onClick={() => remove(index)}
                  aria-label={`Remove ${bh.name ?? "bank holiday"}`}
                  title="Remove"
                >
                  <FaTimes aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        )}
        <form
          className="bh-row bh-row--add"
          onSubmit={(event) => {
            event.preventDefault();
            add();
          }}
        >
          <span className="bh-row__dow" aria-hidden="true">
            <FaPlus />
          </span>
          <input
            className="bh-input bh-row__date"
            type="date"
            value={newDate}
            onChange={(event) => setNewDate(event.target.value)}
            aria-label="New bank holiday date"
          />
          <input
            className="bh-input bh-row__name"
            type="text"
            maxLength={60}
            value={newName}
            onChange={(event) => setNewName(event.target.value)}
            placeholder="Name"
            aria-label="New bank holiday name"
          />
          <button
            type="submit"
            className="btn btn--secondary btn--compact"
            disabled={!newDate}
          >
            Add
          </button>
        </form>
      </section>
    </div>
  );
};
