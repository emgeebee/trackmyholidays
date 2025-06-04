import { createSelector } from "reselect";

const moment = require("moment");
moment().format();

const dateState = (state) => state.dates;

export const getIsLoading = createSelector(dateState, (state) => state.loading);

export const getDays = createSelector(
  (state) => state.dates.startMonth,
  (state) => state.dates.currentYear,
  (startMonth, year) => {
    const currentYearDates = [];

    for (let j = 0; j < 12; j++) {
      const mmonth = moment([year, startMonth, 1]).add(j, "M");
      const currentMonthDates = Array.from(
        {
          length: moment(mmonth).daysInMonth(),
        },
        (x, i) => moment(mmonth).startOf("month").add(i, "days")
      );
      currentYearDates.push(currentMonthDates);
    }
    return currentYearDates;
  }
);

const loopOverHolidaysAndFindEligibleDays =
  (bankHolidays) => (businessDaysMap, hol) => {
    const bh = Object.keys(bankHolidays);
    let day = moment(hol.start, "YY-MM-DD");
    let end = moment(hol.end, "YY-MM-DD");
    if (end.isBefore(day, "day")) {
      day = end;
      end = moment(hol.start, "YY-MM-DD");
    }
    let businessDays = 0;
    let origDay = day.clone();
    while (day.isSameOrBefore(end, "day")) {
      if (
        day.day() !== 0 &&
        day.day() !== 6 &&
        !bh.includes(day.format("YY-MM-DD"))
      ) {
        businessDays++;
      }
      day.add(1, "d");
    }
    day = origDay;

    while (day.isSameOrBefore(end, "day")) {
      if (day.day() !== 0 && day.day() !== 6) {
        businessDaysMap[day.format("YY-MM-DD")] = {
          hol: hol,
          length: businessDays,
        };
      }
      day.add(1, "d");
    }
    return businessDaysMap;
  };

export const getBankHolidayMapForYear = createSelector(
  (state) => state.dates.bankHolidays,
  (bankHolidays) =>
    bankHolidays.reduce((map, bh) => {
      map[bh.start] = {
        hol: {
          ...bh,
          isBHoliday: true,
        },
      };
      return map;
    }, {})
);

export const getHolidayMapForYear = createSelector(
  (state) => state.dates.holidays,
  (state) => state.dates.currentYear,
  (state) => state.dates.startMonth,
  getBankHolidayMapForYear,
  (holidays, currentYear, startMonth, bankHolidays) => {
    const hols = holidays
      .filter(filterToCurrentYear(currentYear, startMonth))
      .reduce(loopOverHolidaysAndFindEligibleDays(bankHolidays), {});
    return { ...hols, ...bankHolidays };
  }
);

export const filterOutCurrentYear = (currentYear, startMonth) => (hol) => {
  let day = moment(hol.start, "YY-MM-DD");
  let start = moment(`${currentYear}-${startMonth + 1}-01`, "YYYY-MM-DD");
  let end = moment(`${currentYear + 1}-${startMonth + 1}-01`, "YYYY-MM-DD");
  if (start <= day && day < end) {
    return false;
  }
  return hol;
};

const filterToCurrentYear = (currentYear, startMonth) => (hol) => {
  let day = moment(hol.start, "YY-MM-DD");
  let start = moment(`${currentYear}-${startMonth + 1}-01`, "YYYY-MM-DD");
  let end = moment(`${currentYear + 1}-${startMonth + 1}-01`, "YYYY-MM-DD");
  if (start <= day && day < end) {
    return hol;
  }
  return false;
};

const findHolidayDays = (bankHolidays) => (hol) => {
  const bh = Object.keys(bankHolidays);
  let day = moment(hol.start, "YY-MM-DD");
  let end = moment(hol.end, "YY-MM-DD");
  if (end.isBefore(day, "day")) {
    day = end;
    end = moment(hol.start, "YY-MM-DD");
  }
  let businessDays = [];

  while (day.isSameOrBefore(end, "day")) {
    if (
      day.day() !== 0 &&
      day.day() !== 6 &&
      !bh.includes(day.format("YY-MM-DD"))
    ) {
      businessDays.push(day.format("YY-MM-DD"));
    }
    day.add(1, "d");
  }
  return businessDays;
};

export const getProvisionalHolidaysForYear = createSelector(
  (state) => state.dates.startDay,
  (state) => state.dates.endOfCurrent,
  getBankHolidayMapForYear,
  (provisionalStart, provisionalEnd, bankHolidays) =>
    [{ start: provisionalStart, end: provisionalEnd }]
      .map(findHolidayDays(bankHolidays))
      .flat()
);

export const getHolidaysForYear = createSelector(
  (state) => state.dates.holidays,
  (state) => state.dates.currentYear,
  (state) => state.dates.startMonth,
  getBankHolidayMapForYear,
  (holidays, currentYear, startMonth, bankHolidays) =>
    holidays
      .filter(filterToCurrentYear(currentYear, startMonth))
      .map(findHolidayDays(bankHolidays))
      .flat()
);

export const getBankHolidaysForYear = createSelector(
  (state) => state.dates.bankHolidays,
  (state) => state.dates.currentYear,
  (state) => state.dates.startMonth,
  (holidays, currentYear, startMonth) =>
    holidays
      .filter(filterToCurrentYear(currentYear, startMonth))
      .map((date) => date.start)
);

export const getPlanned = createSelector(
  getHolidayMapForYear,
  getProvisionalHolidaysForYear,
  (holidays, provisionalHolidays) => {
    const numOfHolidays = Object.values(holidays)
      .filter((hol) => !hol.hol.isBHoliday)
      .reduce((acc, hol) => acc + (!!hol.hol.half ? 0.5 : 1), 0);
    return numOfHolidays - provisionalHolidays.length;
  }
);

export const getRemaining = createSelector(
  (state) => state.dates.carriedOver,
  (state) => state.dates.currentYear,
  (state) => state.dates.daysPerYear,
  getHolidayMapForYear,
  getProvisionalHolidaysForYear,
  (co, year, dpy, holidays, provisionalHolidays) => {
    const carried = co[year] || 0;
    const numOfHolidays = Object.values(holidays)
      .filter((hol) => !hol.hol.isBHoliday)
      .reduce((acc, hol) => acc + (!!hol.hol.half ? 0.5 : 1), 0);
    return carried + dpy - numOfHolidays - provisionalHolidays.length;
  }
);

export const getSelected = createSelector(
  (state) => state.dates.selected,
  getHolidayMapForYear,
  (selected, listOfHolidays) =>
    selected ? listOfHolidays[selected.formattedDay] : false
);

export const getCurrentPY = createSelector(
  (state) => state.dates.daysPerYear,
  (py) => py || 0
);

export const getCurrentCO = createSelector(
  (state) => state.dates.currentYear,
  (state, year) => state.dates.carriedOver,
  (year, co) => co[year] || 0
);

export const getYear = createSelector(
  (state) => state.dates.currentYear,
  (year) => year || 0
);

export const isInSelectMode = createSelector(
  (state) => state.dates.startDay,
  (startDay) => startDay !== ""
);

export const getCurrentStartDay = createSelector(
  (state) => state.dates.startDay,
  (startDay) => startDay || ""
);
