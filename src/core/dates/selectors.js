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
            console.log(currentMonthDates);
            currentYearDates.push(currentMonthDates);
        }
        console.log(currentYearDates);
        return currentYearDates;
    }
);

export const isInSelectMode = createSelector(
    state => state.dates.startDay,
    (startDay) => startDay !== ''
);
