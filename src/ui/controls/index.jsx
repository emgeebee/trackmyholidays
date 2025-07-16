import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getSelected } from "../../core/dates/selectors";
import {
  deselectDay,
  halfDayToggle,
  selectDay,
} from "../../core/dates/actions";
import { getHolidaysForYearInPast } from "../../core/dates/selectors";

import "./style.css";

const DaysTakenYTD = () => {
  const holidays = useSelector(getHolidaysForYearInPast);
  const hours = holidays * 7.5;

  return (
    <footer>
      <span className="ytd">
        Days taken this year to date: {holidays} ({hours} hours)
      </span>
    </footer>
  );
};

export const Controls = () => {
  const selected = useSelector(getSelected);
  const dispatch = useDispatch();
  const deselect = useCallback(
    (selected) => dispatch(deselectDay(selected)),
    [dispatch]
  );
  const close = useCallback(
    (selected) => dispatch(selectDay(null)),
    [dispatch]
  );

  const half = useCallback(
    (selected) => dispatch(halfDayToggle(selected)),
    [dispatch]
  );

  const isSingleDay = selected?.hol
    ? selected.hol.start === selected.hol.end
    : false;

  return !selected ? (
    <DaysTakenYTD />
  ) : (
    <footer>
      {selected.hol.isBHoliday ? (
        <>
          <span className="from">
            {selected.hol.name}: {selected.hol.start}
          </span>
        </>
      ) : (
        <>
          <button title="Close these controls" onClick={close} type="button">
            X
          </button>
          <span className="from-to">
            <span className="from">From: {selected.hol.start}</span>
            <span className="to">To: {selected.hol.end}</span>
          </span>
          <span className="length">({selected.length} days)</span>
          {isSingleDay && (
            <button type="button" onClick={half.bind(null, selected)}>
              {selected.hol.half === "first"
                ? "Last Half"
                : selected.hol.half === "last"
                ? "Full Day"
                : "Half Day"}
            </button>
          )}
          <button type="button" onClick={deselect.bind(null, selected)}>
            Deselect
          </button>
        </>
      )}
    </footer>
  );
};
