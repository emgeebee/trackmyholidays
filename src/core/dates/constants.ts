import moment from "moment";
import type { MemorableCalendar } from "../../types/holiday";

const startMonth = 9;
const currentYear =
  moment().month() < startMonth ? moment().year() - 1 : moment().year();

/** Seeded for new users (and users whose saved data predates memorable dates). */
export const defaultMemorableCalendars: MemorableCalendar[] = [
  { id: "birthdays", name: "Birthdays", colour: "#ec4899" },
];

export const defaultState = {
  loading: false,
  startMonth,
  currentYear,
  daysPerYear: 30,
  carriedOver: {
    [currentYear]: 0,
  },
  startDay: "",
  endOfCurrent: "",
  selected: null,
  holidays: [],
  bankHolidays: [
    {
      start: "20-12-25",
      name: "xmas",
    },
  ],
  memorableCalendars: defaultMemorableCalendars,
  memorableDates: [],
  bankHolidayCountry: "uk",
};
