import { createSelector } from "reselect";
import moment, { Moment } from "moment";
import { RootState, Holiday, HolidayMapEntry } from "../../types/holiday";

moment().format();

const dateState = (state: RootState) => state.dates;

export const getIsLoading = createSelector(dateState, (state) => state.loading);

export const getDays = createSelector(
  (state: RootState) => state.dates.startMonth,
  (state: RootState) => state.dates.currentYear,
  (startMonth, year) => {
    const currentYearDates: Moment[][] = [];

    for (let j = 0; j < 12; j++) {
      const month = moment([year, startMonth, 1]).add(j, "M");
      const currentMonthDates = Array.from(
        {
          length: moment(month).daysInMonth(),
        },
        (_x, i) => moment(month).startOf("month").add(i, "days")
      );
      currentYearDates.push(currentMonthDates);
    }
    return currentYearDates;
  }
);

const loopOverHolidaysAndFindEligibleDays =
  (bankHolidays: Record<string, HolidayMapEntry>) =>
  (businessDaysMap: Record<string, HolidayMapEntry>, hol: Holiday) => {
    const bh = Object.keys(bankHolidays);
    let day = moment(hol.start, "YY-MM-DD");
    let end = moment(hol.end, "YY-MM-DD");
    if (end.isBefore(day, "day")) {
      day = end;
      end = moment(hol.start, "YY-MM-DD");
    }
    let businessDays = 0;
    const origDay = day.clone();
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
  (state: RootState) => state.dates.bankHolidays,
  (bankHolidays: Holiday[]) =>
    bankHolidays.reduce((map: Record<string, HolidayMapEntry>, bh: Holiday) => {
      map[bh.start] = {
        hol: {
          ...bh,
          isBHoliday: true,
        },
        length: 1, // Bank holidays are always 1 day
      };
      return map;
    }, {})
);

export const getHolidayMapForYear = createSelector(
  (state: RootState) => state.dates.holidays,
  (state: RootState) => state.dates.currentYear,
  (state: RootState) => state.dates.startMonth,
  getBankHolidayMapForYear,
  (
    holidays: Holiday[],
    currentYear: number,
    startMonth: number,
    bankHolidays: Record<string, HolidayMapEntry>
  ) => {
    const hols = holidays
      .filter(filterToCurrentYear(currentYear, startMonth))
      .reduce(loopOverHolidaysAndFindEligibleDays(bankHolidays), {});
    return { ...hols, ...bankHolidays };
  }
);

export const filterOutCurrentYear =
  (currentYear: number, startMonth: number) => (hol: Holiday) => {
    const day = moment(hol.start, "YY-MM-DD");
    const start = moment(`${currentYear}-${startMonth + 1}-01`, "YYYY-MM-DD");
    const end = moment(`${currentYear + 1}-${startMonth + 1}-01`, "YYYY-MM-DD");
    if (start <= day && day < end) {
      return false;
    }
    return hol;
  };

const filterToCurrentYear =
  (currentYear: number, startMonth: number) => (hol: Holiday) => {
    const day = moment(hol.start, "YY-MM-DD");
    const start = moment(`${currentYear}-${startMonth + 1}-01`, "YYYY-MM-DD");
    const end = moment(`${currentYear + 1}-${startMonth + 1}-01`, "YYYY-MM-DD");
    if (start <= day && day < end) {
      return hol;
    }
    return false;
  };

const findHolidayDays =
  (bankHolidays: Record<string, HolidayMapEntry>) =>
  (hol: Holiday): string[] => {
    const bh = Object.keys(bankHolidays);
    let day = moment(hol.start, "YY-MM-DD");
    let end = moment(hol.end, "YY-MM-DD");
    if (end.isBefore(day, "day")) {
      day = end;
      end = moment(hol.start, "YY-MM-DD");
    }
    const businessDays: string[] = [];

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
  (state: RootState) => state.dates.startDay,
  (state: RootState) => state.dates.endOfCurrent,
  getBankHolidayMapForYear,
  (
    provisionalStart: string,
    provisionalEnd: string,
    bankHolidays: Record<string, HolidayMapEntry>
  ) =>
    [{ start: provisionalStart, end: provisionalEnd }]
      .map(findHolidayDays(bankHolidays))
      .flat()
);

export const getHolidaysForYear = createSelector(
  (state: RootState) => state.dates.holidays,
  (state: RootState) => state.dates.currentYear,
  (state: RootState) => state.dates.startMonth,
  getBankHolidayMapForYear,
  (
    holidays: Holiday[],
    currentYear: number,
    startMonth: number,
    bankHolidays: Record<string, HolidayMapEntry>
  ) =>
    holidays
      .filter(filterToCurrentYear(currentYear, startMonth))
      .flatMap(findHolidayDays(bankHolidays))
);

export const getHolidaysForYearInPast = createSelector(
  getHolidayMapForYear,
  (holidays: Record<string, HolidayMapEntry>) => {
    const current = moment();

    return Object.values(holidays)
      .filter((hol: HolidayMapEntry) => !hol.hol.isBHoliday)
      .filter(
        (hol: HolidayMapEntry) => moment(hol.hol.start, "YY-MM-DD") < current
      )
      .reduce(
        (acc: number, hol: HolidayMapEntry) => acc + (hol.hol.half ? 0.5 : 1),
        0
      );
  }
);

export const getBankHolidaysForYear = createSelector(
  (state: RootState) => state.dates.bankHolidays,
  (state: RootState) => state.dates.currentYear,
  (state: RootState) => state.dates.startMonth,
  (holidays: Holiday[], currentYear: number, startMonth: number) =>
    holidays
      .filter(filterToCurrentYear(currentYear, startMonth))
      .map((date: Holiday) => date.start)
);

export const getPlanned = createSelector(
  getHolidayMapForYear,
  getProvisionalHolidaysForYear,
  (
    holidays: Record<string, HolidayMapEntry>,
    provisionalHolidays: string[]
  ) => {
    const numOfHolidays = Object.values(holidays)
      .filter((hol: HolidayMapEntry) => !hol.hol.isBHoliday)
      .reduce(
        (acc: number, hol: HolidayMapEntry) => acc + (hol.hol.half ? 0.5 : 1),
        0
      );
    return numOfHolidays - provisionalHolidays.length;
  }
);

export const getRemaining = createSelector(
  (state: RootState) => state.dates.carriedOver,
  (state: RootState) => state.dates.currentYear,
  (state: RootState) => state.dates.daysPerYear,
  getHolidayMapForYear,
  getProvisionalHolidaysForYear,
  (
    co: Record<number, number>,
    year: number,
    dpy: number,
    holidays: Record<string, HolidayMapEntry>,
    provisionalHolidays: string[]
  ) => {
    const carried = co[year] || 0;
    const numOfHolidays = Object.values(holidays)
      .filter((hol: HolidayMapEntry) => !hol.hol.isBHoliday)
      .reduce(
        (acc: number, hol: HolidayMapEntry) => acc + (hol.hol.half ? 0.5 : 1),
        0
      );
    return carried + dpy - numOfHolidays - provisionalHolidays.length;
  }
);

export const getSelected = createSelector(
  (state: RootState) => state.dates.selected,
  getHolidayMapForYear,
  (
    selected: { formattedDay: string } | null,
    listOfHolidays: Record<string, HolidayMapEntry>
  ) => (selected ? listOfHolidays[selected.formattedDay] : false)
);

export const getCurrentPY = createSelector(
  (state: RootState) => state.dates.daysPerYear,
  (py: number) => py || 0
);

export const getCurrentCO = createSelector(
  (state: RootState) => state.dates.currentYear,
  (state: RootState) => state.dates.carriedOver,
  (year: number, co: Record<number, number>) => co[year] || 0
);

export const getYear = createSelector(
  (state: RootState) => state.dates.currentYear,
  (year: number) => year || 0
);

export const isInSelectMode = createSelector(
  (state: RootState) => state.dates.startDay,
  (startDay: string) => startDay !== ""
);

export const getCurrentStartDay = createSelector(
  (state: RootState) => state.dates.startDay,
  (startDay: string) => startDay || ""
);
