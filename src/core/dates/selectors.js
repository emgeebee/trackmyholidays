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

export const getHolidayMapForYear = createSelector(
    state => state.dates.holidays,
    (holidays) => holidays.reduce((businessDaysMap, hol) => {
        let day = moment(hol.start, 'YY-MM-DD');
        let end = moment(hol.end, 'YY-MM-DD');
        if (end.isBefore(day, 'day')) {
            day = end;
            end = moment(hol.start, 'YY-MM-DD');
        }
        let businessDays = 0;
        let origDay = day.clone();
        while (day.isSameOrBefore(end, 'day')) {
            if (day.day() != 0 && day.day() != 6) {
                businessDays++;
            }
            day.add(1,'d');
        }
        day = origDay;

        while (day.isSameOrBefore(end, 'day')) {
            if (day.day() != 0 && day.day() != 6) {
                businessDaysMap[day.format('YY-MM-DD')] = {
                  hol: hol,
                  length: businessDays
                };
            }
            day.add(1,'d');
        }
        return businessDaysMap;
    }, {})
)

export const getHolidaysForYear = createSelector(
    state => state.dates.holidays,
    (holidays) => holidays.map((hol) => {
        let day = moment(hol.start, 'YY-MM-DD');
        let end = moment(hol.end, 'YY-MM-DD');
        if (end.isBefore(day, 'day')) {
            day = end;
            end = moment(hol.start, 'YY-MM-DD');
        }
        let businessDays = [];

        while (day.isSameOrBefore(end, 'day')) {
            if (day.day() != 0 && day.day() != 6) {
                businessDays.push(day.format('YY-MM-DD'));
            }
            day.add(1,'d');
        }
        return businessDays;
    }).flat()
)

export const getRemaining = createSelector(
    state => state.dates.carriedOver,
    state => state.dates.daysPerYear,
    getHolidaysForYear,
    (co, dpy, holidays) => {
        return co + dpy - holidays.length;
    }
);

export const getSelected = createSelector(
    state => state.dates.selected,
    selected => selected || false
);

export const getYear = createSelector(
    state => state.dates.currentYear,
    year => year || 0
);

export const isInSelectMode = createSelector(
    state => state.dates.startDay,
    (startDay) => startDay !== ''
);
