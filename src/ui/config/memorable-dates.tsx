import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import moment from "moment";
import { FaPlus, FaTimes } from "react-icons/fa";

import {
  removeMemorableCalendar,
  removeMemorableDate,
  saveMemorableCalendar,
  saveMemorableDate,
} from "../../core/dates/actions";
import {
  CALENDAR_PALETTE,
  MEMORABLE_DATE_FORMAT,
  REPEAT_OPTIONS,
  newId,
} from "../../core/dates/memorable";
import {
  getMemorableCalendars,
  getMemorableDates,
} from "../../core/dates/selectors";
import { useAppDispatch } from "../../core/hooks";
import { CommitInput } from "../commit-input";
import type {
  MemorableCalendar,
  MemorableDate,
  MemorableRepeat,
} from "../../types/holiday";

const DEFAULT_CALENDAR_NAME = "Calendar";
const DEFAULT_DATE_NAME = "Memorable date";

/** Colour picker that saves once the user settles, not on every drag tick. */
const ColourInput = ({
  value,
  onCommit,
  ...rest
}: {
  value: string;
  onCommit: (colour: string) => void;
  "aria-label": string;
  title?: string;
}) => {
  const [draft, setDraft] = useState(value);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => setDraft(value), [value]);
  useEffect(() => () => clearTimeout(timer.current), []);

  const commit = (colour: string) => {
    clearTimeout(timer.current);
    if (colour !== value) onCommit(colour);
  };

  return (
    <input
      type="color"
      className="md-colour"
      value={draft}
      onChange={(event) => {
        const colour = event.target.value;
        setDraft(colour);
        clearTimeout(timer.current);
        timer.current = setTimeout(() => commit(colour), 400);
      }}
      onBlur={() => commit(draft)}
      {...rest}
    />
  );
};

const byMonthDayThenName = (a: MemorableDate, b: MemorableDate) =>
  a.date.slice(5).localeCompare(b.date.slice(5)) ||
  a.name.localeCompare(b.name);

const CalendarSettings = ({
  calendars,
  dates,
}: {
  calendars: MemorableCalendar[];
  dates: MemorableDate[];
}) => {
  const dispatch = useAppDispatch();
  const [newName, setNewName] = useState("");
  const [newColour, setNewColour] = useState(
    CALENDAR_PALETTE[calendars.length % CALENDAR_PALETTE.length]
  );

  const countFor = (calendarId: string) =>
    dates.filter((date) => date.calendarId === calendarId).length;

  const remove = (calendar: MemorableCalendar) => {
    const count = countFor(calendar.id);
    if (
      count > 0 &&
      !window.confirm(
        `Remove "${calendar.name}" and its ${count} memorable date${
          count === 1 ? "" : "s"
        }?`
      )
    ) {
      return;
    }
    dispatch(removeMemorableCalendar(calendar.id));
  };

  const add = () => {
    dispatch(
      saveMemorableCalendar({
        id: newId(),
        name: newName.trim() || DEFAULT_CALENDAR_NAME,
        colour: newColour,
      })
    );
    setNewName("");
    setNewColour(
      CALENDAR_PALETTE[(calendars.length + 1) % CALENDAR_PALETTE.length]
    );
  };

  return (
    <section className="config-section">
      <h4 className="config-section__title">
        Calendars <span className="bh-count">{calendars.length}</span>
      </h4>
      <p className="config-section__hint">
        Group memorable dates into calendars, each with its own dot colour.
      </p>
      {calendars.length > 0 && (
        <ul className="bh-list">
          {calendars.map((calendar) => (
            <li key={calendar.id} className="bh-row">
              <ColourInput
                value={calendar.colour}
                onCommit={(colour) =>
                  dispatch(saveMemorableCalendar({ ...calendar, colour }))
                }
                aria-label={`Dot colour for ${calendar.name}`}
                title="Dot colour"
              />
              <CommitInput
                className="bh-input bh-row__name"
                value={calendar.name}
                placeholder="Calendar name"
                aria-label="Calendar name"
                onCommit={(name) =>
                  dispatch(
                    saveMemorableCalendar({
                      ...calendar,
                      name: name || DEFAULT_CALENDAR_NAME,
                    })
                  )
                }
              />
              <span className="md-row__count" title="Dates in this calendar">
                {countFor(calendar.id)}
              </span>
              <button
                type="button"
                className="bh-row__remove"
                onClick={() => remove(calendar)}
                aria-label={`Remove ${calendar.name}`}
                title="Remove calendar"
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
        <input
          type="color"
          className="md-colour"
          value={newColour}
          onChange={(event) => setNewColour(event.target.value)}
          aria-label="New calendar dot colour"
          title="Dot colour"
        />
        <input
          className="bh-input bh-row__name"
          type="text"
          maxLength={40}
          value={newName}
          onChange={(event) => setNewName(event.target.value)}
          placeholder="e.g. Anniversaries"
          aria-label="New calendar name"
        />
        <button type="submit" className="btn btn--secondary btn--compact">
          Add
        </button>
      </form>
    </section>
  );
};

const CalendarSelect = ({
  calendars,
  value,
  onChange,
  ...rest
}: {
  calendars: MemorableCalendar[];
  value: string;
  onChange: (calendarId: string) => void;
  "aria-label": string;
}) => {
  const current = calendars.find((calendar) => calendar.id === value);
  return (
    <span className="md-select-wrap">
      <span
        className="md-dot"
        style={{ background: current?.colour }}
        aria-hidden="true"
      />
      <select
        className="bh-input md-select"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        {...rest}
      >
        {calendars.map((calendar) => (
          <option key={calendar.id} value={calendar.id}>
            {calendar.name}
          </option>
        ))}
      </select>
    </span>
  );
};

const RepeatSelect = ({
  value,
  onChange,
  ...rest
}: {
  value: MemorableRepeat;
  onChange: (repeat: MemorableRepeat) => void;
  "aria-label": string;
}) => (
  <select
    className="bh-input md-select"
    value={value}
    onChange={(event) => onChange(event.target.value as MemorableRepeat)}
    {...rest}
  >
    {REPEAT_OPTIONS.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
);

const DateList = ({
  calendars,
  dates,
}: {
  calendars: MemorableCalendar[];
  dates: MemorableDate[];
}) => {
  const dispatch = useAppDispatch();
  const [newDate, setNewDate] = useState("");
  const [newName, setNewName] = useState("");
  const [newRepeat, setNewRepeat] = useState<MemorableRepeat>("yearly");
  const [newCalendarId, setNewCalendarId] = useState(calendars[0]?.id ?? "");

  // Keep the add form pointing at a calendar that still exists.
  const addCalendarId = calendars.some((cal) => cal.id === newCalendarId)
    ? newCalendarId
    : calendars[0]?.id ?? "";

  const update = (date: MemorableDate, changes: Partial<MemorableDate>) =>
    dispatch(saveMemorableDate({ ...date, ...changes }));

  const add = () => {
    if (!newDate || !addCalendarId) return;
    dispatch(
      saveMemorableDate({
        id: newId(),
        calendarId: addCalendarId,
        name: newName.trim() || DEFAULT_DATE_NAME,
        date: newDate,
        repeat: newRepeat,
      })
    );
    setNewDate("");
    setNewName("");
  };

  const sorted = [...dates].sort(byMonthDayThenName);

  return (
    <section className="config-section">
      <h4 className="config-section__title">
        Memorable dates <span className="bh-count">{dates.length}</span>
      </h4>
      <p className="config-section__hint">
        Shown as a dot on the calendar. Repeating dates use the date you enter
        as their first occurrence, so a birthday with the birth year shows the
        age.
      </p>
      {calendars.length === 0 ? (
        <p className="config-section__hint">
          Add a calendar above before adding memorable dates.
        </p>
      ) : (
        <>
          {sorted.length > 0 && (
            <ul className="bh-list">
              {sorted.map((date) => (
                <li key={date.id} className="md-row">
                  <div className="md-row__line">
                    <span className="bh-row__dow">
                      {moment(date.date, MEMORABLE_DATE_FORMAT).format("ddd")}
                    </span>
                    <input
                      className="bh-input bh-row__date"
                      type="date"
                      value={date.date}
                      onChange={(event) =>
                        event.target.value &&
                        update(date, { date: event.target.value })
                      }
                      aria-label={`Date for ${date.name}`}
                    />
                    <CommitInput
                      className="bh-input bh-row__name"
                      value={date.name}
                      placeholder="Name"
                      aria-label="Memorable date name"
                      onCommit={(name) =>
                        update(date, { name: name || DEFAULT_DATE_NAME })
                      }
                    />
                    <button
                      type="button"
                      className="bh-row__remove"
                      onClick={() => dispatch(removeMemorableDate(date.id))}
                      aria-label={`Remove ${date.name}`}
                      title="Remove"
                    >
                      <FaTimes aria-hidden="true" />
                    </button>
                  </div>
                  <div className="md-row__line md-row__line--meta">
                    <CalendarSelect
                      calendars={calendars}
                      value={date.calendarId}
                      onChange={(calendarId) => update(date, { calendarId })}
                      aria-label={`Calendar for ${date.name}`}
                    />
                    <RepeatSelect
                      value={date.repeat}
                      onChange={(repeat) => update(date, { repeat })}
                      aria-label={`Repeat for ${date.name}`}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
          <form
            className="md-row md-row--add"
            onSubmit={(event) => {
              event.preventDefault();
              add();
            }}
          >
            <div className="md-row__line">
              <span className="bh-row__dow" aria-hidden="true">
                <FaPlus />
              </span>
              <input
                className="bh-input bh-row__date"
                type="date"
                value={newDate}
                onChange={(event) => setNewDate(event.target.value)}
                aria-label="New memorable date"
              />
              <input
                className="bh-input bh-row__name"
                type="text"
                maxLength={60}
                value={newName}
                onChange={(event) => setNewName(event.target.value)}
                placeholder="e.g. Mum's birthday"
                aria-label="New memorable date name"
              />
            </div>
            <div className="md-row__line md-row__line--meta">
              <CalendarSelect
                calendars={calendars}
                value={addCalendarId}
                onChange={setNewCalendarId}
                aria-label="Calendar for new memorable date"
              />
              <RepeatSelect
                value={newRepeat}
                onChange={setNewRepeat}
                aria-label="Repeat for new memorable date"
              />
              <button
                type="submit"
                className="btn btn--secondary btn--compact"
                disabled={!newDate}
              >
                Add
              </button>
            </div>
          </form>
        </>
      )}
    </section>
  );
};

export const MemorableDateSettings = () => {
  const calendars = useSelector(getMemorableCalendars);
  const dates = useSelector(getMemorableDates);

  return (
    <div className="config-panel">
      <CalendarSettings calendars={calendars} dates={dates} />
      <DateList calendars={calendars} dates={dates} />
    </div>
  );
};
