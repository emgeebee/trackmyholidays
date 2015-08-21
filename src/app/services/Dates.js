'use strict';

class Dates {
    constructor (UserData) {

        this.UserData = UserData;
        this.currentDate = new Date();
        this.currentlySelected = false;
        this.selectingNewRange = false;
        this.selectedDate = null;
        this.selectedStartDate = null;

        var month = this.UserData.getYearStart();
        if (this.currentDate.getMonth() < month){
            this.currentYear = parseInt(this.currentDate.getFullYear()) - 1;
        } else {
            this.currentYear = parseInt(this.currentDate.getFullYear());
        }
    }

    getCurrentlySelected() {
        return this.selectedDate;
    }

    isCurrentlySelected() {
        return this.currentlySelected;
    }

    isNewSelectionStarted() {
        return this.selectingNewRange;
    }

    getCurrentYear() {
        return this.currentYear;
    }

    setCurrentYear(year) {
        this.currentYear = year;
    }

    getHolidaysForCurrentYear() {
        return this.getDatesForCurrentYear(false);
    }

    getBankHolidaysForCurrentYear() {
        return this.getDatesForCurrentYear(true);
    }

    getDatesForCurrentYear(qualifier) {
        var currentYear = this.getCurrentYear();
        var fullDates = this.UserData.getDates();
        var data = fullDates[currentYear].date;

        var holidays = [];
        for (var i = data.length - 1; i >= 0; i--) {
            if (data[i]['-isBankHoliday'] === qualifier) {
                continue;
            }
            holidays.push(data[i]);
        };
        return holidays;
    }

    removeGroup(d, calendar = 1) {
        this.UserData.clearRange(d.rangeStart, d.rangeEnd, this.currentYear, calendar)
    }

    halfDay(d, calendar = 1) {
        console.log(d);
        this.selectingNewRange = false;
        this.currentlySelected = false;
        this.UserData.addHalfDay(d, this.currentYear, calendar);
    }

    selectDate (dateObj, calendar = 1) {

        //if already selected, deselect and forget
        if (this.UserData.isDayAHoliday(dateObj, this.currentYear).indexOf(calendar) > -1 || this.UserData.isDayAHoliday(dateObj, this.currentYear).indexOf(0) > -1 ) {
            this.selectedDate = this.UserData.getHoliday(dateObj, this.currentYear);
            this.currentlySelected = true;
            this.selectingNewRange = false;
            return;
        }
        //if in the middle of making a selction, this is our matching date
        if (this.selectingNewRange) {
            this.UserData.addRange(this.selectedStartDate, dateObj, this.currentYear, calendar);
            this.currentlySelected = false;
            this.selectingNewRange = false;

        //else start a selection
        } else {
            this.selectedStartDate = angular.copy(dateObj);
            this.selectedDate = this.selectedStartDate;
            this.currentlySelected = true;
            this.selectingNewRange = true;
        }
    }

}

Dates.$inject = ['UserData'];

export default Dates;