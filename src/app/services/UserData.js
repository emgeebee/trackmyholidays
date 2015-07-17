'use strict';

class UserData {
    constructor () {
        var data = window.localStorage.holidayTrackerDates;
        this.version = 0.1;
        if (data) {
            var dataObj = JSON.parse(data);

            var dates = dataObj.dateList;
            if (data.version === undefined) {
                dates = this.convertOldDates(dataObj.dateList);
            }

            this.dates = dates;
            this.weekdays = dataObj['-weekendDays'];
            this.country = dataObj['-country'];
            this.yearStart = dataObj['-yearStart'];
        } else {
            this.dates = null;
        }
    }

    getRemainingHolidays(year, calendar = 1) {
        var counter = [];
        for (var date in this.dates[year]) {
            if (this.dates[year][date].holidayCalendars.indexOf(calendar) > -1) {
                counter.push(this.dates[year][date]);
            }
        }
        return 30 - counter.length;
    }

    addRange(start, end, year, calendar = 1) {
        for (var d = start; d <= end; d.setDate(d.getDate() + 1)) {
            var id = this.workingDateFromDateObject(d);
            this.dates[year][id] = new Holiday(id, "", [start, end], calendar);
        }
    }

    getDates(year = false) {
        if (year !== false) {
            return this.dates[year];
        }
        return this.dates;
    }

    setDates(dates) {
        this.dates = dates;
    }

    getYearStart() {
        return this.yearStart - 1;
    }

    setYearStart(yearStart) {
        this.yearStart = yearStart;
    }

    convertOldDates(oldDates) {
        var allDates = {};
        for (var year in oldDates) {
            allDates[year] = {};
            var yearDates = {};
            for (var id in oldDates[year]['date']) {

                var date = oldDates[year]['date'][id]['-id'];
                yearDates[date] = oldDates[year]['date'][id];

                if (oldDates[year]['date'][id]['-isBankHoliday'] === false) {
                    var rangeArray = yearDates[date]['-dateRange'].split(',');
                    yearDates[date] = new Holiday(oldDates[year]['date'][id]['-id'], oldDates[year]['date'][id]['notes'], rangeArray, 1);
                } else {
                    yearDates[date] = new Holiday(oldDates[year]['date'][id]['-id'], oldDates[year]['date'][id]['notes'], [], 0);
                }
            }
            allDates[year] = yearDates;
        }
        return allDates;
    }

    isDayAHoliday(date, year){

        var workingDate = this.workingDateFromDateObject(date);
        if (this.dates[year][workingDate]) {
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
} 

class Holiday {
    constructor(id, notes, rangeArray, calendars) {
        if (typeof calendars === "string" || typeof calendars === "number") {
            calendars = [calendars];
        }
        this.notes = notes;
        this.holidayCalendars = calendars;
        this.rangeStart = rangeArray[0];
        this.rangeEnd = rangeArray[rangeArray.length - 1];
    }
}

export default UserData;