'use strict';

import Holiday from './Holiday';
import Calendar from './Calendar';

class UserData {
    constructor () {
        var data = window.localStorage.holidayTrackerDates;
        this.version = 0.1;
        if (data) {
            var dataObj = JSON.parse(data);
            var dates = dataObj.dateList;
            this.weekenddays = dataObj['-weekendDays'].split(',').map(function(a){return parseInt(a)});
            this.country = dataObj['-country'];
            this.yearStart = dataObj['-yearStart'];
            this.calendars = {};
            this.calendarCounter = 0;
            this.dates = {};

            if (data.version === undefined) {
                dates = this.convertOldDates(dataObj.dateList);
            }
            this.dates = dates;
            this.sanitiseDates();
        } else {
            this.dates = null;
        }
    }

    getCalendars() {
        return this.calendars;
    }

    addCalendar(name, bh = false) {
        var cal = new Calendar(this.calendarCounter, name, bh);
        this.calendars[cal.name] = cal;
        this.calendarCounter++;
        return cal;
    }

    getRemainingHolidays(year, calendar = 1) {
        var counter = [];
        var halfs = [];
        for (var date in this.dates[year]) {
            if (this.dates[year][date].holidayCalendars.indexOf(calendar) > -1) {
                if (this.dates[year][date].halfDay) {
                    halfs.push(this.dates[year][date]);
                } else {
                    counter.push(this.dates[year][date]);
                }
            }
        }
        return 30 - counter.length - (0.5 * halfs.length);
    }

    addHalfDay(d, year, calendar, notes = "") {
        var id = this.workingDateFromDateObject(d);
        this.dates[year][id] = new Holiday(id, notes, [d, d, 1], calendar, true, d);
    }

    addRange(start, end, year, calendar = 1, notes = "") {
        this.clearRange(start, end, year, calendar);
        var range = this.getRange(start, end, year, calendar);

        for (var i = 0; i < range.length; i++) {
            var id = range[i];
            this.dates[year][id] = new Holiday(id, notes, [start, end, range.length], calendar, false, new Date(id));
        }
    }

    getRange(start, end, year, calendar) {
        var range = [];
        for (var d = angular.copy(start); d <= end; d.setDate(d.getDate() + 1)) {
            if (this.getWeekendDays().indexOf(d.getDay()) > -1) {
                continue;
            }
            var calendars = this.isDayAHoliday(d, year);
            var id = this.workingDateFromDateObject(d);
            if (calendars.indexOf(calendar) === -1 && calendars.indexOf(0) === -1) {
                range.push(d.getTime());
            }
        }
        return range;
    }

    clearRange(start, end, year, calendar) {
        for (var d = angular.copy(start); d <= end; d.setDate(d.getDate() + 1)) {
            var id = this.workingDateFromDateObject(d);
            var calendars = this.isDayAHoliday(d, year);
            if (calendars.indexOf(calendar) > -1) {
                delete this.dates[year][id];
            }
        }
    }

    getDates(year = false) {
        if (year !== false) {
            if (this.dates[year] === undefined) {
                this.dates[year] = {};
            }
            return this.dates[year];
        }
        return this.dates;
    }

    setDates(dates) {
        this.dates = dates;
    }

    getWeekendDays() {
        return this.weekenddays;
    }

    getYearStart() {
        return this.yearStart;
    }

    setYearStart(yearStart) {
        this.yearStart = yearStart;
    }

    convertOldDates(oldDates) {
        var allDates = {};

        var calendar1 = this.addCalendar('Mats');
        var bh = this.addCalendar('Bank Holidays', true);

        for (var year in oldDates) {
            allDates[year] = {};
            var yearDates = {};
            for (var id in oldDates[year]['date']) {

                var date = oldDates[year]['date'][id]['-id'];
                var dateObj = new Date(date);
                yearDates[date] = oldDates[year]['date'][id];

                if (oldDates[year]['date'][id]['-isBankHoliday'] === false) {
                    var rangeArray = yearDates[date]['-dateRange'].split(',');

                    if (rangeArray.length === 1) {
                        rangeArray.push(rangeArray[0]);
                    }

                    var rangeStart = new Date(rangeArray[0]);
                    var rangeEnd = new Date(rangeArray[rangeArray.length - 1]);
                    var range = this.getRange(rangeStart, rangeEnd, year, 1);

                    yearDates[date] = new Holiday(oldDates[year]['date'][id]['-id'], oldDates[year]['date'][id]['notes'], [rangeStart, rangeEnd, range.length], calendar1.id, yearDates[date]['-halfday'], dateObj);
                } else {
                    var bhDate = new Date(date);
                    yearDates[date] = new Holiday(oldDates[year]['date'][id]['-id'], oldDates[year]['date'][id]['notes'], [bhDate, bhDate, 1], bh.id, false, dateObj);
                }
            }
            allDates[year] = yearDates;
        }
        return allDates;
    }

    getHoliday(date, year){
        var workingDate = this.workingDateFromDateObject(date);
        if (this.dates[year] && this.dates[year][workingDate]) {
            return this.dates[year][workingDate];
        }
        return null;
    }

    isDayAHoliday(date, year){
        var workingDate = this.workingDateFromDateObject(date);
        if (this.dates[year] && this.dates[year][workingDate]) {
            return this.dates[year][workingDate].holidayCalendars;
        }
        return [];
    }

    getDatesForYear(workingYear) {
        if (this.dates[workingYear]) {
            return this.dates[workingYear]['date'];   
        }
    }

    workingDateFromDateObject(date) {
        return parseInt(parseInt(date.getMonth()) + 1) + '/' + date.getDate() + '/' + date.getFullYear();
    }

    countBankHolidays(year) {
        return 30 - this.getRemainingHolidays(year, 0);
    }

    sanitiseDates() {
        for (var year in this.dates) {
            for (var id in this.dates[year]) {
                var date = new Date(this.dates[year][id].date);
                if (date.getMonth() < parseInt(this.yearStart) && date.getFullYear() === parseInt(year)) {
                    delete this.dates[year][id];
                } else if (date.getMonth() >= parseInt(this.yearStart) && date.getFullYear() < parseInt(year)) {
                    delete this.dates[year][id];
                } else if (date.getMonth() > parseInt(this.yearStart) && date.getFullYear() > parseInt(year)) {
                    delete this.dates[year][id];
                } else if (isNaN(date.getTime())) {
                    delete this.dates[year][id];
                }
            }
        }
    }
}

export default UserData;