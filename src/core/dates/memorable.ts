import moment, { Moment } from "moment";
import type {
  MemorableCalendar,
  MemorableDate,
  MemorableOccurrence,
  MemorableRepeat,
} from "../../types/holiday";

export const MEMORABLE_DATE_FORMAT = "YYYY-MM-DD";
const DAY_KEY_FORMAT = "YY-MM-DD";

export const REPEAT_OPTIONS: { value: MemorableRepeat; label: string }[] = [
  { value: "once", label: "One off" },
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
];

/** Suggested dot colours, cycled when the user adds a calendar. */
export const CALENDAR_PALETTE = [
  "#ec4899",
  "#22c55e",
  "#f97316",
  "#3b82f6",
  "#a855f7",
  "#14b8a6",
  "#eab308",
  "#ef4444",
];

export const newId = (): string =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

/** 1 → "1st", 22 → "22nd", 13 → "13th". */
export const ordinal = (n: number): string => {
  const mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 13) return `${n}th`;
  switch (n % 10) {
    case 1:
      return `${n}st`;
    case 2:
      return `${n}nd`;
    case 3:
      return `${n}rd`;
    default:
      return `${n}th`;
  }
};

/**
 * Same day-of-month in `month`, clamped to the month's length so that e.g. a
 * 31st repeats on the 30th of shorter months and 29 Feb falls on 28 Feb.
 */
const sameDayIn = (month: Moment, dayOfMonth: number): Moment =>
  month
    .clone()
    .startOf("month")
    .date(Math.min(dayOfMonth, month.daysInMonth()));

/**
 * Expands memorable dates onto the concrete days they fall on within the
 * 12-month window starting at `windowStart`, keyed by YY-MM-DD.
 */
export const expandMemorableDates = (
  dates: MemorableDate[],
  calendars: MemorableCalendar[],
  windowStart: Moment
): Record<string, MemorableOccurrence[]> => {
  const start = windowStart.clone().startOf("month");
  const end = start.clone().add(12, "months");
  const calendarsById = new Map(calendars.map((cal) => [cal.id, cal]));
  const map: Record<string, MemorableOccurrence[]> = {};

  const push = (entry: MemorableDate, calendar: MemorableCalendar, on: Moment, anchor: Moment) => {
    if (on.isBefore(start, "day") || !on.isBefore(end, "day") || on.isBefore(anchor, "day")) {
      return;
    }
    const day = on.format(DAY_KEY_FORMAT);
    map[day] = map[day] || [];
    map[day].push({
      entry,
      calendar,
      day,
      years: entry.repeat === "yearly" ? on.year() - anchor.year() : 0,
    });
  };

  for (const entry of dates) {
    const calendar = calendarsById.get(entry.calendarId);
    const anchor = moment(entry.date, MEMORABLE_DATE_FORMAT, true);
    if (!calendar || !anchor.isValid()) continue;

    if (entry.repeat === "once") {
      push(entry, calendar, anchor, anchor);
    } else if (entry.repeat === "yearly") {
      for (let year = start.year(); year <= end.year(); year++) {
        const month = moment([year, anchor.month(), 1]);
        push(entry, calendar, sameDayIn(month, anchor.date()), anchor);
      }
    } else {
      for (let i = 0; i < 12; i++) {
        const month = start.clone().add(i, "months");
        push(entry, calendar, sameDayIn(month, anchor.date()), anchor);
      }
    }
  }

  for (const occurrences of Object.values(map)) {
    occurrences.sort((a, b) => a.entry.name.localeCompare(b.entry.name));
  }
  return map;
};

/** Short human label for an occurrence, e.g. "Mum's birthday · 62nd". */
export const describeOccurrence = (occurrence: MemorableOccurrence): string =>
  occurrence.years > 0
    ? `${occurrence.entry.name} · ${ordinal(occurrence.years)}`
    : occurrence.entry.name;
