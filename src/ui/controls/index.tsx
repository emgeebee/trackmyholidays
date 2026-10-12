import { useState } from "react";
import { useSelector } from "react-redux";
import moment from "moment";

import {
  getHolidaysForYearInPast,
  getSelected,
  getSelectedMemorable,
} from "../../core/dates/selectors";
import {
  convertToBankHoliday,
  deselectDay,
  halfDayToggle,
  removeBankHoliday,
  removeMemorableDate,
  renameBankHoliday,
  renameHoliday,
  selectDay,
} from "../../core/dates/actions";
import { openSettings, SETTINGS_TAB } from "../../core/config/actions";
import { describeOccurrence, REPEAT_OPTIONS } from "../../core/dates/memorable";
import { useAppDispatch } from "../../core/hooks";
import { CommitInput } from "../commit-input";
import type {
  HolidayMapEntry,
  MemorableOccurrence,
} from "../../types/holiday";

import "./style.css";

const formatDay = (day?: string) =>
  day ? moment(day, "YY-MM-DD").format("ddd D MMM") : "";

const repeatLabel = (occurrence: MemorableOccurrence) =>
  REPEAT_OPTIONS.find((option) => option.value === occurrence.entry.repeat)
    ?.label ?? occurrence.entry.repeat;

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

const CloseButton = () => {
  const dispatch = useAppDispatch();
  return (
    <button
      type="button"
      title="Close these controls"
      aria-label="Close these controls"
      onClick={() => dispatch(selectDay(null))}
    >
      ×
    </button>
  );
};

const MemorableControls = ({
  occurrences,
}: {
  occurrences: MemorableOccurrence[];
}) => {
  const dispatch = useAppDispatch();

  return (
    <footer>
      <CloseButton />
      <span className="from">{formatDay(occurrences[0].day)}</span>
      <ul className="memorable-list">
        {occurrences.map((occurrence) => (
          <li key={occurrence.entry.id} className="memorable-item">
            <span
              className="memorable-item__dot"
              style={{ background: occurrence.calendar.colour }}
              aria-hidden="true"
            />
            <span className="memorable-item__name">
              {describeOccurrence(occurrence)}
            </span>
            <span className="memorable-item__meta">
              {occurrence.calendar.name} · {repeatLabel(occurrence)}
            </span>
            <button
              type="button"
              className="memorable-item__remove"
              onClick={() => dispatch(removeMemorableDate(occurrence.entry.id))}
              aria-label={`Remove ${occurrence.entry.name}`}
              title="Remove this memorable date"
            >
              ×
            </button>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={() => dispatch(openSettings(SETTINGS_TAB.memorableDates))}
      >
        Edit memorable dates
      </button>
    </footer>
  );
};

const BankHolidayControls = ({ entry }: { entry: HolidayMapEntry }) => {
  const dispatch = useAppDispatch();
  const { hol } = entry;

  return (
    <footer>
      <CloseButton />
      <CommitInput
        className="footer-name"
        value={hol.name ?? ""}
        placeholder="Bank holiday name"
        aria-label="Bank holiday name"
        onCommit={(name) => dispatch(renameBankHoliday({ start: hol.start, name }))}
      />
      <span className="from">{formatDay(hol.start)}</span>
      <button
        type="button"
        onClick={() => dispatch(removeBankHoliday(hol.start))}
      >
        Remove bank holiday
      </button>
    </footer>
  );
};

const ConvertToBankHoliday = ({
  entry,
  onCancel,
}: {
  entry: HolidayMapEntry;
  onCancel: () => void;
}) => {
  const dispatch = useAppDispatch();
  const { hol } = entry;
  const [name, setName] = useState(hol.name ?? "");

  return (
    <footer>
      <form
        className="footer-form"
        onSubmit={(event) => {
          event.preventDefault();
          dispatch(
            convertToBankHoliday({
              start: hol.start,
              name: name.trim() || "Bank holiday",
            })
          );
        }}
        onKeyDown={(event) => event.key === "Escape" && onCancel()}
      >
        <label htmlFor="bh-name">
          Make {formatDay(hol.start)} a bank holiday:
        </label>
        <input
          id="bh-name"
          className="footer-name"
          type="text"
          maxLength={60}
          placeholder="e.g. Company day off"
          value={name}
          onChange={(event) => setName(event.target.value)}
          autoFocus
        />
        <button type="submit">Save</button>
        <button type="button" className="footer-btn--ghost" onClick={onCancel}>
          Cancel
        </button>
      </form>
    </footer>
  );
};

const HolidayControls = ({ entry }: { entry: HolidayMapEntry }) => {
  const dispatch = useAppDispatch();
  const [converting, setConverting] = useState(false);
  const { hol } = entry;
  const isSingleDay = hol.start === hol.end;

  if (converting) {
    return (
      <ConvertToBankHoliday entry={entry} onCancel={() => setConverting(false)} />
    );
  }

  return (
    <footer>
      <CloseButton />
      <CommitInput
        className="footer-name"
        value={hol.name ?? ""}
        placeholder="Name this holiday"
        aria-label="Holiday name"
        onCommit={(name) => dispatch(renameHoliday({ start: hol.start, name }))}
      />
      <span className="from-to">
        <span className="from">From: {formatDay(hol.start)}</span>
        <span className="to">To: {formatDay(hol.end)}</span>
      </span>
      <span className="length">({entry.length} days)</span>
      {isSingleDay && (
        <>
          <button type="button" onClick={() => dispatch(halfDayToggle(entry))}>
            {hol.half === "first"
              ? "Last Half"
              : hol.half === "last"
              ? "Full Day"
              : "Half Day"}
          </button>
          <button type="button" onClick={() => setConverting(true)}>
            Make bank holiday
          </button>
        </>
      )}
      <button type="button" onClick={() => dispatch(deselectDay(entry))}>
        Deselect
      </button>
    </footer>
  );
};

export const Controls = () => {
  const selected = useSelector(getSelected);
  const memorable = useSelector(getSelectedMemorable);

  if (memorable.length > 0) {
    return (
      <MemorableControls key={memorable[0].day} occurrences={memorable} />
    );
  }
  if (!selected) {
    return <DaysTakenYTD />;
  }
  return selected.hol.isBHoliday ? (
    <BankHolidayControls key={selected.hol.start} entry={selected} />
  ) : (
    <HolidayControls key={selected.hol.start} entry={selected} />
  );
};
