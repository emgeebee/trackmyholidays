import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  selectDay,
  selectHoliday,
  selectMemorableDay,
} from "../../core/dates/actions";
import { DATES_SELECT_END_OF_CURRENT } from "../../core/dates/action-types";
import {
  getCurrentStartDay,
  getBankHolidaysForYear,
  getHolidaysForYear,
  getProvisionalHolidaysForYear,
  isInSelectMode,
  getHolidayMapForYear,
  getMemorableMapForYear,
} from "../../core/dates/selectors";
import { describeOccurrence } from "../../core/dates/memorable";
import "./style.css";

import moment from "moment";

const today = moment().format("YY-MM-DD");
const MAX_DOTS = 3;

/** Small coloured dots for the memorable dates on a day; click for details. */
const MemorableDots = ({ formattedDay, occurrences, selected }) => {
  const dispatch = useDispatch();
  const summary = occurrences
    .map((occ) => `${describeOccurrence(occ)} (${occ.calendar.name})`)
    .join("\n");
  const onClick = useCallback(
    (event) => {
      event.stopPropagation();
      dispatch(selectMemorableDay(formattedDay));
    },
    [dispatch, formattedDay]
  );

  return (
    <button
      type="button"
      className={`day-dots${selected ? " day-dots--selected" : ""}`}
      onClick={onClick}
      title={summary}
      aria-label={`${occurrences.length} memorable date${
        occurrences.length === 1 ? "" : "s"
      }: ${summary.replace(/\n/g, ", ")}`}
      aria-pressed={selected}
    >
      {occurrences.slice(0, MAX_DOTS).map((occ) => (
        <span
          key={occ.entry.id}
          className="day-dot"
          style={{ background: occ.calendar.colour }}
        />
      ))}
    </button>
  );
};

export const Day = ({ day }) => {
  const mday = moment(day);
  const formattedDay = mday.format("YY-MM-DD");
  const isWeekend = mday.format("d") === "0" || mday.format("d") === "6";

  const dispatch = useDispatch();

  const dates = useSelector(getHolidaysForYear);
  const bhDates = useSelector(getBankHolidaysForYear);
  const isHoliday = dates.indexOf(formattedDay) > -1;
  const holidayClass = isHoliday ? "hol" : "";
  const isBHoliday = bhDates.indexOf(formattedDay) > -1;
  const bHolidayClass = isBHoliday ? "bhol" : "";
  const todayClass = formattedDay === today ? "today" : "";

  const provisionalHolidays = useSelector(getProvisionalHolidaysForYear);

  const holidayMap = useSelector(getHolidayMapForYear);
  const isHalfDay =
    holidayMap[formattedDay] && holidayMap[formattedDay].hol.half;
  const halfDayClass = isHalfDay
    ? holidayMap[formattedDay].hol.half === "first"
      ? "half-first"
      : "half-last"
    : "";

  const isProvHoliday = provisionalHolidays.indexOf(formattedDay) > -1;
  const provHolidayClass = isProvHoliday ? "provhol" : "";

  const iISM = useSelector(isInSelectMode);
  const selectClass = iISM && !isWeekend ? "select-mode" : "";

  const isCurrentStartDate = useSelector(getCurrentStartDay) === formattedDay;
  const isCurrentStartDateClass = isCurrentStartDate ? "start-of-hol" : "";

  let clickEvent = selectDay;
  let payload = formattedDay;
  if (isHoliday || isBHoliday) {
    clickEvent = selectHoliday;
    payload = {
      formattedDay,
      isBHoliday,
    };
  }
  if (isWeekend) {
    clickEvent = false;
  }
  const clickEventHandler = useCallback(
    () => (clickEvent ? dispatch(clickEvent(payload)) : null),
    [dispatch, clickEvent, payload]
  );

  let onHoverEvent = false;
  if (iISM) {
    onHoverEvent = { type: DATES_SELECT_END_OF_CURRENT, payload: formattedDay };
  }
  const hoverEventHandler = useCallback(
    () => (onHoverEvent ? dispatch(onHoverEvent) : null),
    [dispatch, onHoverEvent]
  );

  const memorableMap = useSelector(getMemorableMapForYear);
  const memorable = memorableMap[formattedDay];
  const selected = useSelector((state) => state.dates.selected);
  const memorableSelected =
    !!selected?.isMemorable && selected.formattedDay === formattedDay;

  const dow = mday.format("d");

  return (
    <div className={`day-cell day-${dow}`} onMouseOver={hoverEventHandler}>
      <button
        className={`day day-${dow} ${todayClass} ${isCurrentStartDateClass} ${selectClass} ${provHolidayClass} ${holidayClass} ${bHolidayClass} ${halfDayClass}`}
        onClick={clickEventHandler}
        title={holidayMap[formattedDay]?.hol.name || undefined}
      >
        {mday.format("DD")}
      </button>
      {memorable && (
        <MemorableDots
          formattedDay={formattedDay}
          occurrences={memorable}
          selected={memorableSelected}
        />
      )}
    </div>
  );
};
