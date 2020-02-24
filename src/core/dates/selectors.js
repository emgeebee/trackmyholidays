import { createSelector } from 'reselect';

const moment = require('moment');
moment().format();

export const getDays = createSelector(
    state => state.dates.startMonth,
    state => state.dates.currentYear,
    (startMonth, year) => {
        const currentYearDates = [];

        for (let j = 0; j < 12; j++) {
            const mmonth = moment([year, startMonth, 1]).add(j, 'M');
            const currentMonthDates = Array.from({
                length: moment(mmonth).daysInMonth()
            }, (x, i) => moment(mmonth).startOf('month').add(i, 'days'));
            currentYearDates.push(currentMonthDates);
        }
        return currentYearDates;
    }
);

const loopOverHolidaysAndFindEligibleDays = (businessDaysMap, hol) => {
    let day = moment(hol.start, 'YY-MM-DD');
    let end = moment(hol.end, 'YY-MM-DD');
    if (end.isBefore(day, 'day')) {
        day = end;
        end = moment(hol.start, 'YY-MM-DD');
    }
    let businessDays = 0;
    let origDay = day.clone();
    while (day.isSameOrBefore(end, 'day')) {
        if (day.day() !== 0 && day.day() !== 6) {
            businessDays++;
        }
        day.add(1,'d');
    }
    day = origDay;

    while (day.isSameOrBefore(end, 'day')) {
        if (day.day() !== 0 && day.day() !== 6) {
            businessDaysMap[day.format('YY-MM-DD')] = {
                hol: hol,
                length: businessDays
            };
        }
        day.add(1,'d');
    }
    return businessDaysMap;
}

export const getHolidayMapForYear = createSelector(
    state => state.dates.holidays,
    (holidays) => holidays.reduce(loopOverHolidaysAndFindEligibleDays, {})
)

const filterToCurrentYear = (currentYear, startMonth) => (hol) => {
    let day = moment(hol.start, 'YY-MM-DD');
    let start = moment(`${currentYear}-${startMonth+1}-01`, 'YYYY-MM-DD');
    let end = moment(`${currentYear+1}-${startMonth+1}-01`, 'YYYY-MM-DD');
    if ( start < day && day < end ) {
        return hol;
    }
    return false;
}

const findHolidayDays = (hol) => {
    let day = moment(hol.start, 'YY-MM-DD');
    let end = moment(hol.end, 'YY-MM-DD');
    if (end.isBefore(day, 'day')) {
        day = end;
        end = moment(hol.start, 'YY-MM-DD');
    }
    let businessDays = [];

    while (day.isSameOrBefore(end, 'day')) {
        if (day.day() !== 0 && day.day() !== 6) {
            businessDays.push(day.format('YY-MM-DD'));
        }
        day.add(1,'d');
    }
    return businessDays;
}

export const getProvisionalHolidaysForYear = createSelector(
    state => state.dates.startDay,
    state => state.dates.endOfCurrent,
    (provisionalStart, provisionalEnd) => [
        { start: provisionalStart, end: provisionalEnd }
    ].map(findHolidayDays).flat()
)

export const getHolidaysForYear = createSelector(
    state => state.dates.holidays,
    state => state.dates.currentYear,
    state => state.dates.startMonth,
    (holidays, currentYear, startMonth) => holidays.filter(filterToCurrentYear(currentYear, startMonth)).map(findHolidayDays).flat()
)

export const getRemaining = createSelector(
    state => state.dates.carriedOver,
    state => state.dates.currentYear,
    state => state.dates.daysPerYear,
    getHolidaysForYear,
    getProvisionalHolidaysForYear,
    (co, year, dpy, holidays, provisionalHolidays) => {
        const carried = co[year] || 0;
        return carried + dpy - holidays.length - provisionalHolidays.length;
    }
);

export const getSelected = createSelector(
    state => state.dates.selected,
    selected => selected || false
);

export const getCurrentCO = createSelector(
    state => state.dates.currentYear,
    (state, year) => console.log(year) || state.dates.carriedOver,
    (year, co) => console.log(year, co) || co[year] || 0
);

export const getYear = createSelector(
    state => state.dates.currentYear,
    year => year || 0
);

export const isInSelectMode = createSelector(
    state => state.dates.startDay,
    (startDay) => startDay !== ''
);

export const getCurrentStartDay = createSelector(
    state => state.dates.startDay,
    (startDay) => startDay || ""
);
