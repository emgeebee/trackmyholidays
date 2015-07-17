'use strict';

class Dates {
    constructor (UserData) {

        this.UserData = UserData;
        this.currentDate = new Date();
        this.currentlySelected = false;
        this.selectedStartDate = null;


        var month = this.UserData.getYearStart();
        if (this.currentDate.getMonth() < month){
            this.currentYear = parseInt(this.currentDate.getFullYear()) - 1;
        } else {
            this.currentYear = parseInt(this.currentDate.getFullYear());
        }

    }

    getCurrentlySelected() {
        return this.currentlySelected;
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

    selectDate (dateObj) {
        if (this.currentlySelected) {
            this.UserData.addRange(this.selectedStartDate, dateObj, this.currentYear);
        } else {
            this.selectedStartDate = angular.copy(dateObj);
        }
        this.currentlySelected = !this.currentlySelected;
    }

}

Dates.$inject = ['UserData'];

export default Dates;