import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import { selectDay, selectHoliday } from "../../core/dates/actions";
import { DATES_SELECT_END_OF_CURRENT } from "../../core/dates/action-types";
import {
  getCurrentStartDay,
  getBankHolidaysForYear,
  getHolidaysForYear,
  getProvisionalHolidaysForYear,
  isInSelectMode,
  getHolidayMapForYear,
} from "../../core/dates/selectors";
import "./style.css";

import moment from "moment";

const today = moment().format("YY-MM-DD");

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

  return (
    <button
      className={`day day-${mday.format(
        "d"
      )} ${todayClass} ${isCurrentStartDateClass} ${selectClass} ${provHolidayClass} ${holidayClass} ${bHolidayClass} ${halfDayClass}`}
      onClick={clickEventHandler}
      onMouseOver={hoverEventHandler}
    >
      {mday.format("DD")}
    </button>
  );
};
