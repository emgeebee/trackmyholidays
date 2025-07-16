import moment from "moment";

const startMonth = 9;
const currentYear =
  moment().month() < startMonth ? moment().year() - 1 : moment().year();

export const base =
  window.location.origin === "http://localhost:3000"
    ? "https://dev.trackmyholidays.com"
    : "";

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
  bankHolidayCountry: "uk",
};
